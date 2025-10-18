'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// TODO: Importar Pitchy cuando esté completamente integrado
// import { Pitchy } from 'pitchy'

interface TunerState {
  isListening: boolean
  hasPermission: boolean
  detectedNote: string
  frequency: number
  cents: number
  confidence: number
}

export const useTuner = () => {
  const [state, setState] = useState<TunerState>({
    isListening: false,
    hasPermission: false,
    detectedNote: '',
    frequency: 0,
    cents: 0,
    confidence: 0
  })

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  // TODO: Configurar Pitchy cuando esté integrado
  // const pitchDetectorRef = useRef<Pitchy | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Notas cromáticas para conversión de frecuencia a nota
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  
  const frequencyToNote = useCallback((frequency: number): { note: string, cents: number } => {
    const A4 = 440
    const C0 = A4 * Math.pow(2, -4.75) // C0 frequency
    
    if (frequency > 0) {
      const h = Math.round(12 * Math.log2(frequency / C0))
      const octave = Math.floor(h / 12)
      const n = h % 12
      const note = noteNames[n]
      
      // Calcular cents de desviación
      const exactNote = A4 * Math.pow(2, (h - 69) / 12)
      const cents = Math.round(1200 * Math.log2(frequency / exactNote))
      
      return { note: `${note}${octave}`, cents }
    }
    
    return { note: '', cents: 0 }
  }, [noteNames])

  const requestMicrophonePermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false
        } 
      })
      
      streamRef.current = stream
      
      // Configurar AudioContext
      audioContextRef.current = new AudioContext({ sampleRate: 44100 })
      analyserRef.current = audioContextRef.current.createAnalyser()
      
      analyserRef.current.fftSize = 4096
      analyserRef.current.smoothingTimeConstant = 0.8
      
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      
      // TODO: Inicializar Pitchy
      // pitchDetectorRef.current = new Pitchy({
      //   sampleRate: 44100,
      //   threshold: 0.95
      // })
      
      setState(prev => ({ ...prev, hasPermission: true }))
      
    } catch (error) {
      console.error('Error accessing microphone:', error)
      setState(prev => ({ ...prev, hasPermission: false }))
    }
  }, [])

  const detectPitch = useCallback(() => {
    if (!analyserRef.current || !audioContextRef.current) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Float32Array(bufferLength)
    analyserRef.current.getFloatFrequencyData(dataArray)
    
    // TODO: Usar Pitchy para detección precisa
    // const [frequency, confidence] = pitchDetectorRef.current.findPitch(dataArray, audioContextRef.current.sampleRate)
    
    // Simulación temporal de detección de pitch
    const mockFrequency = 110 + Math.random() * 10 - 5 // Simular A2 ±5Hz
    const mockConfidence = 0.8 + Math.random() * 0.2
    
    if (mockConfidence > 0.9) {
      const { note, cents } = frequencyToNote(mockFrequency)
      
      setState(prev => ({
        ...prev,
        detectedNote: note,
        frequency: mockFrequency,
        cents,
        confidence: mockConfidence
      }))
    }

    if (state.isListening) {
      animationFrameRef.current = requestAnimationFrame(detectPitch)
    }
  }, [state.isListening, frequencyToNote])

  const startListening = useCallback(async () => {
    if (!state.hasPermission) {
      await requestMicrophonePermission()
    }
    
    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume()
    }
    
    setState(prev => ({ ...prev, isListening: true }))
    detectPitch()
  }, [state.hasPermission, requestMicrophonePermission, detectPitch])

  const stopListening = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isListening: false,
      detectedNote: '',
      frequency: 0,
      cents: 0,
      confidence: 0
    }))
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }, [])

  const toggle = useCallback(() => {
    if (state.isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [state.isListening, startListening, stopListening])

  // Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Funciones utilitarias para UI
  const getCentsColor = useCallback((cents: number) => {
    if (Math.abs(cents) <= 5) return 'text-green-600'
    if (Math.abs(cents) <= 15) return 'text-yellow-600'
    return 'text-red-600'
  }, [])

  const getTuningStatus = useCallback((cents: number) => {
    if (Math.abs(cents) <= 5) return 'Afinado'
    if (cents > 5) return 'Muy agudo'
    return 'Muy grave'
  }, [])

  return {
    ...state,
    startListening,
    stopListening,
    toggle,
    getCentsColor,
    getTuningStatus,
    frequencyToNote
  }
}

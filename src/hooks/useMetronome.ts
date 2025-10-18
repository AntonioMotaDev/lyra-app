'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import * as Tone from 'tone'

interface MetronomeState {
  bpm: number
  isPlaying: boolean
  currentBeat: number
  subdivision: 'quarter' | 'eighth' | 'triplet' | 'sixteenth'
  volume: number
}

export const useMetronome = () => {
  const [state, setState] = useState<MetronomeState>({
    bpm: 120,
    isPlaying: false,
    currentBeat: 0,
    subdivision: 'quarter',
    volume: 0.7
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const synthRef = useRef<Tone.Synth | null>(null)
  const sequenceRef = useRef<Tone.Sequence | null>(null)
  const isInitialized = useRef(false)

  // Inicializar Tone.js
  const initializeAudio = useCallback(async () => {
    if (isInitialized.current) return
    
    try {
      // Asegurar que el contexto de audio esté iniciado
      if (Tone.getContext().state !== 'running') {
        await Tone.start()
      }
      
      // Crear un sintetizador para el click del metrónomo
      synthRef.current = new Tone.Synth({
        oscillator: {
          type: "square"
        },
        envelope: {
          attack: 0.01,
          decay: 0.1,
          sustain: 0,
          release: 0.1
        }
      }).toDestination()
      
      synthRef.current.volume.value = Tone.gainToDb(state.volume)
      isInitialized.current = true
    } catch (error) {
      console.error('Error inicializando audio:', error)
    }
  }, [state.volume])

  useEffect(() => {
    return () => {
      // Limpiar todo al desmontar el componente
      Tone.getTransport().stop()
      
      if (sequenceRef.current) {
        sequenceRef.current.stop()
        sequenceRef.current.dispose()
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      
      if (synthRef.current) {
        synthRef.current.dispose()
      }
    }
  }, [])


  const start = useCallback(async () => {
    if (state.isPlaying) return

    // Inicializar audio si no está inicializado
    await initializeAudio()

    setState(prev => ({ ...prev, isPlaying: true, currentBeat: 0 }))

    // Detener secuencia anterior si existe
    if (sequenceRef.current) {
      sequenceRef.current.stop()
      sequenceRef.current.dispose()
    }

    // Configurar el tempo en Tone.js
    const subdivisionMultiplier = {
      quarter: 1,
      eighth: 2,
      triplet: 3,
      sixteenth: 4
    }[state.subdivision]

    // Calcular BPM efectivo con subdivisión
    const effectiveBPM = state.bpm * subdivisionMultiplier
    Tone.getTransport().bpm.value = effectiveBPM

    // Crear secuencia de clicks
    sequenceRef.current = new Tone.Sequence((time, step) => {
      // Programar el click en el tiempo exacto
      const isAccent = step === 0 // Primer beat es acentuado
      const frequency = isAccent ? "C5" : "C4"
      
      if (synthRef.current) {
        synthRef.current.triggerAttackRelease(frequency, "32n", time)
      }

      // Actualizar el estado visual en el siguiente frame
      Tone.getDraw().schedule(() => {
        setState(prev => ({
          ...prev,
          currentBeat: step
        }))
      }, time)
    }, [0, 1, 2, 3], "4n")

    // Iniciar la secuencia
    sequenceRef.current.start(0)
    Tone.getTransport().start()
    }, [state.bpm, state.subdivision, initializeAudio, state.isPlaying])

  const stop = useCallback(() => {
    // Detener transport de Tone.js
    Tone.getTransport().stop()
    
    // Detener y limpiar secuencia
    if (sequenceRef.current) {
      sequenceRef.current.stop()
      sequenceRef.current.dispose()
      sequenceRef.current = null
    }
    
    // Limpiar interval si existe (fallback)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    setState(prev => ({ ...prev, isPlaying: false, currentBeat: 0 }))
  }, [])

  const toggle = useCallback(() => {
    if (state.isPlaying) {
      stop()
    } else {
      start()
    }
  }, [state.isPlaying, start, stop])

  const setBpm = useCallback((newBpm: number) => {
    const clampedBpm = Math.max(40, Math.min(200, newBpm))
    setState(prev => ({ ...prev, bpm: clampedBpm }))
    
    // Actualizar BPM en tiempo real si está reproduciendo
    if (state.isPlaying) {
      const subdivisionMultiplier = {
        quarter: 1,
        eighth: 2,
        triplet: 3,
        sixteenth: 4
      }[state.subdivision]
      
      const effectiveBPM = clampedBpm * subdivisionMultiplier
      Tone.getTransport().bpm.rampTo(effectiveBPM, 0.1) // Transición suave
    }
  }, [state.isPlaying, state.subdivision])

  const setSubdivision = useCallback((subdivision: MetronomeState['subdivision']) => {
    setState(prev => ({ ...prev, subdivision }))
    
    // Reiniciar con nueva subdivisión si está reproduciendo
    if (state.isPlaying) {
      stop()
      // Usar requestAnimationFrame para asegurar que el stop se complete
      requestAnimationFrame(() => {
        setTimeout(() => {
          start()
        }, 100)
      })
    }
  }, [state.isPlaying, start, stop])

  const setVolume = useCallback((volume: number) => {
    const newVolume = Math.max(0, Math.min(1, volume))
    setState(prev => ({ ...prev, volume: newVolume }))
    
    // Aplicar volumen a Tone.js
    if (synthRef.current) {
      synthRef.current.volume.value = Tone.gainToDb(newVolume)
    }
  }, [])

  return {
    ...state,
    start,
    stop,
    toggle,
    setBpm,
    setSubdivision,
    setVolume
  }
}

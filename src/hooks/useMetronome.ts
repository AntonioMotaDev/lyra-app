'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// TODO: Importar Tone.js cuando esté completamente integrado
// import * as Tone from 'tone'

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
  // TODO: Configurar Tone.js cuando esté integrado
  // const toneRef = useRef<Tone.Player | null>(null)

  // TODO: Inicializar Tone.js
  useEffect(() => {
    // Ejemplo de configuración que se implementará:
    // toneRef.current = new Tone.Player({
    //   url: "/metronome-click.wav",
    //   volume: state.volume
    // }).toDestination()
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      // TODO: Limpiar recursos de Tone.js
      // toneRef.current?.dispose()
    }
  }, [state.volume])

  const playClick = useCallback(() => {
    // TODO: Reproducir sonido con Tone.js
    // toneRef.current?.start()
    
    // Por ahora, solo logging para demostración
    console.log(`Click - Beat: ${state.currentBeat + 1}, BPM: ${state.bpm}`)
  }, [state.currentBeat, state.bpm])

  const start = useCallback(() => {
    if (intervalRef.current) return

    setState(prev => ({ ...prev, isPlaying: true, currentBeat: 0 }))

    const subdivisionMultiplier = {
      quarter: 1,
      eighth: 2,
      triplet: 3,
      sixteenth: 4
    }[state.subdivision]

    const interval = 60000 / (state.bpm * subdivisionMultiplier)

    intervalRef.current = setInterval(() => {
      playClick()
      setState(prev => ({
        ...prev,
        currentBeat: (prev.currentBeat + 1) % 4
      }))
    }, interval)
  }, [state.bpm, state.subdivision, playClick])

  const stop = useCallback(() => {
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
    setState(prev => ({ ...prev, bpm: Math.max(40, Math.min(200, newBpm)) }))
    
    // Reiniciar si está reproduciendo para aplicar el nuevo BPM
    if (state.isPlaying) {
      stop()
      setTimeout(start, 50) // Pequeño delay para evitar conflictos
    }
  }, [state.isPlaying, start, stop])

  const setSubdivision = useCallback((subdivision: MetronomeState['subdivision']) => {
    setState(prev => ({ ...prev, subdivision }))
    
    // Reiniciar si está reproduciendo para aplicar la nueva subdivisión
    if (state.isPlaying) {
      stop()
      setTimeout(start, 50)
    }
  }, [state.isPlaying, start, stop])

  const setVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }))
    // TODO: Aplicar volumen a Tone.js
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

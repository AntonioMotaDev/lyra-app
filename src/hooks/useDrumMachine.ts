'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import * as Tone from 'tone'

export type DrumSound = 'kick' | 'snare' | 'hihat' | 'tom' | 'clap' | 'rim' | 'cowbell' | 'crash'

export interface DrumPattern {
  [key: string]: boolean[]
}

const STEPS = 16
const DEFAULT_BPM = 120

export function useDrumMachine() {
  const [pattern, setPattern] = useState<DrumPattern>(() => {
    const initialPattern: DrumPattern = {}
    const drums: DrumSound[] = ['kick', 'snare', 'hihat', 'tom', 'clap', 'rim', 'cowbell', 'crash']
    drums.forEach(drum => {
      initialPattern[drum] = Array(STEPS).fill(false)
    })
    return initialPattern
  })
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [bpm, setBpm] = useState(DEFAULT_BPM)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const synthsRef = useRef<{ [key: string]: Tone.MembraneSynth | Tone.NoiseSynth | Tone.MetalSynth }>({})
  const sequenceRef = useRef<Tone.Sequence | null>(null)
  const isInitialized = useRef(false)

  // Initialize drum sounds
  useEffect(() => {
    if (isInitialized.current) return
    
    const initialize = async () => {
      await Tone.start()
      
      synthsRef.current = {
        kick: new Tone.MembraneSynth({
          pitchDecay: 0.05,
          octaves: 10,
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4, attackCurve: 'exponential' }
        }).toDestination(),
        
        snare: new Tone.NoiseSynth({
          noise: { type: 'white' },
          envelope: { attack: 0.001, decay: 0.2, sustain: 0 }
        }).toDestination(),
        
        hihat: new Tone.MetalSynth({
          envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
          harmonicity: 5.1,
          modulationIndex: 32,
          resonance: 4000,
          octaves: 1.5
        }).toDestination(),
        
        tom: new Tone.MembraneSynth({
          pitchDecay: 0.008,
          octaves: 4,
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.3, sustain: 0.1, release: 0.8 }
        }).toDestination(),
        
        clap: new Tone.NoiseSynth({
          noise: { type: 'pink' },
          envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.15 }
        }).toDestination(),
        
        rim: new Tone.MetalSynth({
          envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
          harmonicity: 8,
          modulationIndex: 20,
          resonance: 3000,
          octaves: 1
        }).toDestination(),
        
        cowbell: new Tone.MetalSynth({
          envelope: { attack: 0.001, decay: 0.15, release: 0.3 },
          harmonicity: 2.1,
          modulationIndex: 16,
          resonance: 2500,
          octaves: 1.5
        }).toDestination(),
        
        crash: new Tone.MetalSynth({
          envelope: { attack: 0.001, decay: 1.5, release: 3 },
          harmonicity: 3.1,
          modulationIndex: 64,
          resonance: 3000,
          octaves: 2
        }).toDestination()
      }
      
      isInitialized.current = true
    }
    
    initialize()
    
    return () => {
      Object.values(synthsRef.current).forEach(synth => {
        synth.dispose()
      })
      Tone.getTransport().stop()
    }
  }, [])

  // Play single drum sound
  const playSound = useCallback((drum: string) => {
    const synth = synthsRef.current[drum]
    if (!synth) return
    
    const now = Tone.now()
    
    if (drum === 'kick' || drum === 'tom') {
      (synth as Tone.MembraneSynth).triggerAttackRelease('C2', '8n', now)
    } else if (drum === 'snare' || drum === 'clap') {
      (synth as Tone.NoiseSynth).triggerAttackRelease('8n', now)
    } else {
      (synth as Tone.MetalSynth).triggerAttackRelease('16n', now)
    }
  }, [])

  // Toggle step
  const toggleStep = useCallback((drum: string, step: number) => {
    setPattern(prev => ({
      ...prev,
      [drum]: prev[drum].map((active, i) => i === step ? !active : active)
    }))
  }, [])

  // Clear pattern
  const clearPattern = useCallback(() => {
    setPattern(prev => {
      const newPattern: DrumPattern = {}
      Object.keys(prev).forEach(drum => {
        newPattern[drum] = Array(STEPS).fill(false)
      })
      return newPattern
    })
  }, [])

  // Generate random pattern
  const generateRandomPattern = useCallback(() => {
    setPattern(prev => {
      const newPattern: DrumPattern = {}
      Object.keys(prev).forEach(drum => {
        const probability = drum === 'kick' || drum === 'snare' ? 0.3 : 0.2
        newPattern[drum] = Array(STEPS).fill(false).map(() => Math.random() < probability)
      })
      return newPattern
    })
  }, [])

  // Generate Magenta pattern (disabled due to compatibility issues)
  const generateMagentaPattern = useCallback(async () => {
    setIsGenerating(true)
    // TODO: Magenta.js has compatibility issues with Next.js 15 + Turbopack
    // Falling back to enhanced random pattern for now
    setTimeout(() => {
      setPattern(prev => {
        const newPattern: DrumPattern = {}
        Object.keys(prev).forEach(drum => {
          // More musical probabilities for AI-like patterns
          let probability = 0.15
          if (drum === 'kick') probability = 0.35
          if (drum === 'snare') probability = 0.25
          if (drum === 'hihat') probability = 0.4
          
          const steps = Array(STEPS).fill(false)
          for (let i = 0; i < STEPS; i++) {
            // Add some musical structure (emphasize strong beats)
            const isStrongBeat = i % 4 === 0
            const adjustedProb = isStrongBeat ? probability * 1.5 : probability
            steps[i] = Math.random() < adjustedProb
          }
          newPattern[drum] = steps
        })
        return newPattern
      })
      setIsGenerating(false)
    }, 1000)
  }, [])

  // Toggle playback
  const togglePlayback = useCallback(async () => {
    if (!isInitialized.current) return

    if (isPlaying) {
      Tone.getTransport().stop()
      if (sequenceRef.current) {
        sequenceRef.current.stop()
        sequenceRef.current.dispose()
        sequenceRef.current = null
      }
      setIsPlaying(false)
      setCurrentStep(0)
    } else {
      await Tone.start()
      
      Tone.getTransport().bpm.value = bpm
      Tone.getTransport().timeSignature = 4

      let step = 0
      sequenceRef.current = new Tone.Sequence(
        (time) => {
          Object.entries(pattern).forEach(([drum, steps]) => {
            if (steps[step]) {
              playSound(drum)
            }
          })
          
          Tone.Draw.schedule(() => {
            setCurrentStep(step)
          }, time)
          
          step = (step + 1) % STEPS
        },
        Array(STEPS).fill(0).map((_, i) => i),
        '16n'
      )

      sequenceRef.current.start(0)
      Tone.getTransport().start()
      setIsPlaying(true)
    }
  }, [isPlaying, pattern, bpm, playSound])

  // Update BPM
  const updateBpm = useCallback((newBpm: number) => {
    setBpm(newBpm)
    if (isPlaying) {
      Tone.getTransport().bpm.value = newBpm
    }
  }, [isPlaying])

  return {
    pattern,
    isPlaying,
    currentStep,
    bpm,
    isGenerating,
    toggleStep,
    clearPattern,
    generateRandomPattern,
    generateMagentaPattern,
    togglePlayback,
    updateBpm,
    playSound
  }
}

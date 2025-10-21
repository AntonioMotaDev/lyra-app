'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import * as mm from '@magenta/music'
import * as Tone from 'tone'

export type DrumSound = 'kick' | 'snare' | 'hihat' | 'tom' | 'clap' | 'rim' | 'cowbell' | 'crash'

export interface DrumPattern {
  [key: string]: boolean[] // 16 steps for each drum sound
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
  
  const sequenceRef = useRef<Tone.Sequence | null>(null)
  const samplersRef = useRef<{ [key: string]: Tone.MembraneSynth | Tone.NoiseSynth | Tone.MetalSynth }>({})
  const isInitializedRef = useRef(false)

  // Initialize Tone.js samplers with synthesized drum sounds
  useEffect(() => {
    if (isInitializedRef.current) return
    
    const initializeSamplers = async () => {
      await Tone.start()
      
      // Create synthesized drum sounds using Tone.js
      samplersRef.current = {
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
      
      isInitializedRef.current = true
    }
    
    initializeSamplers()
    
    return () => {
      // Cleanup
      Object.values(samplersRef.current).forEach(sampler => {
        sampler.dispose()
      })
    }
  }, [])

  // Play drum sound
  const playSound = useCallback((drum: string) => {
    const sampler = samplersRef.current[drum]
    if (!sampler) return
    
    const now = Tone.now()
    
    // Trigger sounds based on drum type
    if (drum === 'kick' || drum === 'tom') {
      (sampler as Tone.MembraneSynth).triggerAttackRelease('C2', '8n', now)
    } else if (drum === 'snare' || drum === 'clap') {
      (sampler as Tone.NoiseSynth).triggerAttackRelease('8n', now)
    } else {
      (sampler as Tone.MetalSynth).triggerAttackRelease('16n', now)
    }
  }, [])

  // Toggle step in pattern
  const toggleStep = useCallback((drum: string, step: number) => {
    setPattern(prev => ({
      ...prev,
      [drum]: prev[drum].map((active, i) => i === step ? !active : active)
    }))
  }, [])

  // Clear entire pattern
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
        // Different probability for different drums
        const probability = drum === 'kick' || drum === 'snare' ? 0.3 : 0.2
        newPattern[drum] = Array(STEPS).fill(false).map(() => Math.random() < probability)
      })
      return newPattern
    })
  }, [])

  // Generate pattern using Magenta.js
  const generateMagentaPattern = useCallback(async () => {
    setIsGenerating(true)
    try {
      // Initialize DrumRNN model
      const drumRNN = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/drum_kit_rnn')
      await drumRNN.initialize()

      // Create seed sequence with basic pattern
      const seed: mm.INoteSequence = {
        ticksPerQuarter: 220,
        totalTime: 2,
        timeSignatures: [{ time: 0, numerator: 4, denominator: 4 }],
        tempos: [{ time: 0, qpm: bpm }],
        notes: [
          { pitch: 36, startTime: 0, endTime: 0.5, velocity: 100, instrument: 0, program: 0, isDrum: true }, // Kick
          { pitch: 38, startTime: 1, endTime: 1.5, velocity: 80, instrument: 0, program: 0, isDrum: true }  // Snare
        ]
      }

      // Generate continuation
      const result = await drumRNN.continueSequence(seed, STEPS, 1.0)

      // Convert Magenta sequence to our pattern format
      const newPattern: DrumPattern = {}
      const drums: DrumSound[] = ['kick', 'snare', 'hihat', 'tom', 'clap', 'rim', 'cowbell', 'crash']
      drums.forEach(drum => {
        newPattern[drum] = Array(STEPS).fill(false)
      })

      // Map MIDI pitches to drum sounds
      const pitchMap: { [key: number]: string } = {
        36: 'kick', 35: 'kick',
        38: 'snare', 40: 'snare',
        42: 'hihat', 44: 'hihat', 46: 'hihat',
        47: 'tom', 48: 'tom', 50: 'tom',
        39: 'clap',
        37: 'rim',
        56: 'cowbell',
        49: 'crash', 57: 'crash'
      }

      result.notes?.forEach(note => {
        if (note.pitch === null || note.pitch === undefined) return
        const drum = pitchMap[note.pitch]
        if (drum && note.quantizedStartStep !== undefined && note.quantizedStartStep !== null) {
          const step = note.quantizedStartStep % STEPS
          newPattern[drum][step] = true
        }
      })

      setPattern(newPattern)
    } catch (error) {
      console.error('Error generating pattern with Magenta:', error)
      // Fallback to random pattern
      generateRandomPattern()
    } finally {
      setIsGenerating(false)
    }
  }, [bpm, generateRandomPattern])

  // Start/stop playback
  const togglePlayback = useCallback(async () => {
    if (!isInitializedRef.current) return

    if (isPlaying) {
      // Stop
      Tone.getTransport().stop()
      if (sequenceRef.current) {
        sequenceRef.current.stop()
        sequenceRef.current.dispose()
        sequenceRef.current = null
      }
      setIsPlaying(false)
      setCurrentStep(0)
    } else {
      // Start
      await Tone.start()
      
      Tone.getTransport().bpm.value = bpm
      Tone.getTransport().timeSignature = 4

      let step = 0
      sequenceRef.current = new Tone.Sequence(
        (time) => {
          // Play all active drums at current step
          Object.entries(pattern).forEach(([drum, steps]) => {
            if (steps[step]) {
              playSound(drum)
            }
          })
          
          // Update UI on main thread
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sequenceRef.current) {
        sequenceRef.current.stop()
        sequenceRef.current.dispose()
      }
      Tone.getTransport().stop()
    }
  }, [])

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

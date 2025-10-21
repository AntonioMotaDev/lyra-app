'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { ArrowLeft, Play, Pause, Trash2, Wand2, Sparkles } from 'lucide-react'
import { useDrumMachine, DrumSound } from '@/hooks/useDrumMachine'

const DRUM_CONFIG: { sound: DrumSound; label: string; icon: string }[] = [
  { sound: 'kick', label: 'Kick', icon: '🥁' },
  { sound: 'snare', label: 'Snare', icon: '🎯' },
  { sound: 'hihat', label: 'Hi-Hat', icon: '🎩' },
  { sound: 'tom', label: 'Tom', icon: '🪘' },
  { sound: 'clap', label: 'Clap', icon: '👏' },
  { sound: 'rim', label: 'Rim', icon: '⭕' },
  { sound: 'cowbell', label: 'Cowbell', icon: '🔔' },
  { sound: 'crash', label: 'Crash', icon: '💥' }
]

export default function DrumMachinePage() {
  const {
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
  } = useDrumMachine()

  return (
    <div className="min-h-screen bg-rich-black text-vivid-sky-blue">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-oxford-blue/20 via-rich-black to-rich-black"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-celestial-blue hover:text-vivid-sky-blue transition-colors duration-300 mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-light">Back to Home</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 rounded-full bg-celestial-blue animate-pulse"></div>
            <h1 className="text-4xl md:text-5xl font-light tracking-wide text-vivid-sky-blue">
              Drum Machine
            </h1>
          </div>
          <p className="text-celestial-blue/70 font-light mt-3 text-sm">
            Create rhythmic patterns with AI-powered generation
          </p>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          {/* Pattern Grid */}
          <Card className="bg-oxford-blue/40 border-cerulean/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-light text-vivid-sky-blue flex items-center justify-between">
                <span>Pattern Grid</span>
                <div className="text-sm text-celestial-blue/70">
                  {bpm} BPM
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  {/* Step indicators */}
                  <div className="flex mb-2 pl-24">
                    {Array.from({ length: 16 }, (_, i) => (
                      <div
                        key={i}
                        className={`flex-1 text-center text-xs font-light transition-all duration-150 ${
                          currentStep === i && isPlaying
                            ? 'text-vivid-sky-blue font-bold scale-110'
                            : 'text-cerulean/50'
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>

                  {/* Drum rows */}
                  {DRUM_CONFIG.map(({ sound, label, icon }) => (
                    <div key={sound} className="flex items-center mb-2 group">
                      {/* Drum label */}
                      <button
                        onClick={() => playSound(sound)}
                        className="w-20 text-left text-sm font-light text-celestial-blue hover:text-vivid-sky-blue transition-colors duration-200 flex items-center space-x-2 mr-4"
                      >
                        <span className="text-lg">{icon}</span>
                        <span>{label}</span>
                      </button>

                      {/* Steps */}
                      <div className="flex flex-1">
                        {pattern[sound]?.map((active, stepIndex) => (
                          <button
                            key={stepIndex}
                            onClick={() => toggleStep(sound, stepIndex)}
                            className={`flex-1 aspect-square mx-0.5 rounded-sm transition-all duration-200 ${
                              active
                                ? currentStep === stepIndex && isPlaying
                                  ? 'bg-vivid-sky-blue shadow-lg shadow-vivid-sky-blue/50 scale-110'
                                  : 'bg-celestial-blue hover:bg-vivid-sky-blue shadow-md'
                                : currentStep === stepIndex && isPlaying
                                ? 'bg-oxford-blue/80 border-2 border-vivid-sky-blue scale-105'
                                : 'bg-oxford-blue/40 hover:bg-oxford-blue/60 border border-cerulean/20'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Playback Control */}
            <Card className="bg-oxford-blue/40 border-cerulean/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-light text-vivid-sky-blue">
                  Playback
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <button
                    onClick={togglePlayback}
                    disabled={isGenerating}
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isPlaying
                        ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30'
                        : 'bg-gradient-to-br from-celestial-blue to-vivid-sky-blue hover:from-vivid-sky-blue hover:to-celestial-blue shadow-lg shadow-celestial-blue/30'
                    } hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isPlaying ? (
                      <Pause className="w-10 h-10 text-white" />
                    ) : (
                      <Play className="w-10 h-10 text-white ml-1" />
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <div className="text-xs text-celestial-blue/70 font-light">
                    {isPlaying ? 'Playing' : 'Stopped'}
                  </div>
                </div>

                {/* BPM Control */}
                <div>
                  <label className="block text-sm font-light text-celestial-blue mb-3">
                    Tempo: {bpm} BPM
                  </label>
                  <Slider
                    value={[bpm]}
                    onValueChange={(value) => updateBpm(value[0])}
                    max={200}
                    min={60}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-cerulean/50 mt-2 font-light">
                    <span>60</span>
                    <span>200</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pattern Generation */}
            <Card className="bg-oxford-blue/40 border-cerulean/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-light text-vivid-sky-blue">
                  Generate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={generateMagentaPattern}
                  disabled={isGenerating || isPlaying}
                  className="w-full bg-gradient-to-r from-celestial-blue/20 to-vivid-sky-blue/20 hover:from-celestial-blue/30 hover:to-vivid-sky-blue/30 border border-celestial-blue/40 hover:border-vivid-sky-blue text-vivid-sky-blue font-light py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  {isGenerating ? 'Generating...' : 'AI Pattern'}
                </Button>

                <Button
                  onClick={generateRandomPattern}
                  disabled={isGenerating || isPlaying}
                  className="w-full bg-cerulean/20 hover:bg-cerulean/30 border border-cerulean/40 hover:border-cerulean text-celestial-blue font-light py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <Wand2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Random Pattern
                </Button>

                <Button
                  onClick={clearPattern}
                  disabled={isPlaying}
                  className="w-full bg-oxford-blue/40 hover:bg-oxford-blue/60 border border-cerulean/30 hover:border-red-500/50 text-cerulean hover:text-red-400 font-light py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <Trash2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Clear Pattern
                </Button>
              </CardContent>
            </Card>

            {/* Info */}
            <Card className="bg-oxford-blue/40 border-cerulean/20 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-3 text-xs text-cerulean/70 font-light">
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-celestial-blue mt-1.5 flex-shrink-0"></div>
                    <span>Click on grid cells to toggle drum hits</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-celestial-blue mt-1.5 flex-shrink-0"></div>
                    <span>Click drum labels to preview sounds</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-celestial-blue mt-1.5 flex-shrink-0"></div>
                    <span>Use AI generation for creative patterns</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

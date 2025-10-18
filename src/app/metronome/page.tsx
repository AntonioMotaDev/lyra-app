'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { ArrowLeft, Play, Pause } from 'lucide-react'
import { useMetronome } from '@/hooks/useMetronome'

export default function MetronomePage() {
  const {
    bpm,
    isPlaying,
    currentBeat,
    subdivision,
    volume,
    toggle,
    setBpm,
    setSubdivision,
    setVolume
  } = useMetronome()

  const subdivisions = [
    { value: 'quarter' as const, label: '♩ Negras', multiplier: 1 },
    { value: 'eighth' as const, label: '♫ Corcheas', multiplier: 2 },
    { value: 'triplet' as const, label: '♫♫♫ Tresillos', multiplier: 3 },
    { value: 'sixteenth' as const, label: '♬ Semicorcheas', multiplier: 4 }
  ]

  return (
    <div className="min-h-screen bg-dark-blue p-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-700 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-blue">Metrónomo </h1>
        </header>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">
              <div className={`text-6xl font-mono ${isPlaying ? 'text-blue-600' : 'text-gray-400'}`}>
                {bpm}
              </div>
              <div className="text-sm text-gray-600 mt-2">BPM</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Control de BPM */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tempo: {bpm} BPM
              </label>
              <Slider
                value={[bpm]}
                onValueChange={(value) => setBpm(value[0])}
                max={200}
                min={40}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>40</span>
                <span>200</span>
              </div>
            </div>

            {/* Control de volumen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volumen: {Math.round(volume * 100)}%
              </label>
              <Slider
                value={[volume * 100]}
                onValueChange={(value) => setVolume(value[0] / 100)}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Subdivisiones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subdivisión
              </label>
              <div className="grid grid-cols-2 gap-2">
                {subdivisions.map((sub) => (
                  <Button
                    key={sub.value}
                    variant={subdivision === sub.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSubdivision(sub.value)}
                    className="text-xs"
                  >
                    {sub.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Control de reproducción */}
            <div className="text-center">
              <Button
                onClick={toggle}
                size="lg"
                className={`w-32 h-32 rounded-full ${
                  isPlaying 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8" />
                )}
              </Button>
              <div className="mt-4 text-sm text-gray-600">
                {isPlaying ? 'Reproduciendo...' : 'Presiona para iniciar'}
              </div>
            </div>

            {/* Indicador visual del beat */}
            {isPlaying && (
              <div className="text-center">
                <div className="flex justify-center space-x-2">
                  {[0, 1, 2, 3].map((beat) => (
                    <div
                      key={beat}
                      className={`w-4 h-4 rounded-full ${
                        currentBeat === beat 
                          ? 'bg-blue-600' 
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Beat {currentBeat + 1} de 4
                </div>
              </div>
            )}
          </CardContent>
        </Card>



      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { ArrowLeft, Play, Pause } from 'lucide-react'

export default function MetronomePage() {
  const [bpm, setBpm] = useState([120])
  const [isPlaying, setIsPlaying] = useState(false)
  const [subdivision, setSubdivision] = useState('quarter')
  const [currentBeat, setCurrentBeat] = useState(0)

  // TODO: Integrar con Tone.js para la funcionalidad de audio
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isPlaying) {
      const beatInterval = 60000 / bpm[0] // Convertir BPM a milisegundos
      interval = setInterval(() => {
        setCurrentBeat(prev => prev + 1)
        // TODO: Reproducir sonido del metrónomo con Tone.js
        console.log(`Beat: ${currentBeat + 1}, BPM: ${bpm[0]}`)
      }, beatInterval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, bpm, currentBeat])

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      setCurrentBeat(0)
    }
  }

  const subdivisions = [
    { value: 'quarter', label: '♩ Negras', multiplier: 1 },
    { value: 'eighth', label: '♫ Corcheas', multiplier: 2 },
    { value: 'triplet', label: '♫♫♫ Tresillos', multiplier: 3 },
    { value: 'sixteenth', label: '♬ Semicorcheas', multiplier: 4 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-700 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Metrónomo</h1>
        </header>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">
              <div className={`text-6xl font-mono ${isPlaying ? 'text-blue-600' : 'text-gray-400'}`}>
                {bpm[0]}
              </div>
              <div className="text-sm text-gray-600 mt-2">BPM</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Control de BPM */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tempo: {bpm[0]} BPM
              </label>
              <Slider
                value={bpm}
                onValueChange={setBpm}
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
                onClick={togglePlayback}
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
                  {[1, 2, 3, 4].map((beat) => (
                    <div
                      key={beat}
                      className={`w-4 h-4 rounded-full ${
                        (currentBeat % 4) + 1 === beat 
                          ? 'bg-blue-600' 
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Beat {(currentBeat % 4) + 1} de 4
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-yellow-800 mb-2">Próximas funcionalidades</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Integración completa con Tone.js para audio de alta calidad</li>
              <li>• Múltiples sonidos de metrónomo (click, stick, etc.)</li>
              <li>• Acentos personalizables para el primer beat</li>
              <li>• Compases complejos (3/4, 5/4, 7/8, etc.)</li>
              <li>• Presets de tempo para diferentes estilos musicales</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

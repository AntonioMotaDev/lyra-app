'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mic, MicOff } from 'lucide-react'

export default function TunerPage() {
  const [isListening, setIsListening] = useState(false)
  const [detectedNote, setDetectedNote] = useState<string>('')
  const [frequency, setFrequency] = useState<number>(0)
  const [cents, setCents] = useState<number>(0)
  const [tuningMode, setTuningMode] = useState<'guitar' | 'bass'>('guitar')
  const [hasPermission, setHasPermission] = useState<boolean>(false)
  
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Notas de referencia para guitarra estándar
  const guitarNotes = [
    { note: 'E', frequency: 82.41, string: 6 },
    { note: 'A', frequency: 110.00, string: 5 },
    { note: 'D', frequency: 146.83, string: 4 },
    { note: 'G', frequency: 196.00, string: 3 },
    { note: 'B', frequency: 246.94, string: 2 },
    { note: 'E', frequency: 329.63, string: 1 }
  ]

  // Notas de referencia para bajo estándar
  const bassNotes = [
    { note: 'E', frequency: 41.20, string: 4 },
    { note: 'A', frequency: 55.00, string: 3 },
    { note: 'D', frequency: 73.42, string: 2 },
    { note: 'G', frequency: 98.00, string: 1 }
  ]

  const currentNotes = tuningMode === 'guitar' ? guitarNotes : bassNotes

  // TODO: Implementar detección de pitch con Pitchy
  useEffect(() => {
    if (isListening && hasPermission) {
      // Simulación de detección de notas para demostración
      const interval = setInterval(() => {
        // Simulamos la detección de una nota aleatoria
        const randomNote = currentNotes[Math.floor(Math.random() * currentNotes.length)]
        const randomCents = Math.floor(Math.random() * 100) - 50
        
        setDetectedNote(randomNote.note)
        setFrequency(randomNote.frequency + (randomCents * 0.1))
        setCents(randomCents)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isListening, hasPermission, currentNotes])

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setHasPermission(true)
      streamRef.current = stream
      
      // TODO: Configurar AudioContext y AnalyserNode para Pitchy
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      
    } catch (error) {
      console.error('Error accessing microphone:', error)
      setHasPermission(false)
    }
  }

  const toggleListening = () => {
    if (!hasPermission) {
      requestMicrophonePermission()
    }
    setIsListening(!isListening)
  }

  const getCentsColor = (cents: number) => {
    if (Math.abs(cents) <= 5) return 'text-green-600'
    if (Math.abs(cents) <= 15) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getCentsBackground = (cents: number) => {
    if (Math.abs(cents) <= 5) return 'bg-green-100 border-green-300'
    if (Math.abs(cents) <= 15) return 'bg-yellow-100 border-yellow-300'
    return 'bg-red-100 border-red-300'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <Link href="/" className="inline-flex items-center text-green-700 hover:text-green-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Afinador</h1>
        </header>

        {/* Selector de modo */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">Modo de afinación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={tuningMode === 'guitar' ? 'default' : 'outline'}
                onClick={() => setTuningMode('guitar')}
                className="flex-1"
              >
                🎸 Guitarra (6 cuerdas)
              </Button>
              <Button
                variant={tuningMode === 'bass' ? 'default' : 'outline'}
                onClick={() => setTuningMode('bass')}
                className="flex-1"
              >
                🎸 Bajo (4 cuerdas)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Display principal del afinador */}
        <Card className={`mb-6 ${isListening ? getCentsBackground(cents) : 'bg-gray-50'}`}>
          <CardHeader>
            <CardTitle className="text-center">
              {detectedNote ? (
                <div className="space-y-2">
                  <div className="text-6xl font-bold">
                    {detectedNote}
                  </div>
                  <div className="text-sm text-gray-600">
                    {frequency.toFixed(2)} Hz
                  </div>
                </div>
              ) : (
                <div className="text-4xl text-gray-400">
                  {isListening ? 'Escuchando...' : 'Sin señal'}
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Medidor de cents */}
            {detectedNote && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className={`text-3xl font-mono ${getCentsColor(cents)}`}>
                    {cents > 0 ? '+' : ''}{cents} cents
                  </div>
                  <div className="text-sm text-gray-600">
                    {Math.abs(cents) <= 5 ? '¡Afinado!' : 
                     cents > 0 ? 'Muy agudo - Afloja' : 'Muy grave - Aprieta'}
                  </div>
                </div>

                {/* Barra visual de afinación */}
                <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                  <div className="absolute inset-y-0 left-1/2 w-0.5 bg-black"></div>
                  <div 
                    className={`absolute inset-y-0 w-2 rounded-full transition-all duration-300 ${
                      Math.abs(cents) <= 5 ? 'bg-green-600' :
                      Math.abs(cents) <= 15 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{
                      left: `calc(50% + ${Math.max(-48, Math.min(48, cents * 0.8))}%)`,
                      transform: 'translateX(-50%)'
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>-50</span>
                  <span>0</span>
                  <span>+50</span>
                </div>
              </div>
            )}

            {/* Control del micrófono */}
            <div className="text-center mt-6">
              <Button
                onClick={toggleListening}
                size="lg"
                className={`w-24 h-24 rounded-full ${
                  isListening 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </Button>
              <div className="mt-4 text-sm text-gray-600">
                {!hasPermission ? 'Permitir acceso al micrófono' :
                 isListening ? 'Escuchando - Toca para parar' : 'Toca para empezar'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notas de referencia */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              Afinación estándar - {tuningMode === 'guitar' ? 'Guitarra' : 'Bajo'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {currentNotes.map((noteData) => (
                <div 
                  key={`${noteData.note}-${noteData.string}`}
                  className={`p-3 text-center rounded-lg border-2 ${
                    detectedNote === noteData.note && Math.abs(cents) <= 5
                      ? 'bg-green-100 border-green-400'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="font-bold text-lg">{noteData.note}</div>
                  <div className="text-xs text-gray-600">
                    Cuerda {noteData.string}
                  </div>
                  <div className="text-xs text-gray-500">
                    {noteData.frequency.toFixed(1)} Hz
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-yellow-800 mb-2">Próximas funcionalidades</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Integración completa con Pitchy para detección precisa de pitch</li>
              <li>• Soporte para afinaciones alternativas (Drop D, DADGAD, etc.)</li>
              <li>• Calibración de A4 (440Hz personalizable)</li>
              <li>• Modo cromático para cualquier instrumento</li>
              <li>• Historial de afinación y análisis de estabilidad</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

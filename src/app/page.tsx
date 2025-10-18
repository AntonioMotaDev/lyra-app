import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Lyra</h1>
          <p className="text-lg text-gray-600">Tu compañero musical digital</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-700">🥁 Metrónomo</CardTitle>
              <CardDescription>
                Mantén el tiempo perfecto con nuestro metrónomo digital avanzado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
                <li>Control de BPM de 40 a 200</li>
                <li>Múltiples subdivisiones rítmicas</li>
                <li>Sonidos de alta calidad</li>
                <li>Interfaz intuitiva</li>
              </ul>
              <Link href="/metronome">
                <Button className="w-full">Abrir Metrónomo</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-green-700">🎸 Afinador</CardTitle>
              <CardDescription>
                Afina tu guitarra o bajo con precisión profesional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
                <li>Detección automática de notas</li>
                <li>Precisión en cents</li>
                <li>Compatible con guitarra y bajo</li>
                <li>Visualización clara</li>
              </ul>
              <Link href="/tuner">
                <Button className="w-full">Abrir Afinador</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <footer className="text-center mt-12 text-gray-500">
          <p>Hecho con ❤️ para músicos por músicos</p>
        </footer>
      </div>
    </div>
  )
}

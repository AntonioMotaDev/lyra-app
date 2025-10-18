import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen  p-4 bg-dark-blue dark:bg-rich-black text-rich-black dark:text-gray-200">
      <div className="max-w-4xl mx-auto">
      <header className="text-center mb-8 p-6">

        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-light-blue mb-2">Lyra</h1>
          <p className="text-lg text-gray-300 mb-0"></p>
        </div>
      </header>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-blue">Metrónomo</CardTitle>
              <CardDescription>
                
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
                <li>Control de BPM de 40 a 200</li>
                <li>Subdivisiones rítmicas</li>
              </ul>
              <Link href="/metronome">
                <Button className="w-full">Abrir Metrónomo</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-blue">Afinador</CardTitle>
              <CardDescription>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
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
          <p>V 0.1</p>
        </footer>
      </div>
    </div>
  )
}

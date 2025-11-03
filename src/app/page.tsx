import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-rich-black text-vivid-sky-blue overflow-hidden">
      {/* Starry background */}
      <div className="absolute inset-0">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>
      
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-oxford-blue/20 via-rich-black to-rich-black"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-20">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-light tracking-wide text-vivid-sky-blue">
              Lyra
            </h1>
            <p className="text-xl text-celestial-blue/80 font-light max-w-2xl mx-auto leading-relaxed">
              Herramienta en constante evolucion. v 0.1
            </p>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-celestial-blue to-transparent mx-auto"></div>
          </div>
        </header>

        {/* Main content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {/* Metronome Card */}
          <Card className="group bg-oxford-blue/40 border-cerulean/20 backdrop-blur-sm hover:bg-oxford-blue/60 hover:border-celestial-blue/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-celestial-blue/10">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-celestial-blue animate-pulse"></div>
                <CardTitle className="text-2xl font-light text-vivid-sky-blue">
                  Metrónomo
                </CardTitle>
              </div>
              <CardDescription className="text-cerulean/80 font-light">
                Control de tempo preciso y profesional
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-celestial-blue/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-celestial-blue"></div>
                  <span className="text-sm font-light">Control de BPM de 40 a 200</span>
                </div>
                <div className="flex items-center space-x-3 text-celestial-blue/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-celestial-blue"></div>
                  <span className="text-sm font-light">Subdivisiones rítmicas</span>
                </div>
              </div>
              <Link href="/metronome" className="block">
                <Button className="w-full bg-celestial-blue/20 hover:bg-celestial-blue/40 border border-celestial-blue/40 hover:border-celestial-blue text-vivid-sky-blue font-light py-6 transition-all duration-300 hover:shadow-lg hover:shadow-celestial-blue/20">
                  Abrir Metrónomo
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Tuner Card */}
          <Card className="group bg-oxford-blue/40 border-cerulean/20 backdrop-blur-sm hover:bg-oxford-blue/60 hover:border-celestial-blue/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-celestial-blue/10">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-celestial-blue animate-pulse"></div>
                <CardTitle className="text-2xl font-light text-vivid-sky-blue">
                  Afinador
                </CardTitle>
              </div>
              <CardDescription className="text-cerulean/80 font-light">
                Afinación precisa para instrumentos de cuerda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-celestial-blue/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-celestial-blue"></div>
                  <span className="text-sm font-light">Compatible con guitarra y bajo</span>
                </div>
                <div className="flex items-center space-x-3 text-celestial-blue/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-celestial-blue"></div>
                  <span className="text-sm font-light">Visualización clara y precisa</span>
                </div>
              </div>
              <Link href="/tuner" className="block">
                <Button className="w-full bg-celestial-blue/20 hover:bg-celestial-blue/40 border border-celestial-blue/40 hover:border-celestial-blue text-vivid-sky-blue font-light py-6 transition-all duration-300 hover:shadow-lg hover:shadow-celestial-blue/20">
                  Abrir Afinador
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Drum Machine Card */}
          <Card className="group bg-oxford-blue/40 border-cerulean/20 backdrop-blur-sm hover:bg-oxford-blue/60 hover:border-celestial-blue/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-celestial-blue/10">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-celestial-blue animate-pulse"></div>
                <CardTitle className="text-2xl font-light text-vivid-sky-blue">
                  Drum Machine
                </CardTitle>
              </div>
              <CardDescription className="text-cerulean/80 font-light">
                Crea patrones rítmicos con IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-celestial-blue/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-celestial-blue"></div>
                  <span className="text-sm font-light">Generación con Magenta.js</span>
                </div>
                <div className="flex items-center space-x-3 text-celestial-blue/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-celestial-blue"></div>
                  <span className="text-sm font-light">8 sonidos de percusión</span>
                </div>
              </div>
              <Link href="/drum-machine" className="block">
                <Button className="w-full bg-celestial-blue/20 hover:bg-celestial-blue/40 border border-celestial-blue/40 hover:border-celestial-blue text-vivid-sky-blue font-light py-6 transition-all duration-300 hover:shadow-lg hover:shadow-celestial-blue/20">
                  Abrir Drum Machine
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center">
          <div className="space-y-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-cerulean/40 to-transparent mx-auto"></div>
            <p className="text-cerulean/60 text-sm font-light tracking-wider">
              Versión 0.1
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

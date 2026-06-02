import { ScrollProvider } from '@/lib/ScrollProvider'
import { Experience } from '@/three/Experience'
import { Preloader } from '@/components/Preloader'
import { CursorGlow } from '@/components/CursorGlow'
import { Nav } from '@/components/Nav'
import { Hero } from '@/components/sections/Hero'
import { Problem } from '@/components/sections/Problem'
import { Idea } from '@/components/sections/Idea'
import { Features } from '@/components/sections/Features'
import { Feeling } from '@/components/sections/Feeling'
import { Social } from '@/components/sections/Social'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Footer } from '@/components/sections/Footer'

export default function Home() {
  return (
    <ScrollProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>

      <Preloader />
      <CursorGlow />

      {/* one persistent 3D canvas behind everything */}
      <Experience />

      <Nav />

      <main id="main">
        <Hero />
        <Problem />
        <Idea />
        <Features />
        <Feeling />
        <Social />
        <FinalCTA />
      </main>

      <Footer />

      {/* printed-paper grain over the whole page */}
      <div className="grain" aria-hidden="true" />
    </ScrollProvider>
  )
}

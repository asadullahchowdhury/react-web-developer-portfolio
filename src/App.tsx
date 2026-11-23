import { useEffect, useLayoutEffect } from 'react';
import Header from './components/Header';
import Hero from './components/hero/Hero';
import About from './components/about/About';
import Stack from './components/stack/Stack';
import Work from './components/work/Work';
import Experience from './components/experience/Experience';
import Contact from './components/contact/Contact';
import Footer from './components/footer/Footer';
import { initPointerEffects } from './lib/pointerFx';
import { initSmoothScroll } from './lib/scroll';

function App() {
  // Children's layout effects (the hero intro's start state) run first, so the
  // pre-rendered page can be un-hidden here without a flash (see index.html)
  useLayoutEffect(() => document.getElementById('root')?.removeAttribute('data-prerendered'), []);
  // Lenis + ScrollTrigger (lazy, after first paint)
  useEffect(() => initSmoothScroll(), []);
  // Magnetic buttons, card spotlights, footer glow (desktop pointer only)
  useEffect(() => initPointerEffects(), []);

  return (
    <div className="min-h-screen bg-void">
      <Header />
      <main>
        <Hero />
        {/* Positioned above the pinned hero so Work slides over it at the
            end of the pin (spec §11.1 hand-off) */}
        <div className="relative z-10">
          <Work />
          <About />
          <Stack />
          <Experience />
          <Contact />
        </div>
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

export default App;

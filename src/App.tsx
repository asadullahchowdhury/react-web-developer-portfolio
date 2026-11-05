import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from './components/Header';
import Hero from './components/hero/Hero';
import About from './components/about/About';
import Stack from './components/stack/Stack';
import Work from './components/work/Work';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { initSmoothScroll } from './lib/scroll';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 120,
      delay: 100,
    });
    // Pins change the page height, so AOS re-measures after each refresh
    return initSmoothScroll(() => AOS.refresh());
  }, []);

  return (
    <div className="min-h-screen bg-background-primary">
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

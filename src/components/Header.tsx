import { useState, useEffect } from 'react';
import { Menu, X, Code } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const nextScrolled = window.scrollY > 12;
      setIsScrolled(prev => (prev !== nextScrolled ? nextScrolled : prev));
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      gsap.to(window, {
        duration: 1.5,
        scrollTo: element,
        ease: "power2.inOut"
      });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
      isScrolled
        ? 'border-subtle bg-background-primary/96 shadow-soft backdrop-blur'
        : 'border-transparent bg-background-primary/30'
    }`}>
      <nav className="relative container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo + wordmark (wordmark hidden on small screens to avoid duplicating hero heading) */}
          <button
            type="button"
            onClick={() => scrollToSection('hero')}
            className="flex items-center space-x-3 text-2xl font-bold text-left rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary"
            aria-label="Rahat Chowdhury — scroll to top"
          >
            <div className="relative shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent transition-transform duration-300 hover:rotate-6">
                <Code className="text-foreground-primary" size={20} />
              </div>
            </div>
            <span className="hidden md:inline">
              <span className="text-accent">Rahat</span>
              <span className="text-foreground-primary"> Chowdhury</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {['About', 'Skills', 'Projects', 'Experience', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-foreground-secondary hover:text-accent transition-colors duration-200 font-medium relative group"
                data-aos="fade-in"
                data-aos-delay="200"
              >
                {item}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-accent/70 group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground-primary hover:text-accent transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <>
            <button
              type="button"
              aria-label="Close mobile menu backdrop"
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 top-[72px] z-40 bg-background-primary/70 md:hidden"
            />
            <div className="absolute left-6 right-6 top-full z-50 mt-2 md:hidden">
              <div className="ui-card rounded-xl border border-subtle bg-background-primary p-4">
              <div className="flex flex-col space-y-4">
              {['About', 'Skills', 'Projects', 'Experience', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-foreground-secondary hover:text-accent transition-colors duration-200 font-medium text-left"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;

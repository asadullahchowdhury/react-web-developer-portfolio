import { useEffect, useRef } from 'react';
import { ArrowDown, Github, Linkedin, Mail, Code, Terminal } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP Timeline for hero animations
    const tl = gsap.timeline({ delay: 0.5 });

    // Animate developer name first
    if (nameRef.current) {
      tl.fromTo(nameRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );
    }

    // Animate main title with stagger effect
    if (titleRef.current) {
      const titleChars = titleRef.current.querySelectorAll('.char');
      tl.fromTo(titleChars,
        { y: 100, opacity: 0, rotationX: -90 },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: "back.out(1.7)"
        },
        "-=0.3"
      );
    }

    // Animate subtitle
    if (subtitleRef.current) {
      tl.fromTo(subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.3"
      );
    }

    // Animate buttons
    if (buttonsRef.current) {
      const buttons = buttonsRef.current.querySelectorAll('button');
      tl.fromTo(buttons,
        { y: 30, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)"
        },
        "-=0.4"
      );
    }

    // Animate social links
    if (socialRef.current) {
      const socialLinks = socialRef.current.querySelectorAll('a');
      tl.fromTo(socialLinks,
        { y: 20, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.7)"
        },
        "-=0.3"
      );
    }

    return () => {};
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      gsap.to(window, {
        duration: 1.5,
        scrollTo: aboutSection,
        ease: "power2.inOut"
      });
    }
  };

  const handleDownloadResume = () => {
    const resumeUrl = 'assets/resume.pdf';
    window.open(resumeUrl, '_blank');
  }

  const splitTextIntoChars = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className="char inline-block">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <>
      <section
        id="hero"
        ref={heroRef}
        className="relative flex min-h-[100dvh] min-h-screen items-center justify-center overflow-hidden bg-background-primary pt-20 sm:pt-24"
      >
        <div className="container relative z-10 mx-auto px-6 pt-44 text-center">
          <div className="max-w-6xl mx-auto">
            {/* Developer name above title */}
            <div ref={nameRef} className="mb-6 sm:block hidden">
              <p className="text-xl md:text-2xl text-foreground-secondary font-medium tracking-wide">
                Hello, I'm
              </p>
            </div>

            {/* Main heading with character animation */}
            <div ref={titleRef} className="mb-6">
              <h1 className="sm:text-6xl text-4xl md:text-8xl font-extrabold tracking-tight leading-tight mb-3">
                <div className="text-foreground-primary mb-2">
                  {splitTextIntoChars('Rahat')}
                </div>
                <div className="text-foreground-primary">
                  {splitTextIntoChars('Chowdhury')}
                </div>
              </h1>
            </div>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="mb-10 max-w-2xl mx-auto text-xl text-foreground-secondary md:text-2xl leading-relaxed"
            >
              Full-stack developer focused on clear UI, solid architecture, and products that stay
              maintainable after launch.
            </p>

            {/* Action buttons */}
            <div
              ref={buttonsRef}
              className="flex flex-col sm:flex-row gap-6 justify-center mb-14"
            >
              <button
                onClick={() => {
                  const projectsSection = document.getElementById('projects');
                  if (projectsSection) {
                    gsap.to(window, {
                      duration: 1.5,
                      scrollTo: projectsSection,
                      ease: "power2.inOut"
                    });
                  }
                }}
                className="rounded-full bg-accent px-8 py-4 font-semibold text-foreground-primary shadow-soft transition-colors hover:bg-accent/90"
              >
                <span className="flex items-center justify-center space-x-2">
                  <Code size={20} />
                  <span>View work</span>
                </span>
              </button>

              <button className="rounded-full border-2 border-subtle bg-transparent px-8 py-4 font-semibold text-foreground-primary transition-colors hover:border-accent hover:bg-accent/10"
                      onClick={handleDownloadResume}>
                <span className="relative z-10 flex items-center justify-center space-x-2" >
                  <Terminal size={20} />
                  <span>Download Resume</span>
                </span>
              </button>
            </div>

            {/* Social links */}
            <div
              ref={socialRef}
              className="flex justify-center space-x-8 mb-16"
            >
              {[
                { icon: Github, href: 'https://github.com/asadullahchowdhury', label: 'GitHub' },
                { icon: Linkedin, href: 'https://www.linkedin.com/in/chowdhuryrahat', label: 'LinkedIn' },
                { icon: Mail, href: 'mailto:crahat4@gmail.com', label: 'Email' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="p-4 text-foreground-secondary transition-colors hover:text-accent"
                  aria-label={social.label}
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <button
            onClick={scrollToAbout}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-foreground-secondary transition-colors hover:text-accent"
          >
            <div>
              <ArrowDown size={24} />
            </div>
          </button>
        </div>

      </section>
    </>
  );
};

export default Hero;

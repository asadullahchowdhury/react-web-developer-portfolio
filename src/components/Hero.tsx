import { useEffect, useRef } from 'react';
import { ArrowDown, Github, Linkedin, Mail, Code, Terminal, Zap } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import TypewriterCode from './TypewriterCode';
import CodingParticles from './CodingParticles';
import CursorDot from './CursorDot';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

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

    // Animate code terminal
    if (codeRef.current) {
      tl.fromTo(codeRef.current,
        { scale: 0.8, opacity: 0, rotationY: -15 },
        { scale: 1, opacity: 1, rotationY: 0, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.5"
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

    // GSAP ScrollTrigger for parallax effect
    if (heroRef.current) {
      gsap.to(heroRef.current, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
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
    const resumeUrl = '/images/resume.pdf';
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
      <CursorDot />
      <CodingParticles />

      <section id={'hero'}
        ref={heroRef}
        className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
        style={{ paddingTop: '6rem' }} // Add top spacing from navbar
      >
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              animation: 'grid-move 20s linear infinite',
            }}
          ></div>
        </div>

        {/* Floating code icons */}
        <div className="absolute inset-0 pointer-events-none">
          <Code
            className="absolute top-20 left-20 text-cyan-400/20 animate-pulse"
            size={40}
          />
          <Terminal
            className="absolute top-40 right-32 text-purple-400/20 animate-bounce"
            size={35}
          />
          <Zap
            className="absolute bottom-40 left-32 text-cyan-400/20 animate-pulse"
            size={30}
          />
        </div>

        <div className="container mx-auto px-6 pt-44 text-center relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Developer name above title */}
            <div ref={nameRef} className="mb-6">
              <p className="text-xl md:text-2xl text-cyan-400 font-medium tracking-wide">
                Hello, I'm
              </p>
            </div>

            {/* Main heading with character animation */}
            <div ref={titleRef} className="mb-8">
              <h1 className="sm:text-6xl text-4xl md:text-8xl font-bold leading-tight mb-4">
                <div className=" bg-clip-text bg-gradient-to-r text-cyan-400 from-cyan-400 via-purple-400 to-cyan-400 mb-2">
                  {splitTextIntoChars('Rahat')}
                </div>
                <div className=" bg-clip-text bg-gradient-to-r text-purple-400 from-purple-400 via-cyan-400 to-purple-400">
                  {splitTextIntoChars('Chowdhury')}
                </div>
              </h1>
            </div>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed"
            >
              Full-Stack Developer crafting exceptional digital experiences
              <br />
              <span className="text-cyan-400">with modern technologies</span>
            </p>

            {/* Typewriter code terminal */}
            <div
              ref={codeRef}
              className="mb-12"
            >
              <TypewriterCode />
            </div>

            {/* Action buttons */}
            <div
              ref={buttonsRef}
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
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
                className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <Code size={20} />
                  <span>View My Work</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button className="group relative border-2 border-cyan-400 text-cyan-400 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:bg-cyan-400 hover:text-slate-900 hover:shadow-lg hover:shadow-cyan-400/25 transform hover:scale-105"
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
                  className="group relative p-4 text-gray-400 hover:text-cyan-400 transition-all duration-300 transform hover:scale-125 hover:-translate-y-2"
                  aria-label={social.label}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                  <social.icon size={24} className="relative z-10" />
                  <div className="absolute inset-0 bg-cyan-400/10 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <button
            onClick={scrollToAbout}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 hover:text-cyan-400 transition-all duration-300 animate-bounce hover:scale-110 group"
          >
            <div className="relative">
              <ArrowDown size={24} />
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300"></div>
            </div>
          </button>
        </div>

        {/* Glowing accent lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"></div>
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-purple-400/30 to-transparent"></div>
        </div>
      </section>
    </>
  );
};

export default Hero;


import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-subtle bg-background-primary py-16">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
            <div className="text-center md:mb-0 md:text-left" data-aos="fade-in" data-aos-delay="200">
              <div className="mb-2 text-xl font-bold text-foreground-primary sm:text-2xl">
                <span className="text-accent">Rahat</span> Chowdhury
              </div>
              <p className="max-w-md text-base leading-relaxed text-foreground-secondary">
                Full-stack developer — Jashore, Bangladesh.
              </p>
            </div>

            <div className="flex shrink-0 justify-center space-x-6 md:justify-end" data-aos="fade-in" data-aos-delay="400">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/asadullahchowdhury"
                className="text-foreground-secondary transition-colors hover:text-accent"
                aria-label="GitHub"
              >
                <Github size={24} />
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.linkedin.com/in/chowdhuryrahat"
                className="text-foreground-secondary transition-colors hover:text-accent"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="mailto:crahat4@gmail.com"
                className="text-foreground-secondary transition-colors hover:text-accent"
                aria-label="Email"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>

          <div className="mt-10 border-t border-subtle pt-8 text-center">
            <p
              className="text-sm text-foreground-secondary"
              data-aos="fade-in"
              data-aos-delay="600"
            >
              © {currentYear} Rahat Chowdhury. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

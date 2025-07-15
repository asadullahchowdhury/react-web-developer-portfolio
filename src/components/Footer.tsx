
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0" data-aos="fade-in" data-aos-delay="200">
              <div className="text-2xl font-bold text-white mb-2">
                <span className="text-cyan-400">Dev</span>Portfolio
              </div>
              <p className="text-gray-400">
                Building the future, one line of code at a time.
              </p>
            </div>

            <div className="flex space-x-6" data-aos="fade-in" data-aos-delay="400">
              <a
                  target="_blank"
                href="https://github.com/asadullahchowdhury"
                className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 transform hover:scale-110"
                aria-label="GitHub"
              >
                <Github size={24} />
              </a>
              <a
                  target="_blank"
                href="https://www.linkedin.com/in/chowdhuryrahat"
                className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
              <a
                  target="_blank"
                href="mailto:crahat4@gmail.com"
                className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 transform hover:scale-110"
                aria-label="Email"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p
              className="text-gray-400 flex items-center justify-center space-x-1"
              data-aos="fade-in"
              data-aos-delay="600"
            >
              <span>© {currentYear} Rahat Chowdhury. Made with</span>
              <Heart size={16} className="text-red-500" />
              <span>and lots of coffee.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { Code, Coffee, Lightbulb } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-slate-800">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-4xl font-bold text-white text-center mb-16"
            data-aos="fade-up"
          >
            About <span className="text-cyan-400">Me</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right" data-aos-delay="200">
              <div className="w-80 h-80 mx-auto bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center">
                <div className="w-72 h-72 bg-slate-800 rounded-full flex items-center justify-center">
                  <Code size={120} className="text-cyan-400" />
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <p 
                className="text-gray-300 text-lg leading-relaxed"
                data-aos="fade-left"
                data-aos-delay="300"
              >
                I'm a passionate full-stack developer with over 5 years of experience creating 
                innovative web applications. I love turning complex problems into simple, 
                beautiful, and intuitive solutions.
              </p>
              
              <p 
                className="text-gray-300 text-lg leading-relaxed"
                data-aos="fade-left"
                data-aos-delay="400"
              >
                When I'm not coding, you'll find me exploring new technologies, contributing to 
                open-source projects, or sharing knowledge with the developer community.
              </p>
              
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div 
                  className="text-center"
                  data-aos="fade-in"
                  data-aos-delay="500"
                >
                  <div className="bg-slate-700 p-4 rounded-lg mb-3 hover:bg-slate-600 transition-colors duration-300">
                    <Code className="text-cyan-400 mx-auto" size={32} />
                  </div>
                  <h3 className="text-white font-semibold">Clean Code</h3>
                  <p className="text-gray-400 text-sm">Writing maintainable code</p>
                </div>
                
                <div 
                  className="text-center"
                  data-aos="fade-in"
                  data-aos-delay="600"
                >
                  <div className="bg-slate-700 p-4 rounded-lg mb-3 hover:bg-slate-600 transition-colors duration-300">
                    <Lightbulb className="text-cyan-400 mx-auto" size={32} />
                  </div>
                  <h3 className="text-white font-semibold">Innovation</h3>
                  <p className="text-gray-400 text-sm">Creative problem solving</p>
                </div>
                
                <div 
                  className="text-center"
                  data-aos="fade-in"
                  data-aos-delay="700"
                >
                  <div className="bg-slate-700 p-4 rounded-lg mb-3 hover:bg-slate-600 transition-colors duration-300">
                    <Coffee className="text-cyan-400 mx-auto" size={32} />
                  </div>
                  <h3 className="text-white font-semibold">Dedication</h3>
                  <p className="text-gray-400 text-sm">Committed to excellence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
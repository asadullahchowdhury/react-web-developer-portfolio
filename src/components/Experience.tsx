import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

const Experience = () => {
  const experiences = [
    {
      title: 'Senior Full-Stack Developer',
      company: 'TechCorp Solutions',
      location: 'San Francisco, CA',
      period: '2022 - Present',
      description: 'Lead development of enterprise web applications serving 100k+ users. Architected microservices infrastructure and mentored junior developers.',
      achievements: [
        'Reduced application load time by 40% through optimization',
        'Led team of 5 developers on major product redesign',
        'Implemented CI/CD pipeline reducing deployment time by 60%'
      ]
    },
    {
      title: 'Full-Stack Developer',
      company: 'StartupXYZ',
      location: 'Austin, TX',
      period: '2020 - 2022',
      description: 'Developed and maintained multiple client projects using React, Node.js, and cloud technologies. Collaborated with design and product teams.',
      achievements: [
        'Built 15+ responsive web applications from scratch',
        'Integrated third-party APIs and payment systems',
        'Improved code coverage from 60% to 95%'
      ]
    },
    {
      title: 'Frontend Developer',
      company: 'Digital Agency Pro',
      location: 'Remote',
      period: '2019 - 2020',
      description: 'Specialized in creating pixel-perfect, responsive websites for various clients. Worked closely with designers to implement creative solutions.',
      achievements: [
        'Delivered 25+ client projects on time and budget',
        'Achieved 98% client satisfaction rate',
        'Reduced development time by 30% through component reusability'
      ]
    }
  ];

  return (
    <section id="experience" className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-4xl font-bold text-white text-center mb-16"
            data-aos="fade-up"
          >
            Work <span className="text-cyan-400">Experience</span>
          </h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 to-purple-600"></div>
            
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <div 
                  key={index} 
                  className="relative flex items-start space-x-8"
                  data-aos="fade-in-left"
                  data-aos-delay={index * 200}
                >
                  {/* Timeline dot */}
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center relative z-10">
                    <div className="w-8 h-8 bg-slate-900 rounded-full"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-colors duration-300">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{exp.title}</h3>
                        <p className="text-cyan-400 font-semibold">{exp.company}</p>
                      </div>
                      <div className="flex flex-col md:items-end mt-2 md:mt-0">
                        <div className="flex items-center text-gray-400 text-sm mb-1">
                          <Calendar size={14} className="mr-1" />
                          {exp.period}
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <MapPin size={14} className="mr-1" />
                          {exp.location}
                        </div>
                      </div>
                    </div>
                    
                    <p 
                      className="text-gray-300 mb-4 leading-relaxed"
                      data-aos="fade-in-left"
                      data-aos-delay={index * 200 + 100}
                    >
                      {exp.description}
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="text-white font-semibold mb-2">Key Achievements:</h4>
                      <ul className="space-y-1">
                        {exp.achievements.map((achievement, achIndex) => (
                          <li 
                            key={achIndex} 
                            className="text-gray-300 flex items-start"
                            data-aos="fade-in"
                            data-aos-delay={index * 200 + 200 + achIndex * 100}
                          >
                            <span className="text-cyan-400 mr-2">•</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
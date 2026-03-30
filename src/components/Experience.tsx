import { Calendar, MapPin } from 'lucide-react';

const Experience = () => {
  const experiences = [
    {
      title: 'Senior Full-Stack Developer',
      company: 'CodeVioso',
      location: 'Jashore, Bangladesh',
      period: '2025 - Present',
      description: 'Lead development of enterprise web applications serving 100k+ users. Architected microservices infrastructure and mentored junior developers.',
      achievements: [
        'Reduced application load time by 40% through optimization',
        'Led team of 5 developers on major product redesign',
        'Implemented CI/CD pipeline reducing deployment time by 60%'
      ]
    },
    {
      title: 'Full-Stack Developer',
      company: 'Redishketch',
      location: 'Dhaka, Bangladesh',
      period: '2022 - 2024',
      description: 'Developed and maintained multiple client projects using React, Node.js, and cloud technologies. Collaborated with design and product teams.',
      achievements: [
        'Built 15+ responsive web applications from scratch',
        'Integrated third-party APIs and payment systems',
        'Improved code coverage from 60% to 95%'
      ]
    },
    {
      title: 'Frontend Developer',
      company: 'Redishketch',
      location: 'Dhaka, Bangladesh',
      period: '2021 - 2022',
      description: 'Specialized in creating pixel-perfect, responsive websites for various clients. Worked closely with designers to implement creative solutions.',
      achievements: [
        'Delivered 25+ client projects on time and budget',
        'Achieved 100% client satisfaction rate',
        'Reduced development time by 30% through component reusability'
      ]
    }
  ];

  return (
    <section id="experience" className="bg-background-primary py-20">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          <h2
            className="mb-16 text-center text-3xl font-bold tracking-tight text-foreground-primary sm:text-4xl"
            data-aos="fade-up"
          >
            Work <span className="text-accent">Experience</span>
          </h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute bottom-0 left-5 top-0 w-0.5 bg-accent/35 sm:left-8" />

            <div className="space-y-8 sm:space-y-12">
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className="relative flex items-start gap-4 sm:gap-8"
                  data-aos="fade-in-left"
                  data-aos-delay={index * 200}
                >
                  {/* Timeline dot */}
                  <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent sm:h-16 sm:w-16">
                    <div className="w-4 h-4 sm:w-8 sm:h-8 bg-background-primary rounded-full"></div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 ui-card ui-card--interactive p-4 sm:p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="mb-1 text-xl font-bold leading-snug text-foreground-primary">{exp.title}</h3>
                        <p className="text-accent font-semibold">{exp.company}</p>
                      </div>
                      <div className="flex flex-col md:items-end mt-2 md:mt-0">
                        <div className="flex items-center text-foreground-secondary text-sm mb-1">
                          <Calendar size={14} className="mr-1" />
                          {exp.period}
                        </div>
                        <div className="flex items-center text-foreground-secondary text-sm">
                          <MapPin size={14} className="mr-1" />
                          {exp.location}
                        </div>
                      </div>
                    </div>

                    <p
                      className="mb-4 text-base leading-relaxed text-foreground-secondary break-words"
                      data-aos="fade-in-left"
                      data-aos-delay={index * 200 + 100}
                    >
                      {exp.description}
                    </p>

                    <div className="space-y-2">
                      <h4 className="mb-2 font-semibold text-foreground-primary">Highlights</h4>
                      <ul className="space-y-1">
                        {exp.achievements.map((achievement, achIndex) => (
                          <li
                            key={achIndex}
                            className="flex items-start text-base leading-relaxed text-foreground-secondary break-words"
                            data-aos="fade-in"
                            data-aos-delay={index * 200 + 200 + achIndex * 100}
                          >
                            <span className="text-accent mr-2">•</span>
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

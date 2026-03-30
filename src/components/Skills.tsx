
const Skills = () => {
  const skillCategories = [
    {
      title: 'Frontend',
      skills: [
        { name: 'Angular', level: 95 },
        { name: 'React', level: 95 },
        { name: 'TypeScript', level: 90 },
        { name: 'Next.js', level: 85 },
        { name: 'Tailwind CSS', level: 92 },
        { name: 'Vue.js', level: 80 },
      ]
    },
    {
      title: 'Backend',
      skills: [
        { name: 'Laravel', level: 95 },
        { name: 'Node.js', level: 88 },
        { name: 'Python', level: 85 },
        { name: 'PostgreSQL', level: 82 },
        { name: 'MongoDB', level: 78 },
        { name: 'GraphQL', level: 75 },
      ]
    },
    {
      title: 'Tools & Others',
      skills: [
        { name: 'Git', level: 90 },
        { name: 'Figma', level: 86 },
        { name: 'Docker', level: 80 },
        { name: 'AWS', level: 75 },
        { name: 'GSAP', level: 85 },
        { name: 'Nginx', level: 85 },
      ]
    }
  ];

  return (
    <section id="skills" className="bg-background-primary py-20">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          <h2
            className="mb-16 text-center text-3xl font-bold tracking-tight text-foreground-primary sm:text-4xl"
            data-aos="fade-up"
          >
            Technical <span className="text-accent">skills</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="ui-card ui-card--interactive p-6"
                data-aos="fade-in"
                data-aos-delay={categoryIndex * 200}
              >
                <h3 className="text-xl font-bold text-foreground-primary mb-6 text-center">{category.title}</h3>

                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-foreground-secondary font-medium">{skill.name}</span>
                        <span className="text-accent text-sm">{skill.level}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full border border-subtle bg-background-secondary/40">
                        <div
                          className="h-2 rounded-full bg-accent transition-all duration-1000 ease-out"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;

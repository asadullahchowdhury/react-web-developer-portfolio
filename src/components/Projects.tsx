import {ExternalLink, Github} from 'lucide-react';

const Projects = () => {
    const projects = [
        {
            title: 'CAFM Platform',
            description: 'Computer-aided facilities management — assets, work orders and maintenance in one system.',
            image: '/assets/images/cafm-platform.png',
            technologies: ['Angular', 'Bootstrap', 'Vue.js', 'Stripe'],
            liveUrl: '#',
            githubUrl: ''
        },
        {
            title: 'Barberly',
            description: 'Barberly is a popular cloud-based barbershop software designed to help barbers and salon owners manage their business more efficiently. Think of it as a digital assistant specifically for barbershops!',
            image: '/assets/images/barberly.png',
            technologies: ['Vue.js', 'Node.js', 'Laravel', 'Stripe'],
            liveUrl: 'https://barberly.thethemeai.com',
            githubUrl: ''
        },
        {
            title: 'Task management (concept)',
            description: 'Exploration of real-time boards, drag-and-drop, and team workflows—stack chosen to mirror production SaaS patterns.',
            image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200',
            technologies: ['Vue.js', 'Firebase', 'Vuetify', 'Socket.io'],
            liveUrl: '#',
            githubUrl: ''
        },
        {
            title: 'Weather dashboard (concept)',
            description: 'Practice project: location-based forecasts, charts, and a responsive layout built around a public weather API.',
            image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200',
            technologies: ['React', 'TypeScript', 'Chart.js', 'OpenWeather API'],
            liveUrl: '#',
            githubUrl: ''
        },
        {
            title: 'Analytics UI (concept)',
            description: 'Concept dashboard for engagement metrics and reporting—focused on chart performance and readable data density.',
            image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200',
            technologies: ['Next.js', 'Python', 'MongoDB', 'D3.js'],
            liveUrl: '#',
            githubUrl: ''
        }
    ];

    return (
        <section id="projects" className="bg-background-secondary py-20">
            <div className="container mx-auto px-6">
                <div className="mx-auto max-w-6xl">
                    <h2
                        className="mb-16 text-center text-3xl font-bold tracking-tight text-foreground-primary sm:text-4xl"
                        data-aos="fade-up"
                    >
                        Selected <span className="text-accent">work</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {projects.map((project, index) => (
                            <div
                                key={index}
                                className="group ui-card ui-card--interactive overflow-hidden"
                                data-aos="fade-in-right"
                                data-aos-delay={index * 200}
                            >
                                <div className="relative overflow-hidden h-48">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-all duration-[3000ms] ease-linear group-hover:object-top object-top"
                                        style={{
                                            objectPosition: 'center top',
                                            transform: 'translateY(0)',
                                        }}
                                        onMouseEnter={(e) => {
                                            const img = e.target as HTMLImageElement;
                                            img.style.transform = 'translateY(-60%)';
                                        }}
                                        onMouseLeave={(e) => {
                                            const img = e.target as HTMLImageElement;
                                            img.style.transform = 'translateY(0)';
                                        }}
                                    />
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-background-primary/50 to-transparent" />
                                </div>

                                <div className="p-6">
                                    <h3
                                        className="text-xl font-bold text-foreground-primary mb-3"
                                        data-aos="fade-in"
                                        data-aos-delay={index * 200 + 100}
                                    >
                                        {project.title}
                                    </h3>
                                    <p
                                        className="mb-4 text-base leading-relaxed text-foreground-secondary"
                                        data-aos="fade-in-left"
                                        data-aos-delay={index * 200 + 200}
                                    >
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.technologies.map((tech, techIndex) => (
                                            <span
                                                key={techIndex}
                                                className="ui-chip text-accent px-3 py-1 text-sm font-medium transition-colors hover:bg-accent/10"
                                                data-aos="fade-in"
                                                data-aos-delay={index * 200 + 300 + techIndex * 50}
                                            >
                        {tech}
                      </span>
                                        ))}
                                    </div>

                                    <div className="flex space-x-4">
                                        <a
                                            href={project.liveUrl}
                                            {...(project.liveUrl.startsWith('http')
                                              ? { target: '_blank', rel: 'noopener noreferrer' }
                                              : {})}
                                            className="flex items-center space-x-2 text-accent hover:text-foreground-primary transition-colors duration-200 group/link"
                                            data-aos="fade-in"
                                            data-aos-delay={index * 200 + 400}
                                        >
                                            <ExternalLink size={16}
                                                          className="transition-transform duration-200 group-hover/link:scale-105"/>
                                            <span>Live Demo</span>
                                        </a>
                                        {project.githubUrl !== ''
                                            ? (
                                                <a
                                                    href={project.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center space-x-2 text-foreground-secondary hover:text-foreground-primary transition-colors duration-200 group/link"
                                                    data-aos="fade-in"
                                                    data-aos-delay={index * 200 + 450}
                                                >
                                                    <Github size={16}
                                                            className="transition-transform duration-200 group-hover/link:scale-105"/>
                                                    <span>Code</span>
                                                </a>
                                            ) : ('')}

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Projects;

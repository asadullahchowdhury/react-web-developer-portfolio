import {ExternalLink, Github} from 'lucide-react';

const Projects = () => {
    const projects = [
        {
            title: 'EQUIDESK',
            description: 'We partnered with Equidesk to deliver a complete facilities management software solution, covering every aspect from initial concept to successful launch.',
            image: '/images/equidesk.png',
            technologies: ['Angular', 'Bootstrap', 'vue', 'Stripe'],
            liveUrl: '#',
            githubUrl: 'https://barberly.thethemeai.com'
        },
        {
            title: 'Barberly',
            description: 'Barberly is a popular cloud-based barbershop software designed to help barbers and salon owners manage their business more efficiently. Think of it as a digital assistant specifically for barbershops!',
            image: '/images/barberly.png',
            technologies: ['Vue.js', 'Node.js', 'laravel', 'Stripe'],
            liveUrl: 'https://barberly.thethemeai.com',
            githubUrl: ''
        },
        {
            title: 'Task Management App',
            description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
            image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200',
            technologies: ['Vue.js', 'Firebase', 'Vuetify', 'Socket.io'],
            liveUrl: '#',
            githubUrl: ''
        },
        {
            title: 'Weather Dashboard',
            description: 'A responsive weather dashboard that provides detailed weather information with beautiful visualizations and location-based forecasts.',
            image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200',
            technologies: ['React', 'TypeScript', 'Chart.js', 'OpenWeather API'],
            liveUrl: '#',
            githubUrl: ''
        },
        {
            title: 'Social Media Analytics',
            description: 'An analytics platform for social media managers to track engagement, analyze trends, and generate comprehensive reports.',
            image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200',
            technologies: ['Next.js', 'Python', 'MongoDB', 'D3.js'],
            liveUrl: '#',
            githubUrl: ''
        }
    ];

    return (
        <section id="projects" className="py-20 bg-slate-800">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    <h2
                        className="text-4xl font-bold text-white text-center mb-16"
                        data-aos="fade-up"
                    >
                        Featured <span className="text-cyan-400">Projects</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {projects.map((project, index) => (
                            <div
                                key={index}
                                className="bg-slate-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 group"
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
                                        className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                                </div>

                                <div className="p-6">
                                    <h3
                                        className="text-xl font-bold text-white mb-3"
                                        data-aos="fade-in"
                                        data-aos-delay={index * 200 + 100}
                                    >
                                        {project.title}
                                    </h3>
                                    <p
                                        className="text-gray-300 mb-4 leading-relaxed"
                                        data-aos="fade-in-left"
                                        data-aos-delay={index * 200 + 200}
                                    >
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.technologies.map((tech, techIndex) => (
                                            <span
                                                key={techIndex}
                                                className="bg-slate-700 text-cyan-400 px-3 py-1 rounded-full text-sm font-medium hover:bg-slate-600 transition-colors duration-200"
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
                                            className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-200 group/link"
                                            data-aos="fade-in"
                                            data-aos-delay={index * 200 + 400}
                                        >
                                            <ExternalLink size={16}
                                                          className="group-hover/link:scale-110 transition-transform duration-200"/>
                                            <span>Live Demo</span>
                                        </a>
                                        {project.githubUrl !== ''
                                            ? (
                                                <a
                                                    href={project.githubUrl}
                                                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 group/link"
                                                    data-aos="fade-in"
                                                    data-aos-delay={index * 200 + 450}
                                                >
                                                    <Github size={16}
                                                            className="group-hover/link:scale-110 transition-transform duration-200"/>
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

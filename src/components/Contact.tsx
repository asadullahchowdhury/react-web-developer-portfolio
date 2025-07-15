import React, {useState} from 'react';
import {Mail, Phone, MapPin, Send} from 'lucide-react';
import emailjs from '@emailjs/browser';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [loading,setLoading] = useState(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Always set to true before sending

        emailjs.send(
            'service_zui7pgm',
            'template_ah2bhde',
            formData,
            'H7g6CDvV_PhcE5Yzk'
        )
            .then(() => {
                alert('Message sent successfully!');
                setFormData({ name: '', email: '', subject: '', message: '' });
            })
            .catch((error) => {
                console.error('Email error:', error);
                alert('Failed to send message.');
            })
            .finally(() => {
                setLoading(false); // Always reset
            });
    };


    return (
        <section id="contact" className="py-20 bg-slate-800">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    <h2
                        className="text-4xl font-bold text-white text-center mb-16"
                        data-aos="fade-up"
                    >
                        Get In <span className="text-cyan-400">Touch</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div data-aos="fade-in-left" data-aos-delay="200">
                                <h3 className="text-2xl font-bold text-white mb-6">Let's Work Together</h3>
                                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                    I'm always interested in new opportunities and exciting projects.
                                    Whether you have a question or just want to say hi, feel free to reach out!
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div
                                    className="flex items-center space-x-4"
                                    data-aos="fade-in-left"
                                    data-aos-delay="300"
                                >
                                    <div className="bg-slate-700 p-3 rounded-lg">
                                        <Mail className="text-cyan-400" size={24}/>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold">Email</h4>
                                        <p className="text-gray-300">crahat4@gmail.com</p>
                                    </div>
                                </div>

                                <div
                                    className="flex items-center space-x-4"
                                    data-aos="fade-in-left"
                                    data-aos-delay="400"
                                >
                                    <div className="bg-slate-700 p-3 rounded-lg">
                                        <Phone className="text-cyan-400" size={24}/>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold">Phone</h4>
                                        <p className="text-gray-300">+1 (555) 123-4567</p>
                                    </div>
                                </div>

                                <div
                                    className="flex items-center space-x-4"
                                    data-aos="fade-in-left"
                                    data-aos-delay="500"
                                >
                                    <div className="bg-slate-700 p-3 rounded-lg">
                                        <MapPin className="text-cyan-400" size={24}/>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold">Location</h4>
                                        <p className="text-gray-300">San Francisco, CA</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div
                            className="bg-slate-900 rounded-lg p-8"
                            data-aos="slide-up"
                            data-aos-delay="300"
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div data-aos="fade-in" data-aos-delay="400">
                                        <label htmlFor="name" className="block text-white font-semibold mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div data-aos="fade-in" data-aos-delay="450">
                                        <label htmlFor="email" className="block text-white font-semibold mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                </div>

                                <div data-aos="fade-in" data-aos-delay="500">
                                    <label htmlFor="subject" className="block text-white font-semibold mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200"
                                        placeholder="Project Discussion"
                                    />
                                </div>

                                <div data-aos="fade-in" data-aos-delay="550">
                                    <label htmlFor="message" className="block text-white font-semibold mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200 resize-none"
                                        placeholder="Tell me about your project..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                                    data-aos="fade-in"
                                    data-aos-delay="600"
                                >
                                    <Send size={20}/>
                                    <span> {loading ? 'Sending...' : 'Send Message'}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;

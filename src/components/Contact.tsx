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
        <section id="contact" className="bg-background-secondary py-20">
            <div className="container mx-auto px-6">
                <div className="mx-auto max-w-6xl">
                    <h2
                        className="mb-16 text-center text-3xl font-bold tracking-tight text-foreground-primary sm:text-4xl"
                        data-aos="fade-up"
                    >
                        Say <span className="text-accent">hello</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div data-aos="fade-in-left" data-aos-delay="200">
                                <h3 className="mb-6 text-xl font-bold text-foreground-primary">Let&apos;s talk</h3>
                                <p className="mb-8 text-base leading-relaxed text-foreground-secondary">
                                    Tell me about your product, timeline, or stack. I&apos;ll reply as soon as I can.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div
                                    className="flex items-center space-x-4"
                                    data-aos="fade-in-left"
                                    data-aos-delay="300"
                                >
                                    <div className="ui-card ui-card--interactive p-3">
                                        <Mail className="text-accent" size={24}/>
                                    </div>
                                    <div>
                                        <h4 className="text-foreground-primary font-semibold">Email</h4>
                                        <p className="text-foreground-secondary">crahat4@gmail.com</p>
                                    </div>
                                </div>

                                <div
                                    className="flex items-center space-x-4"
                                    data-aos="fade-in-left"
                                    data-aos-delay="400"
                                >
                                    <div className="ui-card ui-card--interactive p-3">
                                        <Phone className="text-accent" size={24}/>
                                    </div>
                                    <div>
                                        <h4 className="text-foreground-primary font-semibold">Phone</h4>
                                        <p className="text-foreground-secondary">+880 1708-746354</p>
                                    </div>
                                </div>

                                <div
                                    className="flex items-center space-x-4"
                                    data-aos="fade-in-left"
                                    data-aos-delay="500"
                                >
                                    <div className="ui-card ui-card--interactive p-3">
                                        <MapPin className="text-accent" size={24}/>
                                    </div>
                                    <div>
                                        <h4 className="text-foreground-primary font-semibold">Location</h4>
                                        <p className="text-foreground-secondary">Jashore, Bangladesh</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div
                            className="ui-card ui-card--interactive p-8"
                            data-aos="slide-up"
                            data-aos-delay="300"
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div data-aos="fade-in" data-aos-delay="400">
                                        <label htmlFor="name" className="block text-foreground-primary font-semibold mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-xl border border-subtle bg-background-primary px-4 py-3 text-foreground-primary placeholder:text-foreground-secondary/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div data-aos="fade-in" data-aos-delay="450">
                                        <label htmlFor="email" className="block text-foreground-primary font-semibold mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-xl border border-subtle bg-background-primary px-4 py-3 text-foreground-primary placeholder:text-foreground-secondary/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                <div data-aos="fade-in" data-aos-delay="500">
                                    <label htmlFor="subject" className="block text-foreground-primary font-semibold mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-xl border border-subtle bg-background-primary px-4 py-3 text-foreground-primary placeholder:text-foreground-secondary/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent"
                                        placeholder="What's this about?"
                                    />
                                </div>

                                <div data-aos="fade-in" data-aos-delay="550">
                                    <label htmlFor="message" className="block text-foreground-primary font-semibold mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="w-full resize-none rounded-xl border border-subtle bg-background-primary px-4 py-3 text-foreground-primary placeholder:text-foreground-secondary/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent"
                                        placeholder="A few details help—scope, budget, or links."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="flex w-full items-center justify-center space-x-2 rounded-xl bg-accent px-8 py-3 font-semibold text-foreground-primary shadow-soft transition-colors hover:bg-accent/90"
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

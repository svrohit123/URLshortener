import { useState, useEffect } from 'react';
import URLForm from '../components/URLForm';
import ResultCard from '../components/ResultCard';
import { shortenUrl } from '../services/api';

const BinaryText = ({ text }) => {
    const [displayText, setDisplayText] = useState(text);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        let interval;
        if (isHovering) {
            interval = setInterval(() => {
                setDisplayText(text.split('').map(char => {
                    if (char === ' ') return ' ';
                    return Math.random() > 0.5 ? '1' : '0';
                }).join(''));
            }, 50);
        } else {
            setDisplayText(text);
        }
        return () => clearInterval(interval);
    }, [isHovering, text]);

    return (
        <span
            onMouseOver={() => setIsHovering(true)}
            onMouseOut={() => setIsHovering(false)}
            className="cursor-default inline-block"
        >
            {displayText}
        </span>
    );
};

export default function Home() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [particles, setParticles] = useState([]);

    // Generate floating particles
    useEffect(() => {
        const generated = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 10,
            duration: 10 + Math.random() * 20,
            size: 1 + Math.random() * 3,
        }));
        setParticles(generated);
    }, []);

    const handleSubmit = async (originalUrl, customSlug) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await shortenUrl(originalUrl, customSlug);
            setResult(data);
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.message ||
                'Something went wrong. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen grid-bg">
            {/* Floating Particles */}
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        left: `${p.left}%`,
                        bottom: '-5px',
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        animation: `particle ${p.duration}s ${p.delay}s linear infinite`,
                    }}
                />
            ))}

            {/* Glow Background */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-glow-gradient opacity-50 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 pt-28 pb-16 px-6">
                <div className="max-w-7xl mx-auto">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                        {/* Left Column: Hero & About */}
                        <div className="space-y-12">

                            {/* Hero Section */}
                            <div className="text-left animate-fade-in pt-4">
                                <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                                    <span className="bg-gradient-to-r from-white via-orange-100 to-orange-300 bg-clip-text text-transparent inline-block">
                                        <BinaryText text="Shorten URLs." />
                                    </span>
                                    <br />
                                    <span className="bg-gradient-to-r from-cyber-primary to-orange-400 bg-clip-text text-transparent inline-block mt-2">
                                        <BinaryText text="Share Faster." />
                                    </span>
                                </h1>

                                <p className="text-cyber-text-muted text-lg md:text-xl max-w-lg leading-relaxed">
                                    Create custom short links instantly.
                                    Fast, reliable, and beautifully branded URLs.
                                </p>
                            </div>

                            {/* About Section */}
                            <div className="animate-fade-in relative">
                                <div className="glass-card p-8 md:p-10 relative overflow-hidden">
                                    {/* Decorative ambient glow inside the card */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                                    <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3 relative z-10">
                                        <svg className="w-7 h-7 text-cyber-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        About Cutify
                                    </h2>

                                    <div className="space-y-4 text-cyber-text-muted leading-relaxed relative z-10 text-[15px]">
                                        <p>
                                            Cutify was built with a singular vision: to make long, complex URLs a thing of the past. Whether you are marketing a new product, sharing a dashboard link, or sending a direct message to a friend, Cutify wraps your original link into a beautiful, personalized, branded slug.
                                        </p>
                                        <p>
                                            Powered by a high-performance Spring Boot backend and an ultra-modern React interface, links are processed and redirected with near-zero latency. Every freshly generated link perfectly bridges the gap between desktop and mobile by instantly spinning up a lightning-fast, scannable QR Code.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Form & Results */}
                        <div className="space-y-8 lg:sticky lg:top-32">
                            {/* Form Card */}
                            <div className="glass-card p-6 md:p-8 scan-overlay animate-slide-up">
                                <URLForm onSubmit={handleSubmit} loading={loading} />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="glass-card p-4 border-cyber-danger/30 bg-cyber-danger/5 animate-slide-up">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-cyber-danger/10 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-cyber-danger" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-cyber-danger">Error</h4>
                                            <p className="text-sm text-cyber-danger/80 mt-0.5">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Result */}
                            {result && <ResultCard result={result} />}
                        </div>
                    </div>

                    {/* Features Grid (Bottom Full Width) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 mb-8 animate-fade-in">
                        {[
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                ),
                                title: 'Custom Slugs',
                                desc: 'Personalize your links with memorable, distinct words',
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                    </svg>
                                ),
                                title: 'QR Codes',
                                desc: 'Instant QR code generation for every shortened URL',
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                ),
                                title: 'Click Analytics',
                                desc: 'Track how many times your short link gets clicked',
                            },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="glass-card glass-card-hover p-6 text-center transition-all duration-300 cursor-default"
                            >
                                <div className="w-12 h-12 rounded-xl bg-cyber-primary/10 flex items-center justify-center mx-auto mb-4 text-cyber-primary">
                                    {feature.icon}
                                </div>
                                <h3 className="text-[15px] font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-[13px] text-cyber-text-muted leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

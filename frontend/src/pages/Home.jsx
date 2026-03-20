import { useState, useEffect } from 'react';
import URLForm from '../components/URLForm';
import ResultCard from '../components/ResultCard';
import { shortenUrl } from '../services/api';

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
                <div className="max-w-2xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyber-primary/10 border border-cyber-primary/20 text-cyber-primary text-xs font-medium mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-safe opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-safe"></span>
                            </span>
                            Security-First URL Shortener
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                            <span className="bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
                                Shorten URLs.
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-cyber-primary to-blue-400 bg-clip-text text-transparent">
                                Stay Secure.
                            </span>
                        </h1>

                        <p className="text-cyber-text-muted text-base md:text-lg max-w-lg mx-auto leading-relaxed">
                            Create custom short links with safety-first validation.
                            Every URL is checked before shortening.
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="glass-card p-6 md:p-8 mb-8 scan-overlay animate-slide-up">
                        <URLForm onSubmit={handleSubmit} loading={loading} />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="glass-card p-4 mb-8 border-cyber-danger/30 bg-cyber-danger/5 animate-slide-up">
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

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 animate-fade-in">
                        {[
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                ),
                                title: 'Security Scan',
                                desc: 'Every URL is validated and checked before shortening',
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
                                className="glass-card glass-card-hover p-5 text-center transition-all duration-300 cursor-default"
                            >
                                <div className="w-12 h-12 rounded-xl bg-cyber-primary/10 flex items-center justify-center mx-auto mb-3 text-cyber-primary">
                                    {feature.icon}
                                </div>
                                <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
                                <p className="text-xs text-cyber-text-muted leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

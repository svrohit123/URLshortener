import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUrlStatus, unlockUrl } from '../services/api';

export default function RedirectHandler() {
    const { slug } = useParams();
    const [status, setStatus] = useState('loading'); // loading, password, error
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [unlocking, setUnlocking] = useState(false);

    useEffect(() => {
        checkStatus();
    }, [slug]);

    const checkStatus = async () => {
        try {
            const data = await getUrlStatus(slug);
            if (data.hasPassword) {
                setStatus('password');
            } else {
                // Instantly redirect if no password
                window.location.href = data.originalUrl;
            }
        } catch (error) {
            setStatus('error');
            setErrorMsg(error.response?.data?.message || 'Link not found or expired.');
        }
    };

    const handleUnlock = async (e) => {
        e.preventDefault();
        setUnlocking(true);
        setErrorMsg('');

        try {
            const data = await unlockUrl(slug, password);
            window.location.href = data.originalUrl;
        } catch (error) {
            setErrorMsg(error.response?.data?.error || 'Incorrect password.');
            setUnlocking(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-2 border-cyber-primary/20" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyber-primary animate-spin" />
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="glass-card p-10 text-center max-w-md w-full animate-fade-in border-cyber-danger/30">
                    <div className="w-16 h-16 rounded-full bg-cyber-danger/10 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-cyber-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Link Broken</h2>
                    <p className="text-cyber-text-muted">{errorMsg}</p>
                    <a href="/" className="mt-8 inline-block text-cyber-primary hover:text-orange-400 transition-colors">
                        Go to Cutify Homepage →
                    </a>
                </div>
            </div>
        );
    }

    if (status === 'password') {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-cyber-bg relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-primary/10 rounded-full blur-3xl pointer-events-none" />

                <div className="glass-card p-8 md:p-10 w-full max-w-md animate-slide-up relative z-10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-cyber-primary/10 flex items-center justify-center mx-auto mb-6 ring-1 ring-cyber-primary/30">
                            <svg className="w-8 h-8 text-cyber-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Protected Link</h2>
                        <p className="text-cyber-text-muted text-sm">
                            This cutify URL requires a password to continue.
                        </p>
                    </div>

                    <form onSubmit={handleUnlock} className="space-y-6">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className={`cyber-input text-center text-lg tracking-widest ${errorMsg ? 'border-cyber-danger' : ''}`}
                                autoFocus
                            />
                            {errorMsg && (
                                <p className="mt-2 text-sm text-cyber-danger text-center animate-shake">
                                    {errorMsg}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={unlocking || !password.trim()}
                            className="cyber-btn w-full flex justify-center items-center gap-2"
                        >
                            {unlocking ? (
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                "Unlock Link"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return null;
}

import { useState, useEffect } from 'react';
import { getAllUrls, deleteUrl } from '../services/api';

export default function Dashboard() {
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        fetchUrls();
    }, []);

    const fetchUrls = async () => {
        try {
            setLoading(true);
            const data = await getAllUrls();
            setUrls(data);
        } catch (err) {
            setError('Failed to load URLs. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async (url, id) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = url;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this URL? You cannot undo this action.')) return;
        try {
            await deleteUrl(id);
            setUrls(urls.filter(url => url.id !== id));
        } catch (err) {
            alert('Failed to delete URL. Please try again.');
        }
    };

    return (
        <div className="relative min-h-screen grid-bg pt-24 pb-16 px-6">
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-glow-gradient opacity-30 pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                        <p className="text-cyber-text-muted text-sm">
                            Monitor and manage all your shortened URLs
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-4">
                        <button
                            onClick={fetchUrls}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-surface border border-cyber-border/50 text-sm text-cyber-text-muted hover:text-white hover:border-cyber-primary/50 transition-all duration-300"
                        >
                            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                        <div className="px-4 py-2 rounded-lg bg-cyber-primary/10 border border-cyber-primary/20 text-sm text-cyber-primary font-medium">
                            {urls.length} URL{urls.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full border-2 border-cyber-primary/20" />
                            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyber-primary animate-spin" />
                        </div>
                        <p className="text-cyber-text-muted mt-4 text-sm">Loading URLs...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="glass-card p-6 border-cyber-danger/30 bg-cyber-danger/5 text-center animate-slide-up">
                        <svg className="w-12 h-12 text-cyber-danger/50 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-cyber-danger text-sm">{error}</p>
                        <button onClick={fetchUrls} className="cyber-btn mt-4 text-sm px-6 py-2">
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && urls.length === 0 && (
                    <div className="glass-card p-12 text-center animate-fade-in">
                        <div className="w-20 h-20 rounded-2xl bg-cyber-primary/10 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-cyber-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No URLs Yet</h3>
                        <p className="text-cyber-text-muted text-sm">Start by creating your first secure short URL</p>
                    </div>
                )}

                {/* URL Table */}
                {!loading && !error && urls.length > 0 && (
                    <div className="glass-card overflow-hidden animate-slide-up">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-cyber-border/30">
                                        <th className="text-left text-xs font-semibold text-cyber-text-muted uppercase tracking-wider px-6 py-4">
                                            Short URL
                                        </th>
                                        <th className="text-left text-xs font-semibold text-cyber-text-muted uppercase tracking-wider px-6 py-4">
                                            Original URL
                                        </th>
                                        <th className="text-right text-xs font-semibold text-cyber-text-muted uppercase tracking-wider px-6 py-4">
                                            Clicks
                                        </th>
                                        <th className="text-right text-xs font-semibold text-cyber-text-muted uppercase tracking-wider px-6 py-4">
                                            Expires
                                        </th>
                                        <th className="text-center text-xs font-semibold text-cyber-text-muted uppercase tracking-wider px-6 py-4">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {urls.map((url) => (
                                        <tr
                                            key={url.id}
                                            className="border-b border-cyber-border/10 hover:bg-white/[0.02] transition-colors duration-200"
                                        >
                                            <td className="px-6 py-4">
                                                <code className="text-sm text-cyber-primary font-mono">
                                                    /{url.customSlug}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-300 truncate max-w-[200px] font-mono" title={url.originalUrl}>
                                                    {url.originalUrl}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-sm font-mono text-white font-semibold">
                                                    {url.clickCount.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-xs text-cyber-text-muted">
                                                    {new Date(url.expiryDate).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleCopy(url.shortUrl, url.id)}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${copiedId === url.id
                                                            ? 'bg-cyber-safe/20 text-cyber-safe'
                                                            : 'bg-cyber-primary/10 text-cyber-primary hover:bg-cyber-primary/20'
                                                            }`}
                                                    >
                                                        {copiedId === url.id ? (
                                                            <>
                                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                                Copied
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                </svg>
                                                                Copy
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(url.id)}
                                                        className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300"
                                                        title="Delete URL"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

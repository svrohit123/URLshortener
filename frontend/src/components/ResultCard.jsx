import { useState } from 'react';
import QRCode from './QRCode';

export default function ResultCard({ result }) {
    const [copied, setCopied] = useState(false);

    if (!result) return null;

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'SecureLink Short URL',
                    text: 'Check out this secured short link!',
                    url: result.shortUrl,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            alert('Web Share API is not supported in your browser. You can copy the link instead.');
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(result.shortUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = result.shortUrl;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="glass-card p-6 animate-slide-up space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyber-primary/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-cyber-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">URL Created Successfully!</h3>
                    <p className="text-xs text-cyber-text-muted">Your secure short link is ready</p>
                </div>
            </div>

            {/* Short URL */}
            <div className="bg-cyber-bg/80 rounded-xl p-4 border border-cyber-border/30">
                <label className="text-xs text-cyber-text-muted mb-2 block">Your Short URL</label>
                <div className="flex items-center gap-3">
                    <code className="flex-1 text-cyber-primary font-mono text-sm bg-transparent truncate">
                        {result.shortUrl}
                    </code>
                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${copied
                            ? 'bg-cyber-safe/20 text-cyber-safe border border-cyber-safe/30'
                            : 'bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/30 hover:bg-cyber-primary/20'
                            }`}
                    >
                        {copied ? (
                            <>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Copied!
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copy
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/30 hover:bg-cyber-primary/20"
                        title="Share URL"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share
                    </button>
                </div>
            </div>

            {/* Original URL */}
            <div className="bg-cyber-bg/50 rounded-xl p-4 border border-cyber-border/20">
                <label className="text-xs text-cyber-text-muted mb-1 block">Original URL</label>
                <p className="text-sm text-gray-300 truncate font-mono">{result.originalUrl}</p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center pt-2">
                <QRCode base64Image={result.qrCodeBase64} />
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 pt-2 border-t border-cyber-border/20 text-xs text-cyber-text-muted">
                <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Expires: {new Date(result.expiryDate).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {result.clickCount} clicks
                </span>
            </div>
        </div>
    );
}

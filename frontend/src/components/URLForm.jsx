import { useState } from 'react';

export default function URLForm({ onSubmit, loading }) {
    const [originalUrl, setOriginalUrl] = useState('');
    const [customSlug, setCustomSlug] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!originalUrl.trim()) {
            newErrors.originalUrl = 'URL is required';
        } else {
            try {
                new URL(originalUrl);
            } catch {
                newErrors.originalUrl = 'Please enter a valid URL (include https://)';
            }
        }

        if (!customSlug.trim()) {
            newErrors.customSlug = 'Custom slug is required';
        } else if (customSlug.length < 3 || customSlug.length > 30) {
            newErrors.customSlug = 'Slug must be 3–30 characters';
        } else if (!/^[a-zA-Z0-9-]+$/.test(customSlug)) {
            newErrors.customSlug = 'Only letters, numbers, and hyphens allowed';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(originalUrl, customSlug.toLowerCase(), password);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* URL Input */}
            <div>
                <label className="block text-sm font-medium text-cyber-text-muted mb-2">
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-cyber-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        Original URL
                    </span>
                </label>
                <input
                    type="text"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    placeholder="https://example.com/very-long-url..."
                    className={`cyber-input ${errors.originalUrl ? 'border-cyber-danger' : ''}`}
                />
                {errors.originalUrl && (
                    <p className="mt-1.5 text-xs text-cyber-danger flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.originalUrl}
                    </p>
                )}
            </div>

            {/* Custom Slug Input */}
            <div>
                <label className="block text-sm font-medium text-cyber-text-muted mb-2">
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-cyber-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        Custom Slug
                    </span>
                </label>
                <div className={`flex items-center cyber-input !p-0 overflow-hidden ${errors.customSlug ? 'border-cyber-danger' : ''}`}>
                    <span className="flex-shrink-0 pl-4 pr-1 py-3.5 text-cyber-text-muted text-sm font-mono select-none">
                        app.com/
                    </span>
                    <input
                        type="text"
                        value={customSlug}
                        onChange={(e) => setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                        placeholder="my-custom-slug"
                        className="flex-1 bg-transparent border-none outline-none text-cyber-text font-mono text-[15px] py-3.5 pr-4"
                        maxLength={30}
                    />
                </div>
                <div className="flex justify-between mt-1.5">
                    {errors.customSlug ? (
                        <p className="text-xs text-cyber-danger flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.customSlug}
                        </p>
                    ) : (
                        <p className="text-xs text-cyber-text-muted">Letters, numbers, hyphens only</p>
                    )}
                    <p className="text-xs text-cyber-text-muted">{customSlug.length}/30</p>
                </div>
            </div>

            {/* Password Input (Optional) */}
            <div>
                <label className="block text-sm font-medium text-cyber-text-muted mb-2">
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-cyber-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Set Password (Optional)
                    </span>
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank for public access"
                    className="cyber-input"
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="cyber-btn w-full flex items-center justify-center gap-3 text-base"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Creating Link...</span>
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Shorten URL</span>
                    </>
                )}
            </button>
        </form>
    );
}

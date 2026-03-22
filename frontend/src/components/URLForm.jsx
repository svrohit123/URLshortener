import { useState } from 'react';

export default function URLForm({ onSubmit, loading }) {
    const [originalUrl, setOriginalUrl] = useState('');
    const [customSlug, setCustomSlug] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
            newErrors.customSlug = 'Custom URL is required';
        } else if (customSlug.length < 3 || customSlug.length > 30) {
            newErrors.customSlug = 'Custom URL must be 3–30 characters';
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

            {/* Custom URL Input */}
            <div>
                <label className="block text-sm font-medium text-cyber-text-muted mb-2">
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-cyber-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        Custom URL
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
                        placeholder="my-custom-url"
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
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave blank for public access"
                        className="cyber-input pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-text-muted hover:text-cyber-primary transition-colors focus:outline-none"
                    >
                        {showPassword ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                </div>
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

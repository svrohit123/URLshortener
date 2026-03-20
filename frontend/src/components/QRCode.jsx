export default function QRCode({ base64Image }) {
    if (!base64Image) return null;

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative p-3 bg-white rounded-xl group">
                <img
                    src={`data:image/png;base64,${base64Image}`}
                    alt="QR Code"
                    className="w-40 h-40 rounded-lg"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-cyber-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-cyber-primary text-xs font-semibold bg-white/90 px-3 py-1 rounded-full">
                        Scan Me
                    </span>
                </div>
            </div>
            {/* Download button */}
            <a
                href={`data:image/png;base64,${base64Image}`}
                download="qr-code.png"
                className="text-xs text-cyber-primary hover:text-blue-300 transition-colors flex items-center gap-1.5"
            >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download QR
            </a>
        </div>
    );
}

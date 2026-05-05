import React, { useEffect, useRef } from 'react';

export const EcgLine = ({ isDown, color = '#10b981', label }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let phase = 0;

        // Custom piecewise ECG function for sharp, jagged points and flat segments
        const getEcgY = (localX) => {
            if (localX >= 0 && localX < 40) return 0; // Baseline / isoelectric line
            if (localX >= 40 && localX < 50) return (localX - 40) / 10 * 6; // P-wave (up)
            if (localX >= 50 && localX < 60) return 6 - ((localX - 50) / 10 * 6); // P-wave (down)
            if (localX >= 60 && localX < 70) return 0; // Baseline
            if (localX >= 70 && localX < 75) return 0 - (localX - 70) / 5 * 5; // Q-wave (down)
            if (localX >= 75 && localX < 81) return -5 - (localX - 75) / 6 * 32; // R-wave (sharp high peak)
            if (localX >= 81 && localX < 87) return -37 + (localX - 81) / 6 * 44; // S-wave (deep sharp dip)
            if (localX >= 87 && localX < 92) return 7 - (localX - 87) / 5 * 7; // Return to baseline
            if (localX >= 92 && localX < 125) return 0; // Baseline
            if (localX >= 125 && localX < 145) return (localX - 125) / 20 * 8; // T-wave (up)
            if (localX >= 145 && localX < 170) return 8 - (localX - 145) / 25 * 8; // T-wave (down)
            if (localX >= 170 && localX < 250) return 0; // Baseline
            return 0;
        };

        const draw = () => {
            // Match dimensions and scale to device pixel ratio
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);

            ctx.clearRect(0, 0, rect.width, rect.height);
            ctx.strokeStyle = isDown ? '#ef4444' : color;
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'miter'; // Miter join creates sharp points
            ctx.beginPath();

            if (isDown) {
                // Outage: flat, beeping red line
                ctx.moveTo(0, rect.height / 2);
                ctx.lineTo(rect.width, rect.height / 2);
            } else {
                for (let x = 0; x < rect.width; x++) {
                    let y = rect.height / 2;
                    const localX = (x + Math.floor(Math.abs(phase))) % 250;

                    y += getEcgY(localX);

                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
            }
            ctx.stroke();
            phase -= 2.5;
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isDown, color]);

    return (
        <div className="bg-slate-950 p-6 rounded-[28px] border border-slate-900 flex items-center justify-between shadow-2xl w-full">
            <div>
                <span className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Node Telemetry: {label}</span>
                <p className={`text-xs font-black mt-2 ${isDown ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
                    {isDown ? 'OUTAGE / NO URI' : 'STABLE NODE CONNECTION'}
                </p>
            </div>
            <canvas ref={canvasRef} width={240} height={60} className="rounded-2xl bg-slate-900/40 border border-slate-900" />
        </div>
    );
};

export default EcgLine;
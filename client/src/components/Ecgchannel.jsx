import React, { useEffect, useRef } from 'react';

const getEcgY = (localX, height) => {
    const mid = height / 2;
    const scale = height / 80;
    let y = mid;
    if (localX < 30) { y = mid; }
    else if (localX < 40) { y = mid - ((localX - 30) / 10) * 6 * scale; }
    else if (localX < 50) { y = mid - 6 * scale + ((localX - 40) / 10) * 6 * scale; }
    else if (localX < 58) { y = mid; }
    else if (localX < 63) { y = mid + ((localX - 58) / 5) * 4 * scale; }
    else if (localX < 67) { y = mid + 4 * scale - ((localX - 63) / 4) * (4 + 28) * scale; }
    else if (localX < 71) { y = mid - 28 * scale + ((localX - 67) / 4) * 38 * scale; }
    else if (localX < 75) { y = mid + 10 * scale - ((localX - 71) / 4) * 10 * scale; }
    else if (localX < 80) { y = mid; }
    else if (localX < 100) { y = mid; }
    else if (localX < 115) { y = mid - ((localX - 100) / 15) * 5 * scale; }
    else if (localX < 130) { y = mid - 5 * scale + ((localX - 115) / 15) * 5 * scale; }
    else { y = mid; }
    return y;
};

/**
 * EcgChannel — animated P-QRS-T heartbeat canvas
 *
 * Props:
 *   isDown  {boolean}  — if true, shows flat red outage line
 *   color   {string}   — stroke color when healthy (default: '#10b981')
 *   phaseOffset {number} — starting phase offset so multiple channels are staggered (default: 0)
 */
const EcgChannel = ({ isDown = false, color = '#10b981', phaseOffset = 0 }) => {
    const canvasRef = useRef(null);
    const phaseRef  = useRef(-phaseOffset);
    const rafRef    = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const draw = () => {
            const dpr = window.devicePixelRatio || 1;
            const w   = canvas.offsetWidth  || 220;
            const h   = canvas.offsetHeight || 52;

            canvas.width  = w * dpr;
            canvas.height = h * dpr;
            ctx.scale(dpr, dpr);
            ctx.clearRect(0, 0, w, h);

            // Medical grid
            ctx.strokeStyle = 'rgba(20,60,100,0.35)';
            ctx.lineWidth   = 0.5;
            for (let x = 0; x < w; x += 10) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
            }
            for (let y = 0; y < h; y += 10) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
            }

            if (isDown) {
                // Flat red line
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth   = 2;
                ctx.beginPath();
                ctx.moveTo(0, h / 2);
                ctx.lineTo(w, h / 2);
                ctx.stroke();
            } else {
                // Real ECG — P-QRS-T complex
                ctx.strokeStyle  = color;
                ctx.lineWidth    = 2;
                ctx.shadowColor  = color;
                ctx.shadowBlur   = 4;
                ctx.lineCap      = 'round';
                ctx.lineJoin     = 'miter';
                ctx.beginPath();

                const cycle = 160;
                for (let x = 0; x <= w; x++) {
                    const localX = ((x + Math.floor(Math.abs(phaseRef.current))) % cycle);
                    const y      = getEcgY(localX, h);
                    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();
                ctx.shadowBlur = 0;
            }

            phaseRef.current -= 2.5;
            rafRef.current = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(rafRef.current);
    }, [isDown, color]);

    return (
        <canvas
            ref={canvasRef}
            className={`rounded-lg border ${
                isDown
                    ? 'border-red-900/50'
                    : 'border-slate-800'
            }`}
            style={{
                width:      220,
                height:     52,
                display:    'block',
                background: '#020913',
            }}
        />
    );
};

export default EcgChannel;
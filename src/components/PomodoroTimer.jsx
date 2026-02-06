import React, { useState, useEffect } from 'react';

const PomodoroTimer = ({ onComplete }) => {
    // Custom settings state (in minutes)
    const [customFocusTime, setCustomFocusTime] = useState(25);
    const [customBreakTime, setCustomBreakTime] = useState(5);
    const [showSettings, setShowSettings] = useState(false);

    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('focus'); // focus | break

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft => timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (onComplete) onComplete(mode); // Award XP

            // Simple audio beep
            const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
            audio.play().catch(e => console.log('Audio play failed', e));

            // Auto-switch mode
            if (mode === 'focus') {
                setMode('break');
                setTimeLeft(customBreakTime * 60);
            } else {
                setMode('focus');
                setTimeLeft(customFocusTime * 60);
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode, onComplete, customFocusTime, customBreakTime]);

    // Update timer when settings change (only if not active to avoid jumping jumps)
    useEffect(() => {
        if (!isActive) {
            setTimeLeft(mode === 'focus' ? customFocusTime * 60 : customBreakTime * 60);
        }
    }, [customFocusTime, customBreakTime]);


    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? customFocusTime * 60 : customBreakTime * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const totalTime = mode === 'focus' ? customFocusTime * 60 : customBreakTime * 60;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Focus Timer
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{
                        fontSize: '0.8rem',
                        padding: '0.4rem 0.8rem',
                        background: mode === 'focus' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                        color: mode === 'focus' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        borderRadius: '20px',
                        fontWeight: '600'
                    }}>
                        {mode === 'focus' ? '🔥 Focus Mode' : '☕ Break Time'}
                    </span>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            opacity: 0.7
                        }}
                        title="Timer Settings"
                    >
                        ⚙️
                    </button>
                </div>
            </h2>

            {showSettings && (
                <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', gap: '1rem', justifyContent: 'space-around', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label>Focus (min)</label>
                        <input
                            type="number"
                            value={customFocusTime}
                            onChange={(e) => setCustomFocusTime(Number(e.target.value))}
                            style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: 'white', width: '60px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label>Break (min)</label>
                        <input
                            type="number"
                            value={customBreakTime}
                            onChange={(e) => setCustomBreakTime(Number(e.target.value))}
                            style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: 'white', width: '60px' }}
                        />
                    </div>
                </div>
            )}

            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>

                {/* Progress Bar Background */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '4px',
                    width: `${progress}%`,
                    background: mode === 'focus' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    transition: 'width 1s linear'
                }} />

                <h1 style={{
                    fontSize: '5rem',
                    fontWeight: 'bold',
                    fontVariantNumeric: 'tabular-nums',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    textShadow: isActive ? '0 0 30px var(--accent-glow)' : 'none',
                    transition: 'all 0.3s ease',
                    margin: '1rem 0'
                }}>
                    {formatTime(timeLeft)}
                </h1>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={toggleTimer} style={{
                        padding: '1rem 3rem',
                        background: isActive ? 'rgba(255,255,255,0.05)' : 'var(--accent-primary)',
                        border: isActive ? '1px solid var(--border-color)' : 'none',
                        color: isActive ? 'var(--text-primary)' : 'var(--bg-primary)',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        boxShadow: isActive ? 'none' : '0 4px 12px var(--accent-glow)'
                    }}>
                        {isActive ? 'Pause' : (timeLeft < totalTime ? 'Resume' : 'Start Focus')}
                    </button>

                    <button onClick={resetTimer} title="Reset Timer" style={{
                        padding: '0 1.5rem',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'var(--text-secondary)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '1.5rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        ↻
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PomodoroTimer;

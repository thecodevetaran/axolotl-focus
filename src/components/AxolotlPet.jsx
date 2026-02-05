import React from 'react';

const AxolotlPet = ({ xp = 0 }) => {
    const level = Math.floor(xp / 100) + 1;
    const progressToNext = xp % 100;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            <h2>Your Companion</h2>
            <div className="glass-panel" style={{
                padding: '2rem',
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
            }}>
                {/* Placeholder Emoji for now, will replace with SVG/Canvas later */}
                <div style={{
                    fontSize: '8rem',
                    filter: 'drop-shadow(0 0 20px var(--accent-secondary))',
                    animation: 'float 3s ease-in-out infinite'
                }}>
                    {level === 1 ? '🥚' : (level < 5 ? '🦎' : '🐲')}
                </div>
                <h3 style={{ marginTop: '1rem' }}>{level === 1 ? 'Egg' : 'Axel'}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Level {level} • {xp} XP</p>

                <div style={{
                    width: '100%',
                    height: '6px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    marginTop: '1rem',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        height: '100%',
                        width: `${progressToNext}%`,
                        background: 'var(--accent-secondary)',
                        transition: 'width 0.5s ease'
                    }} />
                </div>

                <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
            </div>
        </div>
    );
};
export default AxolotlPet;

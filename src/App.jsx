import React from 'react'
import Layout from './components/Layout'
import PomodoroTimer from './components/PomodoroTimer'
import TodoList from './components/TodoList'
import AxolotlPet from './components/AxolotlPet'

function App() {
  const [xp, setXp] = React.useState(() => {
    const saved = localStorage.getItem('axolotl_xp');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [theme, setTheme] = React.useState('theme-midnight'); // default

  React.useEffect(() => {
    localStorage.setItem('axolotl_xp', xp);
  }, [xp]);

  React.useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleTimerComplete = (mode) => {
    if (mode === 'focus') {
      setXp(prev => prev + 100);
      console.log("Focus session complete! +100 XP");
    }
  };

  const handleTaskComplete = () => {
    setXp(prev => prev + 20); // 20 XP per task
    console.log("Task complete! +20 XP");
  };

  const themes = [
    { id: 'theme-midnight', name: '🌌 Midnight' },
    { id: 'theme-sunset', name: '🌅 Sunset' },
    { id: 'theme-forest', name: '🌲 Forest' },
    { id: 'theme-ocean', name: '🌊 Ocean' }
  ];

  return (
    <>
      <header style={{
        maxWidth: '1200px',
        margin: '0 auto 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 1rem'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Axolotl Focus</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              style={{
                background: theme === t.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                color: theme === t.id ? 'var(--bg-primary)' : 'var(--text-secondary)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}
            >
              {t.name}
            </button>
          ))}
        </div>
      </header>

      <Layout>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <PomodoroTimer onComplete={handleTimerComplete} />
          <TodoList onTaskComplete={handleTaskComplete} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <AxolotlPet xp={xp} />
        </div>
      </Layout>
    </>
  )
}

export default App

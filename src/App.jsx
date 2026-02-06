import React from 'react'
import Layout from './components/Layout'
import PomodoroTimer from './components/PomodoroTimer'
import TodoList from './components/TodoList'
import AxolotlPet from './components/AxolotlPet'
import Auth from './components/Auth'
import { supabase } from './lib/supabaseClient'

function App() {
  const [session, setSession] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const [xp, setXp] = React.useState(() => {
    const saved = localStorage.getItem('axolotl_xp');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [theme, setTheme] = React.useState('theme-midnight'); // default

  // Check for active session
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync theme to body
  React.useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Load XP from cloud when session starts
  React.useEffect(() => {
    async function loadProfile() {
      if (session?.user) {
        let { data, error } = await supabase
          .from('profiles')
          .select('xp')
          .eq('id', session.user.id)
          .single();

        if (data) {
          console.log("Loaded XP from cloud:", data.xp);
          // Use the higher value (local vs cloud) to prevent progress loss
          if (data.xp > xp) {
            setXp(data.xp);
          } else if (xp > data.xp) {
            // Local is ahead (offline play?), sync up
            uploadXp(xp);
          }
        }
      }
    }
    loadProfile();
  }, [session]);

  const uploadXp = async (newXp) => {
    if (!session) {
      localStorage.setItem('axolotl_xp', newXp);
      return;
    }

    // Optimistic update
    localStorage.setItem('axolotl_xp', newXp);

    // Cloud update
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: session.user.id, xp: newXp })
      .select();

    if (error) console.error("Error syncing XP:", error);
  };

  const updateXp = (amount) => {
    setXp(prev => {
      const newValue = prev + amount;
      uploadXp(newValue);
      return newValue;
    });
  };

  const handleTimerComplete = (mode) => {
    if (mode === 'focus') {
      updateXp(100);
      console.log("Focus session complete! +100 XP");
    }
  };

  const handleTaskComplete = () => {
    updateXp(20); // 20 XP per task
    console.log("Task complete! +20 XP");
  };

  const themes = [
    { id: 'theme-midnight', name: '🌌 Midnight' },
    { id: 'theme-sunset', name: '🌅 Sunset' },
    { id: 'theme-forest', name: '🌲 Forest' },
    { id: 'theme-ocean', name: '🌊 Ocean' }
  ];

  if (loading) return null; // or a spinner

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
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
          {session && (
            <button
              onClick={() => supabase.auth.signOut()}
              style={{ background: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '8px' }}
            >
              Sign Out
            </button>
          )}
        </div>
      </header>

      {!session ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', marginTop: '4rem' }}>
          <AxolotlPet xp={xp} />
          <Auth onLogin={() => { }} />
        </div>
      ) : (
        <Layout>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <PomodoroTimer onComplete={handleTimerComplete} />
            <TodoList onTaskComplete={handleTaskComplete} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <AxolotlPet xp={xp} />
          </div>
        </Layout>
      )}
    </>
  )
}

export default App

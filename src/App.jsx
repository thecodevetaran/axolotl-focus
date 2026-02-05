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

  React.useEffect(() => {
    localStorage.setItem('axolotl_xp', xp);
  }, [xp]);

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

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <PomodoroTimer onComplete={handleTimerComplete} />
        <TodoList onTaskComplete={handleTaskComplete} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <AxolotlPet xp={xp} />
      </div>
    </Layout>
  )
}

export default App

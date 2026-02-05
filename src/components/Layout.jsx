import React from 'react';

const Layout = ({ children }) => {
  return (
    <main className="glass-panel" style={{ 
      flex: 1, 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '2rem',
      padding: '2rem',
      overflow: 'hidden'
    }}>
      {children}
    </main>
  );
};

export default Layout;

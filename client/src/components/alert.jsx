import React, { useEffect, useState } from 'react';

const Alert = ({ message }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!visible) return null;

  const alertStyle = {
    padding: '10px 20px',
    color: '#fff',
    borderRadius: '8px',
    fontWeight: 'bold',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#2a9d8f', // green
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 9999,
  };

  return (
    <div style={alertStyle}>
      <span><i className="fa-solid fa-square-check"></i></span>
      <span>{message}</span>
    </div>
  );
};

export default Alert;

import { createContext, useContext, useState, useEffect } from 'react';

const AudienceContext = createContext();

export function AudienceProvider({ children }) {
  // Always default to 'umum' (Standard Theme) to provide a unified aesthetic for all ages
  const audienceMode = 'umum';
  const setAudienceMode = () => {};

  useEffect(() => {
    // Clear all demographic theme classes to enforce standard styles
    document.body.classList.remove('theme-kids', 'theme-senior', 'theme-gov');
  }, []);

  return (
    <AudienceContext.Provider value={{ audienceMode, setAudienceMode }}>
      {children}
    </AudienceContext.Provider>
  );
}

export function useAudience() {
  return useContext(AudienceContext);
}

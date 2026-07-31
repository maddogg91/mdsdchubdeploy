import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchDashboard } from '../api/dashboard.js';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [data, setData] = useState({ user: null, projects: [], notifications: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    try {
      const result = await fetchDashboard();
      setData(result);
      setError('');
    } catch (err) {
      setError(err.message ?? 'Could not load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <DashboardContext.Provider value={{ ...data, loading, error, refresh }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return ctx;
}

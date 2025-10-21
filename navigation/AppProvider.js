import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import sqliteService from '../src/services/sqliteService';

const AppProvider = ({ children }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        await sqliteService.init();
      } catch (e) {
        console.warn('SQLite init error', e);
      } finally {
        if (mounted) setReady(true);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return children;
};

export default AppProvider;
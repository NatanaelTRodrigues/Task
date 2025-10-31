// mobile-app/App.tsx
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Routes from '@/navigation'; 

export default function App() {
  return (
    
    <> 
      <Routes />
      <StatusBar style="auto" />
    </>
  );
}

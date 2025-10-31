// mobile-app/src/screens/DashboardScreen.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '@/hooks/useAuth'; 

const DashboardScreen: React.FC = () => {
    const { signOut } = useAuth();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Bem-vindo ao TaskFlow!</Text>
            <Button title="Sair / Logout" onPress={signOut} />
        </View>
    );
};
export default DashboardScreen;
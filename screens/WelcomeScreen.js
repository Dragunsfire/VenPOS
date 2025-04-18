import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WelcomeScreen({ route }) {
  const { userName } = route.params; 

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>¡Hola, {userName}!</Text>
      <Text style={styles.message}>Bienvenido a la aplicación.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen({ route }) {
  const { userName } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>¡Hola, {userName || 'Usuario'}! 👋</Text>
        <Text style={styles.subText}>Has iniciado sesión correctamente.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 16,
    color: 'white',
    marginTop: 10,
  },
});

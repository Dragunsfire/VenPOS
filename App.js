import React, { useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { supabase } from './utils/supabase'; // Asegúrate de tener la importación correcta de tu archivo supabase.js

const App = () => {
  useEffect(() => {
    // Ejecutar la función select_2_plus_2 desde Supabase
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .rpc('select_2_plus_2'); // Llamar a la función RPC creada en Supabase

        if (error) {
          console.error('Error ejecutando la función:', error);
        } else {
          console.log('Resultado de 2 + 2:', data[0].result);
        }
      } catch (error) {
        console.error('Error de conexión o ejecución:', error);
      }
    };

    fetchData();
  }, []); // Se ejecuta una vez cuando se monta el componente

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Conexión a Supabase</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default App;

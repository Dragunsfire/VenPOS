import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import { supabase } from '../utils/supabase';

export default function HomeScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error('Correo o contraseña incorrectos');
      console.log('❌ Error:', error.message);
    } else {
      const userEmail = data.user.email;
      toast.success(`Bienvenido ${userEmail}`);
      console.log('✅ Usuario autenticado:', data.user);
      navigation.navigate('Welcome', { userEmail });
    }
  };

  // DEBUG DE CONEXIÓN A SUPABASE Y PRUEBA DE RPC
  useEffect(() => {
    const testConnection = async () => {
      try {
        // Verificar sesión
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.log('❌ Error al obtener sesión:', sessionError.message);
        } else {
          console.log('✅ Supabase conectado. Sesión:', sessionData);
        }
        // Llamar función RPC
        const { data: rpcData, error: rpcError } = await supabase.rpc('select_2_plus_2');
        if (rpcError) {
          console.error('❌ Error ejecutando select_2_plus_2:', rpcError.message);
        } else {
          console.log('📊 Resultado de select_2_plus_2:', rpcData[0]?.result);
        }
      } catch (error) {
        console.error('⚠️ Error general:', error);
      }
    };
    testConnection();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginContainer}>
        <View style={styles.header}>
          <MaterialIcons name="account-circle" size={80} color="#007AFF" />
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>

        {/* Enlace para ir a registro */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>¿No tienes cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpLink}>Regístrate aquí</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loginContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  signUpContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    color: '#666',
    marginRight: 5,
  },
  signUpLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

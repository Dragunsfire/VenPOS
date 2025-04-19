// screens/SignUpScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';
import { supabase } from '../utils/supabase';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!email || !password) {
      toast.error('Completa todos los campos');
      return;
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      toast.error(error.message);
      console.log('❌ SignUp Error:', error.message);
    } else {
      toast.success('Usuario registrado');
      console.log('✅ SignUp success:', data.user);
      navigation.replace('Welcome', { userEmail: data.user.email });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Registro</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, justifyContent:'center', backgroundColor:'#fff' },
  header: { fontSize:28, fontWeight:'bold', marginBottom:40, textAlign:'center' },
  input: {
    height:50, borderRadius:8, borderWidth:1, borderColor:'#ccc',
    paddingHorizontal:15, marginBottom:20
  },
  button: {
    height:50, borderRadius:8, backgroundColor:'#007AFF',
    justifyContent:'center', alignItems:'center', marginBottom:15
  },
  buttonText: { color:'#fff', fontSize:18, fontWeight:'600' },
  link: { color:'#007AFF', textAlign:'center', marginTop:10 }
});

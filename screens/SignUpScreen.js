import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';
import { MaterialIcons } from '@expo/vector-icons';
import { registerUser } from '../services/authServices';

export default function SignUpScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // User credentials
    email: '',
    password: '',
    confirmPassword: '',
    // Company basic info
    nombre_empresa: '',
    rif: '',
    representante: '',
    // Contact info
    telefono: '',
    direccion: '',
    pais: 'Venezuela',
    ciudad: '',
    municipio: '',
    edo_estado: '',
    // Additional details
    sector_economico: '',
    actividad_economica: '',
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.email || !formData.password || !formData.confirmPassword) {
          toast.error('Por favor complete todos los campos');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error('Las contraseñas no coinciden');
          return false;
        }
        if (formData.password.length < 6) {
          toast.error('La contraseña debe tener al menos 6 caracteres');
          return false;
        }
        return true;

      case 2:
        if (!formData.nombre_empresa || !formData.rif || !formData.representante) {
          toast.error('Por favor complete la información básica de la empresa');
          return false;
        }
        return true;

      case 3:
        if (!formData.telefono || !formData.direccion || !formData.ciudad) {
          toast.error('Por favor complete la información de contacto');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSignUp = async () => {
    try {
      // Here you would implement your Supabase registration logic
      toast.success('Registro exitoso!');
      navigation.replace('Dashboard', { userEmail: formData.email });
    } catch (error) {
      toast.error('Error en el registro: ' + error.message);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <Text style={styles.stepTitle}>Datos de Usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => updateFormData('password', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmar Contraseña"
              secureTextEntry
              value={formData.confirmPassword}
              onChangeText={(text) => updateFormData('confirmPassword', text)}
            />
          </>
        );

      case 2:
        return (
          <>
            <Text style={styles.stepTitle}>Información Básica de la Empresa</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la Empresa"
              value={formData.nombre_empresa}
              onChangeText={(text) => updateFormData('nombre_empresa', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="RIF"
              value={formData.rif}
              onChangeText={(text) => updateFormData('rif', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Representante Legal"
              value={formData.representante}
              onChangeText={(text) => updateFormData('representante', text)}
            />
          </>
        );

      case 3:
        return (
          <>
            <Text style={styles.stepTitle}>Información de Contacto</Text>
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              keyboardType="phone-pad"
              value={formData.telefono}
              onChangeText={(text) => updateFormData('telefono', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Dirección"
              value={formData.direccion}
              onChangeText={(text) => updateFormData('direccion', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Ciudad"
              value={formData.ciudad}
              onChangeText={(text) => updateFormData('ciudad', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Municipio"
              value={formData.municipio}
              onChangeText={(text) => updateFormData('municipio', text)}
            />
          </>
        );

      case 4:
        return (
          <>
            <Text style={styles.stepTitle}>Detalles Adicionales</Text>
            <TextInput
              style={styles.input}
              placeholder="Sector Económico"
              value={formData.sector_economico}
              onChangeText={(text) => updateFormData('sector_economico', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Actividad Económica"
              value={formData.actividad_economica}
              onChangeText={(text) => updateFormData('actividad_economica', text)}
            />
          </>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Registro de Empresa</Text>
          <View style={styles.stepIndicator}>
            {[1, 2, 3, 4].map((step) => (
              <View
                key={step}
                style={[
                  styles.step,
                  currentStep >= step ? styles.activeStep : styles.inactiveStep,
                ]}
              >
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.formContainer}>
          {renderStep()}

          <View style={styles.buttonContainer}>
            {currentStep > 1 && (
              <TouchableOpacity
                style={[styles.button, styles.backButton]}
                onPress={handleBack}
              >
                <MaterialIcons name="arrow-back" size={20} color="#007AFF" />
                <Text style={styles.backButtonText}>Anterior</Text>
              </TouchableOpacity>
            )}

            {currentStep < 4 ? (
              <TouchableOpacity
                style={[styles.button, styles.nextButton]}
                onPress={handleNext}
              >
                <Text style={styles.buttonText}>Siguiente</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.nextButton]}
                onPress={async () => {
                  const result = await registerUser(formData);
                    if (result.ok) {
                      console.log('Usuario registrado correctamente:', result.data);
                      navigation.navigate('Dashboard');
                    } else {
                      toast.error(result.error || (result.data && result.data.message) || 'Error al registrar usuario');
                      console.log('Error detalle:', result);
                    }
                }}
              >
                <Text style={styles.buttonText}>Registrar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeStep: {
    backgroundColor: '#007AFF',
  },
  inactiveStep: {
    backgroundColor: '#E0E0E0',
  },
  stepText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#F8F8F8',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    flex: 1,
    marginLeft: 10,
  },
  backButton: {
    backgroundColor: '#F8F8F8',
    flex: 1,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 5,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
});
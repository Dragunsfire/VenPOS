import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { toast } from 'sonner-native';

export default function NewCustomerScreen({ navigation, route }) {
  const editingCustomer = route.params?.customer;
  const [formData, setFormData] = useState({
    name: editingCustomer?.name || '',
    document: editingCustomer?.document || '',
    phone: editingCustomer?.phone || '',
    email: editingCustomer?.email || '',
    address: editingCustomer?.address || '',
    notes: editingCustomer?.notes || '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'El nombre es requerido';
    if (!formData.document) newErrors.document = 'El documento es requerido';
    if (!formData.phone) newErrors.phone = 'El teléfono es requerido';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Aquí iría la lógica para guardar el cliente
      toast.success(editingCustomer ? 'Cliente actualizado' : 'Cliente creado');
      navigation.goBack();
    }
  };

  const formatDocument = (text) => {
    // Formato para cédula venezolana (V-12345678)
    const cleaned = text.replace(/[^\d]/g, '');
    return cleaned ? `V-${cleaned}` : '';
  };

  const formatPhone = (text) => {
    // Formato para teléfono venezolano (+58 412-1234567)
    const cleaned = text.replace(/[^\d]/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `+58 ${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `+58 ${cleaned.slice(0, 3)}-${cleaned.slice(3, 10)}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {editingCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}
        </Text>
        <TouchableOpacity onPress={handleSubmit}>
          <MaterialCommunityIcons name="check" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `https://api.a0.dev/assets/image?text=Profile%20Picture&aspect=1:1` }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.changeImageButton}>
            <MaterialCommunityIcons name="camera" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre Completo *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Ej: Juan Pérez"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Documento de Identidad *</Text>
          <TextInput
            style={[styles.input, errors.document && styles.inputError]}
            value={formData.document}
            onChangeText={(text) => setFormData({ ...formData, document: formatDocument(text) })}
            placeholder="V-12345678"
            keyboardType="numeric"
          />
          {errors.document && <Text style={styles.errorText}>{errors.document}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono *</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: formatPhone(text) })}
            placeholder="+58 412-1234567"
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="ejemplo@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dirección</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            placeholder="Dirección completa"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notas Adicionales</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            placeholder="Notas o comentarios adicionales"
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {editingCustomer ? 'Actualizar Cliente' : 'Crear Cliente'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
  },
  changeImageButton: {
    position: 'absolute',
    right: '30%',
    bottom: 0,
    backgroundColor: '#1976D2',
    padding: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF5252',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 12,
    marginTop: 4,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
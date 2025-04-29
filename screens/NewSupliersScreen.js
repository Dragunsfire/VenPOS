
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { toast } from 'sonner-native';

export default function NewSupplierScreen({ navigation, route }) {
  const editingSupplier = route.params?.supplier;
  
  const [formData, setFormData] = useState({
    name: editingSupplier?.name || '',
    rif: editingSupplier?.rif || '',
    phone: editingSupplier?.phone || '',
    email: editingSupplier?.email || '',
    address: editingSupplier?.address || '',
    contactPerson: editingSupplier?.contactPerson || '',
    notes: editingSupplier?.notes || '',
    taxInfo: {
      ivaRate: editingSupplier?.taxInfo?.ivaRate || 16,
      ivaRetention: editingSupplier?.taxInfo?.ivaRetention || 75,
      islrRate: editingSupplier?.taxInfo?.islrRate || 5,
      isLargeTransaction: editingSupplier?.taxInfo?.isLargeTransaction || false,
    },
    paymentTerm: editingSupplier?.paymentTerm || '30',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'El nombre es requerido';
    if (!formData.rif) newErrors.rif = 'El RIF es requerido';
    if (!formData.phone) newErrors.phone = 'El teléfono es requerido';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Aquí iría la lógica para guardar el proveedor
      toast.success(editingSupplier ? 'Proveedor actualizado' : 'Proveedor creado');
      navigation.goBack();
    }
  };

  const formatRif = (text) => {
    // Formato para RIF venezolano (J-12345678-0)
    const cleaned = text.replace(/[^\dJVGE]/g, '').toUpperCase();
    if (cleaned.length <= 1) return cleaned;
    if (cleaned.length <= 9) return `${cleaned.charAt(0)}-${cleaned.slice(1)}`;
    return `${cleaned.charAt(0)}-${cleaned.slice(1, 9)}-${cleaned.slice(9, 10)}`;
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
          {editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        </Text>
        <TouchableOpacity onPress={handleSubmit}>
          <MaterialCommunityIcons name="check" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información General</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre o Razón Social *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Ej: Distribuidora ABC, C.A."
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>RIF *</Text>
            <TextInput
              style={[styles.input, errors.rif && styles.inputError]}
              value={formData.rif}
              onChangeText={(text) => setFormData({ ...formData, rif: formatRif(text) })}
              placeholder="J-12345678-0"
              autoCapitalize="characters"
              maxLength={12}
            />
            {errors.rif && <Text style={styles.errorText}>{errors.rif}</Text>}
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
              placeholder="ejemplo@empresa.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dirección Fiscal</Text>
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
            <Text style={styles.label}>Persona de Contacto</Text>
            <TextInput
              style={styles.input}
              value={formData.contactPerson}
              onChangeText={(text) => setFormData({ ...formData, contactPerson: text })}
              placeholder="Nombre del contacto"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Fiscal</Text>

          <View style={styles.taxContainer}>
            <View style={styles.taxRow}>
              <Text style={styles.taxLabel}>Tasa de IVA</Text>
              <View style={styles.taxInputContainer}>
                <TextInput
                  style={styles.taxInput}
                  value={formData.taxInfo.ivaRate.toString()}
                  onChangeText={(text) => setFormData({
                    ...formData,
                    taxInfo: { ...formData.taxInfo, ivaRate: parseInt(text) || 0 }
                  })}
                  keyboardType="numeric"
                />
                <Text style={styles.percentageText}>%</Text>
              </View>
            </View>

            <View style={styles.taxRow}>
              <Text style={styles.taxLabel}>Retención de IVA</Text>
              <View style={styles.taxInputContainer}>
                <TextInput
                  style={styles.taxInput}
                  value={formData.taxInfo.ivaRetention.toString()}
                  onChangeText={(text) => setFormData({
                    ...formData,
                    taxInfo: { ...formData.taxInfo, ivaRetention: parseInt(text) || 0 }
                  })}
                  keyboardType="numeric"
                />
                <Text style={styles.percentageText}>%</Text>
              </View>
            </View>

            <View style={styles.taxRow}>
              <Text style={styles.taxLabel}>Retención de ISLR</Text>
              <View style={styles.taxInputContainer}>
                <TextInput
                  style={styles.taxInput}
                  value={formData.taxInfo.islrRate.toString()}
                  onChangeText={(text) => setFormData({
                    ...formData,
                    taxInfo: { ...formData.taxInfo, islrRate: parseInt(text) || 0 }
                  })}
                  keyboardType="numeric"
                />
                <Text style={styles.percentageText}>%</Text>
              </View>
            </View>

            <View style={styles.taxRow}>
              <Text style={styles.taxLabel}>Grandes Transacciones</Text>
              <Switch
                value={formData.taxInfo.isLargeTransaction}
                onValueChange={(value) => setFormData({
                  ...formData,
                  taxInfo: { ...formData.taxInfo, isLargeTransaction: value }
                })}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={formData.taxInfo.isLargeTransaction ? '#1976D2' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condiciones de Pago</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Plazo de Pago (días)</Text>
            <TextInput
              style={styles.input}
              value={formData.paymentTerm}
              onChangeText={(text) => setFormData({ ...formData, paymentTerm: text })}
              placeholder="30"
              keyboardType="numeric"
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
              numberOfLines={4}
            />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {editingSupplier ? 'Actualizar Proveedor' : 'Crear Proveedor'}
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
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
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
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
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
  taxContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
  },
  taxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  taxLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  taxInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
    width: 100,
  },
  taxInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
    textAlign: 'right',
  },
  percentageText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
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
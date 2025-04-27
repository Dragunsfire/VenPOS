import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import { toast } from 'sonner-native';

export default function NewProductScreen({ navigation, route }) {
  const editingProduct = route.params?.product;
  const [showScanner, setShowScanner] = useState(false);
  const [formData, setFormData] = useState({
    name: editingProduct?.name || '',
    barcode: editingProduct?.barcode || '',
    price: editingProduct?.price?.toString() || '',
    cost: editingProduct?.cost?.toString() || '',
    stock: editingProduct?.stock?.toString() || '',
    minStock: editingProduct?.minStock?.toString() || '',
    category: editingProduct?.category || '',
    unit: editingProduct?.unit || 'unidad',
    description: editingProduct?.description || '',
    image: editingProduct?.image || `https://api.a0.dev/assets/image?text=Product%20Image&aspect=1:1`,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'El nombre es requerido';
    if (!formData.price) newErrors.price = 'El precio es requerido';
    if (!formData.stock) newErrors.stock = 'El stock es requerido';
    if (!formData.category) newErrors.category = 'La categoría es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBarcodeScan = ({ data }) => {
    setShowScanner(false);
    setFormData({ ...formData, barcode: data });
    toast.success('Código de barras escaneado');
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Aquí iría la lógica para guardar el producto
      toast.success(editingProduct ? 'Producto actualizado' : 'Producto creado');
      navigation.goBack();
    }
  };

  const units = ['unidad', 'kg', 'g', 'l', 'ml', 'paquete', 'caja'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        </Text>
        <TouchableOpacity onPress={handleSubmit}>
          <MaterialCommunityIcons name="check" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form}>
        <TouchableOpacity style={styles.imageContainer}>
          <Image source={{ uri: formData.image }} style={styles.productImage} />
          <View style={styles.imageActions}>
            <TouchableOpacity style={styles.imageButton}>
              <MaterialCommunityIcons name="camera" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageButton}>
              <MaterialCommunityIcons name="image" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre del Producto *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Ej: Harina Pan"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.barcodeContainer}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Código de Barras</Text>
            <TextInput
              style={styles.input}
              value={formData.barcode}
              onChangeText={(text) => setFormData({ ...formData, barcode: text })}
              placeholder="Escanea o ingresa manualmente"
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => setShowScanner(true)}>
            <MaterialCommunityIcons name="barcode-scan" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.priceContainer}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Precio de Venta (Bs.) *</Text>
            <TextInput
              style={[styles.input, errors.price && styles.inputError]}
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              placeholder="0.00"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
            <Text style={styles.label}>Costo (Bs.)</Text>
            <TextInput
              style={styles.input}
              value={formData.cost}
              onChangeText={(text) => setFormData({ ...formData, cost: text })}
              placeholder="0.00"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.stockContainer}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Stock Actual *</Text>
            <TextInput
              style={[styles.input, errors.stock && styles.inputError]}
              value={formData.stock}
              onChangeText={(text) => setFormData({ ...formData, stock: text })}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
            <Text style={styles.label}>Stock Mínimo</Text>
            <TextInput
              style={styles.input}
              value={formData.minStock}
              onChangeText={(text) => setFormData({ ...formData, minStock: text })}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Unidad de Medida</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.unitsContainer}>
            {units.map((unit) => (
              <TouchableOpacity
                key={unit}
                style={[
                  styles.unitChip,
                  formData.unit === unit && styles.selectedUnitChip
                ]}
                onPress={() => setFormData({ ...formData, unit: unit })}>
                <Text style={[
                  styles.unitChipText,
                  formData.unit === unit && styles.selectedUnitChipText
                ]}>
                  {unit}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Descripción del producto"
            multiline
            numberOfLines={4}
          />
        </View>
      </ScrollView>

      {showScanner && (
        <Camera
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={handleBarcodeScan}>
          <TouchableOpacity 
            style={styles.closeScanner}
            onPress={() => setShowScanner(false)}>
            <MaterialCommunityIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        </Camera>
      )}
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
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
  },
  imageActions: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -20,
    gap: 12,
  },
  imageButton: {
    backgroundColor: '#1976D2',
    padding: 12,
    borderRadius: 25,
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
  barcodeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 16,
  },
  scanButton: {
    backgroundColor: '#1976D2',
    padding: 12,
    borderRadius: 8,
    height: 48,
  },
  priceContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stockContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  unitsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  unitChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedUnitChip: {
    backgroundColor: '#1976D2',
  },
  unitChipText: {
    color: '#666',
    fontWeight: '500',
  },
  selectedUnitChipText: {
    color: 'white',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  closeScanner: {
    position: 'absolute',
    top: 40,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
});

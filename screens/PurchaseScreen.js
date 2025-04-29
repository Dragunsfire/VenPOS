import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

export default function PurchaseScreen({ navigation }) {
  const [step, setStep] = useState(1); // 1: Proveedor, 2: Productos, 3: Finalizar
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('VES');
  
  const exchangeRate = 35.90;

  const suppliers = [
    {
      id: '1',
      name: 'Distribuidora ABC',
      rif: 'J-12345678-0',
      balance: 15890.50,
    },
    // Más proveedores...
  ];

  const formatCurrency = (amount, currency) => {
    return currency === 'VES'
      ? `Bs. ${Number(amount).toLocaleString('es-VE', { minimumFractionDigits: 2 })}`
      : `$ ${Number(amount / exchangeRate).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const getTotal = () => {
    return purchaseItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
  };

  const addItem = (item) => {
    setPurchaseItems([...purchaseItems, {
      ...item,
      quantity: 1,
      cost: item.price || 0
    }]);
  };

  const updateItemQuantity = (id, quantity) => {
    setPurchaseItems(purchaseItems.map(item =>
      item.id === id ? { ...item, quantity: parseInt(quantity) || 0 } : item
    ));
  };

  const updateItemCost = (id, cost) => {
    setPurchaseItems(purchaseItems.map(item =>
      item.id === id ? { ...item, cost: parseFloat(cost) || 0 } : item
    ));
  };

  const removeItem = (id) => {
    setPurchaseItems(purchaseItems.filter(item => item.id !== id));
  };

  const renderSupplierSelection = () => (
    <View style={styles.section}>
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar proveedor..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={suppliers.filter(supplier =>
          supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          supplier.rif.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.supplierItem,
              selectedSupplier?.id === item.id && styles.selectedSupplier
            ]}
            onPress={() => {
              setSelectedSupplier(item);
              setStep(2);
            }}>
            <View>
              <Text style={styles.supplierName}>{item.name}</Text>
              <Text style={styles.supplierRif}>{item.rif}</Text>
            </View>
            <Text style={styles.supplierBalance}>
              {formatCurrency(item.balance, selectedCurrency)}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );

  const renderProductsSection = () => (
    <View style={styles.section}>
      <View style={styles.purchaseHeader}>
        <TouchableOpacity 
          style={styles.addProductButton}
          onPress={() => navigation.navigate('ProductSelection', {
            onSelect: addItem
          })}>
          <MaterialCommunityIcons name="plus" size={24} color="white" />
          <Text style={styles.buttonText}>Agregar Producto</Text>
        </TouchableOpacity>
        <View style={styles.currencySelector}>
          <TouchableOpacity 
            style={[styles.currencyButton, selectedCurrency === 'USD' && styles.selectedCurrency]}
            onPress={() => setSelectedCurrency('USD')}>
            <Text style={styles.currencyText}>USD</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.currencyButton, selectedCurrency === 'VES' && styles.selectedCurrency]}
            onPress={() => setSelectedCurrency('VES')}>
            <Text style={styles.currencyText}>VES</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={purchaseItems}
        renderItem={({ item }) => (
          <View style={styles.purchaseItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.itemDetails}>
              <View style={styles.quantityContainer}>
                <Text style={styles.detailLabel}>Cantidad:</Text>
                <TextInput
                  style={styles.quantityInput}
                  value={item.quantity.toString()}
                  onChangeText={(text) => updateItemQuantity(item.id, text)}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.costContainer}>
                <Text style={styles.detailLabel}>Costo:</Text>
                <TextInput
                  style={styles.costInput}
                  value={item.cost.toString()}
                  onChangeText={(text) => updateItemCost(item.id, text)}
                  keyboardType="numeric"
                />
              </View>
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeItem(item.id)}>
                <MaterialCommunityIcons name="delete" size={24} color="#FF5252" />
              </TouchableOpacity>
            </View>
            <Text style={styles.itemTotal}>
              Total: {formatCurrency(item.cost * item.quantity, selectedCurrency)}
            </Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total de la Compra:</Text>
        <Text style={styles.totalAmount}>
          {formatCurrency(getTotal(), selectedCurrency)}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.finishButton}
        onPress={() => setStep(3)}>
        <Text style={styles.finishButtonText}>Finalizar Compra</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          if (step > 1) {
            setStep(step - 1);
          } else {
            navigation.goBack();
          }
        }}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {step === 1 ? 'Seleccionar Proveedor' : 
           step === 2 ? 'Agregar Productos' : 
           'Finalizar Compra'}
        </Text>
        <View style={styles.steps}>
          <View style={[styles.step, step >= 1 && styles.activeStep]} />
          <View style={[styles.step, step >= 2 && styles.activeStep]} />
          <View style={[styles.step, step >= 3 && styles.activeStep]} />
        </View>
      </View>

      {step === 1 && renderSupplierSelection()}
      {step === 2 && renderProductsSection()}
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
  steps: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  step: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 2,
  },
  activeStep: {
    backgroundColor: '#1976D2',
  },
  section: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  supplierItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedSupplier: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1976D2',
    borderWidth: 1,
  },
  supplierName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  supplierRif: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  supplierBalance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  purchaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addProductButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  currencySelector: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 4,
  },
  currencyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  selectedCurrency: {
    backgroundColor: '#1976D2',
  },
  currencyText: {
    fontWeight: 'bold',
    color: '#333',
  },
  purchaseItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quantityContainer: {
    flex: 1,
    marginRight: 8,
  },
  costContainer: {
    flex: 1,
    marginRight: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  quantityInput: {
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  costInput: {
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  removeButton: {
    padding: 8,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    textAlign: 'right',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  finishButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  finishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
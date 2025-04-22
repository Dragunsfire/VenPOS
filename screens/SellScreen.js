import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import { toast } from 'sonner-native';


export default function NewSaleScreen({ navigation }) {
  const [step, setStep] = useState(1); // 1: Cliente, 2: Productos, 3: Finalizar
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  // Removed unused state variable showNewClient
  const [cartItems, setCartItems] = useState([
    { id: '1', name: 'Harina Pan', price: 35.90, quantity: 2 },
    { id: '2', name: 'Café Madrid', price: 45.50, quantity: 1 },
    { id: '3', name: 'Azúcar Montalbán', price: 20.00, quantity: 3 },
    { id: '4', name: 'Aceite Diana', price: 50.00, quantity: 1 },
    { id: '5', name: 'Arroz Mary', price: 30.00, quantity: 4 },
    { id: '6', name: 'Pasta Primor', price: 25.00, quantity: 2 },
    { id: '7', name: 'Leche Completa', price: 60.00, quantity: 1 },
    { id: '8', name: 'Queso Paisa', price: 80.00, quantity: 1 },
    { id: '9', name: 'Jamón Plumrose', price: 100.00, quantity: 2 },
    { id: '10', name: 'Mantequilla Mavesa mavesa mavesa', price: 40.00, quantity: 3 }
  ]);
  const [selectedCurrency, setSelectedCurrency] = useState('VES');
  
  const exchangeRate = 35.90;

  // Mock data
  const clients = [
    { id: '1', name: 'Juan Pérez', document: 'V-12345678', phone: '+58 412-1234567' },
    { id: '2', name: 'María González', document: 'V-87654321', phone: '+58 414-7654321' },
  ];

  const products = [
    { 
      id: '1', 
      name: 'Harina Pan', 
      price: 35.90, 
      barcode: '7591001100098',
      stock: 50 
    },
    { 
      id: '2', 
      name: 'Café Madrid', 
      price: 45.50, 
      barcode: '7591001200097',
      stock: 30 
    },
  ];

  const formatCurrency = (amount, currency) => {
    if (currency === 'VES') {
      return `Bs. ${Number(amount).toLocaleString('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    } else {
      return `$ ${Number(amount / exchangeRate).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }
  };

  const handleBarcodeScan = ({ data }) => {
    const product = products.find(p => p.barcode === data);
    if (product) {
      addToCart(product);
      setShowScanner(false);
      toast.success('Producto agregado al carrito');
    } else {
      toast.error('Producto no encontrado');
    }
  };

const renderClientSearch = () => (
    <View style={styles.section}>
    
      <FlatList
        data={clients.filter(client =>
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.document.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.clientItem,
              selectedClient?.id === item.id && styles.selectedClient
            ]}
            onPress={() => {
              setSelectedClient(item);
              setStep(2);
            }}>
            <MaterialCommunityIcons 
              name="account" 
              size={24} 
              color={selectedClient?.id === item.id ? 'white' : '#1976D2'} 
            />
            <View style={styles.clientInfo}>
              <Text style={[
                styles.clientName,
                selectedClient?.id === item.id && styles.selectedText
              ]}>{item.name}</Text>
              <Text style={[
                styles.clientDocument,
                selectedClient?.id === item.id && styles.selectedText
              ]}>{item.document}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </View>
);

const renderProductSection = () => (
    <View style={styles.section}>
        <View style={styles.productActions}>
            <View style={styles.searchAndScanContainer}>
                <TouchableOpacity 
                    style={[styles.scanButton, styles.smallButton]}
                    onPress={() => setShowScanner(true)}>
                    <MaterialCommunityIcons name="barcode-scan" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.productSearchButton, styles.smallButton]}
                    onPress={() => navigation.navigate('ProductSelectionScreen')}>
                    <MaterialCommunityIcons name="view-grid" size={20} color="white" />
                    <Text style={styles.buttonText}>Ver Productos</Text>
                </TouchableOpacity>
             
            </View>
            <View style={[styles.currencySelector, styles.smallButton]}>
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

        <View style={styles.cartContainer}>
            <Text style={styles.sectionTitle}>Productos en Carrito</Text>
            <FlatList
                data={cartItems}
                renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                        <View style={styles.cartItemInfo}>
                            <Text 
                                style={styles.cartItemName} 
                                numberOfLines={2} 
                                ellipsizeMode="tail">
                                {item.name}
                            </Text>
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity
                                    style={[styles.quantityButton, styles.smallButton]}
                                    onPress={() => setCartItems(cartItems.map(cartItem =>
                                        cartItem.id === item.id
                                            ? { ...cartItem, quantity: cartItem.quantity + 1 }
                                            : cartItem
                                    ))}>
                                    <MaterialCommunityIcons name="plus" size={20} color="#333"/>
                                </TouchableOpacity>
                                <Text style={styles.quantityText}>{item.quantity}</Text>
                                <TouchableOpacity
                                    style={[styles.quantityButton, styles.smallButton]}
                                    onPress={() => setCartItems(cartItems.map(cartItem =>
                                        cartItem.id === item.id && cartItem.quantity > 1
                                            ? { ...cartItem, quantity: cartItem.quantity - 1 }
                                            : cartItem
                                    ).filter(cartItem => cartItem.quantity > 0))}>
                                    <MaterialCommunityIcons name="minus" size={20} color="#333"/>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.deleteButton, styles.smallButton]}
                                    onPress={() => setCartItems(cartItems.filter(cartItem => cartItem.id !== item.id))}>
                                    <MaterialCommunityIcons name="delete" size={20} color="#FF0000"/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={styles.cartItemPrice}>
                            {formatCurrency(item.price * item.quantity, selectedCurrency)}
                        </Text>
                    </View>
                )}
                keyExtractor={item => item.id}
            />
        </View>

        <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>
                {formatCurrency(getTotal(), selectedCurrency)}
            </Text>
        </View>

        <TouchableOpacity 
            style={[styles.finishButton, styles.smallButton]}
            onPress={() => setStep(3)}>
            <Text style={styles.finishButtonText}>Finalizar Venta</Text>
        </TouchableOpacity>
    </View>
);

  const renderFinishSection = () => (
    <View style={styles.section}>
      <View style={styles.finishOptions}>
        <TouchableOpacity style={styles.finishOptionButton}>
          <MaterialCommunityIcons name="printer" size={32} color="white" />
          <Text style={styles.finishOptionText}>Imprimir Factura</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.finishOptionButton}>
          <MaterialCommunityIcons name="whatsapp" size={32} color="white" />
          <Text style={styles.finishOptionText}>Enviar por WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.finishOptionButton}>
          <MaterialCommunityIcons name="email" size={32} color="white" />
          <Text style={styles.finishOptionText}>Enviar por Email</Text>
        </TouchableOpacity>
      </View>
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
          {step === 1 ? 'Seleccionar Cliente' : 
           step === 2 ? 'Agregar Productos' : 
           'Finalizar Venta'}
        </Text>
        <View style={styles.steps}>
          <View style={[styles.step, step >= 1 && styles.activeStep]} />
          <View style={[styles.step, step >= 2 && styles.activeStep]} />
          <View style={[styles.step, step >= 3 && styles.activeStep]} />
        </View>
      </View>

      {step === 1 && renderClientSearch()}
      {step === 2 && renderProductSection()}
      {step === 3 && renderFinishSection()}

      {showScanner && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={showScanner}
          onRequestClose={() => setShowScanner(false)}>
          <Camera
            style={StyleSheet.absoluteFillObject}
            onBarCodeScanned={handleBarcodeScan}
          />
          <TouchableOpacity 
            style={styles.closeScanner}
            onPress={() => setShowScanner(false)}>
            <MaterialCommunityIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (mantener los estilos existentes)
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    backgroundColor: '#F0F0F0',
    padding: 8,
    borderRadius: 8,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: 'center',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  deleteButton: {
    padding: 8,
    marginTop: 4,
  },
  invoicePreview: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  invoiceHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 16,
    marginBottom: 16,
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  invoiceDate: {
    fontSize: 14,
    color: '#666',
  },
  clientDetails: {
    marginBottom: 24,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  invoiceItems: {
    marginBottom: 24,
  },
  invoiceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  invoiceItemDetails: {
    flex: 1,
  },
  invoiceItemName: {
    fontSize: 14,
    color: '#333',
  },
  invoiceItemQuantity: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  invoiceItemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  invoiceTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#E0E0E0',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
  },
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
  newClientButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  clientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedClient: {
    backgroundColor: '#1976D2',
  },
  clientInfo: {
    marginLeft: 12,
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  clientDocument: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  selectedText: {
    color: 'white',
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },  searchAndScanContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  scanButton: {
    backgroundColor: '#1976D2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  productSearchButton: {
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
  manualCodeInput: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
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
  cartContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    color: '#333',
  },
  cartItemQuantity: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
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
  finishOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    padding: 16,
  },
  finishOptionButton: {
    backgroundColor: '#1976D2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '30%',
  },
  finishOptionText: {
    color: 'white',
    marginTop: 8,
    textAlign: 'center',
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
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import { toast } from 'sonner-native';

export default function NewSaleScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [showNewClient, setShowNewClient] = useState(false);
const [cartItems, setCartItems] = useState([
    { id: '1', name: 'Harina Pan', price: 35.90, barcode: '7591001100098', stock: 50, quantity: 2 },
    { id: '2', name: 'Café Madrid', price: 45.50, barcode: '7591001200097', stock: 30, quantity: 1 },
    { id: '3', name: 'Arroz Mary', price: 20.00, barcode: '7591001300096', stock: 100, quantity: 1 },
    { id: '4', name: 'Azúcar Montalbán', price: 25.50, barcode: '7591001400095', stock: 80, quantity: 1 },
    { id: '5', name: 'Aceite Diana', price: 50.00, barcode: '7591001500094', stock: 60, quantity: 1 },
    { id: '6', name: 'Pasta Primor', price: 30.00, barcode: '7591001600093', stock: 70, quantity: 1 },
    { id: '7', name: 'Leche La Campiña', price: 45.00, barcode: '7591001700092', stock: 40, quantity: 1 },
    { id: '8', name: 'Mantequilla Mavesa', price: 35.00, barcode: '7591001800091', stock: 50, quantity: 1 },
    { id: '9', name: 'Salsa de Tomate Pampero', price: 15.00, barcode: '7591001900090', stock: 90, quantity: 1 },
    { id: '10', name: 'Mayonesa Kraft', price: 25.00, barcode: '7591002000089', stock: 85, quantity: 1 },
    { id: '11', name: 'Cereal Corn Flakes', price: 40.00, barcode: '7591002100088', stock: 30, quantity: 1 },
    { id: '12', name: 'Galletas Oreo', price: 10.00, barcode: '7591002200087', stock: 120, quantity: 1 },
    { id: '13', name: 'Chocolate Savoy', price: 12.00, barcode: '7591002300086', stock: 110, quantity: 1 },
    { id: '14', name: 'Jugo Hit', price: 8.00, barcode: '7591002400085', stock: 150, quantity: 1 },
    { id: '15', name: 'Refresco Coca-Cola', price: 18.00, barcode: '7591002500084', stock: 100, quantity: 1 },
    { id: '16', name: 'Pan de Sándwich Bimbo', price: 22.00, barcode: '7591002600083', stock: 60, quantity: 1 },
    { id: '17', name: 'Queso Paisa', price: 55.00, barcode: '7591002700082', stock: 50, quantity: 1 },
]);
  const [selectedCurrency, setSelectedCurrency] = useState('VES');

  const exchangeRate = 35.90;

  const clients = [
    { id: '1', name: 'Juan Pérez', document: 'V-12345678', phone: '+58 412-1234567' },
    { id: '2', name: 'María González', document: 'V-87654321', phone: '+58 414-7654321' },
  ];
  // Mock data for products
  const products = [
    { id: '1', name: 'Harina Pan', price: 35.90, barcode: '7591001100098', stock: 50 },
    { id: '2', name: 'Café Madrid', price: 45.50, barcode: '7591001200097', stock: 30 },
  ];

  const formatCurrency = (amount, currency) => {
    return currency === 'VES'
      ? `Bs. ${Number(amount).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : `$ ${Number(amount / exchangeRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getTotal = () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (product, quantity = 1) => {
    const existing = cartItems.find(item => item.id === product.id);
    setCartItems(existing
      ? cartItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
      : [...cartItems, { ...product, quantity }]);
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
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar cliente por nombre o documento..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.newClientButton} onPress={() => setShowNewClient(true)}>
          <MaterialCommunityIcons name="account-plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={clients.filter(client =>
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.document.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.clientItem, selectedClient?.id === item.id && styles.selectedClient]}
            onPress={() => { setSelectedClient(item); setStep(2); }}>
            <MaterialCommunityIcons name="account" size={24} color={selectedClient?.id === item.id ? 'white' : '#1976D2'} />
            <View style={styles.clientInfo}>
              <Text style={[styles.clientName, selectedClient?.id === item.id && styles.selectedText]}>{item.name}</Text>
              <Text style={[styles.clientDocument, selectedClient?.id === item.id && styles.selectedText]}>{item.document}</Text>
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
          <TouchableOpacity style={styles.scanButton} onPress={() => setShowScanner(true)}>
            <MaterialCommunityIcons name="barcode-scan" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.productSearchButton} onPress={() => navigation.navigate('ProductSelectionScreen')}>
            <MaterialCommunityIcons name="view-grid" size={24} color="white" />
            <Text style={styles.buttonText}>Ver Productos</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.manualCodeInput}
            placeholder="Código manual"
            keyboardType="numeric"
            onSubmitEditing={(e) => {
              const product = products.find(p => p.barcode === e.nativeEvent.text);
              product ? addToCart(product) && toast.success('Producto agregado') : toast.error('Producto no encontrado');
            }}
          />
        </View>

        <View style={styles.currencySelector}>
          {['USD', 'VES'].map(curr => (
            <TouchableOpacity key={curr} style={[styles.currencyButton, selectedCurrency === curr && styles.selectedCurrency]} onPress={() => setSelectedCurrency(curr)}>
              <Text style={styles.currencyText}>{curr}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.cartContainer}>
        <Text style={styles.sectionTitle}>Productos en Carrito</Text>
        <FlatList
          data={cartItems}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <View style={styles.cartItemInfo}>
                <Text style={styles.cartItemName}>{item.name}</Text>
                <Text style={styles.cartItemQuantity}>Cant: {item.quantity}</Text>
              </View>
              <Text style={styles.cartItemPrice}>{formatCurrency(item.price * item.quantity, selectedCurrency)}</Text>
            </View>
          )}
          keyExtractor={item => item.id}
        />
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalAmount}>{formatCurrency(getTotal(), selectedCurrency)}</Text>
      </View>

      <TouchableOpacity style={styles.finishButton} onPress={() => setStep(3)}>
        <Text style={styles.finishButtonText}>Finalizar Venta</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFinishSection = () => (
    <View style={styles.section}>
      <View style={styles.finishOptions}>
        {[
          { icon: 'printer', label: 'Imprimir Factura' },
          { icon: 'whatsapp', label: 'Enviar por WhatsApp' },
          { icon: 'email', label: 'Enviar por Email' }
        ].map(option => (
          <TouchableOpacity key={option.label} style={styles.finishOptionButton}>
            <MaterialCommunityIcons name={option.icon} size={32} color="white" />
            <Text style={styles.finishOptionText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {step === 1 ? 'Seleccionar Cliente' : step === 2 ? 'Agregar Productos' : 'Finalizar Venta'}
        </Text>
        <View style={styles.steps}>
          {[1, 2, 3].map(s => <View key={s} style={[styles.step, step >= s && styles.activeStep]} />)}
        </View>
      </View>

      {step === 1 && renderClientSearch()}
      {step === 2 && renderProductSection()}
      {step === 3 && renderFinishSection()}

      {showScanner && (
        <Modal animationType="slide" transparent={false} visible={showScanner} onRequestClose={() => setShowScanner(false)}>
          <Camera style={StyleSheet.absoluteFillObject} onBarCodeScanned={handleBarcodeScan} />
          <TouchableOpacity style={styles.closeScanner} onPress={() => setShowScanner(false)}>
            <MaterialCommunityIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        </Modal>
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
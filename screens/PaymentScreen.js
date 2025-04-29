import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { toast } from 'sonner-native';

export default function PaymentScreen({ navigation, route }) {
  const { total, currency, client, items } = route.params;
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [reference, setReference] = useState('');

  const exchangeRate = 35.90;

  // Mock data - Esto vendría de la configuración de bancos
  const banks = [
    { 
      id: '1', 
      name: 'Banco Nacional', 
      paymentMethods: [
        { id: '1', name: 'Pago Móvil', requiresRef: true },
        { id: '2', name: 'Transferencia', requiresRef: true },
        { id: '3', name: 'Efectivo', requiresRef: false },
      ]
    },
    { 
      id: '2', 
      name: 'Banco Internacional',
      paymentMethods: [
        { id: '4', name: 'Zelle', requiresRef: true },
        { id: '5', name: 'Tarjeta', requiresRef: true },
      ]
    },
  ];

  const formatCurrency = (amount, curr) => {
    return curr === 'VES'
      ? `Bs. ${Number(amount).toLocaleString('es-VE', { minimumFractionDigits: 2 })}`
      : `$ ${Number(amount / exchangeRate).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const handlePayment = () => {
    if (!selectedBank) {
      toast.error('Seleccione un banco');
      return;
    }
    if (!selectedPaymentMethod) {
      toast.error('Seleccione un método de pago');
      return;
    }
    if (selectedPaymentMethod.requiresRef && !reference) {
      toast.error('Ingrese el número de referencia');
      return;
    }

    // Aquí iría la lógica para procesar el pago
    toast.success('Pago procesado exitosamente');
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Procesar Pago</Text>
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

      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen de Pago</Text>
          <Text style={styles.clientName}>{client.name}</Text>
          <Text style={styles.itemCount}>{items.length} productos</Text>
          <Text style={styles.totalAmount}>
            {formatCurrency(total, selectedCurrency)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seleccionar Banco</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.banksContainer}>
            {banks.map(bank => (
              <TouchableOpacity
                key={bank.id}
                style={[
                  styles.bankCard,
                  selectedBank?.id === bank.id && styles.selectedBank
                ]}
                onPress={() => {
                  setSelectedBank(bank);
                  setSelectedPaymentMethod(null);
                }}>
                <MaterialCommunityIcons 
                  name="bank" 
                  size={24} 
                  color={selectedBank?.id === bank.id ? 'white' : '#1976D2'} 
                />
                <Text style={[
                  styles.bankName,
                  selectedBank?.id === bank.id && styles.selectedText
                ]}>
                  {bank.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {selectedBank && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Método de Pago</Text>
            <View style={styles.paymentMethodsGrid}>
              {selectedBank.paymentMethods.map(method => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodCard,
                    selectedPaymentMethod?.id === method.id && styles.selectedMethod
                  ]}
                  onPress={() => setSelectedPaymentMethod(method)}>
                  <MaterialCommunityIcons 
                    name={
                      method.name === 'Pago Móvil' ? 'cellphone' :
                      method.name === 'Transferencia' ? 'bank-transfer' :
                      method.name === 'Efectivo' ? 'cash' :
                      method.name === 'Zelle' ? 'credit-card' :
                      'credit-card'
                    }
                    size={24} 
                    color={selectedPaymentMethod?.id === method.id ? 'white' : '#666'} 
                  />
                  <Text style={[
                    styles.methodName,
                    selectedPaymentMethod?.id === method.id && styles.selectedText
                  ]}>
                    {method.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {selectedPaymentMethod?.requiresRef && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Número de Referencia</Text>
            <TextInput
              style={styles.referenceInput}
              value={reference}
              onChangeText={setReference}
              placeholder="Ingrese el número de referencia"
              keyboardType="numeric"
            />
          </View>
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.processButton}
        onPress={handlePayment}>
        <Text style={styles.processButtonText}>Procesar Pago</Text>
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
  content: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#1976D2',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  summaryTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  clientName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemCount: {
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  totalAmount: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  banksContainer: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  bankCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    minWidth: 120,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedBank: {
    backgroundColor: '#1976D2',
  },
  bankName: {
    marginTop: 8,
    color: '#333',
    fontWeight: '500',
  },
  selectedText: {
    color: 'white',
  },
  paymentMethodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -4,
  },
  methodCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    margin: 4,
    alignItems: 'center',
    width: '31%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedMethod: {
    backgroundColor: '#1976D2',
  },
  methodName: {
    marginTop: 8,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  referenceInput: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  processButton: {
    backgroundColor: '#4CAF50',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  processButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
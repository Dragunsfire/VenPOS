import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SalesBookScreen({ navigation }) {
  const [selectedCurrency, setSelectedCurrency] = useState('VES');
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  
  const exchangeRate = 35.90;

  const sales = [
    {
      id: '1',
      date: '2025-04-27',
      client: 'Juan Pérez',
      invoice: 'F-001',
      amount: 1250.75,
      items: 5,
      paymentMethod: 'efectivo',
      status: 'completed'
    },
    {
      id: '2',
      date: '2025-04-27',
      client: 'María González',
      invoice: 'F-002',
      amount: 1500.00,
      items: 3,
      paymentMethod: 'tarjeta',
      status: 'pending'
    },
    {
      id: '3',
      date: '2025-04-26',
      client: 'Pedro Gómez',
      invoice: 'F-003',
      amount: 2500.00,
      items: 2,
      paymentMethod: 'cheque',
      status: 'canceled'
    },
    {
      id: '4',
      date: '2025-04-25',
      client: 'Ana López',
      invoice: 'F-004',
      amount: 3000.00,
      items: 1,
      paymentMethod: 'transferencia',
      status: 'completed'
    }
  ];

  const periods = [
    { id: 'today', label: 'Hoy' },
    { id: 'week', label: 'Semana' },
    { id: 'month', label: 'Mes' },
    { id: 'year', label: 'Año' }
  ];

  const formatCurrency = (amount, currency) => {
    return currency === 'VES'
      ? `Bs. ${Number(amount).toLocaleString('es-VE', { minimumFractionDigits: 2 })}`
      : `$ ${Number(amount / exchangeRate).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const getTotalSales = () => {
    return sales.reduce((sum, sale) => sum + sale.amount, 0);
  };

  const renderSaleItem = ({ item }) => (
    <TouchableOpacity style={styles.saleItem}>
      <View style={styles.saleHeader}>
        <View>
          <Text style={styles.invoiceNumber}>{item.invoice}</Text>
          <Text style={styles.clientName}>{item.client}</Text>
        </View>
        <Text style={styles.saleAmount}>
          {formatCurrency(item.amount, selectedCurrency)}
        </Text>
      </View>
      
      <View style={styles.saleDetails}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="calendar" size={16} color="#666" />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="package-variant" size={16} color="#666" />
          <Text style={styles.detailText}>{item.items} items</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="cash" size={16} color="#666" />
          <Text style={styles.detailText}>{item.paymentMethod}</Text>
        </View>
        <View style={[styles.statusTag, { backgroundColor: item.status === 'completed' ? '#4CAF50' : '#FFA000' }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Libro de Ventas</Text>
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

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Total de Ventas</Text>
        <Text style={styles.summaryAmount}>
          {formatCurrency(getTotalSales(), selectedCurrency)}
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.periodSelector}>
          {periods.map(period => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodButton,
                selectedPeriod === period.id && styles.selectedPeriod
              ]}
              onPress={() => setSelectedPeriod(period.id)}>
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period.id && styles.selectedPeriodText
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por cliente o factura..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={sales.filter(sale => 
          sale.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sale.invoice.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        renderItem={renderSaleItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.salesList}
      />

      <TouchableOpacity style={styles.exportButton}>
        <MaterialCommunityIcons name="file-export" size={24} color="white" />
        <Text style={styles.exportButtonText}>Exportar Libro</Text>
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
  summary: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  selectedPeriod: {
    backgroundColor: '#1976D2',
  },
  periodButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  selectedPeriodText: {
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    padding: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  salesList: {
    padding: 16,
  },
  saleItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  clientName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  saleAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  saleDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SuppliersScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('VES');
  
  const exchangeRate = 35.90;

  const suppliers = [
    {
      id: '1',
      name: 'Distribuidora ABC',
      rif: 'J-12345678-0',
      phone: '+58 412-1234567',
      email: 'contacto@abc.com',
      address: 'Caracas, Venezuela',
      balance: 15890.50,
      taxInfo: {
        ivaRate: 16,
        ivaRetention: 75, // 75% del IVA
        islrRate: 5,
        isLargeTransaction: true,
      },
      status: 'active'
    },
    // Más proveedores...
  ];

  const formatCurrency = (amount, currency) => {
    return currency === 'VES'
      ? `Bs. ${Number(amount).toLocaleString('es-VE', { minimumFractionDigits: 2 })}`
      : `$ ${Number(amount / exchangeRate).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const renderSupplierItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.supplierCard}
      onPress={() => navigation.navigate('NewSupplier', { supplier: item })}>
      <View style={styles.supplierHeader}>
        <View style={styles.supplierInfo}>
          <Text style={styles.supplierName}>{item.name}</Text>
          <Text style={styles.supplierRif}>{item.rif}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'active' ? '#4CAF50' : '#FFA000' }
        ]}>
          <Text style={styles.statusText}>
            {item.status === 'active' ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="phone" size={20} color="#666" />
          <Text style={styles.detailText}>{item.phone}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="email" size={20} color="#666" />
          <Text style={styles.detailText}>{item.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="map-marker" size={20} color="#666" />
          <Text style={styles.detailText}>{item.address}</Text>
        </View>
      </View>

      <View style={styles.taxInfoContainer}>
        <Text style={styles.taxInfoTitle}>Información Fiscal</Text>
        <View style={styles.taxGrid}>
          <View style={styles.taxItem}>
            <Text style={styles.taxLabel}>IVA</Text>
            <Text style={styles.taxValue}>{item.taxInfo.ivaRate}%</Text>
          </View>
          <View style={styles.taxItem}>
            <Text style={styles.taxLabel}>Retención IVA</Text>
            <Text style={styles.taxValue}>{item.taxInfo.ivaRetention}%</Text>
          </View>
          <View style={styles.taxItem}>
            <Text style={styles.taxLabel}>ISLR</Text>
            <Text style={styles.taxValue}>{item.taxInfo.islrRate}%</Text>
          </View>
        </View>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Balance Actual:</Text>
        <Text style={styles.balanceAmount}>
          {formatCurrency(item.balance, selectedCurrency)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Proveedores</Text>
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
        renderItem={renderSupplierItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.suppliersList}
      />

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('NewSuplierScreen')}>
        <MaterialCommunityIcons name="plus" size={24} color="white" />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    padding: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  suppliersList: {
    padding: 16,
  },
  supplierCard: {
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
  supplierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  supplierInfo: {
    flex: 1,
  },
  supplierName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  supplierRif: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  taxInfoContainer: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  taxInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  taxGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taxItem: {
    alignItems: 'center',
  },
  taxLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  taxValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#4CAF50',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
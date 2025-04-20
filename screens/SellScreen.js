import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function NewSaleScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: '1', name: 'Alimentos', icon: 'food' },
    { id: '2', name: 'Bebidas', icon: 'coffee' },
    { id: '3', name: 'Limpieza', icon: 'spray' },
    { id: '4', name: 'Electrónica', icon: 'cellphone' },
    { id: '5', name: 'Otros', icon: 'dots-horizontal' },
  ];

  const products = [
    { id: '1', name: 'Producto 1', price: 35.90, category: '1' },
    { id: '2', name: 'Producto 2', price: 45.50, category: '1' },
    // Add more products...
  ];

  const renderCategory = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategory
      ]}
      onPress={() => setSelectedCategory(item.id)}>
      <MaterialCommunityIcons name={item.icon} size={24} color={selectedCategory === item.id ? 'white' : '#333'} />
      <Text style={[styles.categoryText, selectedCategory === item.id && styles.selectedCategoryText]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Nueva Venta</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <MaterialCommunityIcons name="cart" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
        />
      </View>

      <View style={styles.productsContainer}>
        {/* Products list will go here */}
      </View>
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
  categoriesContainer: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: '#1976D2',
  },
  categoryText: {
    marginLeft: 8,
    color: '#333',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'white',
  },
  productsContainer: {
    flex: 1,
    padding: 16,
  },
});
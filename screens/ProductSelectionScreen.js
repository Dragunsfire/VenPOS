import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Image,
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { toast } from 'sonner-native';

const windowWidth = Dimensions.get('window').width;
const numColumns = 2;
const tileSize = (windowWidth - 48) / numColumns;

export default function ProductSelectionScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('VES');
  
  const exchangeRate = 35.90;

  // Mock data
  const categories = [
    { id: '1', name: 'Alimentos', icon: 'food' },
    { id: '2', name: 'Bebidas', icon: 'coffee' },
    { id: '3', name: 'Limpieza', icon: 'spray' },
    { id: '4', name: 'Electrónica', icon: 'cellphone' },
    { id: '5', name: 'Otros', icon: 'dots-horizontal' },
  ];

  const products = [
    { 
      id: '1', 
      name: 'Harina Pan', 
      price: 35.90, 
      category: '1',
      stock: 50,
      image: `https://api.a0.dev/assets/image?text=Harina%20Pan%20Venezuela&aspect=1:1`
    },
    { 
      id: '2', 
      name: 'Café Madrid', 
      price: 45.50, 
      category: '1',
      stock: 30,
      image: `https://api.a0.dev/assets/image?text=Cafe%20Madrid%20Venezuela&aspect=1:1`
    },
    // Add more products as needed
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

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    // Aquí implementaremos la lógica para añadir al carrito
    toast.success(`${product.name} agregado al carrito`);
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategory
      ]}
      onPress={() => setSelectedCategory(item.id === selectedCategory ? null : item.id)}>
      <MaterialCommunityIcons 
        name={item.icon} 
        size={24} 
        color={selectedCategory === item.id ? 'white' : '#333'} 
      />
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.selectedCategoryText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.productTile}
      onPress={() => addToCart(item)}>
      <Image
        source={{ uri: item.image }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productPrice}>
          {formatCurrency(item.price, selectedCurrency)}
        </Text>
        <View style={[
          styles.stockIndicator,
          { backgroundColor: item.stock > 10 ? '#4CAF50' : '#FFA000' }
        ]}>
          <Text style={styles.stockText}>Stock: {item.stock}</Text>
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
        <Text style={styles.title}>Seleccionar Productos</Text>
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
          placeholder="Buscar productos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
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

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.productsGrid}
      />
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
  categoriesContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    marginBottom: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
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
  productsGrid: {
    padding: 16,
  },
  productTile: {
    width: tileSize,
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: tileSize,
    backgroundColor: '#F0F0F0',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: '#1976D2',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stockIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  stockText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});
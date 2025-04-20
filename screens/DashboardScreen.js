import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

export default function HomeScreen() {
  const [selectedCurrency, setSelectedCurrency] = useState('VES');
  const exchangeRate = 80.90;

  const operator = {
    name: 'Wilfredo Garcia',
    role: 'cajero Principal',
    id: 'OP001',
  };

  const formatCurrency = (amount, currency) => {
    if (currency === 'VES') {
      return `Bs. ${Number(amount).toLocaleString('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    } else {
      return `$ ${Number(amount / exchangeRate).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
  };

  const salesHistory = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        data: [
          45678.9, 52345.67, 48932.45, 55678.9, 49876.54, 58765.43,
          100000.0, 123456.78, 65432.1, 78901.23, 87654.32, 93500.0,
        ],
      },
    ],
  };

  const getQuickStats = (currency) => [
    {
      title: 'Ventas Hoy',
      value: formatCurrency(45678.9, currency),
      icon: 'cash-register',
    },
    {
      title: 'Tasa USD',
      value: exchangeRate.toString(),
      icon: 'currency-usd',
    },
  ];

  const getQuickStatsDolars = () => [
    {
      title: 'Clientes Nuevos',
      value: '15',
      icon: 'account-plus',
    },
    {
      title: 'Productos Vendidos',
      value: '120',
      icon: 'package-variant-closed',
    },
  ];

  const mainMenuItems = [
    {
      title: 'Nueva Venta',
      icon: 'cart-plus',
      color: '#4CAF50',
      route: 'NewSale',
    },
    {
      title: 'Carrito',
      icon: 'cart',
      color: '#E91E63',
      route: 'Cart',
    },
    {
      title: 'Clientes',
      icon: 'account-group',
      color: '#795548',
      route: 'Customers',
    },
    {
      title: 'Inventario',
      icon: 'package-variant',
      color: '#2196F3',
      route: 'Inventory',
    },
    {
      title: 'Categorías',
      icon: 'shape',
      color: '#9C27B0',
      route: 'Categories',
    },
    {
      title: 'Cierre de Caja',
      icon: 'cash-register',
      color: '#FF9800',
      route: 'CashClose',
    },
    {
      title: 'Reportes',
      icon: 'chart-bar',
      color: '#607D8B',
      route: 'Reports',
    },
    {
      title: 'Configuración',
      icon: 'cog',
      color: '#455A64',
      route: 'Settings',
    },
    {
      title: 'Salir',
      icon: 'logout',
      color: '#F44336',
      route: 'Logout', 
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.operatorInfo}>
            <MaterialIcons name="account-circle" size={40} color="#1976D2" />
            <View style={styles.operatorText}>
              <Text style={styles.operatorName}>{operator.name}</Text>
              <Text style={styles.operatorRole}>{operator.role}</Text>
            </View>
          </View>

          <View style={styles.currencySelector}>
            <TouchableOpacity
              style={[styles.currencyButton, selectedCurrency === 'USD' && styles.selectedCurrency]}
              onPress={() => setSelectedCurrency('USD')}
            >
              <Text style={[styles.currencyText, selectedCurrency === 'USD' && { color: '#fff' }]}>USD</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.currencyButton, selectedCurrency === 'VES' && styles.selectedCurrency]}
              onPress={() => setSelectedCurrency('VES')}
            >
              <Text style={[styles.currencyText, selectedCurrency === 'VES' && { color: '#fff' }]}>VES</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.quickStats}>
          {getQuickStats(selectedCurrency).map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <MaterialCommunityIcons name={stat.icon} size={20} color="#1976D2" />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>

        <View style={styles.quickStats}>
          {getQuickStatsDolars().map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <MaterialCommunityIcons name={stat.icon} size={20} color="#1976D2" />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Historial de Ventas</Text>
          <LineChart
            data={{
              labels: salesHistory.labels,
              datasets: [
                {
                  data: salesHistory.datasets[0].data.map((value) =>
                    selectedCurrency === 'USD' ? value / exchangeRate : value
                  ),
                },
              ],
            }}
            width={Dimensions.get('window').width * 0.9}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
              style: { borderRadius: 10 },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#1976D2',
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.menuGrid}>
          {mainMenuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={[styles.menuIconContainer, { backgroundColor: item.color }]}>
                {item.icon.includes('account') ? (
                  <MaterialIcons name={item.icon} size={32} color="white" />
                ) : (
                  <MaterialCommunityIcons name={item.icon} size={32} color="white" />
                )}
              </View>
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
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
  operatorInfo: { flexDirection: 'row', alignItems: 'center' },
  operatorText: { marginLeft: 12 },
  operatorName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  operatorRole: { fontSize: 14, color: '#666' },
  currencySelector: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 4,
  },
  currencyButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  selectedCurrency: { backgroundColor: '#1976D2' },
  currencyText: { fontWeight: 'bold', color: '#333' },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 8 },
  statTitle: { fontSize: 12, color: '#666', marginTop: 4 },
  chartContainer: { paddingHorizontal: 16, paddingBottom: 24 },
  chartTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  chart: { borderRadius: 16 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12 },
  menuItem: {
    width: '33.33%',
    padding: 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  menuIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItemText: { fontSize: 12, fontWeight: 'bold', color: '#333' },
});

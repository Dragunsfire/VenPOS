import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

export default function CashCloseScreen({ navigation }) {
  const [selectedCurrency, setSelectedCurrency] = useState('VES');
  const exchangeRate = 35.90;

  const dailySales = {
    total: 45678.90,
    transactions: 28,
    cash: 25678.90,
    card: 15000.00,
    transfer: 5000.00,
  };

  const salesHistory = {
    labels: ['9am', '11am', '1pm', '3pm', '5pm', '7pm'],
    datasets: [{
      data: [
        5678.90,
        12345.67,
        8932.45,
        15678.90,
        9876.54,
        8765.43
      ]
    }]
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Cierre de Caja</Text>
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
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total del Día</Text>
          <Text style={styles.totalAmount}>
            {formatCurrency(dailySales.total, selectedCurrency)}
          </Text>
          <Text style={styles.transactionsCount}>
            {dailySales.transactions} transacciones
          </Text>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Ventas por Hora</Text>
          <LineChart
            data={{
              labels: salesHistory.labels,
              datasets: [{
                data: salesHistory.datasets[0].data.map(value => 
                  selectedCurrency === 'USD' ? value / exchangeRate : value
                )
              }]
            }}
            width={340}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
              style: {
                borderRadius: 16
              }
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.paymentMethodsContainer}>
          <Text style={styles.sectionTitle}>Métodos de Pago</Text>
          <View style={styles.paymentMethod}>
            <MaterialCommunityIcons name="cash" size={24} color="#4CAF50" />
            <Text style={styles.paymentMethodLabel}>Efectivo</Text>
            <Text style={styles.paymentMethodAmount}>
              {formatCurrency(dailySales.cash, selectedCurrency)}
            </Text>
          </View>
          <View style={styles.paymentMethod}>
            <MaterialCommunityIcons name="credit-card" size={24} color="#1976D2" />
            <Text style={styles.paymentMethodLabel}>Tarjeta</Text>
            <Text style={styles.paymentMethodAmount}>
              {formatCurrency(dailySales.card, selectedCurrency)}
            </Text>
          </View>
          <View style={styles.paymentMethod}>
            <MaterialCommunityIcons name="bank-transfer" size={24} color="#9C27B0" />
            <Text style={styles.paymentMethodLabel}>Transferencia</Text>
            <Text style={styles.paymentMethodAmount}>
              {formatCurrency(dailySales.transfer, selectedCurrency)}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.closeButton}>
          <MaterialCommunityIcons name="cash-register" size={24} color="white" />
          <Text style={styles.closeButtonText}>Realizar Cierre de Caja</Text>
        </TouchableOpacity>
      </ScrollView>
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
    padding: 16,
  },
  totalCard: {
    backgroundColor: '#1976D2',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginBottom: 8,
  },
  totalAmount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  transactionsCount: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  chartContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 12,
  },
  paymentMethodsContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  paymentMethodLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  paymentMethodAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
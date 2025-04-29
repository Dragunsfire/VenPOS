import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-chart-kit';

export default function ReportsScreen({ navigation }) {
  const [selectedCurrency, setSelectedCurrency] = useState('VES');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  const exchangeRate = 35.90;

  const formatCurrency = (amount, currency) => {
    return currency === 'VES'
      ? `Bs. ${Number(amount).toLocaleString('es-VE', { minimumFractionDigits: 2 })}`
      : `$ ${Number(amount / exchangeRate).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const financialData = {
    sales: 150000.00,
    purchases: 85000.00,
    accountsReceivable: 45000.00,
    accountsPayable: 35000.00,
    bankBalance: 75000.00,
    profit: 65000.00,
  };

  const salesHistory = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [{
      data: [
        65000.00,
        72000.00,
        58000.00,
        95000.00,
        82000.00,
        150000.00
      ]
    }]
  };

  const expensesData = [
    {
      name: 'Compras',
      amount: 85000.00,
      color: '#FF6384',
    },
    {
      name: 'Servicios',
      amount: 15000.00,
      color: '#36A2EB',
    },
    {
      name: 'Salarios',
      amount: 35000.00,
      color: '#FFCE56',
    },
    {
      name: 'Otros',
      amount: 10000.00,
      color: '#4BC0C0',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Reportes Financieros</Text>
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
        <View style={styles.periodSelector}>
          {['week', 'month', 'quarter', 'year'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.selectedPeriod
              ]}
              onPress={() => setSelectedPeriod(period)}>
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.selectedPeriodText
              ]}>
                {period === 'week' ? 'Semana' :
                 period === 'month' ? 'Mes' :
                 period === 'quarter' ? 'Trimestre' : 'Año'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="cash-register" size={24} color="#4CAF50" />
            <Text style={styles.statLabel}>Ventas</Text>
            <Text style={styles.statValue}>
              {formatCurrency(financialData.sales, selectedCurrency)}
            </Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="cart" size={24} color="#F44336" />
            <Text style={styles.statLabel}>Compras</Text>
            <Text style={styles.statValue}>
              {formatCurrency(financialData.purchases, selectedCurrency)}
            </Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="bank" size={24} color="#2196F3" />
            <Text style={styles.statLabel}>Banco</Text>
            <Text style={styles.statValue}>
              {formatCurrency(financialData.bankBalance, selectedCurrency)}
            </Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="chart-line" size={24} color="#9C27B0" />
            <Text style={styles.statLabel}>Ganancia</Text>
            <Text style={styles.statValue}>
              {formatCurrency(financialData.profit, selectedCurrency)}
            </Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Ventas por Período</Text>
          <LineChart
            data={{
              labels: salesHistory.labels,
              datasets: [{
                data: salesHistory.datasets[0].data.map(value => 
                  selectedCurrency === 'USD' ? value / exchangeRate : value
                )
              }]
            }}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
              style: {
                borderRadius: 16
              }
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Distribución de Gastos</Text>
          <PieChart
            data={expensesData.map(item => ({
              ...item,
              amount: selectedCurrency === 'USD' ? item.amount / exchangeRate : item.amount,
            }))}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        </View>

        <View style={styles.accountsContainer}>
          <View style={styles.accountCard}>
            <Text style={styles.accountTitle}>Cuentas por Cobrar</Text>
            <Text style={styles.accountValue}>
              {formatCurrency(financialData.accountsReceivable, selectedCurrency)}
            </Text>
            <TouchableOpacity style={styles.viewDetailsButton}>
              <Text style={styles.viewDetailsText}>Ver Detalles</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.accountCard}>
            <Text style={styles.accountTitle}>Cuentas por Pagar</Text>
            <Text style={styles.accountValue}>
              {formatCurrency(financialData.accountsPayable, selectedCurrency)}
            </Text>
            <TouchableOpacity style={styles.viewDetailsButton}>
              <Text style={styles.viewDetailsText}>Ver Detalles</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    flex: 1,
    padding: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 12,
    marginVertical: 8,
  },
  accountsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  accountCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  accountTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  accountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  viewDetailsButton: {
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewDetailsText: {
    color: '#1976D2',
    fontWeight: '500',
  },
});
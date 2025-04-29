import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
  const [settings, setSettings] = useState({
    business: {
      name: 'Mi Tienda',
      rif: 'J-12345678-0',
      address: 'Caracas, Venezuela',
      phone: '+58 412-1234567',
      email: 'contacto@mitienda.com',
      logo: `https://api.a0.dev/assets/image?text=Store%20Logo&aspect=1:1`,
    },
    currency: {
      primary: 'VES',
      showDualCurrency: true,
      exchangeRate: 35.90,
    },
    tax: {
      iva: 16,
      ivaRetention: 75,
      islrRetention: 5,
    },
    invoice: {
      prefix: 'F',
      nextNumber: 1001,
      showLogo: true,
      includeQR: true,
      footer: 'Gracias por su compra',
    },
    theme: {
      darkMode: false,
      primaryColor: '#1976D2',
      accentColor: '#4CAF50',
    },
    notifications: {
      lowStock: true,
      duePayments: true,
      dailyReport: true,
    }
  });

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Configuración</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="content-save" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Datos de la Empresa */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos de la Empresa</Text>
          
          <TouchableOpacity style={styles.logoContainer}>
            <Image source={{ uri: settings.business.logo }} style={styles.logo} />
            <View style={styles.logoOverlay}>
              <MaterialCommunityIcons name="camera" size={24} color="white" />
              <Text style={styles.logoText}>Cambiar Logo</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre de la Empresa</Text>
            <TextInput
              style={styles.input}
              value={settings.business.name}
              onChangeText={(text) => updateSetting('business', 'name', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>RIF</Text>
            <TextInput
              style={styles.input}
              value={settings.business.rif}
              onChangeText={(text) => updateSetting('business', 'rif', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dirección</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={settings.business.address}
              onChangeText={(text) => updateSetting('business', 'address', text)}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              value={settings.business.phone}
              onChangeText={(text) => updateSetting('business', 'phone', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              value={settings.business.email}
              onChangeText={(text) => updateSetting('business', 'email', text)}
              keyboardType="email-address"
            />
          </View>
        </View>

        {/* Configuración de Moneda */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración de Moneda</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Moneda Principal</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity 
                style={[
                  styles.radioButton,
                  settings.currency.primary === 'VES' && styles.radioSelected
                ]}
                onPress={() => updateSetting('currency', 'primary', 'VES')}>
                <Text style={styles.radioText}>Bolívares (VES)</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.radioButton,
                  settings.currency.primary === 'USD' && styles.radioSelected
                ]}
                onPress={() => updateSetting('currency', 'primary', 'USD')}>
                <Text style={styles.radioText}>Dólares (USD)</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Mostrar Doble Moneda</Text>
              <Switch
                value={settings.currency.showDualCurrency}
                onValueChange={(value) => updateSetting('currency', 'showDualCurrency', value)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tasa de Cambio (USD)</Text>
            <TextInput
              style={styles.input}
              value={settings.currency.exchangeRate.toString()}
              onChangeText={(text) => updateSetting('currency', 'exchangeRate', parseFloat(text) || 0)}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Configuración de Impuestos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración de Impuestos</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>IVA (%)</Text>
            <TextInput
              style={styles.input}
              value={settings.tax.iva.toString()}
              onChangeText={(text) => updateSetting('tax', 'iva', parseInt(text) || 0)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Retención de IVA (%)</Text>
            <TextInput
              style={styles.input}
              value={settings.tax.ivaRetention.toString()}
              onChangeText={(text) => updateSetting('tax', 'ivaRetention', parseInt(text) || 0)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Retención de ISLR (%)</Text>
            <TextInput
              style={styles.input}
              value={settings.tax.islrRetention.toString()}
              onChangeText={(text) => updateSetting('tax', 'islrRetention', parseInt(text) || 0)}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Configuración de Factura */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración de Factura</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prefijo de Factura</Text>
            <TextInput
              style={styles.input}
              value={settings.invoice.prefix}
              onChangeText={(text) => updateSetting('invoice', 'prefix', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Próximo Número</Text>
            <TextInput
              style={styles.input}
              value={settings.invoice.nextNumber.toString()}
              onChangeText={(text) => updateSetting('invoice', 'nextNumber', parseInt(text) || 0)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Mostrar Logo</Text>
              <Switch
                value={settings.invoice.showLogo}
                onValueChange={(value) => updateSetting('invoice', 'showLogo', value)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Incluir Código QR</Text>
              <Switch
                value={settings.invoice.includeQR}
                onValueChange={(value) => updateSetting('invoice', 'includeQR', value)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pie de Factura</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={settings.invoice.footer}
              onChangeText={(text) => updateSetting('invoice', 'footer', text)}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Tema y Apariencia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tema y Apariencia</Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Modo Oscuro</Text>
              <Switch
                value={settings.theme.darkMode}
                onValueChange={(value) => updateSetting('theme', 'darkMode', value)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Color Principal</Text>
            <View style={styles.colorPicker}>
              {['#1976D2', '#4CAF50', '#9C27B0', '#FF5722'].map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    settings.theme.primaryColor === color && styles.colorSelected
                  ]}
                  onPress={() => updateSetting('theme', 'primaryColor', color)}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Notificaciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Alertas de Stock Bajo</Text>
              <Switch
                value={settings.notifications.lowStock}
                onValueChange={(value) => updateSetting('notifications', 'lowStock', value)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Pagos Pendientes</Text>
              <Switch
                value={settings.notifications.duePayments}
                onValueChange={(value) => updateSetting('notifications', 'duePayments', value)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Reporte Diario</Text>
              <Switch
                value={settings.notifications.dailyReport}
                onValueChange={(value) => updateSetting('notifications', 'dailyReport', value)}
              />
            </View>
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
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  logoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: 'white',
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  radioSelected: {
    backgroundColor: '#1976D2',
  },
  radioText: {
    color: '#333',
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  colorPicker: {
    flexDirection: 'row',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: 'white',
    elevation: 4,
  },
});
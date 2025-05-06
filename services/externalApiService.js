// services/externalApiService.js

// Aquí puedes agregar funciones para consumir APIs externas usando fetch o axios

export async function getExchangeRate() {
  // Ejemplo usando fetch
  const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
  if (!response.ok) throw new Error('Error obteniendo tasa de cambio');
  return await response.json();
}

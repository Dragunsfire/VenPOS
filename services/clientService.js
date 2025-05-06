// services/clientService.js
import { supabase } from '../utils/supabase';
const empresa_id = '9f38e2c4-4093-4d44-b0ea-ccff9093e2f5';
// Obtener todos los clientes de una empresa
export async function getClientsByEmpresa(empresa_id) {
  return await supabase
    .from('clientes')
    .select('*')
    .eq('empresa_id', empresa_id);
}

// Agregar un nuevo cliente
export async function addClient(cliente) {
  // cliente debe incluir al menos: empresa_id, nombre
  return await supabase
    .from('clientes')
    .insert([cliente]);
}

// Actualizar un cliente existente
export async function updateClient(id, updates) {
  return await supabase
    .from('clientes')
    .update(updates)
    .eq('id', id);
}

// Eliminar un cliente
export async function deleteClient(id) {
  return await supabase
    .from('clientes')
    .delete()
    .eq('id', id);
}

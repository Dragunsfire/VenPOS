// services/transactionService.js
import { supabase } from '../utils/supabase';

export async function getTransactions() {
  return await supabase.from('transacciones').select('*');
}

export async function addTransaction(transaction) {
  return await supabase.from('transacciones').insert([transaction]);
}

export async function updateTransaction(id, updates) {
  return await supabase.from('transacciones').update(updates).eq('id', id);
}

export async function deleteTransaction(id) {
  return await supabase.from('transacciones').delete().eq('id', id);
}

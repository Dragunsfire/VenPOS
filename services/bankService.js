// services/bankService.js
import { supabase } from '../utils/supabase';

export async function getBanks() {
  return await supabase.from('bancos').select('*');
}

export async function addBank(bank) {
  return await supabase.from('bancos').insert([bank]);
}

export async function updateBank(id, updates) {
  return await supabase.from('bancos').update(updates).eq('id', id);
}

export async function deleteBank(id) {
  return await supabase.from('bancos').delete().eq('id', id);
}

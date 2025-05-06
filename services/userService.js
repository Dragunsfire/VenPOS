// services/userService.js
import { supabase } from '../utils/supabase';

export async function getUsers() {
  return await supabase.from('usuarios').select('*');
}

export async function addUser(user) {
  return await supabase.from('usuarios').insert([user]);
}

export async function updateUser(id, updates) {
  return await supabase.from('usuarios').update(updates).eq('id', id);
}

export async function deleteUser(id) {
  return await supabase.from('usuarios').delete().eq('id', id);
}

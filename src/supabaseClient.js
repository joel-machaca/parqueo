// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qfipwyijfxqizfenqvfs.supabase.co'; // Reemplaza con la URL de tu proyecto Supabase
const supabaseKey = 'sb_publishable_CMzriYIHtvrNc3k_lrxqmA_VlUWsgmD'; // Reemplaza con la clave pública de tu proyecto
export const supabase = createClient(supabaseUrl, supabaseKey);
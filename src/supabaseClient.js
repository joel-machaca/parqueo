// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qfipwyijfxqizfenqvfs.supabase.co'; // Reemplaza con la URL de tu proyecto Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmaXB3eWlqZnhxaXpmZW5xdmZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NzY0ODgsImV4cCI6MjA3MDU1MjQ4OH0.8O_o-i9_4cLVpF4FER5004DMgld8E-td8dZjAN5DK00   '; // Reemplaza con la clave pública de tu proyecto
export const supabase = createClient(supabaseUrl, supabaseKey);
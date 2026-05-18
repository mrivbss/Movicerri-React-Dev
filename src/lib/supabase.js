import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Verificamos que las variables de entorno existan
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('pega_aqui')) {
    console.warn('Faltan las credenciales de Supabase en el archivo .env. La base de datos no conectará correctamente.');
}

// Inicializamos el cliente de Supabase
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co', 
    supabaseAnonKey || 'placeholder_key'
);

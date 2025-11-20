// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from "./componentes/Login/Login";
import Consola from "./componentes/Consola/Consola";
// import './App.css'

function App() {
  // Estado para almacenar la sesión del usuario
  const [session, setSession] = useState(null);

  useEffect(() => {
    // 1. Obtener la sesión actual al cargar la página
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Escuchar cambios en la autenticación (login, logout, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // 3. Limpiar el listener al desmontar el componente
    return () => subscription.unsubscribe();
  }, []);

  // Si no hay sesión, muestra el componente de Login
  if (!session) {
    return <Login />;
  } 
  // Si hay una sesión, muestra el componente de Consola
  else {
    return <Consola session={session} />;
  }
}

export default App;
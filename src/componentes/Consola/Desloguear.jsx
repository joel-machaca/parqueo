//frontend/src/componentes/Consola/Desloguear.jsx

// frontend/src/componentes/Desloguear/Desloguear.jsx

import React from 'react';
import { supabase } from '../../supabaseClient.js';
import styles from './Desloguear.module.css';

export default function Desloguear() {
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      alert("Has cerrado sesión correctamente.");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
      alert("Hubo un error al intentar cerrar sesión.");
    }
  };

  return (
    <button onClick={handleLogout} className={styles.botonDesloguear}>
      Cerrar Sesión
    </button>
  );
}
// frontend/src/componentes/Login/Login.jsx
import React, { useState } from 'react';
import { supabase } from '../../supabaseClient.js';
import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <main className={styles["login-container"]}>
      <div className={styles["login-card"]}>
        <h2 className={styles.title}>Iniciar Sesión</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form className={styles["login-form"]} onSubmit={handleSubmit}>
          <input
            className={styles["input-field"]}
            name="email"
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={styles["input-field"]}
            name="password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className={styles["login-button"]} type="submit" disabled={loading}>
            {loading ? 'Cargando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  );
}
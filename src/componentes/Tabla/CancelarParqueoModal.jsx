// frontend/src/componentes/Tabla/CancelarParqueoModal.jsx

import React, { useState } from 'react';
import styles from './CancelarParqueoModal.module.css';

export default function CancelarParqueoModal({ registro, onConfirmar, onClose }) {
  const [observaciones, setObservaciones] = useState(''); // <-- Nuevo estado para las observaciones

  if (!registro) return null;

  const handleConfirmar = () => {
    // Llama a la función de confirmación pasando el ID y las observaciones
    onConfirmar(registro.id, observaciones);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Cancelar Parqueo</h2>
        <p>¿Estás seguro de que quieres cancelar el parqueo en el **{registro.espacio_nombre}**?</p>
        
        {/* <-- Nuevo campo para las observaciones */}
        <div className={styles.observacionesContainer}>
          <label htmlFor="observaciones">Motivo de la cancelación:</label>
          <textarea
            id="observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            rows="4"
            className={styles.observacionesTextarea}
          />
        </div>
        {/* --> Fin del nuevo campo */}
        
        <div className={styles.modalButtons}>
          <button onClick={handleConfirmar}>Confirmar cancelación</button>
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
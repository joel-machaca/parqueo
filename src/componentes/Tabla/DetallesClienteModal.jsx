// DetallesClienteModal.jsx
import React from 'react';
import styles from './DetallesClienteModal.module.css';

export default function DetallesClienteModal({ cliente, onClose }) {
  if (!cliente) {
    return null;
  }

  return (
    <div className={styles.modalFondo} onClick={onClose}>
      <div className={styles.modalContenido} onClick={(e) => e.stopPropagation()}>
        <button className={styles.cerrarBoton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.titulo}>Detalles del Cliente</h2>
        <div className={styles.detalleItem}>
          <strong>DNI:</strong> {cliente.dni}
        </div>
        <div className={styles.detalleItem}>
          <strong>Nombre:</strong> {cliente.nombre}
        </div>
        <div className={styles.detalleItem}>
          <strong>Teléfono:</strong> {cliente.telefono}
        </div>
        <div className={styles.detalleItem}>
          <strong>Correo:</strong> {cliente.correo}
        </div>
        <div className={styles.detalleItem}>
          <strong>Categoría:</strong> {cliente.categoria}
        </div>
      </div>
    </div>
  );
}
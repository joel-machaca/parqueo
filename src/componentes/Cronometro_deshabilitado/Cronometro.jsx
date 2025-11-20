// frontend/src/componentes/Tabla/TablaFila.jsx

import React from 'react';
import styles from './Tabla.module.css';
import { supabase } from '../../supabaseClient';
import BoletoPDFBoton from './BoletoPDFBoton.jsx';
import Cronometro from './Cronometro.jsx'; // <-- Asegúrate de importar el nuevo componente

// El componente Cronometro NO debe estar definido aquí

export default function TablaFila({ registro, onOpenModal, onToggleVisible }) {
  const {
    id,
    espacio_nombre,
    placa,
    tiempo_inicio,
    tiempo_fin, // <-- Asegúrate de que `tiempo_fin` está aquí
    tarifa,
    pago,
    cliente_nombre,
    cliente_dni,
    cliente_telefono,
    cliente_correo,
    cliente_categoria
  } = registro;

  const cliente = {
    dni: cliente_dni,
    nombre: cliente_nombre,
    telefono: cliente_telefono,
    correo: cliente_correo,
    categoria: cliente_categoria
  };

  const horaInicio = new Date(tiempo_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const horaFin = tiempo_fin ? new Date(tiempo_fin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '---';

  return (
    <div className={styles.tablaFila}>
      <div className={styles.celda}>{espacio_nombre}</div>
      <div className={styles.celda}>
        <button className={styles.botonCheck} onClick={() => onToggleVisible(registro)}>
          ✅
        </button>
      </div>
      <div className={styles.celda}>
        {/* Pasa ambas props al componente Cronometro */}
        <Cronometro tiempoInicio={tiempo_inicio} tiempoFin={tiempo_fin} />
      </div>
      <div className={styles.celda}>S/ {tarifa}</div>
      <div className={styles.celda}>{horaInicio}</div>
      <div className={styles.celda}>{horaFin}</div>
      <div className={styles.celda}>{placa}</div>
      <div className={styles.celda}>
        <button
          onClick={() => onOpenModal(cliente)}
          className={styles.botonCliente}
        >
          {cliente.dni}
        </button>
      </div>
      <div className={styles.celda}>{cliente.nombre}</div>
      <div className={styles.celda}>
        <BoletoPDFBoton registro={registro} />
      </div>
      <div className={styles.celda}>S/ {pago ? pago : '0.00'}</div>
    </div>
  );
}
// frontend/src/componentes/Tabla/TablaFila.jsx

import React from 'react';
import styles from './Tabla.module.css';
import BoletoPDFBoton from './BoletoPDFBoton.jsx';
import Cronometro from './Cronometro.jsx';
import { supabase } from '../../supabaseClient';

export default function TablaFila({ registro, onOpenModal, onToggleVisible, onCancelarClick }) { // <-- Recibe la nueva prop
  const {
    id,
    espacio_nombre,
    placa,
    tiempo_inicio,
    tiempo_fin,
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
      <div className={styles.celda}>
        <span 
          onClick={() => onCancelarClick(registro)} // <-- Llama a la nueva función
          className={styles.linkEspacio} // <-- Puedes crear un estilo para este span en tu CSS
        >
          {espacio_nombre}
        </span>
      </div>
      <div className={styles.celda}>
        <button className={styles.botonCheck} onClick={() => onToggleVisible(registro)}>
          ✅
        </button>
      </div>
      <div className={styles.celda}>
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
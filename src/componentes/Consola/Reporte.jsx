// frontend/src/componentes/Consola/Reporte.jsx

import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import styles from './Reporte.module.css';

export default function Reporte() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const handleAbrirModal = () => {
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
  };

  const formatearDatosParaCSV = (data) => {
    if (!data || data.length === 0) {
      return '';
    }

    const headers = Object.keys(data[0]);
    const csvHeader = headers.join(';') + '\n';
    
    const csvBody = data.map(row => {
      return headers.map(header => {
        let value = row[header];
        if (value === null || value === undefined) {
          value = '';
        } else if (typeof value === 'string' && value.includes(',')) {
          value = `"${value}"`; // Envuelve el valor en comillas si contiene comas
        }
        return value;
      }).join(';');
    }).join('\n');

    return csvHeader + csvBody;
  };

  const descargarCSV = (csvData) => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'registros_parqueo.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportarReporte = async () => {
    if (!fechaInicio || !fechaFin) {
      alert("Por favor, selecciona una fecha de inicio y una de fin.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('registros_parqueo')
        .select('*')
        .gte('tiempo_inicio', fechaInicio)
        .lte('tiempo_fin', fechaFin);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const csv = formatearDatosParaCSV(data);
        descargarCSV(csv);
        alert('Reporte CSV exportado con éxito.');
      } else {
        alert('No se encontraron registros en el rango de fechas seleccionado.');
      }

    } catch (error) {
      console.error('Error al exportar el reporte:', error.message);
      alert('Hubo un error al exportar el reporte.');
    } finally {
      handleCerrarModal();
    }
  };

  return (
    <>
      <button onClick={handleAbrirModal} className={styles.botonReporte}>
        Generar Reporte
      </button>

      {modalAbierto && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Generar Reporte CSV</h2>
            <div className={styles.formGroup}>
              <label htmlFor="fechaInicio">Fecha de Inicio:</label>
              <input
                type="date"
                id="fechaInicio"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="fechaFin">Fecha de Fin:</label>
              <input
                type="date"
                id="fechaFin"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            <div className={styles.modalButtons}>
              <button onClick={handleExportarReporte} className={styles.botonExportar}>
                Exportar CSV
              </button>
              <button onClick={handleCerrarModal} className={styles.botonCerrar}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
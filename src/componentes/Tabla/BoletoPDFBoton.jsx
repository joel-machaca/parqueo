// frontend/src/componentes/Tabla/BoletoPDFBoton.jsx

import React from 'react';
import jsPDF from 'jspdf';
import styles from './Tabla.module.css';

export default function BoletoPDFBoton({ registro }) {
  
  const generarPDF = () => {
    const doc = new jsPDF();
    const padding = 15;
    let yPosition = 20;

    // Título
    doc.setFontSize(20);
    doc.text('Boleto de Parqueo', padding, yPosition);
    yPosition += 15;

    // Línea separadora
    doc.setDrawColor(0);
    doc.line(padding, yPosition, 210 - padding, yPosition);
    yPosition += 10;

    // Detalles del cliente
    doc.setFontSize(12);
    doc.text(`Cliente: ${registro.cliente_nombre}`, padding, yPosition);
    yPosition += 8;
    doc.text(`DNI: ${registro.cliente_dni}`, padding, yPosition);
    yPosition += 8;
    doc.text(`Placa: ${registro.placa}`, padding, yPosition);
    yPosition += 15;

    // Detalles del parqueo
    doc.text(`Espacio: ${registro.espacio_nombre}`, padding, yPosition);
    yPosition += 8;
    doc.text(`Tarifa: S/ ${registro.tarifa}`, padding, yPosition);
    yPosition += 8;
    doc.text(`Inicio: ${new Date(registro.tiempo_inicio).toLocaleString()}`, padding, yPosition);
    yPosition += 8;
    
    // Mostrar la fecha de fin y el pago solo si existen
    if (registro.tiempo_fin) {
        doc.text(`Fin: ${new Date(registro.tiempo_fin).toLocaleString()}`, padding, yPosition);
        yPosition += 8;
    } else {
        doc.text(`Fin: En curso`, padding, yPosition);
        yPosition += 8;
    }
    yPosition += 15;

    // Mostrar el pago total solo si existe
    doc.setFontSize(16);
    if (registro.pago) {
        doc.text(`Total a Pagar: S/ ${registro.pago}`, padding, yPosition);
    } else {
        doc.text(`Total a Pagar: Por calcular`, padding, yPosition);
    }

    // Guardar el archivo PDF
    doc.save(`boleto_parqueo_${registro.placa}.pdf`);
  };

  return (
      <button 
      onClick={generarPDF} 
      className={styles.botonBoleta}
      style={{
        color: '#f0f4f9ff',  // Un color azul brillante
        fontSize: '20px', // Un tamaño de fuente más grande
        border: 'none',   // Quita el borde si lo tiene
        background: 'transparent', // Asegura que el fondo sea transparente
        cursor: 'pointer'
      }}
    >
      📄
    </button>
  );
}

///home/zero/Descargas/react2/frontend/src/assets/pdf.svg
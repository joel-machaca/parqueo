// frontend/src/componentes/Tabla/Cronometro.jsx

import React, { useState, useEffect } from 'react';

export default function Cronometro({ tiempoInicio, tiempoFin }) {
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState('00:00:00');

  useEffect(() => {
    // Si tiempoFin existe, calculamos el tiempo total de una sola vez
    if (tiempoFin) {
      const inicio = new Date(tiempoInicio);
      const fin = new Date(tiempoFin);
      const diferenciaMs = fin - inicio;
      
      const horas = Math.floor(diferenciaMs / (1000 * 60 * 60));
      const minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferenciaMs % (1000 * 60)) / 1000);
      
      setTiempoTranscurrido(
        `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
      );
      return; // Detenemos el useEffect aquí para que no continúe contando
    }

    // Si no hay tiempoFin, el cronómetro sigue contando
    const intervalo = setInterval(() => {
      const ahora = new Date();
      const inicio = new Date(tiempoInicio);
      const diferenciaMs = ahora - inicio;
      
      const horas = Math.floor(diferenciaMs / (1000 * 60 * 60));
      const minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferenciaMs % (1000 * 60)) / 1000);

      setTiempoTranscurrido(
        `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(intervalo);
  }, [tiempoInicio, tiempoFin]); // El efecto se ejecuta cuando `tiempoFin` cambia

  return <span>{tiempoTranscurrido}</span>;
}
// frontend/src/componentes/MapaEstacionamiento/MapaEstacionamiento.jsx

import { useState, useEffect } from "react";
import { supabase } from '../../supabaseClient';
import styles from "./MapaEstacionamiento.module.css";
import Espacio from "./Espacio.jsx";
import Auto from "../Auto/Auto.jsx";
import Detener from "../Detener/Detener.jsx";

// El componente debe recibir la nueva prop `dataUpdated`
export default function MapaEstacionamiento({ onDataUpdate, dataUpdated }) {
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(true);

  // El `useEffect` debe escuchar los cambios en `dataUpdated`
  useEffect(() => {
    fetchEspaciosConRegistros();
  }, [dataUpdated]);

  async function fetchEspaciosConRegistros() {
    try {
      setLoading(true);
      const { data: todosLosEspacios, error: errorEspacios } = await supabase
        .from('espacios_parqueo')
        .select('id, nombre');
      if (errorEspacios) throw errorEspacios;

      const { data: registrosActivos, error: errorRegistros } = await supabase
        .from('vista_registros_parqueo')
        .select('*')
        .is('tiempo_fin', null);
      if (errorRegistros) throw errorRegistros;

      const espaciosCombinados = todosLosEspacios.map(espacio => {
        const registro = registrosActivos.find(reg => reg.espacio_nombre === espacio.nombre);
        return {
          ...espacio,
          registro: registro || null
        };
      });

      setEspacios(espaciosCombinados);
    } catch (error) {
      console.error("Error al obtener los datos:", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function detenerParqueo(idRegistro) {
    if (!idRegistro) return;
    
    try {
      const { data: registro, error: errorFetch } = await supabase
        .from('vista_registros_parqueo')
        .select('tiempo_inicio, tarifa')
        .eq('id', idRegistro)
        .single();
      if (errorFetch) throw errorFetch;

      const tiempoFin = new Date();
      const tiempoInicio = new Date(registro.tiempo_inicio);
      const diferenciaHoras = (tiempoFin - tiempoInicio) / (1000 * 60 * 60);
      const pagoFinal = parseFloat(diferenciaHoras * registro.tarifa).toFixed(2);
      
      const { error: errorUpdate } = await supabase
        .from('registros_parqueo')
        .update({ 
          tiempo_fin: tiempoFin.toISOString(),
          pago: pagoFinal
        })
        .eq('id', idRegistro);
      if (errorUpdate) throw errorUpdate;

      // Notificamos al componente padre (Consola)
      onDataUpdate(); 
      // Después de notificar, actualizamos el estado local
      await fetchEspaciosConRegistros();

    } catch (error) {
      console.error("Error al detener el parqueo:", error.message);
    }
  }

  if (loading) {
    return <div className={styles.loading}>Cargando mapa...</div>;
  }

  return (
    <main className={styles.mapaParqueo}>
      <div className={styles.izquierda}>
        {espacios.slice(0, 5).map(espacio => (
          <Espacio key={espacio.id} espacio={espacio} onDetenerParqueo={detenerParqueo} />
        ))}
      </div>
      <div className={styles.centro}></div>
      <div className={styles.derecha}>
        {espacios.slice(5, 10).map(espacio => (
          <Espacio key={espacio.id} espacio={espacio} onDetenerParqueo={detenerParqueo} />
        ))}
      </div>
    </main>
  );
}
// frontend/src/componentes/Tabla/Tabla.jsx

import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import TablaFila from './TablaFila';
import DetallesClienteModal from './DetallesClienteModal';
import CancelarParqueoModal from './CancelarParqueoModal.jsx';
import styles from './Tabla.module.css';

export default function Tabla({ dataUpdated }) {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDetallesModalOpen, setIsDetallesModalOpen] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [isCancelarModalOpen, setIsCancelarModalOpen] = useState(false);
  const [registroACancelar, setRegistroACancelar] = useState(null);

  useEffect(() => {
    fetchRegistrosParqueo();
  }, [dataUpdated]);

  async function fetchRegistrosParqueo() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vista_registros_parqueo')
        .select('*')
        .eq('estado', 'confirmado')
        .eq('visible', true);
      
      if (error) throw error;
      setRegistros(data);
    } catch (error) {
      console.error('Error al obtener los registros:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleVisible = async (registro) => {
    // ... (este código no cambia) ...
    if (!registro.tiempo_fin) {
      window.alert("No se puede ocultar este registro porque el parqueo aún no ha finalizado.");
      return;
    }

    const confirmacion = window.confirm("¿Deseas marcar este parqueo como finalizado y ocultarlo de la tabla?");
    if (confirmacion) {
      try {
        const { error } = await supabase
          .from('registros_parqueo')
          .update({ visible: false })
          .eq('id', registro.id);

        if (error) throw error;
        await fetchRegistrosParqueo();
      } catch (error) {
        console.error("Error al actualizar el registro:", error.message);
      }
    }
  };

  const handleOpenDetallesModal = (cliente) => {
    setClienteSeleccionado(cliente);
    setIsDetallesModalOpen(true);
  };

  const handleCloseDetallesModal = () => {
    setIsDetallesModalOpen(false);
    setClienteSeleccionado(null);
  };
  
  const handleAbrirCancelarModal = (registro) => {
    setRegistroACancelar(registro);
    setIsCancelarModalOpen(true);
  };

  const handleCerrarCancelarModal = () => {
    setIsCancelarModalOpen(false);
    setRegistroACancelar(null);
  };

  // La función ahora recibe las observaciones como segundo argumento
  const handleConfirmarCancelacion = async (idRegistro, observaciones) => {
    try {
      const { error } = await supabase
        .from('registros_parqueo')
        .update({
          estado: 'cancelado',
          tiempo_fin: new Date().toISOString(),
          visible: false,
          observaciones: observaciones // <-- Actualiza la columna de observaciones
        })
        .eq('id', idRegistro);

      if (error) throw error;
      
      handleCerrarCancelarModal();
      await fetchRegistrosParqueo();
      
    } catch (error) {
      console.error("Error al cancelar el parqueo:", error.message);
    }
  };
  
  if (loading) {
    return <div className={styles.loading}>Cargando registros...</div>;
  }
  
  if (registros.length === 0) {
    return <div className={styles.noData}>No hay espacios de parqueo en uso.</div>;
  }

  return (
    <div className={styles.tablaContainer}>
      {/* ... (el resto del JSX no cambia) ... */}
      <div className={styles.tablaEncabezado}>
        <div className={styles.encabezadoItem}>ESPACIO</div>
        <div className={styles.encabezadoItem}>LIMPIAR</div>
        <div className={styles.encabezadoItem}>TIEMPO</div>
        <div className={styles.encabezadoItem}>PAGAR</div>
        <div className={styles.encabezadoItem}>INICIO</div>
        <div className={styles.encabezadoItem}>FIN</div>
        <div className={styles.encabezadoItem}>PLACA</div>
        <div className={styles.encabezadoItem}>DNI</div>
        <div className={styles.encabezadoItem}>NOMBRE</div>
        <div className={styles.encabezadoItem}>BOLETA</div>
      </div>
      <div className={styles.tablaCuerpo}>
        {registros.map((registro) => (
          <TablaFila 
            key={registro.id} 
            registro={registro} 
            onOpenModal={handleOpenDetallesModal} 
            onToggleVisible={handleToggleVisible}
            onCancelarClick={handleAbrirCancelarModal}
          />
        ))}
      </div>

      {isDetallesModalOpen && clienteSeleccionado && (
        <DetallesClienteModal 
          cliente={clienteSeleccionado}
          onClose={handleCloseDetallesModal} 
        />
      )}
      
      {isCancelarModalOpen && registroACancelar && (
        <CancelarParqueoModal
          registro={registroACancelar}
          onConfirmar={handleConfirmarCancelacion} // <-- Pasamos la función actualizada
          onClose={handleCerrarCancelarModal}
        />
      )}
    </div>
  );
}
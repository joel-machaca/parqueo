// frontend/src/componentes/Consola/RegistroParqueo.jsx

import React, { useState, useEffect } from 'react';
import styles from './RegistroParqueo.module.css';
import { supabase } from '../../supabaseClient';

export default function RegistroParqueo({ onDataUpdate }) { // <-- Recibe la nueva prop
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    categoria: 'estandar',
    telefono: '',
    correo: '',
    placa: '',
    espacio_id: '',
    tarifa: 5.0,
    observaciones: '',
    isEditing: false,
  });
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState(null);
  const [clientExists, setClientExists] = useState(false);

  // Cargar espacios disponibles (excluyendo los ocupados)
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        // Obtener todos los espacios de espacios_parqueo
        const { data: allSlots, error: slotsError } = await supabase
          .from('espacios_parqueo')
          .select('id, nombre');
        if (slotsError) throw slotsError;

        // Obtener espacios ocupados (con tiempo_inicio pero sin tiempo_fin)
        const { data: occupiedSlots, error: occupiedError } = await supabase
          .from('registros_parqueo')
          .select('espacio_id')
          .eq('estado', 'confirmado')
          .is('tiempo_fin', null);
        if (occupiedError) throw occupiedError;

        // Filtrar espacios disponibles
        const occupiedIds = occupiedSlots.map(slot => slot.espacio_id);
        const availableSlots = allSlots.filter(slot => !occupiedIds.includes(slot.id));

        setSlots(availableSlots);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchSlots();
  }, [isModalOpen]); // Agregamos isModalOpen como dependencia para que se actualice al abrir

  // Cargar datos del cliente al cambiar el DNI
  useEffect(() => {
    const fetchClient = async () => {
      if (formData.dni) {
        const { data, error } = await supabase
          .from('clientes')
          .select('*')
          .eq('dni', formData.dni)
          .single();
        if (data && !error) {
          setFormData((prev) => ({
            ...prev,
            nombre: data.nombre || '',
            categoria: data.categoria || 'estandar',
            telefono: data.telefono || '',
            correo: data.correo || '',
          }));
          setClientExists(true);
        } else if (!error) {
          setFormData((prev) => ({
            ...prev,
            nombre: '',
            categoria: 'estandar',
            telefono: '',
            correo: '',
          }));
          setClientExists(false);
        }
      }
    };
    fetchClient();
  }, [formData.dni]);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Alternar modo de edición
  const toggleEdit = () => {
    setFormData((prev) => ({ ...prev, isEditing: !prev.isEditing }));
  };

  // Guardar o actualizar cliente
  const saveClient = async () => {
    try {
      if (clientExists) {
        const { error } = await supabase
          .from('clientes')
          .update({
            nombre: formData.nombre,
            categoria: formData.categoria,
            telefono: formData.telefono || null,
            correo: formData.correo || null,
          })
          .eq('dni', formData.dni);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('clientes')
          .insert({
            dni: formData.dni,
            nombre: formData.nombre,
            categoria: formData.categoria,
            telefono: formData.telefono || null,
            correo: formData.correo || null,
          });
        if (error) throw error;
        setClientExists(true);
      }
      setFormData((prev) => ({ ...prev, isEditing: false }));
      alert('Datos del cliente guardados con éxito!');
    } catch (error) {
      setError(error.message);
    }
  };

  // Registrar parqueo
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Asegurarse de que el cliente esté guardado antes de registrar el parqueo
      await saveClient();

      // Crear registro de parqueo
      const { data, error } = await supabase
        .from('registros_parqueo')
        .insert([
          {
            espacio_id: parseInt(formData.espacio_id),
            dni_cliente: formData.dni,
            placa: formData.placa,
            tiempo_inicio: new Date().toISOString(),
            estado: 'confirmado',
            tarifa: parseFloat(formData.tarifa),
            observaciones: formData.observaciones || null,
          },
        ])
        .select();
      if (error) throw error;

      setIsModalOpen(false);
      setFormData({
        dni: '',
        nombre: '',
        categoria: 'estandar',
        telefono: '',
        correo: '',
        placa: '',
        espacio_id: '',
        tarifa: 5.0,
        observaciones: '',
        isEditing: false,
      });
      setClientExists(false);
      alert('Parqueo registrado con éxito!');

      // Notificar al componente padre que los datos han cambiado
      if (onDataUpdate) { 
        onDataUpdate(); 
      }
      
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className={styles.botonRegistro} // <-- Aplicamos la clase del propio componente
      >
        Registrar Parqueo
      </button>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Registrar Nuevo Parqueo</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
              {/* Sección de datos del cliente */}
              <div className={styles.clientSection}>
                <h3>Datos del Cliente</h3>
                <label>
                  DNI:
                  <input
                    type="text"
                    name="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.isEditing && clientExists}
                  />
                </label>
                <label>
                  Nombre:
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.isEditing && clientExists}
                  />
                </label>
                <label>
                  Categoría:
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    disabled={!formData.isEditing && clientExists}
                  >
                    <option value="estandar">Estandar</option>
                    <option value="vip">VIP</option>
                    <option value="observacion">Observación</option>
                  </select>
                </label>
                <label>
                  Teléfono:
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    disabled={!formData.isEditing && clientExists}
                  />
                </label>
                <label>
                  Correo:
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    disabled={!formData.isEditing && clientExists}
                  />
                </label>
                <button
                  type="button"
                  onClick={toggleEdit}
                  className={styles.editButton}
                  disabled={clientExists && !formData.isEditing && formData.dni === ''}
                >
                  {formData.isEditing ? 'Cancelar Edición' : 'Editar Datos'}
                </button>
                {formData.isEditing && (
                  <button type="button" onClick={saveClient} className={styles.saveButton}>
                    Guardar Cliente
                  </button>
                )}
              </div>

              {/* Sección de datos del parqueo */}
              <div className={styles.parkingSection}>
                <h3>Datos del Parqueo</h3>
                <label>
                  Placa:
                  <input
                    type="text"
                    name="placa"
                    value={formData.placa}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Espacio:
                  <select
                    name="espacio_id"
                    value={formData.espacio_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecciona un espacio</option>
                    {slots.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.nombre}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Tarifa por hora (PEN):
                  <input
                    type="number"
                    name="tarifa"
                    value={formData.tarifa}
                    onChange={handleInputChange}
                    step="0.1"
                    required
                  />
                </label>
                <label>
                  Observaciones:
                  <input
                    type="text"
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleInputChange}
                  />
                </label>
              </div>

              <div className={styles.modalButtons}>
                <button type="submit" disabled={!clientExists || formData.isEditing}>
                  Guardar Parqueo
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
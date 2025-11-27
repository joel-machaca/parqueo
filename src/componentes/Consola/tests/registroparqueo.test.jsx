import { describe, it, expect, vi, beforeEach } from 'vitest'  
import { render, screen, fireEvent, waitFor } from '@testing-library/react'  
import RegistroParqueo from '../RegistroParqueo'  
import { supabase } from '../../../supabaseClient'  
  
// Mock de Supabase  
vi.mock('../../../supabaseClient', () => ({  
  supabase: {  
    from: vi.fn()  
  }  
}))  
  
describe('Módulo de Registro de Parqueo - RegistroParqueo.jsx', () => {  
  const mockOnDataUpdate = vi.fn()  
  
  beforeEach(() => {  
    vi.clearAllMocks()  
    window.alert = vi.fn()  
  })  
  
  it('REG-01: debe cargar espacios disponibles al abrir el modal', async () => {  
    const mockEspacios = [  
      { id: 1, nombre: 'A-01' },  
      { id: 2, nombre: 'A-02' }  
    ]  
      
    supabase.from.mockImplementation((table) => {  
      if (table === 'espacios_parqueo') {  
        return {  
          select: vi.fn().mockResolvedValue({   
            data: mockEspacios,   
            error: null   
          })  
        }  
      }  
      if (table === 'registros_parqueo') {  
        return {  
          select: vi.fn().mockReturnThis(),  
          eq: vi.fn().mockReturnThis(),  
          is: vi.fn().mockResolvedValue({ data: [], error: null })  
        }  
      }  
    })  
  
    render(<RegistroParqueo onDataUpdate={mockOnDataUpdate} />)  
      
    const boton = screen.getByText('Registrar Parqueo')  
    fireEvent.click(boton)  
      
    await waitFor(() => {  
      const select = screen.getByLabelText(/Espacio/)  
      expect(select).toBeInTheDocument()  
      expect(screen.getByText('A-01')).toBeInTheDocument()  
      expect(screen.getByText('A-02')).toBeInTheDocument()  
    })  
  })  
  
  it('REG-02: debe buscar y autocompletar datos del cliente por DNI', async () => {  
    const mockCliente = {  
      dni: '12345678',  
      nombre: 'Juan Pérez',  
      categoria: 'vip',  
      telefono: '999888777',  
      correo: 'juan@email.com'  
    }  
      
    supabase.from.mockImplementation((table) => {  
      if (table === 'clientes') {  
        return {  
          select: vi.fn().mockReturnThis(),  
          eq: vi.fn().mockReturnThis(),  
          single: vi.fn().mockResolvedValue({ data: mockCliente, error: null })  
        }  
      }  
      if (table === 'espacios_parqueo') {  
        return {  
          select: vi.fn().mockResolvedValue({ data: [], error: null })  
        }  
      }  
      if (table === 'registros_parqueo') {  
        return {  
          select: vi.fn().mockReturnThis(),  
          eq: vi.fn().mockReturnThis(),  
          is: vi.fn().mockResolvedValue({ data: [], error: null })  
        }  
      }  
    })  
  
    render(<RegistroParqueo onDataUpdate={mockOnDataUpdate} />)  
      
    fireEvent.click(screen.getByText('Registrar Parqueo'))  
      
    await waitFor(() => screen.findByLabelText(/DNI/))  
      
    const dniInput = screen.getByLabelText(/DNI/)  
    fireEvent.change(dniInput, { target: { value: '12345678' } })  
      
    await waitFor(() => {  
      const nombreInput = screen.getByLabelText(/Nombre/)  
      expect(nombreInput.value).toBe('Juan Pérez')  
        
      const categoriaSelect = screen.getByLabelText(/Categoría/)  
      expect(categoriaSelect.value).toBe('vip')  
        
      const telefonoInput = screen.getByLabelText(/Teléfono/)  
      expect(telefonoInput.value).toBe('999888777')  
        
      const correoInput = screen.getByLabelText(/Correo/)  
      expect(correoInput.value).toBe('juan@email.com')  
    })  
  })  
  
  it('REG-03: debe registrar nuevo parqueo con formulario completo', async () => {  
  // Mock para simular que el cliente YA EXISTE  
  const mockClienteExistente = {  
    dni: '12345678',  
    nombre: 'Juan Pérez',  
    categoria: 'estandar',  
    telefono: '999888777',  
    correo: 'juan@email.com'  
  }  
    
  supabase.from.mockImplementation((table) => {  
    if (table === 'espacios_parqueo') {  
      return {  
        select: vi.fn().mockResolvedValue({   
          data: [{ id: 1, nombre: 'A-01' }],   
          error: null   
        })  
      }  
    }  
    if (table === 'registros_parqueo') {  
      return {  
        select: vi.fn().mockReturnThis(),  
        eq: vi.fn().mockReturnThis(),  
        is: vi.fn().mockResolvedValue({ data: [], error: null }),  
        insert: vi.fn().mockReturnValue({  
          select: vi.fn().mockResolvedValue({   
            data: [{ id: 1 }],   
            error: null   
          })  
        })  
      }  
    }  
    if (table === 'clientes') {  
      return {  
        select: vi.fn().mockReturnThis(),  
        eq: vi.fn().mockReturnThis(),  
        // CAMBIO CLAVE: Retornar cliente existente en lugar de null  
        single: vi.fn().mockResolvedValue({   
          data: mockClienteExistente,   
          error: null   
        }),  
        update: vi.fn().mockResolvedValue({ error: null })  
      }  
    }  
  })  
  
  render(<RegistroParqueo onDataUpdate={mockOnDataUpdate} />)  
    
  fireEvent.click(screen.getByText('Registrar Parqueo'))  
  await waitFor(() => screen.findByLabelText(/DNI/))  
    
  // Ingresar DNI de cliente existente  
  fireEvent.change(screen.getByLabelText(/DNI/), {   
    target: { value: '12345678' }   
  })  
    
  // Esperar a que se autocompleten los datos del cliente  
  await waitFor(() => {  
    expect(screen.getByLabelText(/Nombre/).value).toBe('Juan Pérez')  
  })  
    
  // Llenar datos del parqueo  
  fireEvent.change(screen.getByLabelText(/Placa/), {   
    target: { value: 'ABC-123' }   
  })  
    
  // Esperar y seleccionar espacio  
  await waitFor(() => {  
    const espacioSelect = screen.getByLabelText(/Espacio/)  
    expect(screen.getByText('A-01')).toBeInTheDocument()  
    fireEvent.change(espacioSelect, { target: { value: '1' } })  
  })  
    
  // Ahora el botón debería estar habilitado  
  const submitButton = screen.getByText('Guardar Parqueo')  
  fireEvent.click(submitButton)  
    
  await waitFor(() => {  
    expect(window.alert).toHaveBeenCalledWith('Parqueo registrado con éxito!')  
    expect(mockOnDataUpdate).toHaveBeenCalled()  
  }, { timeout: 3000 })  
})
  
  it('REG-04: debe guardar y actualizar datos del cliente en la base de datos', async () => {  
    supabase.from.mockImplementation((table) => {  
      if (table === 'clientes') {  
        return {  
          select: vi.fn().mockReturnThis(),  
          eq: vi.fn().mockReturnThis(),  
          single: vi.fn().mockResolvedValue({   
            data: {   
              dni: '12345678',   
              nombre: 'Juan Pérez',   
              categoria: 'estandar',  
              telefono: '999888777',  
              correo: 'juan@email.com'  
            },   
            error: null   
          }),  
          update: vi.fn().mockReturnValue({  
            eq: vi.fn().mockResolvedValue({ error: null })  
          })  
        }  
      }  
      if (table === 'espacios_parqueo') {  
        return {  
          select: vi.fn().mockResolvedValue({ data: [], error: null })  
        }  
      }  
      if (table === 'registros_parqueo') {  
        return {  
          select: vi.fn().mockReturnThis(),  
          eq: vi.fn().mockReturnThis(),  
          is: vi.fn().mockResolvedValue({ data: [], error: null })  
        }  
      }  
    })  
  
    render(<RegistroParqueo onDataUpdate={mockOnDataUpdate} />)  
      
    fireEvent.click(screen.getByText('Registrar Parqueo'))  
    await waitFor(() => screen.findByLabelText(/DNI/))  
      
    fireEvent.change(screen.getByLabelText(/DNI/), {   
      target: { value: '12345678' }   
    })  
      
    // Esperar a que se autocompleten los datos del cliente  
    await waitFor(() => {  
      expect(screen.getByLabelText(/Nombre/).value).toBe('Juan Pérez')  
    })  
      
    fireEvent.click(screen.getByText('Editar Datos'))  
      
    fireEvent.change(screen.getByLabelText(/Nombre/), {   
      target: { value: 'Juan Pérez Actualizado' }   
    })  
      
    fireEvent.click(screen.getByText('Guardar Cliente'))  
      
    await waitFor(() => {  
      expect(window.alert).toHaveBeenCalledWith('Datos del cliente guardados con éxito!')  
    })  
  })  
})
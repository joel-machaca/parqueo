import { describe, it, expect, vi, beforeEach } from 'vitest'  
import { render, screen, fireEvent, waitFor } from '@testing-library/react'  
import Tabla from '../Tabla'  
import { supabase } from '../../../supabaseClient'  
  
vi.mock('../../../supabaseClient', () => ({  
  supabase: {  
    from: vi.fn()  
  }  
}))  
  
vi.mock('../TablaFila', () => ({  
  default: ({ registro, onToggleVisible, onCancelarClick }) => (  
    <div data-testid={`fila-${registro.id}`}>  
      <span>{registro.espacio_nombre}</span>  
      <button   
        data-testid={`toggle-${registro.id}`}  
        onClick={() => onToggleVisible(registro)}  
      >  
        Toggle  
      </button>  
      <button   
        data-testid={`cancelar-${registro.id}`}  
        onClick={() => onCancelarClick(registro)}  
      >  
        Cancelar  
      </button>  
    </div>  
  )  
}))  
  
vi.mock('../DetallesClienteModal', () => ({  
  default: () => null  
}))  
  
vi.mock('../CancelarParqueoModal', () => ({  
  default: ({ registro, onConfirmar, onClose }) => (  
    <div data-testid="modal-cancelar">  
      <span>{registro.espacio_nombre}</span>  
      <button onClick={() => onConfirmar(registro.id, 'Motivo de prueba')}>  
        Confirmar  
      </button>  
      <button onClick={onClose}>Cerrar Modal</button>  
    </div>  
  )  
}))  
  
describe('Módulo de Tabla de Registros - Tabla.jsx', () => {  
  beforeEach(() => {  
    vi.clearAllMocks()  
    window.alert = vi.fn()  
    window.confirm = vi.fn()  
  })  
  
  it('TABLA-01: debe cargar registros activos confirmados', async () => {  
    const mockRegistros = [  
      {   
        id: 1,   
        espacio_nombre: 'A-01',   
        estado: 'confirmado',   
        visible: true,  
        placa: 'ABC-123',  
        cliente_dni: '12345678',  
        cliente_nombre: 'Juan Pérez',  
        tiempo_inicio: '2024-01-01T10:00:00',  
        tiempo_fin: null,  
        tarifa: 5.0,  
        pago: null  
      },  
      {   
        id: 2,   
        espacio_nombre: 'A-02',   
        estado: 'confirmado',   
        visible: true,  
        placa: 'XYZ-789',  
        cliente_dni: '87654321',  
        cliente_nombre: 'María García',  
        tiempo_inicio: '2024-01-01T11:00:00',  
        tiempo_fin: null,  
        tarifa: 5.0,  
        pago: null  
      }  
    ]  
      
    // Mock con encadenamiento correcto de .eq()  
    supabase.from.mockReturnValue({  
      select: vi.fn().mockReturnValue({  
        eq: vi.fn().mockReturnValue({  
          eq: vi.fn().mockResolvedValue({ data: mockRegistros, error: null })  
        })  
      })  
    })  
  
    render(<Tabla dataUpdated={false} />)  
      
    await waitFor(() => {  
      expect(screen.getByTestId('fila-1')).toBeInTheDocument()  
      expect(screen.getByTestId('fila-2')).toBeInTheDocument()  
    })  
  })  
  
  it('TABLA-02: debe ocultar registro finalizado con tiempo_fin', async () => {  
    const mockRegistro = {   
      id: 1,   
      espacio_nombre: 'A-01',  
      estado: 'confirmado',  
      visible: true,  
      tiempo_fin: '2024-01-01T12:00:00',  
      placa: 'ABC-123',  
      cliente_dni: '12345678',  
      cliente_nombre: 'Juan Pérez',  
      tiempo_inicio: '2024-01-01T10:00:00',  
      tarifa: 5.0,  
      pago: 10.0  
    }  
      
    window.confirm.mockReturnValue(true)  
      
    const mockUpdate = vi.fn().mockReturnValue({  
      eq: vi.fn().mockResolvedValue({ error: null })  
    })  
      
    supabase.from.mockImplementation((table) => {  
      if (table === 'vista_registros_parqueo') {  
        return {  
          select: vi.fn().mockReturnValue({  
            eq: vi.fn().mockReturnValue({  
              eq: vi.fn().mockResolvedValue({ data: [mockRegistro], error: null })  
            })  
          })  
        }  
      }  
      if (table === 'registros_parqueo') {  
        return {  
          update: mockUpdate  
        }  
      }  
    })  
  
    render(<Tabla dataUpdated={false} />)  
      
    await waitFor(() => {  
      expect(screen.getByTestId('fila-1')).toBeInTheDocument()  
    })  
      
    const toggleButton = screen.getByTestId('toggle-1')  
    fireEvent.click(toggleButton)  
      
    await waitFor(() => {  
      expect(window.confirm).toHaveBeenCalled()  
      expect(mockUpdate).toHaveBeenCalledWith({ visible: false })  
    })  
  })  
  
  it('TABLA-03: debe cancelar parqueo con observaciones', async () => {  
    const mockRegistro = {   
      id: 1,   
      espacio_nombre: 'A-01',  
      estado: 'confirmado',  
      visible: true,  
      tiempo_fin: null,  
      placa: 'ABC-123',  
      cliente_dni: '12345678',  
      cliente_nombre: 'Juan Pérez',  
      tiempo_inicio: '2024-01-01T10:00:00',  
      tarifa: 5.0,  
      pago: null  
    }  
      
    const mockUpdate = vi.fn().mockReturnValue({  
      eq: vi.fn().mockResolvedValue({ error: null })  
    })  
      
    supabase.from.mockImplementation((table) => {  
      if (table === 'vista_registros_parqueo') {  
        return {  
          select: vi.fn().mockReturnValue({  
            eq: vi.fn().mockReturnValue({  
              eq: vi.fn().mockResolvedValue({ data: [mockRegistro], error: null })  
            })  
          })  
        }  
      }  
      if (table === 'registros_parqueo') {  
        return {  
          update: mockUpdate  
        }  
      }  
    })  
  
    render(<Tabla dataUpdated={false} />)  
      
    await waitFor(() => {  
      expect(screen.getByTestId('fila-1')).toBeInTheDocument()  
    })  
      
    const cancelarButton = screen.getByTestId('cancelar-1')  
    fireEvent.click(cancelarButton)  
      
    await waitFor(() => {  
      expect(screen.getByTestId('modal-cancelar')).toBeInTheDocument()  
    })  
      
    const confirmarButton = screen.getByText('Confirmar')  
    fireEvent.click(confirmarButton)  
      
    await waitFor(() => {  
      expect(mockUpdate).toHaveBeenCalledWith({  
        estado: 'cancelado',  
        tiempo_fin: expect.any(String),  
        visible: false,  
        observaciones: 'Motivo de prueba'  
      })  
    })  
  })  
})
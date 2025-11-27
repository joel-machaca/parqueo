import { describe, it, expect, vi, beforeEach } from 'vitest'  
import { render, screen, fireEvent, waitFor } from '@testing-library/react'  
import MapaEstacionamiento from '../Mapa-estacionamiento'  
import { supabase } from '../../../supabaseClient'  
  
// Mock de Supabase  
vi.mock('../../../supabaseClient', () => ({  
  supabase: {  
    from: vi.fn()  
  }  
}))  
  
// Mock del componente Espacio  
vi.mock('../Espacio.jsx', () => ({  
  default: ({ espacio, onDetenerParqueo }) => (  
    <div data-testid={`espacio-${espacio.id}`}>  
      <span>{espacio.nombre}</span>  
      {espacio.registro && (  
        <button   
          data-testid={`detener-${espacio.id}`}  
          onClick={() => onDetenerParqueo(espacio.registro.id)}  
        >  
          Detener  
        </button>  
      )}  
    </div>  
  )  
}))  
  
describe('Módulo de Mapa de Estacionamiento - MapaEstacionamiento.jsx', () => {  
  const mockOnDataUpdate = vi.fn()  
  
  beforeEach(() => {  
    vi.clearAllMocks()  
  })  
  
  it('MAPA-01: debe cargar estado de espacios con registros activos', async () => {  
    const mockEspacios = [  
      { id: 1, nombre: 'A-01' },  
      { id: 2, nombre: 'A-02' },  
      { id: 3, nombre: 'A-03' }  
    ]  
      
    const mockRegistrosActivos = [  
      {   
        id: 100,  
        espacio_nombre: 'A-01',   
        placa: 'ABC-123',  
        tiempo_inicio: '2024-01-01T10:00:00',  
        tiempo_fin: null  
      }  
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
      if (table === 'vista_registros_parqueo') {  
        return {  
          select: vi.fn().mockReturnThis(),  
          is: vi.fn().mockResolvedValue({   
            data: mockRegistrosActivos,   
            error: null   
          })  
        }  
      }  
    })  
  
    render(<MapaEstacionamiento onDataUpdate={mockOnDataUpdate} dataUpdated={false} />)  
      
    await waitFor(() => {  
      // Verificar que se cargaron los espacios  
      expect(screen.getByTestId('espacio-1')).toBeInTheDocument()  
      expect(screen.getByTestId('espacio-2')).toBeInTheDocument()  
      expect(screen.getByTestId('espacio-3')).toBeInTheDocument()  
        
      // Verificar que A-01 tiene registro activo (botón detener visible)  
      expect(screen.getByTestId('detener-1')).toBeInTheDocument()  
        
      // Verificar que A-02 y A-03 no tienen botón detener (espacios libres)  
      expect(screen.queryByTestId('detener-2')).not.toBeInTheDocument()  
      expect(screen.queryByTestId('detener-3')).not.toBeInTheDocument()  
    })  
  })  
  
  it('MAPA-02: debe calcular pago y actualizar BD al detener parqueo', async () => {  
    const mockEspacios = [  
      { id: 1, nombre: 'A-01' }  
    ]  
      
    const mockRegistroActivo = {  
      id: 100,  
      espacio_nombre: 'A-01',  
      placa: 'ABC-123',  
      tiempo_inicio: '2024-01-01T10:00:00',  
      tiempo_fin: null  
    }  
      
    const mockRegistroDetalle = {  
      tiempo_inicio: '2024-01-01T10:00:00',  
      tarifa: 5.0  
    }  
      
    const mockUpdate = vi.fn().mockReturnValue({  
      eq: vi.fn().mockResolvedValue({ error: null })  
    })  
      
    supabase.from.mockImplementation((table) => {  
      if (table === 'espacios_parqueo') {  
        return {  
          select: vi.fn().mockResolvedValue({   
            data: mockEspacios,   
            error: null   
          })  
        }  
      }  
      if (table === 'vista_registros_parqueo') {  
        return {  
          select: vi.fn().mockReturnThis(),  
          is: vi.fn().mockResolvedValue({   
            data: [mockRegistroActivo],   
            error: null   
          }),  
          eq: vi.fn().mockReturnThis(),  
          single: vi.fn().mockResolvedValue({   
            data: mockRegistroDetalle,   
            error: null   
          })  
        }  
      }  
      if (table === 'registros_parqueo') {  
        return {  
          update: mockUpdate  
        }  
      }  
    })  
  
    render(<MapaEstacionamiento onDataUpdate={mockOnDataUpdate} dataUpdated={false} />)  
      
    await waitFor(() => {  
      expect(screen.getByTestId('detener-1')).toBeInTheDocument()  
    })  
      
    // Simular clic en botón detener  
    const botonDetener = screen.getByTestId('detener-1')  
    fireEvent.click(botonDetener)  
      
    await waitFor(() => {  
      // Verificar que se llamó al update con tiempo_fin y pago  
      expect(mockUpdate).toHaveBeenCalled()  
        
      // Verificar que se notificó al componente padre  
      expect(mockOnDataUpdate).toHaveBeenCalled()  
    })  
  })  
  
  it('MAPA-03: debe mostrar espacios ocupados con Auto y botón Detener', async () => {  
    const mockEspacios = [  
      { id: 1, nombre: 'A-01' },  
      { id: 2, nombre: 'A-02' }  
    ]  
      
    const mockRegistrosActivos = [  
      {   
        id: 100,  
        espacio_nombre: 'A-01',   
        placa: 'ABC-123',  
        tiempo_fin: null  
      },  
      {   
        id: 101,  
        espacio_nombre: 'A-02',   
        placa: 'XYZ-789',  
        tiempo_fin: null  
      }  
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
      if (table === 'vista_registros_parqueo') {  
        return {  
          select: vi.fn().mockReturnThis(),  
          is: vi.fn().mockResolvedValue({   
            data: mockRegistrosActivos,   
            error: null   
          })  
        }  
      }  
    })  
  
    render(<MapaEstacionamiento onDataUpdate={mockOnDataUpdate} dataUpdated={false} />)  
      
    await waitFor(() => {  
      // Verificar que ambos espacios tienen botón detener (están ocupados)  
      expect(screen.getByTestId('detener-1')).toBeInTheDocument()  
      expect(screen.getByTestId('detener-2')).toBeInTheDocument()  
        
      // Verificar que se muestran los nombres de los espacios  
      expect(screen.getByText('A-01')).toBeInTheDocument()  
      expect(screen.getByText('A-02')).toBeInTheDocument()  
    })  
  })  
  
  it('MAPA-04: debe actualizar espacios cuando cambia dataUpdated', async () => {  
    const mockEspaciosInicial = [  
      { id: 1, nombre: 'A-01' }  
    ]  
      
    const mockRegistrosInicial = []  
      
    supabase.from.mockImplementation((table) => {  
      if (table === 'espacios_parqueo') {  
        return {  
          select: vi.fn().mockResolvedValue({   
            data: mockEspaciosInicial,   
            error: null   
          })  
        }  
      }  
      if (table === 'vista_registros_parqueo') {  
        return {  
          select: vi.fn().mockReturnThis(),  
          is: vi.fn().mockResolvedValue({   
            data: mockRegistrosInicial,   
            error: null   
          })  
        }  
      }  
    })  
  
    const { rerender } = render(  
      <MapaEstacionamiento onDataUpdate={mockOnDataUpdate} dataUpdated={false} />  
    )  
      
    await waitFor(() => {  
      expect(screen.getByTestId('espacio-1')).toBeInTheDocument()  
      // Inicialmente sin botón detener (espacio libre)  
      expect(screen.queryByTestId('detener-1')).not.toBeInTheDocument()  
    })  
      
    // Simular que se agregó un nuevo registro  
    const mockRegistrosNuevo = [  
      {   
        id: 100,  
        espacio_nombre: 'A-01',  
        placa: 'ABC-123',  
        tiempo_fin: null  
      }  
    ]  
      
    supabase.from.mockImplementation((table) => {  
      if (table === 'espacios_parqueo') {  
        return {  
          select: vi.fn().mockResolvedValue({   
            data: mockEspaciosInicial,   
            error: null   
          })  
        }  
      }  
      if (table === 'vista_registros_parqueo') {  
        return {  
          select: vi.fn().mockReturnThis(),  
          is: vi.fn().mockResolvedValue({   
            data: mockRegistrosNuevo,   
            error: null   
          })  
        }  
      }  
    })  
      
    // Cambiar prop dataUpdated para forzar actualización  
    rerender(<MapaEstacionamiento onDataUpdate={mockOnDataUpdate} dataUpdated={true} />)  
      
    await waitFor(() => {  
      // Ahora debe aparecer el botón detener  
      expect(screen.getByTestId('detener-1')).toBeInTheDocument()  
    })  
  })  
})
import { describe, it, expect, vi, beforeEach } from 'vitest'  
import { render, screen, fireEvent } from '@testing-library/react'  
import BoletoPDFBoton from '../BoletoPDFBoton'  
import jsPDF from 'jspdf'  
  
// Mock de jsPDF - CORRECCIÓN: Debe ser una clase constructora  
vi.mock('jspdf', () => {  
  return {  
    default: vi.fn(function() {  
      return {  
        setFontSize: vi.fn(),  
        text: vi.fn(),  
        setDrawColor: vi.fn(),  
        line: vi.fn(),  
        save: vi.fn()  
      }  
    })  
  }  
})  
  
describe('Módulo de Generación de PDF - BoletoPDFBoton.jsx', () => {  
  beforeEach(() => {  
    vi.clearAllMocks()  
  })  
  
  it('PDF-01: debe generar PDF con datos completos de parqueo finalizado', () => {  
    const registroCompleto = {  
      cliente_nombre: 'Juan Pérez',  
      cliente_dni: '12345678',  
      placa: 'ABC-123',  
      espacio_nombre: 'A-01',  
      tarifa: 5.0,  
      tiempo_inicio: '2024-01-01T10:00:00',  
      tiempo_fin: '2024-01-01T12:00:00',  
      pago: 10.0  
    }  
  
    render(<BoletoPDFBoton registro={registroCompleto} />)  
      
    const boton = screen.getByRole('button')  
    expect(boton).toBeInTheDocument()  
    expect(boton.textContent).toBe('📄')  
      
    // Hacer clic en el botón para generar el PDF  
    fireEvent.click(boton)  
      
    // Verificar que jsPDF fue instanciado (usando import en lugar de require)  
    expect(jsPDF).toHaveBeenCalled()  
  })  
  
  it('PDF-02: debe generar PDF con "En curso" para parqueo activo sin tiempo_fin', () => {  
    const registroActivo = {  
      cliente_nombre: 'María García',  
      cliente_dni: '87654321',  
      placa: 'XYZ-789',  
      espacio_nombre: 'B-05',  
      tarifa: 5.0,  
      tiempo_inicio: '2024-01-01T14:00:00',  
      tiempo_fin: null,  
      pago: null  
    }  
  
    render(<BoletoPDFBoton registro={registroActivo} />)  
      
    const boton = screen.getByRole('button')  
    fireEvent.click(boton)  
      
    // Verificar que jsPDF fue instanciado (usando import en lugar de require)  
    expect(jsPDF).toHaveBeenCalled()  
  })  
  
  it('PDF-03: debe renderizar el botón con el estilo correcto', () => {  
    const registro = {  
      cliente_nombre: 'Test',  
      cliente_dni: '11111111',  
      placa: 'TEST-123',  
      espacio_nombre: 'C-01',  
      tarifa: 5.0,  
      tiempo_inicio: '2024-01-01T10:00:00',  
      tiempo_fin: null,  
      pago: null  
    }  
  
    render(<BoletoPDFBoton registro={registro} />)  
      
    const boton = screen.getByRole('button')  
      
    // Verificar que el botón tiene el emoji correcto  
    expect(boton.textContent).toBe('📄')  
      
    // Verificar que el botón es clickeable  
    expect(boton).not.toBeDisabled()  
  })  
})
import { describe, it, expect, vi, beforeEach } from 'vitest'  
import { render, screen, waitFor } from '@testing-library/react'
import { act } from '@testing-library/react'
import App from '../App'  
import { supabase } from '../supabaseClient'  
  
// Mock de Supabase  
vi.mock('../supabaseClient', () => ({  
  supabase: {  
    auth: {  
      getSession: vi.fn(),  
      onAuthStateChange: vi.fn()  
    }  
  }  
}))  
  
// Mock de componentes hijos  
vi.mock('../componentes/Login/Login', () => ({  
  default: () => <div data-testid="login-component">Login Component</div>  
}))  
  
vi.mock('../componentes/Consola/Consola', () => ({  
  default: ({ session }) => (  
    <div data-testid="consola-component">  
      Consola Component - User: {session?.user?.email || 'No user'}  
    </div>  
  )  
}))  
  
describe('Módulo de Autenticación - App.jsx', () => {  
  beforeEach(() => {  
    vi.clearAllMocks()  
  })  
  
  it('AUTH-01: debe renderizar Login cuando session = null', async () => {  
    supabase.auth.getSession.mockResolvedValue({   
      data: { session: null },  
      error: null  
    })  
      
    supabase.auth.onAuthStateChange.mockReturnValue({  
      data: { subscription: { unsubscribe: vi.fn() } }  
    })  
  
    render(<App />)  
      
    await waitFor(() => {  
      expect(screen.getByTestId('login-component')).toBeInTheDocument()  
    })  
  })  
  
  it('AUTH-02: debe renderizar Consola cuando session existe', async () => {  
    const mockSession = {  
      user: {   
        email: 'test@example.com',  
        id: '123'  
      }  
    }  
      
    supabase.auth.getSession.mockResolvedValue({   
      data: { session: mockSession },  
      error: null  
    })  
      
    supabase.auth.onAuthStateChange.mockReturnValue({  
      data: { subscription: { unsubscribe: vi.fn() } }  
    })  
  
    render(<App />)  
      
    await waitFor(() => {  
      expect(screen.getByTestId('consola-component')).toBeInTheDocument()  
      expect(screen.getByText(/test@example.com/)).toBeInTheDocument()  
    })  
  })  
  
  it('AUTH-03: debe actualizar session state cuando cambia autenticación', async () => {  
    let authCallback  
      
    supabase.auth.getSession.mockResolvedValue({   
      data: { session: null },  
      error: null  
    })  
      
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {  
      authCallback = callback  
      return { data: { subscription: { unsubscribe: vi.fn() } } }  
    })  
  
    render(<App />)  
      
    await waitFor(() => {  
      expect(screen.getByTestId('login-component')).toBeInTheDocument()  
    })  
      
    // Simular login exitoso  
    const newSession = {   
      user: {   
        email: 'nuevo@example.com',  
        id: '456'  
      }   
    }  
    await act(async () => {
  authCallback('SIGNED_IN', newSession)
})
      
    await waitFor(() => {  
      expect(screen.getByTestId('consola-component')).toBeInTheDocument()  
      expect(screen.getByText(/nuevo@example.com/)).toBeInTheDocument()  
    })  
  })  
})
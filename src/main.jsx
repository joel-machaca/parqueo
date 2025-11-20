/*frontend/src/main.jsx*/
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import App from './App.jsx'

 // --- INICIO DEL CÓDIGO JAVASCRIPT ---
        
 console.log("Script de gradiente iniciado."); // Mensaje para verificar que el script se ejecuta

        const bodyElement = document.body;

        // Colores y paradas de color (los tuyos)
        const color1 = '#201d1d'; // Color inicial
        const stop1 = '14%';
        const color2 = '#3c3c3e'; // Color intermedio
        const stop2 = '50%'; // CORRECCIÓN: 'stop2' debe ser 'const' o 'let'
        const color3 = '#1b1d1b'; // Color final
        const stop3 = '80%'; // CORRECCIÓN: 'stop3' debe ser 'const' o 'let'

        let currentDegrees = 89; // Grados iniciales

        function actualizarGradienteRotatorio() {
            // Construye la cadena CSS del gradiente
            const gradientString = `linear-gradient(${currentDegrees}deg, ${color1} ${stop1}, ${color2} ${stop2}, ${color3} ${stop3})`;
            
            // Debug: Mostrar la cadena CSS que se intenta aplicar
            // console.log("Aplicando gradiente:", gradientString);

            // Aplica el gradiente al background del body
            bodyElement.style.background = gradientString;
            // Quitamos los prefijos -webkit-, -moz-, -o- por ahora.
            // Para navegadores modernos, 'background' es suficiente.
            // Si el problema persiste, es MUY poco probable que los prefijos sean el problema.
            
            // Incrementa los grados
            currentDegrees = (currentDegrees + 0.5) % 360; 
        }

        // Ejecutar una vez inmediatamente y luego en intervalo
        actualizarGradienteRotatorio(); // Ejecutar al cargar para ver el primer estado
        setInterval(actualizarGradienteRotatorio, 10); 

        // console.log("Script de gradiente finalizado. Intervalo configurado.");
        // --- FIN DEL SCRIPT ---

const rutas={
  "/login":"Login",
  "/consola":"Consola"
}

const pagina= rutas[window.location.pathname]
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App pagina={pagina} />
  </StrictMode>,
)

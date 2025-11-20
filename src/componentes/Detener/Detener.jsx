// frontend/src/componentes/Detener/Detener.jsx
import "./Detener.css"
import img_detener from "../../assets/detener.png"

export default function Detener(){
      return(
        <button type="button">
         <img src={img_detener} alt="Detener parqueo" width="40vh" />
        </button>
      )
}
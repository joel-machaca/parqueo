// frontend/src/componentes/Auto/Auto.jsx
import "./Auto.css"
import img_auto from "../../assets/auto.png"

export default function Auto(){
    return(
        <button type="button">
           <img src={img_auto} alt="Auto en parqueo" width="90vh" />
        </button>
    )
}
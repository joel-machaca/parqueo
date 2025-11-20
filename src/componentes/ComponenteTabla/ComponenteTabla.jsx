import "./ComponenteTabla.css"
import Pdf from "../Pdf/Pdf.jsx"
import Check from "../Check/Check.jsx"
export default function ComponenteTabla({espacio,cronometro,precio,inicio,fin,placa,dni,nombre}){

        return(
           <tr>
            <td>{espacio}</td>
            <td><Check/></td>
            <td>{cronometro}</td>
            <td>{precio}</td>
            <td>{inicio}</td>
            <td>{fin} </td>
            <td>{placa} </td>
            <td>{dni} </td>
            <td>{nombre} </td>
            <td><Pdf/></td>
        </tr>
    )
}
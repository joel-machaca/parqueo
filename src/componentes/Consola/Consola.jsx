/// frontend/src/componentes/Consola/Consola.jsx

import { useState } from 'react';
import Tabla from "../Tabla/Tabla.jsx";
import MapaEstacionamiento from "../MapaEstacionamiento/Mapa-estacionamiento.jsx";
import styles from './Consola.module.css';
import Reporte from "./Reporte.jsx";
import Desloguear from "./Desloguear.jsx";
import RegistroParqueo from "./RegistroParqueo.jsx";

export default function Consola() {
    const [dataUpdated, setDataUpdated] = useState(false);

    const handleDataUpdate = () => {
        setDataUpdated(prev => !prev);
    };

    return (
        <>
            <nav>
                 <Desloguear />
                <Reporte />
               
                <RegistroParqueo onDataUpdate={handleDataUpdate} />
            </nav>
            <div className={styles.principal}>
                {/* Nuevo div para envolver la tabla y permitir scroll */}
                <div className={styles.tablaContainer}>
                    <Tabla dataUpdated={dataUpdated} />
                </div>
                <MapaEstacionamiento onDataUpdate={handleDataUpdate} dataUpdated={dataUpdated} /> 
            </div>
        </>
    );
}
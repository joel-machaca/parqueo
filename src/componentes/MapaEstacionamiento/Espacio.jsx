// frontend/src/componentes/MapaEstacionamiento/Espacio.jsx

import styles from "./MapaEstacionamiento.module.css";
import Auto from "../Auto/Auto.jsx";
import Detener from "../Detener/Detener.jsx";

export default function Espacio({ espacio, onDetenerParqueo }) {
  // Verificamos si el espacio está en uso
  const estaEnUso = espacio.registro !== null;
  const esIzquierda = espacio.id <= 5; // Lógica para el CSS de la izquierda/derecha

  return (
    <div className={esIzquierda ? styles.espacioIzquierda : styles.espacioDerecha}>
      <span className={styles.etiquetaEstacionamiento}>{espacio.nombre}</span>
      {estaEnUso && (
        <>
          <div className={styles.atumovil}><Auto /></div>
          <div className={styles.detener} onClick={() => onDetenerParqueo(espacio.registro.id)}><Detener /></div>
        </>
      )}
    </div>
  );
}
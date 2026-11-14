import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Inicio from "./Pages/Inicio";
import Favoritos from "./Pages/Favoritos";
import Categoria from "./Pages/Categoria";
import Contacto from "./Pages/Contacto";
import Login from "./Pages/Login";
import Registro from "./Pages/Registro";
import PanelAdmin from "./Pages/Admin/PanelAdmin";
import RutaAdmin from "./Components/RutaAdmin";
import { useJuegos } from "./Context/JuegosContext";

function App() {

    // Los juegos ahora vienen del contexto (así se actualizan con el CRUD)
    const { juegos, error } = useJuegos();

    const [juegosMostrados, setJuegosMostrados] = useState(juegos);

    // Cuando el admin agrega, edita o elimina, la lista se actualiza sola
    useEffect(() => {
        setJuegosMostrados(juegos);
    }, [juegos]);

    return (
        <>
            <Navbar
                juegos={juegos}
                setJuegosMostrados={setJuegosMostrados}
            />

            {error && <div className="alert alert-warning text-center m-3" role="alert">{error}</div>}
            <Routes>
                <Route path="/" element={<Inicio juegosMostrados={juegosMostrados} />} />
                <Route path="/favoritos" element={<Favoritos />} />
                <Route path="/categoria/:nombre" element={<Categoria />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/admin" element={<RutaAdmin><PanelAdmin /></RutaAdmin>} />
            </Routes>

            <Footer />
        </>
    );
}

export default App;

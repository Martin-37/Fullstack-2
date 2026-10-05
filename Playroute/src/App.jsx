import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Inicio from "./Pages/Inicio";
import Favoritos from "./Pages/Favoritos";
import Categoria from "./Pages/Categoria";
import Footer from "./Components/Footer";
import Contacto from "./Pages/Contacto";
import Login from "./Pages/Login";
import { juegos } from "./Data/Juegos";
import Registro from "./Pages/Registro";


function App() {

    const [juegosMostrados, setJuegosMostrados] = useState(juegos);

    return (
        <>
            <Navbar
                juegos={juegos}
                setJuegosMostrados={setJuegosMostrados}
            />

            <Routes>

                <Route
                    path="/"
                    element={
                        <Inicio
                            juegosMostrados={juegosMostrados}
                        />
                    }
                />

                <Route
                    path="/favoritos"
                    element={<Favoritos />}
                />

                <Route
                    path="/categoria/:nombre"
                    element={<Categoria />}
                />

                <Route
                    path="/contacto"
                    element={<Contacto />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

            
                    <Route path="/" element={<Inicio juegosMostrados={juegosMostrados} />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/favoritos" element={<Favoritos />} />
                    <Route path="/registro" element={<Registro />} />
                


            </Routes>

            <Footer />
        </>
    );
}

export default App;
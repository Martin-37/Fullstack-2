import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Inicio from "./Pages/Inicio";
import Favoritos from "./Pages/Favoritos";
import Categoria from "./Pages/Categoria";
import Footer from "./Components/Footer";

import { juegos } from "./Data/Juegos";

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

            </Routes>

            <Footer />
        </>
    );
}

export default App;
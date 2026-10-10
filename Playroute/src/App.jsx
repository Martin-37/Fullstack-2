
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

import Inicio from "./Pages/Inicio";
import Favoritos from "./Pages/Favoritos";
import Categoria from "./Pages/Categoria";
import Contacto from "./Pages/Contacto";
import Login from "./Pages/Login";
import Registro from "./Pages/Registro";
import LoginAdmin from "./Validations/LoginAdmin";
import Administrador from "./Pages/Administrador";

import useJuegos from "./Pages/UseJuegos";

function App() {
    const {
        juegosCatalogo,
        setJuegosCatalogo,
        juegosMostrados,
        setJuegosMostrados
    } = useJuegos();

    return (
        <>
            <Navbar
                juegos={juegosCatalogo}
                setJuegosMostrados={setJuegosMostrados}
            />

            <Routes>
                <Route
                    path="/"
                    element={
                        <Inicio juegosMostrados={juegosMostrados} />
                    }
                />

                <Route
                    path="/favoritos"
                    element={<Favoritos juegos={juegosCatalogo} />}
                />

                <Route
                    path="/categoria/:nombre"
                    element={<Categoria juegos={juegosCatalogo} />}
                />


                <Route path="/contacto" element={<Contacto />} />

                <Route path="/login" element={<Login />} />

                <Route path="/registro" element={<Registro />} />

                <Route
                    path="/admin-login"
                    element={<LoginAdmin />}
                />

                <Route
                    path="/administrador"
                    element={
                        sessionStorage.getItem("sesionAdmin") === "true" ? (
                            <Administrador
                                juegos={juegosCatalogo}
                                setJuegos={setJuegosCatalogo}
                            />
                        ) : (
                            <Navigate to="/admin-login" replace />
                        )
                    }
                />
            </Routes>

            <Footer />
        </>
    );
}

export default App;
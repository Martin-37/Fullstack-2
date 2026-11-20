
function Footer() {
    return (
        <footer className="bg-dark text-white py-4">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <h5>PlayRoute</h5>
                        <p>
                            Accesorios y lista de videojuegos
                            para todos los gamers.
                        </p>
                    </div>

                    <div className="col-md-6 text-md-end">
                        <h5>Contacto</h5>
                        <p className="mb-0">
                            contacto@PlayRouter.cl
                        </p>
                        <p>
                            Viña del Mar, Chile
                        </p>
                    </div>
                </div>

                <hr />

                <p className="text-center mb-0">
                    &copy; 2026 PlayRoute. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}

export default Footer;

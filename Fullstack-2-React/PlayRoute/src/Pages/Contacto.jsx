function Contacto() { 
    return (
    <main className="container py-5">
         <div className="row justify-content-center"> 
            <div className="col-md-8 col-lg-6"> 
                <div className="card shadow border-0 rounded-4"> 
                    <div className="card-body p-4 p-md-5"> 
                        <h2 className="text-center mb-2"> Contáctanos </h2> 
                        <p className="text-center text-muted mb-4"> Completa el formulario y nos pondremos en contacto contigo. </p> 
                        <form> {/* Correo */} 
                            <div className="mb-3"> 
                                <label htmlFor="correo" className="form-label fw-semibold" > Correo electrónico </label> 
                                <input type="email" className="form-control form-control-lg" id="correo" placeholder="nombre@ejemplo.com" required /> 
                                </div> {/* Asunto */} 
                                <div className="mb-3"> 
                                    <label htmlFor="asunto" className="form-label fw-semibold" > Asunto 
                                        </label> 
                                        <input type="text" className="form-control form-control-lg" id="asunto" placeholder="¿En qué podemos ayudarte?" required /> 
                                        </div> {/* Mensaje */} <div className="mb-4"> 
                                            <label htmlFor="mensaje" className="form-label fw-semibold" > Mensaje </label> 
                                            <textarea className="form-control" id="mensaje" rows="3" required ></textarea> 
                                            </div> {/* Botón */} 
                                            <div className="d-grid"> 
                                                <button type="submit" className="btn btn-primary btn-lg rounded-3" > Enviar 
                                                    </button> </div> 
                                                    </form> </div> 
                                                    </div> 
                                                    </div> 
                                                    </div> 
                                                    </main>); 
                                                    }
                                                     export default Contacto;
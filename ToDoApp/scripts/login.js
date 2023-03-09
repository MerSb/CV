window.addEventListener('load', function() {
    /* ---------------------- obtenemos variables globales ---------------------- */

    const URI_BASE = 'http://todo-api.ctd.academy:3000/v1';





    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */

    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        let usuario = {
            email: document.querySelector('#inputEmail').value,
            password: document.querySelector('#inputPassword').value,
        }
        // Validar todos los datos antes de llamar a la API
        realizarLogin(usuario);
        // redirigir a login en caso de éxito
    });

    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 2: Realizar el login [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarLogin(usuario) {

        const configuracion = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        };

        fetch(`${URI_BASE}/users/login`, configuracion)
            .then(respuesta => {
                if(respuesta.status == 200 || respuesta.status == 201) {
                    
                return respuesta.json()}})
            .then(datos => {
                    localStorage.setItem('USER_SESSION', datos.jwt)
                    location.replace('mis-tareas.html')
            });

    };
});
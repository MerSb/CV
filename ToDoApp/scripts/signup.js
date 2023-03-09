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
            firstName: document.querySelector('#inputNombre').value,
            lastName: document.querySelector('#inputApellido').value,
            email: normalizarEmail(document.querySelector('#inputEmail').value),
            password: document.querySelector('#inputPassword').value
        }

        let passwordRepetida = document.querySelector('#inputPasswordRepetida').value;
        // Validar todos los datos antes de llamar a la API


        if(validarTexto(usuario.firstName) && validarTexto(usuario.lastName) 
        && validarEmail(usuario.email) && validarContrasenia(usuario.password) 
        && compararContrasenias(usuario.password, passwordRepetida)) {

            realizarRegister(usuario);
        } else {
            console.log('Debe corregir sus datos');
        }

        // redirigir a login en caso de éxito
    });

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarRegister(usuario) {
        const configuracion = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        };

        fetch(`${URI_BASE}/users`, configuracion)
            .then(respuesta => respuesta.status)
            .then(status => {

                if(status == 200 || status == 201) {

                    location.replace('index.html');
                }
            });

    };


});
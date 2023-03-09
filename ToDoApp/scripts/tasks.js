// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.
const URI_BASE = 'http://todo-api.ctd.academy:3000/v1';
const urlUsuario = 'http://todo-api.ctd.academy:3000/v1/users/getMe';
const urlTareas = 'http://todo-api.ctd.academy:3000/v1/tasks';


/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {
    const jwt = localStorage.getItem('USER_SESSION');

    /* ---------------- variables globales y llamado a funciones ---------------- */

    consultarTareas();
    obtenerNombreUsuario();



    /* -------------------------------------------------------------------------- */
    /*                          FUNCIÓN 1 - Cerrar sesión                         */
    /* -------------------------------------------------------------------------- */
    const btnCerrarSesion = document.querySelector('#closeApp');
    btnCerrarSesion.addEventListener('click', function () {

        localStorage.removeItem('USER_SESSION')
        location.replace('index.html')

    });

    /* -------------------------------------------------------------------------- */
    /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
    /* -------------------------------------------------------------------------- */

    function obtenerNombreUsuario() {

        const settings = {
            method: 'GET',
            headers: {
                authorization: jwt,
            }
        };
        console.log("Consultando mi usuario...");
        fetch(urlUsuario, settings)
            .then(response => response.json())
            .then(data => {
                console.log("Nombre de usuario:");
                console.log(data.firstName);
                const nombreUsuario = document.querySelector('.user-info p');
                nombreUsuario.innerText = data.firstName;
            })
            .catch(error => console.log(error));




    };


    /* -------------------------------------------------------------------------- */
    /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
    /* -------------------------------------------------------------------------- */

    function consultarTareas() {

        const configuracion = {
            method: 'GET',
            headers: {
                'Authorization': jwt
            },
        };

        fetch(`${URI_BASE}/tasks`, configuracion)
            .then(respuesta => respuesta.json())
            .then(datos => {

                renderizarTareas(datos);
                botonesCambioEstado();
                botonBorrarTarea(); //cambio
                /* let tareasPendientes = document.querySelector('.tareas-pendientes');
                let tareasTerminadas = document.querySelector('.tareas-terminadas');
                tareasPendientes.innerHTML = "";

                for (const tarea of datos) {

                  if(tarea.completed) {

                    tareasTerminadas.innerHTML += 
                    `<li class=tarea>${tarea.description}</li>
                    `

                  } else {

                    tareasPendientes.innerHTML += 
                    `<li class=tarea>${tarea.description}</li>
                    `
                  }

                  } */
            });

    };


    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
    /* -------------------------------------------------------------------------- */
    const formCrearTarea = document.querySelector('form');
    formCrearTarea.addEventListener('submit', function (event) {
        event.preventDefault();
        crearTarea(document.querySelector('#nuevaTarea').value);

    });

    function crearTarea(descripcionTarea) {
        const tarea = {
            description: descripcionTarea,
            completed: false
        };
        const jwt = localStorage.getItem('USER_SESSION');

        const configuracion = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            },
            body: JSON.stringify(tarea)
        };

        fetch(`${URI_BASE}/tasks`, configuracion)
            .then(respuesta => respuesta.json())
            .then(datos => {
                console.log(datos);
                location.reload(); //cambio

            })
    }

    /* -------------------------------------------------------------------------- */
    /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
    /* -------------------------------------------------------------------------- */
    function renderizarTareas(listado) {
        //linea 58 en adelante pasada a renderizar
        let tareasPendientes = document.querySelector('.tareas-pendientes');
        let tareasTerminadas = document.querySelector('.tareas-terminadas');
        tareasPendientes.innerHTML = "";
        tareasTerminadas.innerHTML = "";
        const numeroFinalizadas = document.querySelector('#cantidad-finalizadas');
        let contador = 0;
        numeroFinalizadas.innerText = contador;

        listado.forEach(tarea => {

            let fecha = new Date(tarea.createdAt);
            if (tarea.completed) {
                contador++;
                tareasTerminadas.innerHTML +=
                    `<li class="tarea">
            <div class="hecha">
              <i class="fa-regular fa-circle-check"></i>
            </div>
            <div class="descripcion">
              <p class="nombre">${tarea.description}</p>
              <div class="cambios-estados">
                <button class="change completa" id="${tarea.id}" ><i class="fa-solid fa-rotate-left"></i></button>
                <button class="borrar" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
              </div>
            </div>
          </li>
            `
            } else {
                tareasPendientes.innerHTML +=
                    `<li class="tarea">
            <button class="change incompleta" id="${tarea.id}"><i class="fa-regular fa-circle"></i></button>
            <div class="descripcion">
              <p class="nombre">${tarea.description}</p>
              <p class="timestamp">${fecha.toLocaleDateString()}</p>
            </div>
          </li>
            `
            }
            numeroFinalizadas.innerText = contador;
            
        });

    };

    /* -------------------------------------------------------------------------- */
    /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
    /* -------------------------------------------------------------------------- */
    function botonesCambioEstado() {
        document.querySelectorAll('.change').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const tarea = {
                    completed: !e.target.classList.contains('completa')
                        //completed: e.target.classList.contains('incompleta')?true:false
                };

                const configuracion = {
                    method: 'PUT',
                    headers: {
                        'Authorization': jwt,
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(tarea)
                };

                fetch(`${urlTareas}/${e.target.id}`, configuracion)
                    .then(respuesta => respuesta.json())
                    .then(datos => {
                        console.log(datos);
                        consultarTareas();
                    });
            });
        });
    }


    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
    /* -------------------------------------------------------------------------- */
    function botonBorrarTarea() {

        document.querySelectorAll('.borrar').forEach(boton => {

            console.log("Boton de borrar");
            boton.addEventListener('click', (e) => {

                const configuracion = {
                    method: 'DELETE',
                    headers: {
                        'Authorization': jwt,
                    },
                };

                fetch(`${urlTareas}/${e.target.id}`, configuracion)
                    .then(respuesta => {
                        if(respuesta.ok) {
                            consultarTareas();
                        } else {
                            console.log("Falló el borrado");
                        }
                    });
            });
        });



    };

});
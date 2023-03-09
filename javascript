/*                          CONSIGNA MESA DE TRABAJO                          */
/* -------------------------------------------------------------------------- */
// 1- Modificar la funcion de iniciarJuego(), validar si ingresa un dato válido como nombre.
// 2- Si no ingresa un texto, o tiene menos de 3 caracteres debemos volverle a pedir que lo ingrese.
// 3- Finalmente el nombre devuelto debe estar todo en mayúsculas.

function iniciarJuego() {
    let nombre = prompt('Ingresá tu nombre'); //fr
    while (nombre.length <= 3) {
        alert("Debe ingresar un nombre con una longitud mayor a 3 caracteres.");
        nombre = prompt('Ingresá tu nombre');
    }
    
    alert('Gracias por jugar ' + nombre.toUpperCase() + '. ¡Mucha suerte!');
}

iniciarJuego();

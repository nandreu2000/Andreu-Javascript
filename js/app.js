let pagina =1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}
document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();

    //Resalta DIV actual

    mostrarSeccion();

    //Oculta o Muestra una sección
    cambiarSeccion();

    //pagina siguiente y anterior
    paginaSiguiente();

    paginaAnterior();

    //comprobar pagina
    botonesPaginador();

    //Turno y tareas o error
    mostrarResumen();

    //Datos de turno
    nombreCita();

    //Fecha del Turno
    fechaCita();

    //Deshabilitar fecha anterior
    deshabilitarFechaAnterior();

    // Almacenar la hora
    horaCita();
}

function mostrarSeccion(){

    //Elimina "mostrar-seccion"
    const seccionAnterior = document.querySelector(".mostrar-seccion");
    if(seccionAnterior){
        seccionAnterior.classList.remove("mostrar-seccion");
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add("mostrar-seccion");

    //Eliminar clase "actual"
    const tabAnterior = document.querySelector(".tabs .actual");
    if(tabAnterior){
        tabAnterior.classList.remove("actual");
    }
    
    //Resaltar Botón
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add("actual");
}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll(".tabs button");

    enlaces.forEach( enlace =>{
        enlace.addEventListener("click", e=>{
            e.preventDefault();

            pagina = parseInt(e.target.dataset.paso);

            //Mostrar sección
            mostrarSeccion();

            botonesPaginador();
        })
    })
}

async function mostrarServicios(){
    try{
        const resultado = await fetch ("./js/servicios.json");

        const db = await resultado.json();

        const { servicios } = db;

        //GENERANDO HTML

        servicios.forEach(servicio => {
            const { id, nombre, precio } = servicio;

        //DOM

        /* SERVICIO */
        const nombreServicio = document.createElement("P");
        nombreServicio.textContent = nombre;
        nombreServicio.classList.add("nombre-servicio");

        //console.log(nombreServicio);

        /* PRECIO */

        const precioServicio = document.createElement("P");
        precioServicio.textContent = `$ ${precio}`;
        precioServicio.classList.add("precio-servicio");

        //console.log(precioServicio)

        /* DIV CONTENEDOR SERVICIOS */

        const servicioDiv = document.createElement("DIV");
        servicioDiv.classList.add("servicio");
        servicioDiv.dataset.idServicio = id;

        //Seleccion servicio
        servicioDiv.onclick = seleccionarServicio;

        /* AGREGAR PRECIO */
        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        //console.log(servicioDiv);

        /* HTML */
        document.querySelector("#servicios").appendChild(servicioDiv);

        });
    }
    catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e){

    let elemento;

    if(e.target.tagName === "P"){

        elemento = e.target.parentElement;
    }else{
        elemento = e.target;
    }

    if(elemento.classList.contains("seleccionado")){
        elemento.classList.remove("seleccionado");

        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id);
    }else{
        elemento.classList.add("seleccionado");

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }
        //console.log(servicioObj);

        agregarServicio(servicioObj);
    }   
}

function eliminarServicio(id){
    //console.log('eliminando...', id);
    const {servicios} = cita;

    cita.servicios = servicios.filter( servicio => servicio.id !== id);

    console.log(cita);
}

function agregarServicio(servicioObj){
    const {servicios} = cita;

    cita.servicios = [...servicios, servicioObj];

    console.log(cita);
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector("#siguiente");
    paginaSiguiente.addEventListener("click", () =>{
        pagina++;

        /* console.log(pagina); */

        botonesPaginador();
    });
}

function paginaAnterior(){
    const paginaAnterior = document.querySelector("#anterior");
    paginaAnterior.addEventListener("click", () =>{
        pagina--;

        //console.log(pagina);

        botonesPaginador()
    });
}

function botonesPaginador(){
    const paginaSiguiente = document.querySelector("#siguiente");
    const paginaAnterior = document.querySelector("#anterior");

    if(pagina === 1){
        paginaAnterior.classList.add("ocultar");
    }else if(pagina === 3){
        paginaSiguiente.classList.add("ocultar");
        paginaAnterior.classList.remove("ocultar");
        
        mostrarResumen(); // Estamos en la página 3, carga el resumen de la cita
    }else{
        paginaAnterior.classList.remove("ocultar");
        paginaSiguiente.classList.remove("ocultar");
    }

    mostrarSeccion(); //cambia seccion
}

function mostrarResumen(){
    
    const { nombre, fecha, hora, servicios} = cita;

    const resumenDiv = document.querySelector(".contenido-resumen");

    //limpiar HTML
    while( resumenDiv.firstChild ) {
        resumenDiv.removeChild( resumenDiv.firstChild );
    }

    //Validar Objeto
    if(Object.values(cita).includes("")){
        const noServicios = document.createElement("P");
        noServicios.textContent = 'Seleccione los Servicios y complete los campos Nombre, Fecha y Hora.';

        noServicios.classList.add("invalidar-cita");

        resumenDiv.appendChild(noServicios);

        return;
    }

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Datos del Turno';

    // Mostrar el resumen
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Servicios Seleccionados';

    serviciosCita.appendChild(headingServicios);

    let cantidad = 0;

    // Iterar sobre el arreglo de servicios
    servicios.forEach( servicio => {

        const { nombre, precio } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');
        // console.log(parseInt( totalServicio[1].trim() ));

        cantidad += parseInt( totalServicio[1].trim());

        // Colocar texto y precio
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);

    } );


    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement("P");
    cantidadPagar.classList.add("total");
    cantidadPagar.innerHTML = `<span>Total a Pagar:  </span>$ ${cantidad}`;


    resumenDiv.appendChild(cantidadPagar);
}


function nombreCita(){
    const nombreInput = document.querySelector("#nombre");

    nombreInput.addEventListener("input", e =>{
        const nombreTexto = e.target.value.trim();
        /* console.log(nombreTexto); */

        //Validacion Nombre
        if(nombreTexto === '' || nombreTexto.length < 3){
            mostrarAlerta("Nombre no valido", "error");
        }else{
            const alerta = document.querySelector(".alerta");
            if(alerta){
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    });
}

function mostrarAlerta(mensaje, tipo){
    /* console.log("el mensaje es", mensaje); */

    const alertaPrevia = document.querySelector(".alerta");
    if(alertaPrevia){
        return;
    }

    const alerta = document.createElement("DIV");
    alerta.textContent = mensaje;
    alerta.classList.add("alerta");

    if(tipo === "error"){
        alerta.classList.add("error");
    }
    
    //Insertando error en el HTML
    const formulario = document.querySelector(".formulario");
    formulario.appendChild( alerta );

    //Eliminar Alerta
    setTimeout(() => {
        alerta.remove();
    }, 3500);
}

function fechaCita(){
    const fechaInput = document.querySelector("#fecha");
    fechaInput.addEventListener("input", e => {
        const dia = new Date(e.target.value).getUTCDay();
        /* console.log(dia); */
        if([0].includes(dia)){
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta("Los domingos esta cerrado", "error");
        }else{
            cita.fecha = fechaInput.value;
            console.log(cita);
        }
    })
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector("#fecha");

    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate() + 1;
    const fechaDeshabilitar = `${year}-${mes}-${dia}`;

    inputFecha.min = fechaDeshabilitar;
}

function horaCita() {
    const inputHora = document.querySelector("#hora");
    inputHora.addEventListener("input", e => {

        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if(hora[0] < 08 || hora[0] > 19 ) {
            mostrarAlerta("Hora no válida", "error");
            setTimeout(() => {
                inputHora.value = '';
            }, 3500);
        } else {
            cita.hora = horaCita;

            console.log(cita);
        }
    });
}
// Variables y Selectores
const formulario = document.querySelector('#agregar-gasto');
const botonPresupuesto = document.querySelector('#boton-presupuesto');
const gastoListado = document.querySelector('#gastos ul');


// Eventos

eventListeners();
function eventListeners() {
       

    formulario.addEventListener('submit', agregarGasto);
    botonPresupuesto.addEventListener('click', preguntarPresupuesto);
}

// Classes
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }
    calcularRestante() {
        const gastado = this.gastos.reduce( (total, gasto ) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }
    eliminarGasto(id) {
        this.gastos = this.gastos.filter( gasto => gasto.id !== id )
        this.calcularRestante();

        
    }
}
// Interfaz
class UI {
    insertarPresupuesto(cantidad) {
        // Extrayendo el valor
        const { presupuesto, restante } = cantidad;

        // Agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAletar(mensaje, tipo) {
        // crear el div 
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // agregar mensaje de error
        divMensaje.textContent = mensaje;

        // insertar en el HTML
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        setTimeout( () => {
            divMensaje.remove();
        }, 3000)
    }

    mostrarGastos(gastos) {

        this.limpiarHTML(); // Elimina el HTML previo

        // Iterar sobre los gatos
        gastos.forEach(gasto => {

            const { cantidad, nombre, id } = gasto;

            // Crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            // Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad}</span>`;

            // Botón para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;'
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            // Agregar al HTML
            gastoListado.appendChild(nuevoGasto);
        })

        
    }
      // Limpiar HTML
      limpiarHTML() {
        while( gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestObj) {
        const { presupuesto, restante } = presupuestObj;

        const restanteDiv = document.querySelector('.restante');

        // Comprobar 25%
        if(( presupuesto / 4 ) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if( (presupuesto / 2 ) > restante ) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning')
            restanteDiv.classList.add('alert-success');
        }

        // Si el total es 0 o menor 
        if( restante <= 0 ) {
            ui.imprimirAletar('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        } else {
            formulario.querySelector('button[type="submit"]').disabled = false;
        }
    }
    

}

// Instanciar
const ui = new UI();

let presupuesto;

// Funciones

function preguntarPresupuesto(e) {
     e.preventDefault();
   const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?');


      if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0 ) {
          window.location.reload(); // recargamos la app
      }

    // Presupuesto Válido
    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);
}

// Agregar gastos 
function agregarGasto(e) {
    e.preventDefault();

    // Leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    // Validar
    if(nombre === '' || cantidad === '') {
        ui.imprimirAletar('Ambos campos son obligarios', 'error');
        return;
    } else if(cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAletar('Debes agregar una cantidad válida', 'error');
        return;
    }

    // Generar un objeto con el gasto
    const gasto = { nombre, cantidad, id: Date.now() }

    // añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    // mensaje de correcto!
    ui.imprimirAletar('Agregado correctamente');

    // Imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
    
    // reinicia el formulario
    formulario.reset();
    
}

function eliminarGasto(id) {
    // Elimina los gastos del objeto
    presupuesto.eliminarGasto(id);

    //Elimina los gastos del HTML
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}



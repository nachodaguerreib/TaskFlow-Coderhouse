//* Creacion de clase tarea
class Tarea {
  constructor(id, nombre) {
    this.id = id;
    this.nombre = nombre;
    this.completado = false;
  }

  marcarCompletada() {
    this.completado = true;
  }

  mostrar() {
    return `${this.id}, ${this.nombre}, ${
      this.completado ? "Completada" : "Por completar"
    }`;
  }
}

//* Función para cargar tareas desde localStorage como instancias de Tarea
function cargarTareas() {
  const tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];
  return tareasGuardadas.map((t) => Object.assign(new Tarea(), t));
}

//* Datos globales
let tareas = cargarTareas();
let idSiguiente = tareas.length + 1;

//* Llamada inicial para renderizar
actualizarListaTareas();

//* Funcion agregarTarea, agrega la tarea al arreglo de tareas
function agregarTarea() {
  let nombreTarea = prompt("Ingrese el nombre de la tarea");

  if (nombreTarea !== null && nombreTarea.trim() !== "") {
    let tarea = new Tarea(idSiguiente, nombreTarea);
    tareas.push(tarea);
    idSiguiente++;
    alert("Tarea agregada con exito a la lista");
    actualizarListaTareas();
  } else {
    alert("Invalido, ingrese un valor valido");
  }
}

//* Funcion completarTarea, una vez realizada pasa su estado a completada
function completarTarea() {
  let idTarea = Number(prompt("Ingrese el id de la tarea a completar"));

  if (!isNaN(idTarea) && idTarea > 0) {
    let tareaEncontrada = tareas.find((t) => t.id === idTarea);
    if (tareaEncontrada) {
      tareaEncontrada.marcarCompletada();
      actualizarListaTareas();
      alert("Tarea completada correctamente");
    } else {
      alert("No se encontro la tarea");
    }
  } else {
    alert("Invalido, ingrese un valor valido");
  }
}

//* Funcion eliminarTarea, elimina la tarea del arreglo
function eliminarTarea() {
  let idTarea = Number(prompt("Ingrese el id de la tarea a eliminar"));

  if (!isNaN(idTarea) && idTarea > 0) {
    let tareaEncontrada = tareas.find((t) => t.id === idTarea);
    if (tareaEncontrada) {
      tareas = tareas.filter((t) => t.id !== idTarea);
      tareas.forEach((t, index) => {
        t.id = index + 1;
      });
      actualizarListaTareas();
      alert("Tarea eliminada con exito");
    } else {
      alert("No se pudo encontrar la tarea");
    }
  } else {
    alert("Invalido, ingrese un valor valido");
  }
  idSiguiente = tareas.length + 1;
}

//* Renderiza la lista en el HTML y actualiza localStorage
function actualizarListaTareas() {
  const lista = document.getElementById("lista-tareas");
  lista.innerHTML = ""; // limpia antes de renderizar

  tareas.forEach((t) => {
    const li = document.createElement("li");
    li.innerText = t.mostrar();
    li.style.textDecoration = t.completado ? "line-through" : "none";
    lista.appendChild(li);
  });

  localStorage.setItem("tareas", JSON.stringify(tareas));
}

//* Funcionalidad
const botonAgregar = document.querySelector(".agregar-boton");
botonAgregar.addEventListener("click", agregarTarea);

const botonCompletar = document.querySelector(".completar-boton");
botonCompletar.addEventListener("click", completarTarea);

const botonEliminar = document.querySelector(".eliminar-boton");
botonEliminar.addEventListener("click", eliminarTarea);

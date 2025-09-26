//* Creacion de clase tarea
class Tarea {
  constructor(id, nombre, fecha = "") {
    this.id = id;
    this.nombre = nombre;
    this.fecha = fecha;
    this.completado = false;
  }

  marcarCompletada() {
    this.completado = true;
  }

  mostrar() {
    return this.fecha ? `${this.nombre} (Para: ${this.fecha})` : this.nombre;
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

//* Función agregarTarea desde input
function agregarTarea() {
  const input = document.getElementById("nueva-tarea");
  const inputFecha = document.getElementById("fecha-tarea");

  const nombreTarea = input.value.trim();
  const fechaTarea = inputFecha.value;

  if (!nombreTarea) return;

  const tarea = new Tarea(idSiguiente, nombreTarea, fechaTarea);
  tareas.push(tarea);
  idSiguiente++;

  input.value = "";
  inputFecha.value = "";

  actualizarListaTareas();
}

//* Función para eliminar tarea por id
function eliminarTarea(id) {
  tareas = tareas.filter((t) => t.id !== id);
  tareas.forEach((t, index) => (t.id = index + 1));
  idSiguiente = tareas.length + 1;
  actualizarListaTareas();
}

//* Función para completar tarea por id
function completarTarea(id) {
  const tarea = tareas.find((t) => t.id === id);
  if (tarea) {
    tarea.marcarCompletada();
    actualizarListaTareas();
  }
}

//* Renderiza la lista en el HTML y actualiza localStorage
function actualizarListaTareas() {
  const lista = document.getElementById("lista-tareas");
  lista.innerHTML = "";

  tareas.forEach((t) => {
    const li = document.createElement("li");
    li.innerText = t.mostrar();
    li.style.textDecoration = t.completado ? "line-through" : "none";

    // Botón completar
    const btnCompletar = document.createElement("button");
    btnCompletar.innerText = "Completar";
    btnCompletar.classList.add("btn");
    btnCompletar.style.marginLeft = "10px";
    btnCompletar.addEventListener("click", () => completarTarea(t.id));

    // Botón eliminar
    const btnEliminar = document.createElement("button");
    btnEliminar.innerText = "Eliminar";
    btnEliminar.classList.add("btn");
    btnEliminar.style.marginLeft = "5px";
    btnEliminar.addEventListener("click", () => eliminarTarea(t.id));

    li.appendChild(btnCompletar);
    li.appendChild(btnEliminar);
    lista.appendChild(li);
  });

  localStorage.setItem("tareas", JSON.stringify(tareas));
}

//* Funcionalidad botón agregar
document
  .querySelector(".agregar-boton")
  .addEventListener("click", agregarTarea);

//* Agregar evento para Enter en el input
const inputTarea = document.getElementById("nueva-tarea");
inputTarea.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    agregarTarea();
  }
});

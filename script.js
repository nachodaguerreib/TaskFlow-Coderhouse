//* ===============================
//* CLASE PRINCIPAL
//* ===============================
class Tarea {
  constructor(id, nombre, fecha = "", completado = false) {
    this.id = id;
    this.nombre = nombre;
    this.fecha = fecha;
    this.completado = completado;
  }

  marcarCompletada() {
    this.completado = true;
  }

  mostrar() {
    return this.fecha ? `${this.nombre} (Para: ${this.fecha})` : this.nombre;
  }
}

//* ===============================
//* CARGA INICIAL DE DATOS (JSON)
//* ===============================
async function cargarTareas() {
  try {
    const tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];

    if (tareasGuardadas.length === 0) {
      const respuesta = await fetch("./assets/data/tarea.json");
      const datos = await respuesta.json();

      Swal.fire({
        title: "Datos cargados",
        text: "Se importaron tareas iniciales desde el JSON.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      const tareasIniciales = datos.map(
        (t) => new Tarea(t.id, t.nombre, t.fecha, t.completado)
      );
      localStorage.setItem("tareas", JSON.stringify(tareasIniciales));
      return tareasIniciales;
    }

    return tareasGuardadas.map((t) => Object.assign(new Tarea(), t));
  } catch (error) {
    Swal.fire("Error", "No se pudo cargar el archivo JSON.", "error");
    return [];
  }
}

//* ===============================
//* VARIABLES GLOBALES
//* ===============================
let tareas = [];
let idSiguiente = 1;

//* ===============================
//* INICIALIZACIÓN ASÍNCRONA
//* ===============================
document.addEventListener("DOMContentLoaded", async () => {
  tareas = await cargarTareas();
  idSiguiente = tareas.length + 1;
  actualizarListaTareas();
});

//* ===============================
//* AGREGAR TAREA
//* ===============================
function agregarTarea() {
  const input = document.getElementById("nueva-tarea");
  const inputFecha = document.getElementById("fecha-tarea");

  const nombreTarea = input.value.trim();
  const fechaTarea = inputFecha.value;

  if (!nombreTarea) {
    Swal.fire("Error", "Debes ingresar un nombre de tarea.", "warning");
    return;
  }

  const tarea = new Tarea(idSiguiente, nombreTarea, fechaTarea);
  tareas.push(tarea);
  idSiguiente++;

  input.value = "";
  inputFecha.value = "";

  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Tarea agregada",
    showConfirmButton: false,
    timer: 1000,
  });

  actualizarListaTareas();
}

//* ===============================
//* ELIMINAR TAREA
//* ===============================
function eliminarTarea(id) {
  Swal.fire({
    title: "¿Eliminar tarea?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      tareas = tareas.filter((t) => t.id !== id);
      tareas.forEach((t, index) => (t.id = index + 1));
      idSiguiente = tareas.length + 1;
      actualizarListaTareas();

      Swal.fire(
        "Eliminada",
        "La tarea fue eliminada correctamente.",
        "success"
      );
    }
  });
}

//* ===============================
//* COMPLETAR TAREA
//* ===============================
function completarTarea(id) {
  const tarea = tareas.find((t) => t.id === id);
  if (tarea) {
    tarea.marcarCompletada();
    actualizarListaTareas();

    Swal.fire({
      icon: "success",
      title: "¡Bien hecho!",
      text: `Completaste "${tarea.nombre}"`,
      timer: 1500,
      showConfirmButton: false,
    });
  }
}

//* ===============================
//* EDITAR TAREA
//* ===============================
function editarTarea(id) {
  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) return;

  Swal.fire({
    title: "Editar tarea",
    input: "text",
    inputValue: tarea.nombre,
    showCancelButton: true,
    confirmButtonText: "Guardar",
  }).then((result) => {
    if (result.isConfirmed && result.value.trim() !== "") {
      tarea.nombre = result.value.trim();
      actualizarListaTareas();
      Swal.fire(
        "Actualizada",
        "La tarea fue modificada correctamente.",
        "success"
      );
    }
  });
}

//* ===============================
//* ACTUALIZAR LISTA EN HTML
//* ===============================
function actualizarListaTareas() {
  const lista = document.getElementById("lista-tareas");
  lista.innerHTML = "";

  tareas.forEach((t) => {
    const li = document.createElement("li");
    li.innerText = t.mostrar();

    // Agregar clase 'completed' si la tarea ya está completada
    if (t.completado) li.classList.add("completed");

    // Botones
    const btnCompletar = document.createElement("button");
    btnCompletar.innerText = "Completar";
    btnCompletar.classList.add("btn");
    btnCompletar.disabled = t.completado; // No se puede completar dos veces
    btnCompletar.addEventListener("click", () => completarTarea(t.id));

    const btnEditar = document.createElement("button");
    btnEditar.innerText = "Editar";
    btnEditar.classList.add("btn");
    btnEditar.addEventListener("click", () => editarTarea(t.id));

    const btnEliminar = document.createElement("button");
    btnEliminar.innerText = "Eliminar";
    btnEliminar.classList.add("btn");
    btnEliminar.addEventListener("click", () => eliminarTarea(t.id));

    li.append(btnCompletar, btnEditar, btnEliminar);
    lista.appendChild(li);
  });

  localStorage.setItem("tareas", JSON.stringify(tareas));
}

//* ===============================
//* EVENTOS PRINCIPALES
//* ===============================
document
  .querySelector(".agregar-boton")
  .addEventListener("click", agregarTarea);

document.getElementById("nueva-tarea").addEventListener("keydown", (e) => {
  if (e.key === "Enter") agregarTarea();
});

//* ===============================
//* CLASE PRINCIPAL
//* ===============================
class Tarea {
  constructor(id, nombre, fecha = "", prioridad = "Media", completado = false) {
    this.id = id;
    this.nombre = nombre;
    this.fecha = fecha;
    this.prioridad = prioridad;
    this.completado = completado;
  }

  marcarCompletada() {
    this.completado = !this.completado;
  }

  mostrar() {
    return this.fecha ? `${this.nombre} (Para: ${this.fecha})` : this.nombre;
  }
}

//* ===============================
//* CARGA INICIAL DE DATOS
//* ===============================
const datosIniciales = [
  {
    id: 1,
    nombre: "Comprar insumos para proyecto",
    fecha: "2025-10-30",
    completado: false,
    prioridad: "Alta",
  },
  {
    id: 2,
    nombre: "Preparar presentación",
    fecha: "2025-11-01",
    completado: false,
    prioridad: "Alta",
  },
  {
    id: 3,
    nombre: "Ordenar escritorio",
    fecha: "",
    completado: false,
    prioridad: "Baja",
  },
];

async function cargarTareas() {
  try {
    const tareasGuardadas = localStorage.getItem("tareas");
    if (tareasGuardadas) {
      const parsed = JSON.parse(tareasGuardadas);
      return parsed.map((t) => Object.assign(new Tarea(), t));
    }

    const tareasIniciales = datosIniciales.map(
      (t) => new Tarea(t.id, t.nombre, t.fecha, t.prioridad, t.completado)
    );
    localStorage.setItem("tareas", JSON.stringify(tareasIniciales));
    return tareasIniciales;
  } catch (error) {
    console.error("Error al cargar tareas:", error);
    Swal.fire("Error", "No se pudieron cargar las tareas.", "error");
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
  idSiguiente =
    tareas.length > 0 ? Math.max(...tareas.map((t) => t.id)) + 1 : 1;
  actualizarListaTareas();
});

//* ===============================
//* AGREGAR TAREA
//* ===============================
function agregarTarea() {
  const nombre = document.getElementById("nueva-tarea").value.trim();
  const fecha = document.getElementById("fecha-tarea").value;
  const prioridad = document.getElementById("prioridad-tarea").value;

  if (!nombre) {
    Swal.fire({
      icon: "warning",
      title: "Campo vacío",
      text: "Debes ingresar un nombre de tarea.",
      confirmButtonColor: "#2563eb",
    });
    return;
  }

  const tarea = new Tarea(idSiguiente, nombre, fecha, prioridad);
  tareas.push(tarea);
  idSiguiente++;

  document.getElementById("nueva-tarea").value = "";
  document.getElementById("fecha-tarea").value = "";
  document.getElementById("prioridad-tarea").value = "Media";

  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "✅ Tarea agregada",
    showConfirmButton: false,
    timer: 1500,
    toast: true,
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
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
  }).then((result) => {
    if (result.isConfirmed) {
      tareas = tareas.filter((t) => t.id !== id);
      actualizarListaTareas();
      Swal.fire({
        icon: "success",
        title: "Eliminada",
        text: "La tarea ha sido eliminada.",
        confirmButtonColor: "#2563eb",
      });
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
      position: "top-end",
      icon: "success",
      title: tarea.completado ? "✅ Completada" : "⏳ Pendiente",
      text: tarea.nombre,
      showConfirmButton: false,
      timer: 1500,
      toast: true,
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
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#2563eb",
    inputValidator: (value) => {
      if (!value || !value.trim()) {
        return "Debes ingresar un nombre";
      }
    },
  }).then((result) => {
    if (result.isConfirmed && result.value.trim()) {
      tarea.nombre = result.value.trim();
      actualizarListaTareas();
      Swal.fire({
        icon: "success",
        title: "Actualizada",
        text: "La tarea ha sido modificada.",
        confirmButtonColor: "#2563eb",
      });
    }
  });
}

//* ===============================
//* ACTUALIZAR LISTA CON FILTROS Y ORDEN
//* ===============================
function actualizarListaTareas() {
  const lista = document.getElementById("lista-tareas");
  lista.innerHTML = "";

  const filtro = document.getElementById("filtro-tareas").value;
  const orden = document.getElementById("orden-tareas").value;

  let tareasFiltradas = [...tareas];

  if (filtro === "pendientes") {
    tareasFiltradas = tareasFiltradas.filter((t) => !t.completado);
  } else if (filtro === "completadas") {
    tareasFiltradas = tareasFiltradas.filter((t) => t.completado);
  }

  tareasFiltradas.sort((a, b) => {
    if (orden === "nombre") return a.nombre.localeCompare(b.nombre);
    if (orden === "fecha")
      return (a.fecha || "9999").localeCompare(b.fecha || "9999");
    if (orden === "prioridad") {
      const map = { Alta: 1, Media: 2, Baja: 3 };
      return map[a.prioridad] - map[b.prioridad];
    }
    return a.id - b.id;
  });

  if (tareasFiltradas.length === 0) {
    lista.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">📭</div>
            <p class="empty-text">No hay tareas que mostrar</p>
          </div>
        `;
  } else {
    tareasFiltradas.forEach((t) => {
      const li = document.createElement("li");
      li.id = `tarea-${t.id}`;
      li.className = `task-item prioridad-${t.prioridad}`;
      if (t.completado) li.classList.add("completed");

      const prioridadEmoji = {
        Alta: "🔴",
        Media: "🟡",
        Baja: "🟢",
      };

      const fechaFormateada = t.fecha
        ? new Date(t.fecha + "T00:00:00").toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : null;

      li.innerHTML = `
            <div class="task-content">
              <div class="task-info">
                <div class="task-name">${t.nombre}</div>
                <div class="task-meta">
                  <span class="task-badge badge-${t.prioridad.toLowerCase()}">
                    ${prioridadEmoji[t.prioridad]} ${t.prioridad}
                  </span>
                  ${fechaFormateada ? `<span>📅 ${fechaFormateada}</span>` : ""}
                </div>
              </div>
            </div>
            <div class="task-actions">
              <button class="btn btn-sm btn-success" onclick="completarTarea(${
                t.id
              })" aria-label="Completar tarea">
                ${t.completado ? "↩️ Pendiente" : "✓ Completar"}
              </button>
              <button class="btn btn-sm btn-warning" onclick="editarTarea(${
                t.id
              })" aria-label="Editar tarea">
                ✏️ Editar
              </button>
              <button class="btn btn-sm btn-danger" onclick="eliminarTarea(${
                t.id
              })" aria-label="Eliminar tarea">
                🗑️ Eliminar
              </button>
            </div>
          `;

      lista.appendChild(li);
    });
  }

  localStorage.setItem("tareas", JSON.stringify(tareas));
}

//* ===============================
//* EVENTOS FILTRO Y ORDEN
//* ===============================
document
  .getElementById("filtro-tareas")
  .addEventListener("change", actualizarListaTareas);
document
  .getElementById("orden-tareas")
  .addEventListener("change", actualizarListaTareas);

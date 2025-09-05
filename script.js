//* Funcion agregarTarea, agrega la tarea al arreglo de tareas
function agregarTarea() {
  let nombreTarea = prompt("Ingrese el nombre de la tarea");

  if (nombreTarea !== null && nombreTarea.trim() !== "") {
    let tarea = {
      id: idSiguiente,
      nombre: nombreTarea,
      completado: false,
    };

    tareas.push(tarea);
    alert("Tarea agregada con exito a la lista");
  } else {
    alert("Invalido, ingrese un valor valido");
  }
  idSiguiente++;
}

//* Funcion listarTareas, lista todas las tareas tanto hechas como no hechas
function listarTareas() {
  alert("Lista de tareas en consola");
  if (tareas.length === 0) {
    console.log("No hay tareas por realizar");
  } else {
    console.log("Listado de tareas:");
    for (let i = 0; i < tareas.length; i++) {
      let estado = tareas[i].completado ? "completado" : "Por completar";
      console.log(`${tareas[i].id} - ${tareas[i].nombre} (${estado})`);
    }
  }
}

//* Funcion completarTarea, una vez realizada pasa su estado a completada
function completarTarea() {
  let idTarea = Number(prompt("Ingrese el id de la tarea a completar"));

  if (idTarea !== null && idTarea > 0) {
    let tareaEncontrada = tareas.find((t) => t.id === idTarea);
    if (tareaEncontrada) {
      tareaEncontrada.completado = true;
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

  if (idTarea !== null && idTarea > 0) {
    let tareaEncontrada = tareas.find((t) => t.id === idTarea);
    if (tareaEncontrada) {
      let tareasFiltradas = tareas.filter((t) => t.id !== idTarea);
      tareas.length = 0;
      tareas = tareasFiltradas;
      alert("Tarea eliminada con exito");
    } else {
      alert("No se pudo encontrar la tarea");
    }
  } else {
    alert("Invalido, ingrese un valor valido");
  }
}

//*  Datos globales definidos
let tareas = [];
let opcion = "";
let idSiguiente = 1;

//* Menu de navegacion con while y switch
while (opcion !== 5) {
  opcion = Number(
    prompt(
      "Seleccione una opcion\n 1. Agregar tarea\n 2. Listar tareas\n 3. Completar tarea\n 4. Eliminar tarea\n Salir"
    )
  );

  switch (opcion) {
    case 1:
      agregarTarea();
      break;
    case 2:
      listarTareas();
      break;
    case 3:
      completarTarea();
      break;
    case 4:
      eliminarTarea();
      break;
    case 5:
      alert("Gracias por utilizar el Administrador de Tareas");
      break;
    default:
      alert("Opcion invalida, vuelva a intentar");
  }
}

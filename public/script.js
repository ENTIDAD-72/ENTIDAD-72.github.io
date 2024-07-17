document.getElementById('empleado-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const identificacion = document.getElementById('identificacion').value;
    const contrato = document.getElementById('contrato').value;
    const jefe = document.getElementById('jefe').value;

    fetch('/agregar-empleado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, identificacion, contrato, jefe })
    })
    .then(response => response.text())
    .then(data => {
        // Aquí podrías hacer algo si necesitas procesar la respuesta del servidor
        document.getElementById('empleado-form').reset();
        // No elimines visualmente aquí, espera confirmación
        cargarEmpleados(); // Actualiza lista de empleados después de guardar
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('tarea-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const empleado = document.getElementById('empleado-select').value;
    const tarea = document.getElementById('tarea').value;
    const ubicacion = document.getElementById('ubicacion').value;
    const insumos = document.getElementById('insumos').value;
    const descripcion = document.getElementById('descripcion').value;
    const turno = document.getElementById('turno').value;

    fetch('/asignar-tarea', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ empleado, tarea, ubicacion, insumos, descripcion, turno })
    })
    .then(response => response.text())
    .then(data => {
        // Aquí podrías hacer algo si necesitas procesar la respuesta del servidor
        document.getElementById('tarea-form').reset();
        // No elimines visualmente aquí, espera confirmación
        cargarTareas(); // Actualiza tabla de tareas después de guardar
    })
    .catch(error => console.error('Error:', error));
});

function cargarEmpleados() {
    fetch('/obtener-empleados')
        .then(response => response.json())
        .then(data => {
            const empleadoSelect = document.getElementById('empleado-select');
            empleadoSelect.innerHTML = '';
            data.forEach(empleado => {
                const option = document.createElement('option');
                option.value = empleado.Nombre;
                option.textContent = empleado.Nombre;
                empleadoSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error:', error));
}

function cargarTareas() {
    fetch('/obtener-tareas')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('tareas-table').querySelector('tbody');
            tbody.innerHTML = ''; // Limpiar el contenido actual de la tabla
            data.forEach(tarea => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${tarea.Empleado}</td>
                    <td>${tarea.Tarea}</td>
                    <td>${tarea.Ubicacion}</td>
                    <td>${tarea.Insumos}</td>
                    <td>${tarea.Descripcion}</td>
                    <td>${tarea.Turno}</td>
                    <td>${tarea.Estado}</td>
                    <td>
                        <button onclick="cambiarEstado(${tarea.ID}, 'Pendiente')">Pendiente</button>
                        <button onclick="cambiarEstado(${tarea.ID}, 'En Progreso')">En Progreso</button>
                        <button onclick="cambiarEstado(${tarea.ID}, 'Terminado')">Terminado</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
    }
function cambiarEstado(id, estado) {
    fetch(`/cambiar-estado/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado })
    })
    .then(response => response.text())
    .then(data => {
        cargarTareas(); // Actualiza tabla de tareas después de cambiar el estado
    })
    .catch(error => console.error('Error:', error));
}

// Inicializar la carga de empleados y tareas al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarEmpleados();
    cargarTareas();
});



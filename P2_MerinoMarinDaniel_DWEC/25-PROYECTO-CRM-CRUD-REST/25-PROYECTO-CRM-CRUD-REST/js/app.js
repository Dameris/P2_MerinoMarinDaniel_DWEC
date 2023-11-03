document.addEventListener("DOMContentLoaded", function () {
    const dbName = "Clientes"
    const dbVersion = 1

    let db // Variable para almacenar la base de datos

    const request = indexedDB.open(dbName, dbVersion)

    request.onerror = function (event) {
        console.log("Error abriendo la base de datos.")
    }

    request.onsuccess = function (event) {
        db = event.target.result
        mostrarClientes()
    }

    request.onupgradeneeded = function (event) {
        db = event.target.result
        let objectStore

        // Si la base de datos no contiene el almacén de objetos "clientes", se crea
        if (!db.objectStoreNames.contains("clientes")) {
            objectStore = db.createObjectStore("clientes", { keyPath: "id", autoIncrement: true })
            objectStore.createIndex("nombre", "nombre", { unique: false })
            objectStore.createIndex("email", "email", { unique: true })
            objectStore.createIndex("telefono", "telefono", { unique: true })
            objectStore.createIndex("empresa", "empresa", { unique: false })
        }
    }

    // Función para mostrar los clientes en la interfaz
    function mostrarClientes() {
        if (!db) {
            console.error("La base de datos no está disponible.")
            return
        }

        // Inicia una transacción de solo lectura en el almacén de objetos "clientes"
        const transaction = db.transaction(["clientes"], "readonly")
        const objectStore = transaction.objectStore("clientes")
        const request = objectStore.getAll()

        // Al obtener los clientes con éxito, crea elementos en la interfaz para mostrarlos
        request.onsuccess = function (event) {
            const listadoClientes = document.getElementById("listado-clientes")

            event.target.result.forEach(function (cliente) {
                const row = document.createElement("tr")

                // Celdas con la información del cliente
                const nombreCell = document.createElement("td")
                nombreCell.textContent = cliente.nombre

                const telefonoCell = document.createElement("td")
                telefonoCell.textContent = cliente.telefono

                const empresaCell = document.createElement("td")
                empresaCell.textContent = cliente.empresa

                // Botones para borrar y editar clientes
                const accionesCell = document.createElement("td")
                const borrarLink = document.createElement("button")
                borrarLink.textContent = "Borrar"
                borrarLink.style.backgroundColor = "red"
                borrarLink.style.color = "white"
                borrarLink.style.border = "none"
                borrarLink.style.padding = "5px 10px"
                borrarLink.style.cursor = "pointer"

                const editarLink = document.createElement("a")
                editarLink.textContent = "Editar"
                editarLink.style.backgroundColor = "blue"
                editarLink.style.color = "white"
                editarLink.style.textDecoration = "none"
                editarLink.style.display = "inline-block"
                editarLink.style.padding = "5px 10px"
                editarLink.style.cursor = "pointer"
                editarLink.href = `editar-cliente.html?id=${cliente.id}`

                accionesCell.appendChild(borrarLink)
                accionesCell.appendChild(editarLink)

                borrarLink.addEventListener("click", function (event) {
                    event.preventDefault()
                    if (confirm("¿Estás seguro que deseas borrar este cliente?")) {
                        borrarCliente(db, cliente.id)
                        location.reload()
                    }
                })

                row.appendChild(nombreCell)
                row.appendChild(telefonoCell)
                row.appendChild(empresaCell)
                row.appendChild(accionesCell)

                listadoClientes.appendChild(row)
            })
        }
    }

    // Función para borrar un cliente
    function borrarCliente(db, clientId) {
        const transaction = db.transaction(["clientes"], "readwrite")
        const objectStore = transaction.objectStore("clientes")
        const request = objectStore.delete(clientId)

        request.onsuccess = function () {
            console.log("Cliente eliminado correctamente")
        }

        request.onerror = function (event) {
            console.error("Error al borrar el cliente:", event.target.error)
        }
    }
})
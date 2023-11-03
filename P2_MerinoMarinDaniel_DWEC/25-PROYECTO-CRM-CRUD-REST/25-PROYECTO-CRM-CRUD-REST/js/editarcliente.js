document.addEventListener('DOMContentLoaded', function () {
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

        const urlParams = new URLSearchParams(window.location.search)
        const clientId = urlParams.get('id')

        // Inicia una transacción de solo lectura en el almacén de objetos "clientes"
        const transaction = db.transaction(["clientes"], "readonly")
        const objectStore = transaction.objectStore("clientes")
        const request = objectStore.get(Number(clientId))

        request.onsuccess = function (event) {
            const cliente = event.target.result

            if (cliente) {
                document.querySelector("#nombre").value = cliente.nombre
                document.querySelector("#email").value = cliente.email
                document.querySelector("#telefono").value = cliente.telefono
                document.querySelector("#empresa").value = cliente.empresa
                document.querySelector('#id').value = cliente.id
            } else {
                console.error("Cliente no encontrado en la base de datos.")
            }
        }
    }

    // Evento al enviar el formulario
    document.querySelector("#formulario").addEventListener("submit", function (event) {
        event.preventDefault()

        // Obtiene los valores del formulario
        const nombreInput = document.querySelector("#nombre")
        const emailInput = document.querySelector("#email")
        const telefonoInput = document.querySelector("#telefono")
        const empresaInput = document.querySelector("#empresa")
        const idInput = document.querySelector('#id')
        const nombre = nombreInput.value
        const email = emailInput.value
        const telefono = telefonoInput.value
        const empresa = empresaInput.value
        const id = idInput.value

        // Verifica si los campos están vacíos y muestra una alerta si es así
        if (nombre === "" || email === "" || telefono === "" || empresa === "") {
            alert("Por favor, rellena todos los campos")
            return
        }

        // Realiza una transacción de escritura para editar un cliente
        const transaction = db.transaction(["clientes"], "readwrite")
        const objectStore = transaction.objectStore("clientes")
        const index = objectStore.index("email")

        const requestGetEmail = index.get(email)

        requestGetEmail.onsuccess = function (event) {
            // if (event.target.result && event.target.result.id !== id) {
                // alert("El correo electrónico ya está registrado para otro cliente. Usa otro correo electrónico.")
            // } else {
                const cliente = {
                    nombre: nombre,
                    email: email,
                    id: Number(id),
                    telefono: telefono,
                    empresa: empresa
                }

                const requestUpdate = objectStore.put(cliente)

                requestUpdate.onsuccess = function () {
                    console.log("Cliente actualizado en la base de datos");
                    alert("Cliente actualizado correctamente")

                    // Limpia los campos del formulario después de editar el cliente
                    nombreInput.value = ""
                    emailInput.value = ""
                    telefonoInput.value = ""
                    empresaInput.value = ""
                    idInput.value = ""
                }

                requestUpdate.onerror = function (event) {
                    console.error("Error al actualizar el cliente:", event.target.error)
                    alert("Error al actualizar el cliente. Verifica los datos.")
                }
            //}
        }
    })
})
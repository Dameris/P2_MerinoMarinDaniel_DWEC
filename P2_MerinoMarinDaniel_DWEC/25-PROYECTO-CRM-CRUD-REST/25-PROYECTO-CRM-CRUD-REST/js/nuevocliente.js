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

        // Inicia una transacción de solo lectura en el almacén de objetos "clientes"
        const transaction = db.transaction(["clientes"], "readonly")
        const objectStore = transaction.objectStore("clientes")
        const request = objectStore.getAll()

        request.onsuccess = function (event) {
            console.log("Clientes almacenados en la base de datos:")
            event.target.result.forEach(function (cliente) {
                console.log(cliente)
            })
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
        const nombre = nombreInput.value
        const email = emailInput.value
        const telefono = telefonoInput.value
        const empresa = empresaInput.value

        // Verifica si los campos están vacíos y muestra una alerta si es así
        if (nombre === "" || email === "" || telefono === "" || empresa === "") {
            alert("Por favor, rellena todos los campos")
            return
        }

        // Realiza una transacción de escritura para añadir un nuevo cliente
        const transaction = db.transaction(["clientes"], "readwrite")
        const objectStore = transaction.objectStore("clientes")
        const index = objectStore.index("email")

        const requestGetEmail = index.get(email)

        // Comprueba si el correo o el teléfono ya están registrados en la base de datos
        requestGetEmail.onsuccess = function (event) {
            if (event.target.result) {
                alert("El correo electrónico ya está registrado.")
            } else {
                const requestGetTelefono = index.get(telefono)

                requestGetTelefono.onsuccess = function (event) {
                    if (event.target.result) {
                        alert("El número de teléfono ya está registrado.")
                    }
                    else {
                        const cliente = {
                            nombre: nombre,
                            email: email,
                            telefono: telefono,
                            empresa: empresa
                        }

                        const requestAdd = objectStore.add(cliente)

                        requestAdd.onsuccess = function () {
                            console.log("Cliente añadido a la base de datos.")
                            alert("Cliente añadido correctamente.")

                            // Limpiar los campos del formulario después de agregar el cliente
                            nombreInput.value = ""
                            emailInput.value = ""
                            telefonoInput.value = ""
                            empresaInput.value = ""
                        }

                        requestAdd.onerror = function (event) {
                            console.error("Error al añadir el cliente:", event.target.error)
                            alert("Error al añadir el cliente. Por favor, verifica los datos.")
                        }
                    }
                }
            }
        }
    })
})
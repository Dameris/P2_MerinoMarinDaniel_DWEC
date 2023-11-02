## Investigación y Aprendizaje Indexed.db  
1. Investigación:  
	* Conceptos clave de IndexedDB:  
	IndexedDB es una base de datos de objetos incorporada en los navegadores web modernos. Su estructura se compone de objetos de datos y almacena información de manera jerárquica. A diferencia de otras formas de almacenamiento en el navegador, como LocalStorage o SessionStorage, IndexedDB permite el almacenamiento de grandes cantidades de datos y facilita consultas complejas mediante un modelo transaccional.  

	* Sintaxis y operaciones:  
	Para crear y configurar una base de datos en IndexedDB, se siguen pasos que implican la apertura de la base de datos, creación de almacenes de objetos y definición de la estructura de la base de datos. Las operaciones básicas incluyen la lectura, escritura, actualización y eliminación de datos en almacenes de objetos.

	* Transacciones y consultas:  
	IndexedDB utiliza transacciones para garantizar operaciones atómicas y eficientes. Las consultas más complejas se realizan mediante operaciones como get, getAll, put, delete, etc.  

2. Guía:
	```javascript 
	```* Configuración inicial:  
	Iniciar una base de datos en IndexedDB.  
	Crear almacenes de objetos y definir versiones.```  	
	  
	// Abrir una base de datos en IndexedDB  
	let request = indexedDB.open('nombreBaseDatos', 1);  
	  
	// Crear o actualizar la estructura de la base de datos  
	request.onupgradeneeded = function(event) {  
		let db = event.target.result;  
		let objectStore = db.createObjectStore('nombreAlmacen', { keyPath: 'id', autoIncrement: true });  
	};  

	```* Operaciones básicas:  
	Ejemplos de operaciones CRUD.```  
	  
	// Escribir datos en un almacén de objetos  
	let transaction = db.transaction(['nombreAlmacen'], 'readwrite');  
	let store = transaction.objectStore('nombreAlmacen');  
	let data = { id: 1, name: 'Ejemplo' }; 
	let requestAdd = store.add(data); 
	  
	// Leer datos de un almacén de objetos  
	let getRequest = store.get(1);  
	getRequest.onsuccess = function(event) {  
		let result = getRequest.result;  
		console.log('Datos obtenidos:', result);  
	};  

	```* Transacciones:  
	Ejemplos de uso de transacciones para manejar múltiples operaciones.```  
	  
	// Iniciar una transacción  
	let transaction = db.transaction(['nombreAlmacen'], 'readwrite');  
	let store = transaction.objectStore('nombreAlmacen');  
	  
	// Realizar operaciones dentro de la transacción  
	let getRequest = store.get(1);  
	getRequest.onsuccess = function(event) {  
		let result = getRequest.result;  
		console.log('Datos obtenidos:', result);  
	};  
	  
	´´´Consultas y búsquedas:  
	Ejemplos de consultas más avanzadas.´´´  
	  
	// Realizar consultas más avanzadas  
	let transaction = db.transaction(['nombreAlmacen'], 'readwrite');  
	let store = transaction.objectStore('nombreAlmacen');  
	let getRequestAll = store.getAll();  
	getRequestAll.onsuccess = function(event) {  
		let result = getRequestAll.result;  
		console.log('Todos los datos:', result);  
	};

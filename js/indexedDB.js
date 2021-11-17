
window.indexedDB = window.indexedDB || window.mozIndexedDB || 
window.webkitIndexedDB || window.msIndexedDB;

var bd;
var solicitud;
var Tabla;
var result;
var zonadatos;
var txtApellido;
var txtNombre;
var cursor;
var cuenta = 0;

function FilterInput(event) {
    var keyCode = ('which' in event) ? event.which : event.keyCode;

    isNotWanted = (keyCode == 69 || keyCode == 101);
    return !isNotWanted;
};
function handlePaste (e) {
    var clipboardData, pastedData;


    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text').toUpperCase();

    if(pastedData.indexOf('E')>-1) {

        e.stopPropagation();
        e.preventDefault();
    }
};



function iniciar(){

	zonadatos = document.getElementById("zonadatos");
	txtApellido = document.getElementById("apellido");
	txtNombre = document.getElementById("nombre");
	txtEdad = document.getElementById("edad");
	txtUsuario = document.getElementById("usuario");
	btnVerUsuarios = document.getElementById("VerUsuarios");
	btnRegistrar = document.getElementById("Registrar");
	btnBuscar = document.getElementById("Buscar");
	btnActualizar = document.getElementById("Actualizar");
	btnEliminar = document.getElementById("Eliminar");


	btnVerUsuarios.addEventListener("click", VerUsuarios, false);
	btnRegistrar.addEventListener("click", Registrar, false);
	btnBuscar.addEventListener("click", Buscar, false);
	btnActualizar.addEventListener("click", Actualizar, false);
	btnEliminar.addEventListener("click", Eliminar, false);


	var solicitud = indexedDB.open("basePB");

	solicitud.onsuccess = function(e){

		bd = e.target.result;

	}

	solicitud.onupgradeneeded = function(e){

		bd = e.target.result;
		bd.createObjectStore("gente", {keyPath: "clave"});

		var tbUsuarios = bd.createObjectStore("usuarios", {keyPath: "apellido"});

		tbUsuarios.createIndex("nombre", "nombre", { unique: false});
		tbUsuarios.createIndex("usuario", "usuario", { unique: true});
		var tbFacturas = bd.createObjectStore("facturas", {keyPath: "NumFac"});

		tbFacturas.createIndex("id", "id", { unique: true});
		tbFacturas.createIndex("nombre", "nombre", { unique: false});
	}
}

function Registrar(){

	var apellido = document.getElementById("apellido").value;
	var nombre = document.getElementById("nombre").value;
	var edad = document.getElementById("edad").value;
	var usuario = document.getElementById("usuario").value;
	var clave = document.getElementById("contrasena").value;

	var transaccion = bd.transaction(["usuarios"], "readwrite");

	var almacen = transaccion.objectStore("usuarios");

	var agregar = almacen.add({apellido: apellido, nombre: nombre,
		edad: edad,  usuario: usuario, clave: clave});

	agregar.addEventListener("success", VerUsuarios, false);
	alert("El Registro se realizó con éxito");

	Limpiar();
}

function Limpiar(){

	zonadatos.innerHTML = "";
	document.getElementById("nombre").value = "";
	document.getElementById("apellido").value = "";
	document.getElementById("edad").value = "";
	document.getElementById("usuario").value = "";
	document.getElementById("contrasena").value = "";
}

function Buscar(){

	cuenta = 0;
	if (document.getElementById("apellido").value !== ""){
		BuscarApellido();
	}
	if (document.getElementById("nombre").value !== ""){
		BuscarNombre();
	}
}

function BuscarApellido(){

	var transaccion = bd.transaction(["usuarios"], "readonly");
	var almacen = transaccion.objectStore("usuarios");

	var buscaras = txtApellido.value;
	var ver = IDBKeyRange.only(buscaras);
	var cursor = almacen.openCursor(ver, "next");

	cursor.addEventListener("success", mostrarDatosUsuarios, false);
}

function BuscarNombre(){

	var bNombre = document.getElementById("nombre").value;

	var transaccion = bd.transaction(["usuarios"], "readwrite");
	var almacen = transaccion.objectStore("usuarios");
	var index = almacen.index("nombre");
	var cursor = index.openCursor(bNombre);

	cursor.addEventListener("success", mostrarDatosUsuarios, false);
}

function Actualizar(){

	var apellido = document.getElementById("apellido").value;

	var edad = document.getElementById("edad").value;
	var usuario = document.getElementById("usuario").value;
	var clave = document.getElementById("contrasena").value;
	var bNombre = document.getElementById("nombre").value;

	var transaccion = bd.transaction(["usuarios"], "readwrite");
	var almacen = transaccion.objectStore("usuarios");
	var request = almacen.put({apellido: apellido, nombre: bNombre,
		edad: edad,  usuario: usuario, clave: clave});
	request.onsuccess = function (e){
		alert("Se actualizó el REGISTRO");
	}
	request.onerror = function (e){
	      	alert("Actualización sin éxito");
	}
}

function Eliminar(){

	var bApellido = document.getElementById("apellido").value;

	var transaccion = bd.transaction(["usuarios"], "readwrite");
	var almacen = transaccion.objectStore("usuarios");
	var request =almacen.delete(bApellido);
	request.onsuccess = function (e){
		alert("Se Eliminó el REGISTRO");
		Limpiar();
	}
	request.onerror = function (e){
	      	alert("Eliminación sin éxito");
	}
}

function VerUsuarios() {

	zonadatos.innerHTML = "";
	cuenta = 0;
	zonadatos.innerHTML = "";
	var transaccion = bd.transaction(["usuarios"], "readonly");
	var almacen = transaccion.objectStore("usuarios");

	var cursor = almacen.openCursor();

	cursor.addEventListener("success", mostrarDatosUsuarios, false);
}

function mostrarDatosUsuarios(e){

	var cursor = e.target.result;

	if(cursor) {

		zonadatos.innerHTML+="<div>" + cuenta + " --> " + cursor.value.apellido + "-" + 
		cursor.value.nombre + "-" + cursor.value.edad + "-" + 
		cursor.value.usuario + "</div>";

		cursor.continue();
		document.getElementById("apellido").value = cursor.value.apellido;
		document.getElementById("nombre").value = cursor.value.nombre;
		document.getElementById("edad").value = cursor.value.edad;
		document.getElementById("usuario").value = cursor.value.usuario;
		document.getElementById("contrasena").value = cursor.value.clave;
		cuenta = cuenta + 1;
	}
	if (cuenta == 0){
		alert("Dato NO encontrado");
	}
}

window.addEventListener("load", iniciar, false);






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

function iniciar(){

	btnLogin = document.getElementById("BtnLogin");

	btnLogin.addEventListener("click", Login, false);

	var solicitud = indexedDB.open("basePB");
	solicitud.onsuccess = function(e){

		bd = e.target.result;
	}
	solicitud.onupgradeneeded = function(e){
		bd = e.target.result;
		var tbUsuarios = bd.createObjectStore("usuarios", {keyPath: "apellido"});
		tbUsuarios.createIndex("nombre", "nombre", { unique: false});
		tbUsuarios.createIndex("usuario", "usuario", { unique: true});
	}
}

function Login(){
	var bUsuario = document.getElementById("login").value;
	var bContra = document.getElementById("logContra").value;
	var transaccion = bd.transaction(["usuarios"], "readwrite");
	var almacen = transaccion.objectStore("usuarios");
	var index = almacen.index("usuario");
	var request = index.openCursor(bUsuario);
	request.onsuccess = function(e){
		var cursor = e.target.result;
		if(cursor) {

			var SisUsuario = cursor.value.usuario;
			var SisContra = cursor.value.clave;

		}
		if (SisUsuario == bUsuario && bContra == SisContra){
			alert("Login CORRECTO . . . Vamos a Inicio");
			window.open('inicio.html','_top');

		}
		if (SisUsuario !== bUsuario || bContra !== SisContra){
			alert("Login INCORRECTO");
		}
	}
}


window.addEventListener("load", iniciar, false);





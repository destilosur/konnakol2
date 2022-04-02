import { cargarCompoEnDisplay } from './component';
import { compo1 } from '../index';

let listaPreset = {};
const alertasApp = document.querySelector('.alertas');

let urlApi = 'http://localhost:8082/api/compo';

//petición---------------------------------

const peticion = async request => {
	try {
		const resp = await fetch(request);

		return await resp.json();
	} catch (error) {
		let msj = error.statusText || 'ocurrio un error';

		return { error, msj };
	}
};

const obtenerPredefinidos = async () => {
	const { total, compos, msg } = await peticion(urlApi);

	if (msg) return dibujarMSG(msg);

	return compos;
};

export const cargarPredefinidos = async () => {
	listaPreset = await obtenerPredefinidos();

	const $templateTrEnlace = document.querySelector('#tr-enlace').content;

	listaPreset.forEach((compo, index) => {
		const enlase = $templateTrEnlace.querySelector('#item-lista #td1 #enlace-item-lista');

		enlase.setAttribute('value', index);
		enlase.textContent = compo.nombre;
		$templateTrEnlace.querySelector('#td2').textContent = compo.grupo;
		$templateTrEnlace.querySelector('#td3').textContent = compo.nBeats;
		let $node = document.importNode($templateTrEnlace, true);
		document.body.querySelector('#contenedor-lista-predefinidos table tbody').appendChild($node);
	});

	document.body.querySelectorAll('#contenedor-lista-predefinidos #enlace-item-lista').forEach(enlace =>
		enlace.addEventListener('click', e => {
			const indexCompoLista = e.target.getAttribute('value');
			cargarCompoEnDisplay(listaPreset, indexCompoLista);
		})
	);
};

export const guardarPredefinidos = async () => {
	let guardar = false;
	const jwt = localStorage.getItem( 'token' );
	console.log(jwt);

	guardarDatos();

	const data = { nombre: compo1.nombre, grupo: compo1.grupo, nBeats: compo1.nBeats, arrayLineas: compo1.arrayLineas };

	const peticionPOST = new Request(urlApi, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-token': jwt 
		},
		body: JSON.stringify(data),
	});

	// const resp = await peticion(peticionPOST);
	const { msg, status } = await peticion(peticionPOST);
	console.log('status', status);

	if (msg) {
		const msgString = msg.errors[0].msg;

		dibujarMSG(msgString);

		//Comprueba si mensaje es que se repite nombre compo codigo en msg E11000
		if (msgString.includes('E11000')) {
			setTimeout(() => {
				guardar = confirm(`La Lista ya contiene el nombre. Desea sobreescribir ${data.nombre}?`);
				if (!guardar) return;

				modificarCompo();
			}, 4500);
		}
	} else if (status === 200) {
		const msg = `status: ${status}  guardado en  en base de datos presets`;
		dibujarMSG(msg);
	}
};

const guardarDatos = () => {
	compo1.nombre = document.getElementById('nombre').value;
	compo1.grupo = document.getElementById('grupo').value;
	compo1.nBeats = document.getElementById('nBeats').value;
};

const modificarCompo = async () => {
	const jwt = localStorage.getItem( 'token' );
	guardarDatos();

	const data = { nombre: compo1.nombre, grupo: compo1.grupo, nBeats: compo1.nBeats, arrayLineas: compo1.arrayLineas };

	//pedir ID de compo
	const {id,status} = await peticion(urlApi+'/'+data.nombre); 

	if(!id || status !== 200) return dibujarMSG('Hubo un error no se encuentra ID de la Compo');


	const peticionPUT = new Request(`${urlApi}/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'x-token': jwt 
		},
		body: JSON.stringify(data),
	});

	const {msg,ok} = await peticion(peticionPUT);
	console.log(msg);
	if(msg) {
		dibujarMSG('Error la compo no se pudo actualizar');
		return console.error(msg);
	}

	if(ok)dibujarMSG('Compo Update ok.');


};

const dibujarMSG = msg => {
	alertasApp.classList.add('alertas-activo');
	alertasApp.textContent = msg;

	setTimeout(() => {
		alertasApp.classList.remove('alertas-activo');
	}, 3000);
	console.error(`ERROR:  ${msg} `);
};

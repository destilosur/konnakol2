import { escribirPredefinidos } from './component';



let listaPreset = {} ;
let urlApi = 'http://localhost:8082/api/compo'


const obtenerPredefinidos = async () => {
	try {
		const resp = await fetch(urlApi);
		if (!resp.ok) throw { status: resp.status, statusText: resp.statusText };
		const json = resp.json();
		return json;
	} catch (error) {
		mensajeAlerta(error.statusText, `No se puede cargar Predefinidos ${error.status}`);
	}
};


export const cargarPredefinidos = async () => {
	listaPreset = await obtenerPredefinidos();
	// console.log(listaPreset);

	const $templateTrEnlace = document.querySelector('#tr-enlace').content;

	listaPreset.compos.forEach((compo, index) => {
		const enlase = $templateTrEnlace.querySelector('#item-lista #td1 #enlace-item-lista');

		enlase.setAttribute('value', index);
		enlase.textContent = compo.nombre;
		$templateTrEnlace.querySelector('#td2').textContent = compo.grupo;
		$templateTrEnlace.querySelector('#td3').textContent = compo.nBeats;
		let $node = document.importNode($templateTrEnlace, true);
		document.body.querySelector('#contenedor-lista-predefinidos table tbody').appendChild($node);
	});

	document.body
		.querySelectorAll('#contenedor-lista-predefinidos #enlace-item-lista')
		.forEach(enlace => enlace.addEventListener('click', (e)=>{
			const indexCompoLista =e.target.getAttribute('value');
			escribirPredefinidos(listaPreset.compos,indexCompoLista)
		}));
};

export const guardarPredefinidos = async() =>{

	const data = {nombre: 'adi tala',grupo: 'teen tal', nBeats: '16', arrayLineas: [
		{ "id": 1, "rep": 2, "arraySilabas": ["[Ta]---", "(Ka)---", "(Ti)---", "(Mi)---"] },
		{ "id": 2, "rep": 4, "arraySilabas": ["(Ta)-", "Ka-", "(Ti)-", "Mi-"] },
		{ "id": 3, "rep": 8, "arraySilabas": ["(Ta)katimi"] },
		{ "id": 4, "rep": 4, "arraySilabas": ["(Ta)-", "Ka-", "(Ti)-", "Mi-"] }
	]};
	
	fetch(urlApi, {
		method: 'POST',
		headers:{
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
		.then(resp => resp.json())
		.then(( data ) => {
			console.log( data );

		})
		.catch(err => console.log('ERROR: ', err));

}


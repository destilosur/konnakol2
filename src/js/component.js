import { Linea } from '../classes/linea.class';
import { compo1 } from '../index';
import { play,init } from './metronome';

// import data from '../data.json';

const d = document;
const $btns = d.querySelectorAll('body .display-botones .button , #lista a');
const $template = document.querySelector('#caja-escritura').content;
let $cajaNotas;
const $total = document.querySelector('#total');
const $alertas = document.querySelector('#alertas');
let modoBloqueo = false;
const $select = document.querySelector('#option-bol');
const $playButton = document.querySelector('#play-button');
const playIcono = document.querySelector('#play-button i');

let lineaID;
let escribirInputs = false;
let repetir = 1; // para icono x2 x3 x4 se reinicia en focusLinea
let contadorSilaba = 0;
let ultimoNum = 0;
let parrafos = [];
let subD = [1,2, 3, 4, 6, 8];
let subDIndex = 0;
let contadorSubD = 0;

const speakSilabas = [
	['Ta', 'Taka', 'Takite', 'Takatimi', 'Tatikinaton', 'TakatimiTaka', 'ta-ti-kinaton', 'TakatimiTakajuna', 'TakatimiTakaTakita'],

	['Ka','Ke','Ki','Te','Ti','Mi','Ton', 'Ju','Na', '-'],
	['Ta-','Ka-','Ki-','Ti-','Mi-', 'Timi','Juna', 'Kita', 'Kina', 'Tati','--'],
	['Tan-gu', 'Ta--','Ti--','Ka--','Ki--','Mi--', 'ta-ki', '-te-', '-ta-', 'Ta-ka', 'Ti-mi', 'Kinaton','---'],
	['Takajuna', 'Kitataka', 'terekite', 'tatikena', 'Tikinaton','Ta---','Ka---','Ki---','Ti---','Mi---', 'Ta-ka-', 'Ti-mi-', 'Ta--ah',  'Tati--', 'Tati-ta', '----'],
	['Takatakite', 'Takitetaka', 'Ta-takita','TakaTan-gu','Ta-kinaton', 'Tati-naton', 'Kitakinaton','Ta----', 'Ta-ah--', 'Ta--ta-','-----'],
	['TakatimiTa-','Terekitetaka','Terekiteta-','TakiteTakite', 'Tatikenaton-', 'Tati-kinaton', 'tatike-naton', 'Tatikena-ton', 'Ta-ki-ta-', 'ki-na-ton'],
	['Ta---kenaton', 'Ta---ah--', 'Ta------', 'Ta-ti-Tan-gu', 'Ta-ka-ti-mi'],
	['Tati-ke-na-ton', 'Tan-guTatikenaton', 'TakaterekiteTaka', 'Ta-terekiteTaka'],
	['Ta-di-ke-na-ton', 'Ta-ti-Tatikenaton', 'TakatimiTatikenaton', 'TakaTakaTakaTakite', 'TakaTakiteTakaTaka'],
];

// -------------------------------------FUNCIONES ARRAY Y DOM-----------------------------------------

export const crearTablaHtml = id => {
	lineaID = id;
	$template.querySelector('.notas').dataset.id = id;
	let $node = d.importNode($template, true);
	document.body.querySelector('.marco-display').appendChild($node);
};

export const inicio = () => {
	if (localStorage.getItem('compoLista')) {
		loadCompoLista();
		crearListaHtml();
	}
	if (compo1.nombre !== 'default') return (modoBloqueo = true);
	focusLinea();
};

const focusLinea = () => {
	if (modoBloqueo) return mensajeAlerta('Press Edit', '');
	$cajaNotas = document.body.querySelectorAll(' .borde-notas');
	$cajaNotas.forEach(linea => linea.classList.remove('edit'));
	$cajaNotas[lineaID - 1].classList.add('edit');
	contadorSubD = 0; //subdibiciones borra o no
	subDIndex = 0; //subdibiciones index array ':3'
	repetir = 1;
};

const eleccionDeBol = (id, num) => {
	//PREDETERMINADO
	escribirHtml(id, speakSilabas[0][num - 1]);
	escribirArray(id, speakSilabas[0][num - 1]);
	compo1.guardarLocalStorage();

	reiniciarSelect();

	ultimoNum = num; //para borrar bol selecionado en el option(evento click)

	speakSilabas[num].forEach(elem => cargarSelect(elem));
};

const reiniciarSelect = () => {
	if ($select.options) [...$select.options].forEach(elem => elem.remove());
	const etiqueta = document.createElement('option');
	etiqueta.textContent = 'Variation Bol';
	$select.append(etiqueta);
	$select.disabled = true;
};

// CARGA SELECT
const cargarSelect = opcion => {
	$select.disabled = false;

	const opcionBol = document.createElement('option');
	opcionBol.setAttribute('value', opcion);
	opcionBol.textContent = opcion;
	$select.append(opcionBol);
};

// GUARDA LO QUE HAY EL LINEA(.BORDE NOTAS P ) EN EL ARRAY CON SUS DRUTAM
const guardaArray = () => {
	const parrafo_silabas = document.querySelectorAll('.notas')[lineaID - 1].querySelectorAll('.borde-notas p');
	let silabasTemp = [...parrafo_silabas].map(p => p.textContent);

	parrafo_silabas.forEach((silaba, index) => {
		if (silaba.matches('.drutam')) {
			silabasTemp[index] = `(${silabasTemp[index]})`;
		}
		if (silaba.matches('.anudrutam')) {
			silabasTemp[index] = `[${silabasTemp[index]}]`;
		}
	});

	silabasTemp = silabasTemp.join('').split(' ');

	silabasTemp = silabasTemp.map(bol => bol.trim());
	silabasTemp = silabasTemp.filter(bol => bol.length !== 0);
	compo1.arrayLineas[lineaID - 1].arraySilabas = [...silabasTemp];


	compo1.guardarLocalStorage();
};



// escribe Array -----------------
export const escribirArray = (id, bol, repet) => {
	if (!modoBloqueo && !escribirInputs && repet === 'R') {
		compo1.arrayLineas[id - 1].rep = bol;
		compo1.guardarLocalStorage();
	} else if (!modoBloqueo && !escribirInputs) guardaArray();
};
// escribe HTML ----------------
export const escribirHtml = (id, bol) => {
	if (modoBloqueo) return mensajeAlerta('Press Edit \n and dont forget to save', 'It can not be written ');

	if (typeof bol !== 'string') return console.error`<p> El dato guardado ${bol} no es una cadena de texto`;

	if (!escribirInputs) {
		let indiceD = [];
		let indiceA = [];

		bol = bol.replaceAll('-', '--');
		bol = bol.replaceAll(/tan/gi, 'an');
		bol = bol.replaceAll(/ton/gi, 'on');

		if (bol.includes('(')) {
			let idLetra = bol.indexOf('('); //primera vez

			while (idLetra >= 0) {
				indiceD.push(idLetra);
				idLetra = bol.indexOf('(', idLetra + 1);
			}
			indiceD = indiceD.map((ind, index) => (ind = ind - index * 2));

			bol = bol.replace(/[()]/g, '');
		}

		if (bol.includes('[')) {
			let idLetra = bol.indexOf('['); //primera vez

			while (idLetra >= 0) {
				indiceA.push(idLetra);
				idLetra = bol.indexOf('[', idLetra + 1);
			}
			indiceA = indiceA.map((ind, index) => (ind = ind - index * 2));

			bol = bol.replace(/[\[\]]/g, '');
		}

		//LE RESTAMOS AL INDICE DE() LOS [] ENCONTRADOS
		// TODO: aca restamos pero si el anudrutam esta despues del drutan resta igual y el drutam aparece una silaba antes
		indiceD=indiceD.map(n=>n-(indiceA.length*2));
		

		for(let d in indiceD ){

		for(let a in indiceA){

			if(indiceD[d]<indiceA[a])indiceD[d]+=2;
		}
	}
		

		let bolCortado = bol.trim().match(/ta|te|ti|ka|ke|ki|mi|na|ju|ton|--|an|on|gu|ah|re|:1|:2|:3|:4|:6|:8/gi);

		bolCortado.push('&nbsp &nbsp');

		bolCortado.forEach((silaba, index) => {
			const speak = document.createElement('p');
			speak.innerHTML = silaba;
			if (index === 0) speak.classList.add('first');
			indiceD.forEach(ind => {
				if (ind / 2 === index) speak.classList.add('drutam');
			});
			
			indiceA.forEach(ind => {
				if (ind / 2 === index) speak.classList.add('anudrutam');
			});
			if (speak.innerHTML === '--') {
				speak.innerHTML = '-';
				speak.classList.add('guiones');
			}
			if (speak.innerHTML === 'an') speak.innerHTML = 'Tan';
			if (speak.innerHTML === 'on') speak.innerHTML = 'ton';

			$cajaNotas = document.body.querySelectorAll(' .borde-notas');
			$cajaNotas[id - 1].appendChild(speak);
		});

		escribirTotalSub();
	}
};

export const escribirRepeticiones = (id, rep) => {
	const ledRepetir = document.querySelectorAll('.cruz')[id - 1];
	ledRepetir.dataset.rep = rep;
	ledRepetir.dataset.id = id;
	ledRepetir.textContent = rep;
	rep === 1 ? ledRepetir.classList.remove('mostrar') : ledRepetir.classList.add('mostrar');
	escribirTotalSub();
};

const borrarUltimaSilaba = id => {
	// if (modoBloqueo) return alert('Press Edit \ndont forget to save');
	if (modoBloqueo) return mensajeAlerta('Press Edit \n and dont forget to save', 'It can not be written ');

	if (!escribirInputs && !start) {
		if ($cajaNotas[id - 1].querySelector('p')) $cajaNotas[id - 1].lastChild.remove();
		guardaArray();
		escribirTotalSub();
	}
};

export const borrarLineasHtml = () => {
	if (modoBloqueo && !start) return mensajeAlerta('Press Edit \n and dont forget to save', 'It can not be written ');

	document.body.querySelectorAll('.notas').forEach(elem => elem.remove());
	escribirTotalSub();
};

const reiniciarCompo = () => {
	if (start) isStart(aplicarCambiosTempo());
	modoBloqueo = false;
	compo1.reiniciarCompo();
	borrarLineasHtml();
	compo1.nuevaLinea();
	focusLinea();
	reiniciarSelect();
	$total.textContent = '0';
	contadorSubD = 0;
};

//           ///////////////////////////////////////EVENTOS/////////////////////////////////////////////////////

function accionBoton() {
	// -----------------------EVENTO-BOTONES LUCES--------------------------------------------------------------
	let btn = this.matches('.ledBlanco') ? this.parentElement : this;

	if (btn.children[0]) btn.children[0].classList.toggle('ledAzul');

	btn.classList.toggle('encendido');
	btn.classList.toggle('button-display');

	setTimeout(() => {
		btn.classList.toggle('encendido');
		btn.classList.toggle('button-display');
		if (btn.children[0]) btn.children[0].classList.toggle('ledAzul');
	}, 1000);

	// -----------------------------BOTONES ACCIÒN---------------------------------------------------------------
	//ESCRIBIR 1 A 9
	if (btn.matches('.btn-number') && btn.textContent > 0 && btn.textContent < 10) {
		eleccionDeBol(lineaID, parseInt(btn.textContent));
		contadorSubD = 0;
		subDIndex = 0;
	}

	if (btn.textContent === 'R' && !modoBloqueo) {
		const ledRepetir = document.querySelectorAll('.cruz')[lineaID - 1];

		ledRepetir.textContent = repetir++;
		ledRepetir.classList.add('mostrar');
		if (repetir > 9) {
			repetir = 1;
			ledRepetir.classList.remove('mostrar');
		}
		//html data-rep
		escribirRepeticiones(lineaID, repetir);
		//----------array------------------------
		escribirArray(lineaID, repetir, 'R');
	}

	//SubD

	if (btn.textContent === 'SubD') {
		if (subDIndex === 6) subDIndex = 0;
		if (contadorSubD > 0) {
			borrarUltimaSilaba(lineaID);
			borrarUltimaSilaba(lineaID);
		}
		escribirHtml(lineaID, `:${subD[subDIndex]}`);
		escribirArray(lineaID, `:${subDIndex[subDIndex]}`);
		subDIndex++;
		contadorSubD++;
		compo1.guardarLocalStorage();

		reiniciarSelect();
	}

	//BACK
	if (btn.textContent === 'Back') {
		borrarUltimaSilaba(lineaID);
		reiniciarSelect();
	}

	//NEW LINE
	if (btn.textContent === 'New Line' && !modoBloqueo ) {
		compo1.nuevaLinea();
		focusLinea();
		reiniciarSelect();
	}

	//SAVE------
	if (btn.textContent === 'Save') {
		if (modoBloqueo) return mensajeAlerta('it`s already saved\nPress Edit \ndont forget to save', '');
		if (start) isStart(aplicarCambiosTempo());
		loadCompoLista();
		guardarCompoEnLista();
		crearListaHtml();
		reiniciarSelect();
		modoBloqueo = true;
		$cajaNotas.forEach(linea => linea.classList.remove('edit'));
	}

	//LOAD
	if (btn.textContent === 'Load') {
		modoBloqueo = false;
		loadCompoLista();
		document.querySelector('.lista-panel').classList.toggle('lista-panel-active');
		reiniciarSelect();
	}

	if (btn.textContent === 'Delete') {

		if(start)isStart(aplicarCambiosTempo());
		deleteCompo(compo1.nombre);
	}

	//REINICIAR
	if (btn.textContent === 'New') {
		reiniciarCompo();
		compo1.guardarLocalStorage();
	}

	//EDIT
	if (btn.textContent === 'Edit') {
		if (!modoBloqueo) return mensajeAlerta('First load Tala', '');
		modoBloqueo = false;
		focusLinea();
		inputs.forEach(input => (input.disabled = false));
	}

	if (btn.textContent === 'Close') {
		document.querySelector('.lista-panel').classList.toggle('lista-panel-active');
	}
}

$btns.forEach(elem => elem.addEventListener('click', accionBoton));

// -----------------------EVENTO-TECLAS------------------------------------------

export const accionTeclas = e => {
	const num = parseInt(e.key);

	if (num > 0 && num < 10 && !start) {
		eleccionDeBol(lineaID, num);
		contadorSubD = 0;
		subDIndex = 0;
	}

	if (e.key === 'Backspace' || e.code === 'Backspace') {
		borrarUltimaSilaba(lineaID);
		reiniciarSelect();
	}

	if (e.keyCode == 13 && !modoBloqueo && !escribirInputs && !start) {
		compo1.nuevaLinea();
		focusLinea();
		reiniciarSelect();
	}
};

document.addEventListener('keydown', accionTeclas);

//----------------EVENTO CLICK-------------------------------------------------
document.addEventListener('click', e => {
	// ESCRIBIR LOS DRUTAM () EN EL ARRAY
	if (e.target.parentElement) {
		if (e.target.parentElement.matches('.edit') && e.target.matches('.anudrutam')) {
			e.target.classList.remove('anudrutam');
			guardaArray();
		} else if (e.target.parentElement.matches('.edit') && e.target.matches('.drutam')) {
			e.target.classList.add('anudrutam');
			e.target.classList.remove('drutam');
			guardaArray();
		} else if (e.target.parentElement.matches('.edit')) {
			e.target.classList.add('drutam');
			guardaArray();
		}
	}

	//PONER FOCUS
	if (e.target.matches('.borde-notas')) {
		if (compo1.arrayLineas.length !== 0) {
			lineaID = e.target.parentElement.parentElement.getAttribute('data-id');
			focusLinea();
		}
	}

	// BORRAR LINEA
	if (e.target.matches('.close')) {
		if ($cajaNotas && !modoBloqueo && !start) {
			let closeId = e.target.parentElement.parentElement.parentElement.getAttribute('data-id');
			// borramos Array  que pichamos
			compo1.arrayLineas = compo1.arrayLineas.filter((linea, index, array) => linea !== array[closeId - 1]);
			//borramos Linea HTML que pinchamos

			document.querySelectorAll('.notas')[closeId - 1].remove();
			//resetemos los ids y el let contador de clase Linea
			let contador = 1;
			compo1.arrayLineas.forEach(linea => (linea.id = contador++));
			contador = 1;
			document.querySelectorAll('.notas').forEach(linea => linea.setAttribute('data-id', contador++));
			Linea.setIdContador(contador);
		}
		compo1.guardarLocalStorage();
	}
});

// SELECT ---------- EVENTO SELECCIONA OPTION BOLS Y BORRA BOL ANTERIOR
$select.addEventListener('change', function () {
	for (let i = 0; i < ultimoNum + 1; i++) {
		borrarUltimaSilaba(lineaID);
	}

	const valor = this.options[this.options.selectedIndex].value;

	escribirHtml(lineaID, valor);
	escribirArray(lineaID, valor);
	compo1.guardarLocalStorage();
});

//----------------------------------------INPUTS--------------------------------------------------
const inputs = document.querySelectorAll('.info input');

inputs.forEach(input =>
	input.addEventListener('focus', e => {
		if (modoBloqueo) {
			e.target.disabled = true;
			return mensajeAlerta('Press Edit \n and dont forget to save', '');
		} else {
			e.target.disabled = false;
			e.target.classList.add('input-foco');
			//para que no escriba en linea cuando inputs
			escribirInputs = true;
		}
	})
);
inputs.forEach(input =>
	input.addEventListener('blur', e => {
		e.target.classList.remove('input-foco');
		escribirInputs = false;
	})
);

///////////////////////////////////LISTA DE COMPOS/////////////////////////////////////

let compoLista = [];
let indexCompoLista = undefined;

const guardarCompoEnLista = () => {
	// COMPROBAR NOMBRE IGUAL A UNO GUARDADO
	let nombresLista = compoLista.map(compo => compo.nombre);
	let inputNombre = document.getElementById('nombre').value.trim();
	let indexRepetido = nombresLista.indexOf(inputNombre);

	if (nombresLista.includes(inputNombre)) {
		let guardar = confirm(`La Lista ya contiene el nombre. Desea sobreescribir ${inputNombre}?`);

		if (guardar) {
			compoLista.splice(indexRepetido, 1);

			return guardarConfirmado();
		} else {
			return mensajeAlerta('Saved Canceled', inputNombre);
		}
	}

	guardarConfirmado();
};

const guardarConfirmado = () => {
	guardarDatos();
	compoLista.push(compo1);
	compoLista.sort((a, b) => {
		if (a.nombre < b.nombre) return -1;
		if (b.nombre < a.nombre) return 1;
	});
	localStorage.setItem('compoLista', JSON.stringify(compoLista));

	mensajeAlerta(' Saved', compo1.nombre);

	//-----------------//COMENTAR-MOMENTANEO PARA GUARDAR PRESET--

//  guardarEnPreset(compo1)

};

const guardarDatos = () => {
	compo1.nombre = document.getElementById('nombre').value;
	compo1.grupo = document.getElementById('grupo').value;
	compo1.nBeats = document.getElementById('nBeats').value;
};

const loadCompoLista = () => {
	compoLista = localStorage.getItem('compoLista')
		? (compoLista = JSON.parse(localStorage.getItem('compoLista')))
		: (compoLista = []);
	compoLista.sort((a, b) => {
		if (a.nombre < b.nombre) return -1;
		if (b.nombre < a.nombre) return 1;
	});

	return compoLista;
};

const crearListaHtml = () => {
	if (document.querySelectorAll('#contenedor-lista-usuarios table tbody #item-lista').length !== 0)
		document.querySelectorAll('#contenedor-lista-usuarios table tbody #item-lista').forEach(a => a.remove());
	const $templateTrEnlace = document.querySelector('#tr-enlace').content;

	compoLista.forEach((compo, index) => {
		const enlase = $templateTrEnlace.querySelector('#item-lista #td1 #enlace-item-lista');
		enlase.setAttribute('value', index);
		enlase.textContent = compo.nombre;
		$templateTrEnlace.querySelector('#td2').textContent = compo.grupo;
		$templateTrEnlace.querySelector('#td3').textContent = compo.nBeats;
		let $node = document.importNode($templateTrEnlace, true);
		document.body.querySelector('#contenedor-lista-usuarios table tbody').appendChild($node);
		$node = document.importNode($templateTrEnlace, true);
	});

	
	document.body
		.querySelectorAll('#contenedor-lista-usuarios #enlace-item-lista')
		.forEach(enlace => enlace.addEventListener('click', recargarCompoDeLista));
};

const recargarCompoDeLista = function () {
	modoBloqueo = false;
	borrarLineasHtml();
	Linea.reiniciarIdContador();
	indexCompoLista = this.getAttribute('value');
	compo1.nombre = compoLista[indexCompoLista].nombre;
	compo1.grupo = compoLista[indexCompoLista].grupo;
	compo1.nBeats = compoLista[indexCompoLista].nBeats;
	compo1.arrayLineas = compoLista[indexCompoLista].arrayLineas.map(Linea.fromJson);

	compo1.arrayLineas.forEach(linea => compo1.mandandoObjLineaAEscribirHtml(linea));
	compo1.cargarDatosCompo();

	document.querySelector('.lista-panel').classList.toggle('lista-panel-active');
	modoBloqueo = true;
	if (start) {

		isStart(aplicarCambiosTempo());
		isStart(aplicarCambiosTempo());
	}
};

const deleteCompo = nombre => {
	let compoLista = loadCompoLista();
	let compoNombre = compoLista.map(compo => compo.nombre);
	let borrar = false;
	compoNombre.forEach(compo => {
		if (compo === nombre) borrar = confirm(`Are you sure you want to delete ${nombre}?`);
	});

	if (borrar) {
		compoLista = compoLista.filter(compo => compo.nombre !== nombre);
		localStorage.setItem('compoLista', JSON.stringify(compoLista));
		loadCompoLista();
		crearListaHtml();
		reiniciarCompo();
		mensajeAlerta('ERASED', nombre);
	} else {
		mensajeAlerta('The deletion was canceled', nombre);
	}
};

const mensajeAlerta = (msj, nombre) => {
	$alertas.classList.add('alertas-activo');
	$alertas.textContent = `${nombre}  ${msj}`;
	setTimeout(() => {
		$alertas.classList.remove('alertas-activo');
	}, 3000);
};

// -------------------------------------PREDEFINIDOS JSON-----------------------------------
//ACA LO PODIA IMPORTAR Y USAR DIRECTAMENTE MIRAR IMPORT
// const predefinidos=data.forEach(el=>console.log(el));


let listaPreset = undefined;

const url = './assets/data.json';

const obtenerPredefinidos = async () => {
	try {
		const resp = await fetch(url);
		if (!resp.ok) throw { status: resp.status, statusText: resp.statusText };
		const json = resp.json();
		return json;
	} catch (error) {
		mensajeAlerta(error.statusText, `No se puede cargar Predefinidos ${error.status}`);
	}
};

const cargarPredefinidos = async () => {
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

	document.body
		.querySelectorAll('#contenedor-lista-predefinidos #enlace-item-lista')
		.forEach(enlace => enlace.addEventListener('click', escribirPredefinidos));
};

const escribirPredefinidos = function () {
	modoBloqueo = false;
	borrarLineasHtml();
	Linea.reiniciarIdContador();
	indexCompoLista = this.getAttribute('value');
	compo1.nombre = listaPreset[indexCompoLista].nombre;
	compo1.grupo = listaPreset[indexCompoLista].grupo;
	compo1.nBeats = listaPreset[indexCompoLista].nBeats;
	compo1.arrayLineas = listaPreset[indexCompoLista].arrayLineas.map(Linea.fromJson);

	compo1.arrayLineas.forEach(linea => compo1.mandandoObjLineaAEscribirHtml(linea));
	compo1.cargarDatosCompo();

	document.querySelector('.lista-panel').classList.toggle('lista-panel-active');

	modoBloqueo = true;

	if(start){
	isStart(aplicarCambiosTempo());
	isStart(aplicarCambiosTempo());
	}
};

cargarPredefinidos();

/////////////////////////////////////METRONOMO/////////////////////////////////////////////

//AGREGA DATASET DATA-SUBD AL PARRAFO ANTERIOR QuE TENGA ":N" Y LLAMA AL METODO QUE APLICA LAS REPETICIONES
const aplicarCambiosTempo = () => {
	//CAMBIA EL TEMPO UN PARAFO ANTES CUANDO HAY :N

	let parrafos = document.querySelectorAll('.borde-notas p');
	//FILTRA LOS ESPACIOS
	parrafos = [...parrafos].filter(p => p.innerHTML !== '&nbsp; &nbsp;');

	//AGREGA EL NUMERO DE MODULACION AL DATASET DEL PARRAFO ANTERIOR
	parrafos.forEach((p, index, array) => {
		if (p.textContent.includes(':')) {
			index === 0
				? (array[array.length - 1].dataset.subd = p.textContent.replace(':', ''))
				: (array[index - 1].dataset.subd = p.textContent.replace(':', ''));
		}
	});

	return totalParrafosConRep(parrafos);
};

const totalParrafosConRep = parrafosConModlulac => {
	const lineas = document.querySelectorAll('.borde-linea .borde-notas');

	//borramos los que tengan ':'
	let parrafos = parrafosConModlulac.filter(p => !p.textContent.includes(':'));

	let parrafosGrande = [];

	//POR C/LINEA
	lineas.forEach((linea, index, array) => {
		//OBTIENE EL Nº DE REPETICIONES DE LA LINEA
		let rep = linea.parentElement.querySelector('.contenedor-iconos i').getAttribute('data-rep');

		//GUARDA EN ARRAY LOS PARRAFOS QUE TENGAN EN SU VISABUELO LINEA EL ID=AL INDEX +1 OSEA: (1,2,3)
		let arrTemp = parrafos.filter(p => Number(p.parentElement.parentElement.parentElement.getAttribute('data-id')) === index + 1);

		//GUARDA EN UN ARRAY UN ARRAY ANIDADO CON LOS VALORES DE [...arrTemp] ARRAY FILTRADO POR ID LINEA
		for (let i = 0; i < rep; i++) {
			parrafosGrande.push([...arrTemp]);
		}
	});

	let parrafosSueltos = [];
	//GUARDA LOS ELEMENTOS DE CADA ARRAY ANIDADO EN UN ARRAY NUEVO (PARRAFOSUELTOS)
	parrafosGrande.forEach(arr => parrafosSueltos.push(...arr));

	return parrafosSueltos;
};

let start = false;

const isStart = parrafos => {
	if (parrafos.length !== 0) {
		play(parrafos);

		if (!start) {
			$playButton.innerHTML = '<i class="fas fa-stop"></i>';
			start = true;

			const $btnsNumber = document.querySelectorAll('.contenedor-btnNumber button');
			$btnsNumber.forEach(btn => (btn.disabled = true));
		} else {
			$btns.forEach(btn => (btn.disabled = false));
			$playButton.innerHTML = '<i class="fas fa-play"></i>';
			start = false;
		}
	}
};

//-------------------------------------	ESCRIBIR TOTAL-----------------------
const escribirTotalSub = () => {
	const lineas = document.querySelectorAll('.notas .borde-linea');
	let total = 0;

	lineas.forEach(linea => {
		let rep = linea.querySelector('.contenedor-iconos i').getAttribute('data-rep');
		let totalLininea = linea.querySelectorAll('.borde-notas p');
		totalLininea = [...totalLininea].filter(p => p.innerHTML !== '&nbsp; &nbsp;');
		totalLininea = totalLininea.filter(p => !p.textContent.includes(':')).length;
		totalLininea *= rep;

		total += totalLininea;
	});

	$total.textContent = total;
};

$playButton.addEventListener('click', () => {
    
	isStart(aplicarCambiosTempo());
});

import { Linea } from '../classes/linea.class';
import { compo1 } from '../index';


const d = document;
const $btns = d.querySelectorAll('body .display-botones button , .display-botones a, #lista a');
const $template = document.querySelector('#caja-escritura').content;
let $cajaNotas;
let modoBloqueo = false;




const speakSilabas = [' Ta ', ' Taka ', ' Takite ', ' Takatimi ', ' TakaTakite ', ' TakatimiTaka ', ' TakaTakaTakite ', ' TakatimiTakajuna ', 'TakadimiTakaTakita'];

let lineaID;
let escribirInputs = false;
let repetir = 2;// para icono x2 x3 x4 se reinicia en focusLinea
let contadorBols = 0;




// -------------------------------------FUNCIONES ARRAY Y DOM-----------------------------------------

export const crearTablaHtml = (id) => {

    lineaID = id;
    $template.querySelector('.notas').dataset.id = id;
    let $node = document.importNode($template, true);
    document.body.querySelector('.marco-display').appendChild($node);


};

export const inicio = () => {
    if (localStorage.getItem('compoLista')) loadCompoLista();
    crearListaHtml()
    focusLinea();
};
const focusLinea = () => {


    if (modoBloqueo) return alert('Modo bloqueo activado en focus metodo');
    $cajaNotas = document.body.querySelectorAll(' .borde-notas');
    $cajaNotas.forEach(linea => linea.classList.remove('edit'));
    $cajaNotas[lineaID - 1].classList.add('edit');

    repetir = 2;
};


// escribe Array -----------------
export const escribirArray = (id, num, repet) => {


    if (!modoBloqueo && !escribirInputs && repet === 'R') {
        compo1.arrayLineas[id - 1].rep = num - 1;
        compo1.guardarLocalStorage();

    } else if (!modoBloqueo && !escribirInputs) compo1.arrayLineas[id - 1].agregarSilaba(num);



};
let idTemp;
// escribe HTML ----------------
export const escribirHtml = (id, num) => {
    // if (modoBloqueo) return alert('Press Edit \ndont forget to save');
    if (modoBloqueo) return alert('Modo bloqueo activado en escribirHtml metodo');

    if(typeof num !=='string')return console.error`<p> El dato guardado ${num} no es una cadena de texto`;




    if (!escribirInputs) {

        if (num.includes('('))num = num.replaceAll('(', '<span>').replaceAll(')', '</span>');


        if (idTemp !== id) contadorBols = 0;
        const speak = document.createElement('p');
        speak.dataset.index = contadorBols++;
        speak.classList.add('jati');
        speak.innerHTML = num;
        idTemp = id



        //ASINGNAMOS A VARIABLE COMPONENT.JS
        $cajaNotas = document.body.querySelectorAll(' .borde-notas');
        $cajaNotas[id - 1].appendChild(speak);
        compo1.guardarLocalStorage();



    }

};

export const escribirRepeticiones = (id, rep) => {


    const ledRepetir = document.querySelectorAll('.cruz')[id - 1];
    ledRepetir.textContent = rep;
    (rep === 1)
        ? ledRepetir.classList.remove('mostrar')
        : ledRepetir.classList.add('mostrar');

};



const borrarUltimaSilaba = (id) => {
    // if (modoBloqueo) return alert('Press Edit \ndont forget to save');

    if (modoBloqueo) return alert('modo bloqueo en borrarUltimaSilaba');

    if (!escribirInputs) {
        //BORRA ULTIMA SILABA DE ARRAY SILABAS
        compo1.arrayLineas[id - 1].borrarUltimaSilaba();

        //BORRA ULTIMA SILABA HTML   
        if (!$cajaNotas[id - 1].children[$cajaNotas[id - 1].children.length - 1].matches('div')) $cajaNotas[id - 1].lastChild.remove();

        compo1.guardarLocalStorage();
    };
};


export const borrarLineasHtml = () => {

    if (modoBloqueo) return alert('Modo bloqueo activado en borrarLineasHtml metodo');

    document.body.querySelectorAll('.notas').forEach(elem => elem.remove());

};





function accionBoton() {
    // -----------------------EVENTO-BOTONES LUCES------------------------------------
    let btn = (this.matches('.ledBlanco')) ? this.parentElement : this;



    if (btn.children[0]) btn.children[0].classList.toggle('ledAzul');

    btn.classList.toggle('encendido');
    btn.classList.toggle('button-display');

    setTimeout(() => {
        btn.classList.toggle('encendido');
        btn.classList.toggle('button-display');
        if (btn.children[0]) btn.children[0].classList.toggle('ledAzul');
    }, 1000);




    // -----------------------------BOTONES ACCIÒN------------------------------------
    //ESCRIBIR 1 A 9
    if (btn.matches('.btn-number') && (btn.textContent > 0 && btn.textContent < 10)) {

        escribirArray(lineaID, speakSilabas[parseInt(btn.textContent) - 1]);
        escribirHtml(lineaID, speakSilabas[parseInt(btn.textContent) - 1]);
    };

    if (btn.textContent === 'R' && !modoBloqueo) {

        const ledRepetir = document.querySelectorAll('.cruz')[lineaID - 1];

        ledRepetir.textContent = repetir++;
        ledRepetir.classList.add('mostrar');
        if (repetir > 9) {
            repetir = 2;
            ledRepetir.classList.remove('mostrar');
        };

        //----------array------------------------
        escribirArray(lineaID, repetir, 'R');
    };

    //BACK
    if (btn.textContent === 'Back') borrarUltimaSilaba(lineaID);


    //NEW LINE
    if (btn.textContent === 'New Line' && !modoBloqueo) {
        compo1.nuevaLinea();
        focusLinea();

    };

    //SAVE------
    if (btn.textContent === 'Save') {
        if (modoBloqueo) return alert('it`s already saved\nPress Edit \ndont forget to save');
        loadCompoLista();
        guardarCompoEnLista();
        crearListaHtml();


    }

    //LOAD
    if (btn.textContent === 'Load') {
        modoBloqueo = false;
        loadCompoLista();
        document.querySelector('.lista-panel').classList.toggle('lista-panel-active');
    };

    //REINICIAR
    if (btn.textContent === 'New') {

        modoBloqueo = false;
        compo1.reiniciarCompo();
        borrarLineasHtml();
        compo1.nuevaLinea();
        focusLinea();

    };
    if (btn.textContent === 'Edit') {

        if (!modoBloqueo) return alert('First load Tala')
        modoBloqueo = false;
        focusLinea();
    };

    if (btn.textContent === 'Close') {
        document.querySelector('.lista-panel').classList.toggle('lista-panel-active');
    };
};

$btns.forEach(elem => elem.addEventListener('click', accionBoton));



// -----------------------EVENTO-TECLAS------------------------------------------


export const accionTeclas = (e) => {

    const num = parseInt(e.key);

    if (num > 0 && num < 10) {

        escribirArray(lineaID, speakSilabas[parseInt(num) - 1]);
        escribirHtml(lineaID, speakSilabas[parseInt(num) - 1]);
    };

    if (e.key === 'Backspace' || e.code === 'Backspace') borrarUltimaSilaba(lineaID);



    if (e.keyCode == 13 && !modoBloqueo && !escribirInputs) {

        compo1.nuevaLinea();
        focusLinea();

    }
};

document.addEventListener('keydown', accionTeclas);

//----------------EVENTO CLICK-------------------------------------------------
let letrasSilaba = [];
let indexBol = 0;
const alertas = document.querySelector('#alertas');
document.addEventListener('click', (e) => {
    // TODO: poder marcar donde va el AnuDrutam y el drutam
    // no va a poder ser por que marca toda la palabra
    // e.target.classList.add('drutam');
    // e.target.classList.add('anu-drutam');

    // idea se escribe todo de a una silaba 
    //cuando escribis 4 un bucle for recorre las 4 silabas y va buscando en el array de a silaba mas un espacio al final
    //agregamos un radio button si queremos modo variacion cuando esta puesto
    //abre una ventana con las variaciones del numero apretado
    //luego si queres marcar una de rojo le agregas la clase drutam
    // y para guardarlo a la que tenga la clase drutam le agrgas un asterisco
    //luego cuando carga la que tenga un asterisco le agrega la clase drutam

    if(e.target.matches('.cerrar-drutam')){
      letrasSilaba=[];
      alertas.querySelectorAll('p').forEach(nodo => nodo.remove());
        return alertas.classList.remove('alertas-activo');
    };

    if (e.target.parentElement.matches('.edit')) {
        indexBol = e.target.getAttribute('data-index');
        letrasSilaba=compo1.arrayLineas[lineaID - 1].arraySilabas[indexBol].replaceAll(' ', '').split('');
        // console.log(letrasSilaba);
        // letrasSilaba = e.target.textContent.replaceAll(' ', '').split('');
        // console.warn(letrasSilaba);

       
        alertas.classList.add('alertas-activo');


        letrasSilaba.forEach((letra, index) => {
            const p = document.createElement('p');
            p.dataset.indexLetra = index;
            p.textContent = letra;
            alertas.appendChild(p);
        });
    };

    const reg = /[^aeiou]+/gi;
    if (e.target.parentElement.matches('.alertas-activo') && reg.test(e.target.textContent)) {


        const indexLetra = parseInt(e.target.getAttribute('data-index-letra'));
        letrasSilaba.splice(indexLetra, 0, '(');
        letrasSilaba.splice(indexLetra + 3, 0, ')');

        let letrasUnidas = letrasSilaba.join('');
        compo1.arrayLineas[lineaID - 1].arraySilabas[indexBol] = letrasUnidas;
        
        alertas.querySelectorAll('p').forEach(nodo => nodo.remove());
            alertas.classList.remove('alertas-activo');
           

            if(e.target.matches('#reset-drutam')){
                const regex= /[\(\)]/g;
               const silabaReseteada= compo1.arrayLineas[lineaID - 1].arraySilabas[indexBol].replaceAll(regex,'');
               compo1.arrayLineas[lineaID - 1].arraySilabas[indexBol] = silabaReseteada;
               compo1.guardarLocalStorage();
            };
            
            document.body.querySelectorAll(' .edit p').forEach(p=>p.remove());
            
            contadorBols = 0;
            
            compo1.mandandoObjLineaAEscribirHtml(compo1.arrayLineas[lineaID-1]);

            compo1.guardarLocalStorage();




    }

    


    




















    // 



    if (e.target.matches('.borde-notas')) {
        if (compo1.arrayLineas.length !== 0) {
            lineaID = e.target.parentElement.parentElement.getAttribute('data-id');
            focusLinea();
        };
    };
    if (e.target.matches('.close')) {
        if ($cajaNotas && !modoBloqueo) {


            let closeId = e.target.parentElement.parentElement.parentElement.getAttribute('data-id');
            // borramos Array  que pichamos
            compo1.arrayLineas = compo1.arrayLineas.filter((linea, index, array) => linea !== array[closeId - 1]);
            //borramos Linea HTML que pinchamos

            document.querySelectorAll('.notas')[closeId - 1].remove();
            //resetemos los ids y el let contador de clase Linea
            let contador = 1;
            compo1.arrayLineas.forEach(linea => linea.id = contador++);
            contador = 1;
            document.querySelectorAll('.notas').forEach(linea => linea.setAttribute('data-id', contador++));
            Linea.setIdContador(contador);

        };
        compo1.guardarLocalStorage();

    };




});


//----------------------------------------INPUTS--------------------------------------------------
const inputs = document.querySelectorAll('input');


inputs.forEach(input => input.addEventListener('focus', (e) => {
    if (modoBloqueo) return alert('Modo bloqueo en inputs metodo');
    e.target.classList.add('input-foco');
    //para que no escriba en linea cuando inputs
    escribirInputs = true;

}));
inputs.forEach(input => input.addEventListener('blur', (e) => {
    e.target.classList.remove('input-foco');
    escribirInputs = false;
}));





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
            return alert('inputNombre  + Saved Canceled')
        };
    };

    guardarConfirmado();
};

const guardarConfirmado = () => {
    guardarDatos();
    compoLista.push(compo1);
    compoLista.sort((a, b) => {

        if (a.nombre < b.nombre) return -1;
        if (b.nombre < a.nombre) return 1
    });
    localStorage.setItem('compoLista', JSON.stringify(compoLista));
};



const guardarDatos = () => {

    compo1.nombre = document.getElementById('nombre').value
    compo1.grupo = document.getElementById('grupo').value
    compo1.nBeats = document.getElementById('nBeats').value


};

const loadCompoLista = () => {

    compoLista = (localStorage.getItem('compoLista'))
        ? compoLista = JSON.parse(localStorage.getItem('compoLista'))
        : compoLista = [];
    compoLista.sort((a, b) => {

        if (a.nombre < b.nombre) return -1;
        if (b.nombre < a.nombre) return 1
    });
};



const crearListaHtml = () => {
    if (document.querySelectorAll('#item-lista').length !== 0) document.querySelectorAll('#item-lista').forEach(a => a.remove());

    const $templateTrEnlace = document.querySelector('#tr-enlace').content

    compoLista.forEach((compo, index) => {
        const enlase = $templateTrEnlace.querySelector('#item-lista #td1 #enlace-item-lista');
        enlase.setAttribute('value', index);
        enlase.textContent = compo.nombre;
        $templateTrEnlace.querySelector('#td2').textContent = compo.grupo;
        $templateTrEnlace.querySelector('#td3').textContent = compo.nBeats;
        let $node = document.importNode($templateTrEnlace, true);
        document.body.querySelector('#contenedor-lista-usuarios table tbody').appendChild($node);
        $node = document.importNode($templateTrEnlace, true);
        document.body.querySelector('#contenedor-lista-predefinidos table tbody').appendChild($node);


    });

    // console.log(document.querySelectorAll('#tr-enlace'))
    // console.log(document.body.querySelectorAll(' #enlace-item-lista'));
    document.body.querySelectorAll(' #enlace-item-lista').forEach(enlace => enlace.addEventListener('click', recargarCompoDeLista));

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

    // TODO: CUANDO MODO BLOQUE DISBLE BOTONES MENOS EDIT Y AVISAR CON UN CARTEL





};







// TODO: X2 X3 X4 
// TODO: RADIOBUTTON QUE AGREGA 13 ES TES CON SILENCIO 23 ES 3 ISOLATION ETC. METODO LE ADGREGA LA DECENA 














































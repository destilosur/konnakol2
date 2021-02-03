import { Compo } from '../classes/compo.class';
import { Linea } from '../classes/linea.class';
import { compo1 } from '../index';


const d = document;
const $btns = d.querySelectorAll('body .display-botones button');
const $template = document.querySelector('#caja-escritura').content;
let $cajaNotas;
let modoBloqueo = false;

console.info(modoBloqueo);



const speakSilabas = [' Ta ', ' TaKa ', ' Takite ', ' Takatimi ', ' TakaTakite ', ' TakatimiTaka ', ' TakaTakaTakite ', ' TakatimiTakajuna '];

let lineaID;
let escribirInputs = false;
let repetir = 2;// para icono x2 x3 x4 se reinicia en focusLinea




// -------------------------------------FUNCIONES ARRAY Y DOM-----------------------------------------

export const crearTablaHtml = (id) => {

    lineaID = id;
    $template.querySelector('.notas').dataset.id = id;
    let $node = document.importNode($template, true);
    document.body.querySelector('.marco-display').appendChild($node);


};

export const focusLinea = () => {


    if (modoBloqueo) return alert('Modo bloqueo activado en focus metodo');
    $cajaNotas = document.body.querySelectorAll('.notas .borde-notas');
    $cajaNotas.forEach(linea => linea.classList.remove('edit'));
    $cajaNotas[lineaID - 1].classList.add('edit');

    repetir = 2;




};


// escribe Array -----------------
export const escribirArray = (id, num) => {

    if (!modoBloqueo && !escribirInputs) compo1.arrayLineas[id - 1].agregarSilaba(num);



};

// escribe HTML ----------------
export const escribirHtml = (id, num) => {
    // if (modoBloqueo) return alert('Press Edit \ndont forget to save');
    if (modoBloqueo) return alert('Modo bloqueo activado en escribirHtml metodo');


    if (!escribirInputs) {
        const speak = document.createElement('p')
        speak.innerText = speakSilabas[num - 1];

        //ASINGNAMOS A VARIABLE COMPONENT.JS
        $cajaNotas = document.body.querySelectorAll('.notas .borde-notas');
        $cajaNotas[id - 1].appendChild(speak);
        compo1.guardarLocalStorage();
    }

};



const borrarUltimaSilaba = (id) => {
    // if (modoBloqueo) return alert('Press Edit \ndont forget to save');

    if (modoBloqueo) return alert('modo bloqueo en borrarUltimaSilaba');

    if(!escribirInputs){
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

        escribirArray(lineaID, parseInt(btn.textContent));
        escribirHtml(lineaID, parseInt(btn.textContent));
    };

    if (btn.textContent === 'R' && modoBloqueo) {

        //TODO:QUE GUARDE LA REPETICION EN ARRAY Y LISTA

        const ledRepetir = document.querySelectorAll('.cruz')[lineaID - 1];
        ledRepetir.textContent = repetir++;
        ledRepetir.classList.add('mostrar');
        if (repetir > 9) {
            repetir = 2;
            ledRepetir.classList.remove('mostrar');
        };


        // console.log(document.querySelectorAll('.cruz'));

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
        guardarCompoEnLista();
        loadCompoLista();

    }

    //LOAD
    if (btn.textContent === 'Load') {
        modoBloqueo = false;
        loadCompoLista();
        abrirLista();
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
        
       
        
        

    }
};

$btns.forEach(elem => elem.addEventListener('click', accionBoton));



// -----------------------EVENTO-TECLAS------------------------------------------


export const accionTeclas = (e) => {

    const num = parseInt(e.key);

    if (num > 0 && num < 9) {

        escribirArray(lineaID, num);
        escribirHtml(lineaID, num);
    };

    if (e.key === 'Backspace' || e.code === 'Backspace') borrarUltimaSilaba(lineaID);



    if (e.keyCode == 13 && !modoBloqueo && !escribirInputs) {
        //TODO: QUE NO CUANDO ESCRIBO INPUT NI CUANDO NO ES EDITABLE
        compo1.nuevaLinea();
        focusLinea();
    }
};

document.addEventListener('keydown', accionTeclas);

//----------------EVENTO CLICK-------------------------------------------------

document.addEventListener('click', (e) => {
    if (e.target.matches('.borde-notas')) {
        if (compo1.arrayLineas.length !== 0) {
            lineaID = e.target.parentElement.getAttribute('data-id');
            focusLinea();
        };
    };
    if (e.target.matches('.close')) {
        if ($cajaNotas && !modoBloqueo) {
            //TODO: QUE NO PUEDA HACERLO EN VERSION BLOKED. SE PODRA HACER UNA VERSION BLOQUED TRUE?
            let closeId = e.target.parentElement.parentElement.getAttribute('data-id');

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
    if(modoBloqueo) return alert('Modo bloqueo en inputs metodo');
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
    loadCompoLista();
    let nombresLista = compoLista.map(compo => compo.nombre);
    let inputNombre = document.getElementById('nombre').value.trim();
    let indexRepetido= nombresLista.indexOf(inputNombre);
    console.log(indexRepetido);

    if (nombresLista.includes(inputNombre)) {

        let guardar = confirm(`La Lista ya contiene el nombre. Desea sobreescribir ${inputNombre}?`);

        if (guardar) {
            compoLista.splice(indexRepetido, 1);
            
            return guardarConfirmado();

        }else {
             return alert('inputNombre  + Saved Canceled') 
            };
    };

    guardarConfirmado();
};

const guardarConfirmado = () => {
    guardarDatos();
    compoLista.push(compo1);
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



export const abrirLista = () => {

    compoLista.forEach((compo, index) => {
        const enlase = document.createElement('a');
        let texto = document.createTextNode(`${compo.nombre}`);
        enlase.appendChild(texto);
        enlase.setAttribute('value', index);
        document.getElementById('lista').appendChild(enlase);
        enlase.addEventListener('click', recargarCompoDeLista);

    });
};

const recargarCompoDeLista = function () {



    borrarLineasHtml();
    Linea.reiniciarIdContador();
    indexCompoLista = this.getAttribute('value');
    compo1.nombre = compoLista[indexCompoLista].nombre;
    compo1.grupo = compoLista[indexCompoLista].grupo;
    compo1.nBeats = compoLista[indexCompoLista].nBeats;
    compo1.arrayLineas = compoLista[indexCompoLista].arrayLineas.map(Linea.fromJson);

    
    compo1.arrayLineas.forEach(linea => compo1.mandandoObjLineaAEscribirHtml(linea));
    compo1.cargarDatosCompo();
    // /CAMBIAMOS MODO BLOKED
    modoBloqueo = true;
    document.querySelectorAll('.lista a').forEach(a=>a.remove());



    // //TODO: SEPARAR CUANDO ABRA Y CIERRA LISTA
    // //sacamos focus borde
    // $cajaNotas.forEach(linea => linea.classList.remove('edit'));
    // // //borrar la lista
    // document.querySelectorAll('.lista a').forEach(a => a.remove());


};







// TODO: X2 X3 X4 
// TODO: RADIOBUTTON QUE AGREGA 13 ES TES CON SILENCIO 23 ES 3 ISOLATION ETC. METODO LE ADGREGA LA DECENA 














































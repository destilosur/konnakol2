import { Compo } from '../classes/compo.class';
import { Linea } from '../classes/linea.class';
import { compo1, guardarCompoEnLista, abrirLista } from '../index';


const d = document;
const $btns = d.querySelectorAll('body .display-botones button');
const $template = document.querySelector('#caja-escritura').content;
let $cajaNotas;

const speakSilabas = [' Ta ', ' TaKa ', ' Takite ', ' Takatimi ', ' TakaTakite ', ' TakatimiTaka ', ' TakaTakaTakite ', ' TakatimiTakajuna '];

let lineaID;




// -------------------------------------FUNCIONES ARRAY Y DOM-----------------------------------------

export const crearTablaHtml = (id) => {

    lineaID = id;
    $template.querySelector('.notas').dataset.id = id;
    let $node = document.importNode($template, true);
    document.body.querySelector('.marco-display').appendChild($node);

};


// escribe Array -----------------
export const escribirArray = (id, num) => {

    compo1.arrayLineas[id - 1].agregarSilaba(num);


};

// escribe HTML ----------------
export const escribirHtml = (id, num) => {


    const speak = document.createElement('p')
    speak.innerText = speakSilabas[num - 1];

    //ASINGNAMOS A VARIABLE COMPONENT.JS
    $cajaNotas = document.body.querySelectorAll('.notas .borde-notas');
    $cajaNotas[id - 1].appendChild(speak);
    compo1.guardarLocalStorage();
};



const borrarUltimaSilaba = (id) => {

    //BORRA ULTIMA SILABA DE ARRAY SILABAS
    compo1.arrayLineas[id - 1].borrarUltimaSilaba();

    //BORRA ULTIMA SILABA HTML   
    if (!$cajaNotas[id - 1].children[$cajaNotas[id - 1].children.length - 1].matches('div')) $cajaNotas[id - 1].lastChild.remove();

    compo1.guardarLocalStorage();
};


export const borrarLineasHtml = () => {

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
    //ESCRIBIR 1 A 8
    if (btn.matches('.btn-number')) {
        escribirArray(lineaID, parseInt(btn.textContent));
        escribirHtml(lineaID, parseInt(btn.textContent));
    };
    //BACK
    if (btn.matches('.back')) borrarUltimaSilaba(lineaID);

    //SAVE------
    if (btn.textContent === 'Save') guardarCompoEnLista();

    //LOAD
    if (btn.textContent === 'Load') {

        // TODO: SE TIENE QUE REINICIAR CUANDO PINCHO EN ENLASSE
        borrarLineasHtml()
        abrirLista();
    };

    //REINICIAR
    if (btn.textContent === 'Clear') {

        compo1.reiniciarCompo();
        borrarLineasHtml();
        compo1.nuevaLinea();
    };
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

    if (e.keyCode == 13) compo1.nuevaLinea();
};

document.addEventListener('keydown', accionTeclas);















































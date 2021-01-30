import { Compo } from '../classes/compo.class';
import { Linea } from '../classes/linea.class';
import { compo1 } from '../index';


const d = document;
const $btns = d.querySelectorAll('body .display-botones button');
const $template = document.querySelector('#caja-escritura').content;
const speakSilabas = [' Ta ', ' TaKa ', ' Takite ', ' Takatimi ', ' TakaTakite ', ' TakatimiTaka ', ' TakaTakaTakite ', ' TakatimiTakajuna '];

let ultimaLineaID;








export const crearTablaHtml = (id) => {
    $template.querySelector('.notas').dataset.id = id;
    ultimaLineaID = id;

    let $node = document.importNode($template, true);

    document.body.querySelector('.marco-display').appendChild($node);
};

const borrarLineasArrayYHtml = () => {
    //borra lineas html
    document.body.querySelectorAll('.notas').forEach(elem => elem.remove());

    //borra lineas array=[]  
    const lineasArr = compo1.arrayLineas;
    if (lineasArr) {

        for (const linea of lineasArr) {

            let silabasDeLinea = linea.arraySilabas;
            silabasDeLinea = [];
            // console.log(silabasDeLinea);       

        };
    };




};
// escribe Array y    html---------------------------------------------------
export const escribirArray = (num) => {


    const lineasArr = compo1.arrayLineas;
    const ultimaLineaArr = lineasArr[lineasArr.length - 1];
    ultimaLineaArr.agregarSilaba(num);
    // console.log(compo1);
    // console.log(ultimaLinea.arraySilabas);

};
export const escribirHtml = (id, num) => {

    // console.log(`Id ${id} num: ${num}`);
    const speak = document.createElement('p')
    speak.innerText = speakSilabas[num - 1];
    const lineasHtml = document.body.querySelectorAll('.notas');
    const lineaID = lineasHtml[id - 1].querySelector('.borde-notas');
    lineaID.appendChild(speak);

    compo1.guardarLocalStorage();



};

const borrarUltimaSilaba = () => {
    //borra ultimo silaba del[]  arraySilabas

    const lineasArr = compo1.arrayLineas;
    const ultimaLineaArr = lineasArr[lineasArr.length - 1];
    ultimaLineaArr.borrarUltimaSilaba();//de clase Linea
    console.log(ultimaLineaArr);




    const lineasHtml = document.body.querySelectorAll('.notas');
    const ultimaLineaHtml = lineasHtml[lineasHtml.length - 1].querySelector('.borde-notas');
    if (!ultimaLineaHtml.children[ultimaLineaHtml.children.length - 1].matches('div'))  ultimaLineaHtml.lastChild.remove();

        compo1.guardarLocalStorage();
};



// -----------------------EVENTO-BOTONES------------------------------------

function accionBoton() {
    //luz encendido efecto clase .encendido--------
    let btn = (this.matches('.ledBlanco')) ? this.parentElement : this;


    if (btn.children[0]) btn.children[0].classList.toggle('ledAzul');

    btn.classList.toggle('encendido');
    btn.classList.toggle('button-display');

    setTimeout(() => {
        btn.classList.toggle('encendido');
        btn.classList.toggle('button-display');
        if (btn.children[0]) btn.children[0].classList.toggle('ledAzul');
    }, 1000);

    //----escribir
    if (btn.matches('.btn-number')) {
        escribirArray(parseInt(btn.textContent));
        escribirHtml(ultimaLineaID, parseInt(btn.textContent));
    };

    // if (btn.textContent === 'Clear') borrarUltimaSilaba();

    //guardar------
    if (btn.textContent === 'Save') compo1.guardarLocalStorage();

    //load
    if (btn.textContent === 'Load') {
        compo1.reiniciarCompo();
        borrarLineasArrayYHtml();
        
        //TODO: ESTO ES PROVISIONAL

    };
    if (btn.textContent === 'Clear') {
        

        compo1.reiniciarCompo();
        borrarLineasArrayYHtml();
        compo1.nuevaLinea();
    };
};

$btns.forEach(elem => elem.addEventListener('click', accionBoton));



// -----------------------EVENTO-TECLAS------------------------------------------


export const accionTeclas = (e) => {

    const num = parseInt(e.key);
    // console.log(e.code);
    if (num > 0 && num < 9) {
        escribirArray(num);
        escribirHtml(ultimaLineaID, num);
        
    };

    if (e.key === 'Backspace' || e.code === 'Backspace') {

        borrarUltimaSilaba();
        
    }

    if (e.keyCode == 13) {
        compo1.nuevaLinea();
        console.log(compo1);

    };
};
document.addEventListener('keydown', accionTeclas);









































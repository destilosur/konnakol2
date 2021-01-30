import { compo1 } from '../index';
import { Linea } from '../classes/linea.class';
import { Compo } from '../classes/compo.class';


const d = document;
const $btns = d.querySelectorAll('body .display-botones button');
const $template = document.querySelector('#caja-escritura').content;
const speakSilabas = [' Ta ', ' TaKa ', ' Takite ', ' Takatimi ', ' TakaTakite ', ' TakatimiTaka ', ' TakaTakaTakite ', ' TakatimiTakajuna '];
let idLinea=1;





export const crearTablaHtml = (id) => {
    $template.querySelector('.notas').dataset.id = id;
    let $node = document.importNode($template, true);

    document.body.querySelector('.marco-display').appendChild($node);
};

 const borrarLineasArrayYHtml = () => {
     //borra lineas html
    document.body.querySelectorAll('.notas').forEach(elem=>elem.remove());

    //borra lineas array=[]  

    if(compo1.arrayLineas){
        const lineas = compo1.arrayLineas;       
    for(const linea of lineas){

        let silabasDeLinea=linea.arraySilabas;
        silabasDeLinea=[];
        console.log(silabasDeLinea);       
        
    };
};
    


    
};
// escribe html---------------------------------------------------
export const escribirArray = (num) => {

    const lineas = compo1.arrayLineas;
    const ultimaLinea = lineas[lineas.length - 1];
    ultimaLinea.agregarSilaba(num);
    // console.log(compo1);
    console.log(ultimaLinea.arraySilabas);

};
export const escribirHtml=(id, num)=>{
    
    console.log(`Id ${id} num: ${num}`);
    const speak = document.createElement('p')
    speak.innerText = speakSilabas[num - 1];
    const lineasHtml = document.body.querySelectorAll('.notas');    
    const lineaID = lineasHtml[id-1].querySelector('.borde-notas');
   
    // for(let linea of lineasHtml){
    //     let id=linea.getAttribute('data-id');

    //     console.log(id==='1');
        
    // };
    

    lineaID.appendChild(speak);



};

const borrarUltimaSilaba = () => {
    //borra ultimo[] del array
    const lineas = compo1.arrayLineas;
    const ultimaLinea = lineas[lineas.length - 1];
    ultimaLinea.borrarUltimaSilaba();
    console.log(ultimaLinea.arraySilabas);



    const lineasHtml = document.body.querySelectorAll('.notas');
    const ultimaLineaHtml = lineasHtml[lineasHtml.length - 1].querySelector('.borde-notas');
    if (!ultimaLineaHtml.children[ultimaLineaHtml.children.length - 1].matches('div'))
        ultimaLineaHtml.lastChild.remove();
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
    if (btn.matches('.btn-number')){
         escribirArray(parseInt(btn.textContent));
         escribirHtml(idLinea,parseInt(btn.textContent));
    };

    if (btn.textContent === 'Clear') borrarUltimaSilaba();

    //guardar------
    if (btn.textContent === 'Save') compo1.guardarLocalStorage();

    //load
    if (btn.textContent === 'Load') {
        borrarLineasArrayYHtml();
        const compoNueva = new Compo();        
        compoNueva.loadLocalStorage();
        //TODO: ESTO ES PROVISIONAL

    };
    if(btn.textContent==='Clear'){
        //TODO: CUNADO BORRO BIEN PERO CUANDO ESCRIBO LUEGO QUILOMBO
        idLinea=1;
        borrarLineasArrayYHtml();
        const compoNueva = new Compo();        
        compoNueva.nuevaLinea();
    };




};

$btns.forEach(elem => elem.addEventListener('click', accionBoton));



// -----------------------EVENTO-TECLAS------------------------------------------


export const accionTeclas = (e) => {
    
    const num = parseInt(e.key);
    // console.log(e.code);
    if (num > 0 && num < 9){ 
        escribirArray(num);
        escribirHtml(idLinea,num);
    };

    if (e.key === 'Backspace' || e.code === 'Backspace') borrarUltimaSilaba();

    if (e.keyCode == 13) {
        compo1.nuevaLinea();
        idLinea++;
    };
};
document.addEventListener('keydown', accionTeclas);






































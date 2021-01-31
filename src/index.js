import { Compo } from './classes/compo.class';
import './styles.css';
import './css/component-display.css';
import './css/component-button.css';
import { Linea } from './classes/linea.class';



let compoLista = [];

export let compo1 = new Compo('Teen-TAl', '16-beats', 16, []);
const compoGuardada = compo1.loadLocalStorage();


console.log(compo1);





if (!compoGuardada) {

    compo1.nuevaLinea();
};

const loadCompoLista = () => {

    compoLista = (localStorage.getItem('compoLista'))
        ? compoLista = JSON.parse(localStorage.getItem('compoLista'))
        : compoLista = [];

};

loadCompoLista();

export const guardarCompoEnLista = () => {
//TODO: NO LO PUEDO HACER EN COMPONENTS TODOS ESTOS METODOS?
//ASI CUANDO PINCHE EL ENLASE DE LA COMPO RECIEN AHI SE REINICIA 
//LA COMPO1
    guardarDatos();
    compoLista.push(compo1);
    localStorage.setItem('compoLista', JSON.stringify(compoLista));
    loadCompoLista();

};

const guardarDatos = () => {

    compo1.nombre = document.getElementById('nombre').value
    compo1.grupo = document.getElementById('grupo').value
    compo1.nBeats = document.getElementById('nBeats').value

};

export const abrirLista = () => {

    // TODO: ACA PONER fetch

    
        compoLista.map((compo, index) => {
        const enlase = document.createElement('a');
        let texto = document.createTextNode(`${compo.nombre}`);
        enlase.appendChild(texto);
        enlase.setAttribute('value', index);
        document.getElementById('lista').appendChild(enlase);
        enlase.addEventListener('click',recargarCompoDeLista);
        
        
    })
    
    
};


const recargarCompoDeLista = function()  {
    
   compo1.reiniciarCompo();
   
    const c = compoLista[this.getAttribute('value')];//ejemplo 

    c.arrayLineas = c.arrayLineas.map(linea => Linea.fromJson(linea));

    compo1 = new Compo(c.nombre, c.grupo, c.nBeats, c.arrayLineas);

    compo1.arrayLineas.forEach(linea => compo1.mandandoObjLineaAEscribirHtml(linea));
    
    cargandoDatos(compo1);
    //borrar la lista
    console.log(  document.querySelectorAll('.lista a'))
      document.querySelectorAll('.lista a').forEach(a=>a.remove());



};
// cargandoDatos(compoGuardada);
const cargandoDatos = (compo) => {

    document.getElementById('nombre').value = compo.nombre;
    document.getElementById('grupo').value = compo.grupo;
    document.getElementById('nBeats').value = compo.nBeats;
};
cargandoDatos(compo1);




























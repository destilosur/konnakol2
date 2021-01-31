import { Compo } from './classes/compo.class';
import './styles.css';
import './css/component-display.css';
import './css/component-button.css';
import { Linea } from './classes/linea.class';

let compoLista = [];

export let compo1 = new Compo('Teen-TAl', '16-beats', 16, []);
const compoGuardada = compo1.loadLocalStorage();
// console.log(compoGuardada);





if (!compoGuardada) {

    compo1.nuevaLinea();
};

const loadCompoLista = () => {

    compoLista = (localStorage.getItem('compoLista'))
        ? compoLista = JSON.parse(localStorage.getItem('compoLista'))
        : compoLista = [];

    console.log(compoLista)

};

loadCompoLista();

export const guardarCompoEnLista = (compo) => {

    compoLista.push(compo);
    localStorage.setItem('compoLista', JSON.stringify(compoLista));
    loadCompoLista();

};

export const recargarCompoDeLista = () => {

    const c = compoLista[0];//ejemplo 

    c.arrayLineas = c.arrayLineas.map(linea => Linea.fromJson(linea));

    compo1 = new Compo(c.nombre, c.grupo, c.nBeats, c.arrayLineas);

    compo1.arrayLineas.forEach(linea=>compo1.mandandoObjLineaAEscribirHtml(linea));

};




























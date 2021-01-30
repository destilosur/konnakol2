import './styles.css';
import './css/component-button.css';
import './css/component-display.css';
import {Compo } from './classes/compo.class';


export const compo1 = new Compo('Teen-TAl','16-beats',16);
const compoGuardada= compo1.loadLocalStorage();
// console.log(compoGuardada);





if(!compoGuardada){

    compo1.nuevaLinea();
};
























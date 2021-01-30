import {Compo } from './classes/compo.class';
import './styles.css';
import './css/component-display.css';
import './css/component-button.css';


export const compo1 = new Compo('Teen-TAl','16-beats',16,[]);
const compoGuardada= compo1.loadLocalStorage();
// console.log(compoGuardada);





if(!compoGuardada){

    compo1.nuevaLinea();
};
























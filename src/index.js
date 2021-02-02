import { Compo } from './classes/compo.class';
import './styles.css';
import './css/component-display.css';
import './css/component-button.css';
import { focusLinea} from './js/component';




export let compo1 = new Compo('Default','Default',4,[]);
const compoGuardada = compo1.loadLocalStorage();
focusLinea();


// console.log(compo1);





if (!compoGuardada) {

    compo1.nuevaLinea();
};











































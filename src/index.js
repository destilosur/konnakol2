import { Compo } from './classes/compo.class';
import './styles.css';
import './css/component-display.css';
import './css/component-button.css';
import './css/lista-panel.css';
import { inicio} from './js/component';





export let compo1 = new Compo('Default','Default',4,[]);
const compoGuardada = compo1.loadLocalStorage();

if (!compoGuardada) {

    compo1.nuevaLinea();
};

inicio();

// console.log(compo1);











































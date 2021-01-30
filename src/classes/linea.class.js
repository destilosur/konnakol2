
import {crearTablaHtml} from '../js/component';


let idContador=1; 
export class Linea { 

    static fromJson({id,arraySilabas}){

        
        const tempLinea = new Linea();
        tempLinea.id=id;
        tempLinea.arraySilabas=arraySilabas;        

        return tempLinea;
    };
    

    constructor(id) {
         
        this.id=(!id)?idContador++:id;
        this.arraySilabas = [];
        crearTablaHtml(this.id);
        
    };

    agregarSilaba(n_silaba){
        this.arraySilabas.push(n_silaba);
        
    };

    borrarUltimaSilaba(){
        this.arraySilabas.pop();
    };

    borrarTodaLasSilabas(){
        this.arraySilabas.forEach(pop());

    };

    static reiniciarIdContador(){

        idContador=1;
    };
    

   


};
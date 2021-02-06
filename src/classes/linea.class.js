
import {crearTablaHtml} from '../js/component';



 let idContador=1;
export class Linea { 

    

    static fromJson({id,arraySilabas,rep=1}){
        
        const tempLinea = new Linea();
        tempLinea.id=id;
        tempLinea.rep=rep;
        tempLinea.arraySilabas=arraySilabas;        

        return tempLinea;
    };
    

    constructor(id,rep=1) {
         
        this.id=(!id)?idContador++:id;
        this.rep=rep;
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
    static setIdContador(id){

        idContador=id;
    };
    

   


};
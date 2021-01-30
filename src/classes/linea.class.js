
import {crearTablaHtml} from '../js/component';

let idContador=1; 
export class Linea { 

    static fromJson({id,arraySilabas}){

        
        const tempLinea = new Linea();
        tempLinea.id=id;
        tempLinea.arraySilabas=arraySilabas;        

        return tempLinea;
    };
    

    constructor() {
         
        this.id=idContador++;
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
    

    lineaArrayEnConsola() {
        console.log(this.arraySilabas);
    };

    removerLinea(){
        
    };


};
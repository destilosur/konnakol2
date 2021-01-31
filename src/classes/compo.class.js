
import { cargandoDatos, escribirHtml } from '../js/component';
import { Linea } from './linea.class.js';
const arrayCompos = [];//TODO:PARA CUANDO CARGE TODAS LAS COMPOS


export class Compo {
    constructor(nombre, grupo, nBeats, arraySilabas) {

        this.nombre = nombre;
        this.grupo = grupo;
        this.nBeats = nBeats;
        this.arrayLineas = arraySilabas;
    };

    nuevaLinea() {

        this.arrayLineas.push(new Linea());

    };
   
     
    // LOCAL STORAGE-de la ultima commpo scrita------------------------------------
    guardarLocalStorage() {

        localStorage.setItem('compoNombre', this.nombre);
        localStorage.setItem('compoGrupo', this.grupo);
        localStorage.setItem('compoNBeats', this.nBeats);
        localStorage.setItem('compoLineas', JSON.stringify(this.arrayLineas));

    };

    loadLocalStorage() {


        if (localStorage.getItem('compoNombre')) {

            this.nombre = (localStorage.getItem('compoNombre')) ?
                localStorage.getItem('compoNombre') :
                this.nombre = "";
            this.grupo = (localStorage.getItem('compoGrupo')) ?
                localStorage.getItem('compoGrupo') :
                this.grupo = "";
            this.nBeats = (localStorage.getItem('compoNBeats')) ?
                localStorage.getItem('compoNBeats') :
                this.nBeats = "";

            //recuperando LocalStorage Lineas y escribiendo en html
            this.arrayLineas = (localStorage.getItem('compoLineas')) ?
                this.arrayLineas = JSON.parse(localStorage.getItem('compoLineas')) :
                this.arrayLineas = [];

            //convierto los obj que me devuelve JSON.parse a obj de clase LInea
            this.arrayLineas = this.arrayLineas.map(Linea.fromJson);

            for (const linea of this.arrayLineas) {

                this.mandandoObjLineaAEscribirHtml(linea);

            };
            return true;

        } else {

            this.arrayLineas = [];

        };
    };

    mandandoObjLineaAEscribirHtml(objLinea) {


        let idLinea = objLinea.id;
        let silabasArray = objLinea.arraySilabas;
        // console.warn(idLinea);

        for (const silaba of silabasArray) {
            escribirHtml(idLinea, silaba);
        };

    };

    reiniciarCompo() {
        this.nombre = 'sin nombre';
        this.grupo = 'sin grupo';
        this.nBeats = 1;
        this.arrayLineas = [];
        Linea.reiniciarIdContador();

    }



};




import {  escribirHtml,escribirRepeticiones } from '../js/component';
import { Linea } from './linea.class.js';





export class Compo {

    
    constructor( nombre, grupo, nBeats, arraySilabas ) {

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
            this.cargarDatosCompo(this);
            return true;

        } else {

            this.arrayLineas = [];
            this.cargarDatosCompo(this);

        };
    };

    mandandoObjLineaAEscribirHtml(objLinea) {
       //TODO: ESCRIBIR REPETICIONES
        
       let idLinea = objLinea.id;
       let silabasArray = objLinea.arraySilabas;
       escribirRepeticiones(idLinea,objLinea.rep);

        for (const silaba of silabasArray) {
            escribirHtml(idLinea, silaba);
            // console.log(silaba);
        };

    };

    reiniciarCompo() {
        this.nombre = 'default';
        this.grupo = 'default';
        this.nBeats = 5;
        this.arrayLineas = [];
        Linea.reiniciarIdContador();
        this.cargarDatosCompo();

    }

    cargarDatosCompo() {


        document.getElementById('nombre').value = this.nombre;
        document.getElementById('grupo').value= this.grupo;
        document.getElementById('nBeats').value = this.nBeats;


    }

    



};




const btnForm = document.querySelector('#btn-form');
const alertLogin = document.querySelector('#alert-login');
const alertasApp = document.querySelector('.alertas');



//petición---------------------------------

const peticion = async request => {
	try {
		const resp = await fetch(request);		

		return await resp.json();
        
	} catch (error) {
		let msj = error.statusText || 'ocurrio un error';
		
        return {error , msj }
	}
};

//Registrarse -----------------------------

//login-------------------------------------
// const url = 'http://localhost:8082/api/usuarios/login';
const url = 'https://konnakol-rest-server.herokuapp.com/api/usuarios/login';

btnForm.addEventListener('click', async (e) => {
	e.preventDefault();
	const username = document.querySelector('#username').value;
	const password = document.querySelector('#password').value;

	if(!username  && !password) {
		alertLogin.style.display = "block";
		return alertLogin.textContent = `Rellene los formularios`;}

	const data = { username, password };

	const peticionPOST = new Request(url, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: { 'Content-type': 'application/json; charset=utf-8' },
	});

	const resp = await peticion(peticionPOST);
    
    if(resp.msg){//Mi api manda resp json con msg cuando no encuentra usaurio o contraseña o error
		alertLogin.style.display = "block";
        alertLogin.textContent = `${resp.msg}`;
        return console.error(resp.msg);
	}

	alertLogin.style.display = "block";
	alertLogin.textContent = `Hola ${resp.usuario.username}`;

	localStorage.setItem('token', resp.token);

	// console.log(resp.token, resp.usuario);
});


// Permiso para guardar en Presets BD boton SaveP-----------------------
export const isPermisos = async () => {

		const jwt = localStorage.getItem( 'token' );
		
		const peticionPOST = new Request(`${url}/validarJWT`, {
			method: 'POST',
			headers:{ 'x-token': jwt }
		});

		const {msg,ok} = await peticion(peticionPOST);

		if(msg) {
			
			alertasApp.classList.add('alertas-activo');
			alertasApp.textContent = msg;

			setTimeout(() => {
				alertasApp.classList.remove('alertas-activo');
			}, 3000);
			return console.error(`ERROR:  ${msg} `)
		}

		return true;

	
};

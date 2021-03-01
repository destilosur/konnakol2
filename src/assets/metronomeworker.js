var timerID=null;
var interval=100;

//ESTA A LA ESCUCHA DE RECIBIR MSJ
//LE LLEGA PRIMERO{interval: 0.25} ENTRA 1º ELSE IF
//CUANDO LE LLEGA EL MENSAJE DEl METODO PLAY CUANDO isStart=true;

self.onmessage=function(e){
	if (e.data=="start") {
		console.log("starting");
		//manda msj tick y el el interval
		timerID=setInterval(function(){postMessage("tick");},interval)
	}
	// 
	else if (e.data.interval) {
		console.log("setting interval");
		//INTERVAL =0.25
		interval=e.data.interval;
		
		//SI YA ESTUVO EN PLAY() 1º IF BORRA Y VUELVE A RESETEAR INTERVAL
		if (timerID) {
			clearInterval(timerID);
			timerID=setInterval(function(){postMessage("tick");},interval)
		}
	}
	else if (e.data=="stop") {
		console.log("stopping");
		clearInterval(timerID);
		timerID=null;
	}
};

// MANDA PRIMERO EL MENSAJE ESTE
postMessage('hi there');

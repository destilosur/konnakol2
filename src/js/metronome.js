var audioContext = null;
var unlocked = false;
var isPlaying = false; // Are we currently playing?
var startTime; // The start time of the entire sequence.
var current16thNote; // What note is currently last scheduled?
var tempo = 90.0; // tempo (in beats per minute)
var lookahead = 25.0; // How frequently to call scheduling function
//(in milliseconds)
var scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
// This is calculated from lookahead, and overlaps
// with next interval (in case the timer is late)
var nextNoteTime = 0.0; // when the next note is due.
var noteResolution = 0; // 0 == 16th, 1 == 8th, 2 == quarter note
var noteLength = 0.05; // length of "beep" (in seconds)
var canvas, // the canvas element
	canvasContext; // canvasContext is the canvas' context 2D
var last16thNoteDrawn = -1; // the last "box" we drew on the screen
var notesInQueue = []; // the notes that have been put into the web audio,
// and may or may not have played yet. {note, time}
var timerWorker = null; // The Web Worker used to fire timer messages
const volumeControl = document.querySelector('#volumen');
const volumeControl2 = document.querySelector('#volumen2');
let primerP = undefined;

let osc;
let bufferTemp;
let bufferTemp2;
let bufferTemp3;
let gainNode;
let gainNode2;
let $parrafos = [];
const showTempo = document.querySelector('#showTempo');
let subdivicion = 0.25;
const dosillo = 0.5;
const tresillo = 0.33333333333333;
const cuatrillo = 0.25;
const seisillo = 0.1666666666666667;
const octillo = 0.125;
let contadorRep = 1;

// First, let's shim the requestAnimationFrame API, with a setTimeout fallback
window.requestAnimFrame = (function () {
	return (
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback) {
			window.setTimeout(callback, 1000 / 60);
		}
	);
})();

function nextNote() {
	// Advance current note and time by a 16th note...
	var secondsPerBeat = 60.0 / tempo; // Notice this picks up the CURRENT
	// tempo value to calculate beat length.
	nextNoteTime += subdivicion * secondsPerBeat; // Add beat length to last beat time

	current16thNote++;
	if (current16thNote == 16) {
		//catidad DE SUBDIVICIONES 16
		current16thNote = 0;
	}
}

function scheduleNote(beatNumber, time) {
	notesInQueue.push({ note: beatNumber, time: time });
	osc = audioContext.createOscillator();
	osc.frequency.value = 880.0;

	let bandpassLow = audioContext.createBiquadFilter();
	bandpassLow.type = 'lowpass';
	bandpassLow.frequency.value = 90;

	let bandpassHi = audioContext.createBiquadFilter();
	bandpassHi.type = 'notch';
	bandpassHi.frequency.value = 1000;

	osc.connect(bandpassLow).connect(bandpassHi).connect(gainNode).connect(audioContext.destination);
	osc.start(time);
	osc.stop(time + noteLength);
}

function scheduler() {
	// while there are notes that will need to play before the next interval,
	// schedule them and advance the pointer.
	while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
		scheduleNote(current16thNote, nextNoteTime);
		nextNote();
	}
}

export function play(silabas) {
	$parrafos = silabas;
	
	if (!unlocked) {
		// play silent buffer to unlock the audio
		var buffer = audioContext.createBuffer(1, 1, 22050);
		var node = audioContext.createBufferSource();
		node.buffer = buffer;
		node.start(0);
		unlocked = true;
	}
	 
	isPlaying = !isPlaying;
	
	if (isPlaying) {
		// start playing
		$parrafos.forEach(p => p.classList.remove('activo'));
		i = 0;
		subdivicion = 0.25;
		contadorRep = 1;
		if (primerP.textContent.includes(':')) {
			console.log(primerP);
			
			switch (primerP.textContent) {
				case ':2':
					{
						subdivicion = dosillo;
					}
					break;
					case ':3':
					{
						subdivicion = tresillo;
					}
					break;
				case ':4':
					{
						subdivicion = cuatrillo;
					}
					break;
				case ':6':
					{
						subdivicion = seisillo;
					}
					break;
				case ':8':
					{
						subdivicion = octillo;
					}
					break;
			}
		}
		requestAnimFrame(draw);
		current16thNote = 0;
		nextNoteTime = audioContext.currentTime;
		timerWorker.postMessage('start');
		return 'stop';
	} else {
		timerWorker.postMessage('stop');
		return 'play';
	}
}

function playSample(audioContext, audioBuffer) {
	const sampleSource = audioContext.createBufferSource();
	sampleSource.buffer = audioBuffer;
	sampleSource.connect(audioContext.destination);
	sampleSource.start(0, 0);
	// sampleSource.stop();
	return sampleSource;
}

function playSample2(audioContext, audioBuffer) {
	const sampleSource = audioContext.createBufferSource();
	sampleSource.buffer = audioBuffer;
	sampleSource.connect(gainNode2).connect(audioContext.destination);
	sampleSource.start(0, 0);
	// sampleSource.stop();
	return sampleSource;
}

let i = 0;
// DRAW
function draw() {
	var currentNote = last16thNoteDrawn;
	var currentTime = audioContext.currentTime;

	while (notesInQueue.length && notesInQueue[0].time < currentTime) {
		currentNote = notesInQueue[0].note;
		notesInQueue.splice(0, 1); // remove note from queue
	}

	// We only need to draw if the note has moved.
	if (last16thNoteDrawn != currentNote) {
		if (i !== 0) $parrafos[i - 1].classList.remove('activo');
		else $parrafos[$parrafos.length - 1].classList.remove('activo');

		let rep = $parrafos[i].parentElement.parentElement.querySelector('.contenedor-iconos i').getAttribute('data-rep');
		switch ($parrafos[i].getAttribute('data-subd')) {
			case '2':
				{
					// console.log('rep: ' +rep+ ' contadorRep '+contadorRep);
					if (contadorRep === Number(rep)) {
						subdivicion = dosillo;
						contadorRep = 1;
					} else {
						contadorRep++;
					}
				}
				break;

			case '3':
				{
					if (contadorRep === Number(rep)) {
						subdivicion = tresillo;
						contadorRep = 1;
					} else {
						contadorRep++;
					}
				}
				break;

			case '4':
				{
					if (contadorRep === Number(rep)) {
						subdivicion = cuatrillo;
						contadorRep = 1;
					} else {
						contadorRep++;
					}
				}
				break;

			case '6':
				{
					if (contadorRep === Number(rep)) {
						subdivicion = seisillo;
						contadorRep = 1;
					} else {
						contadorRep++;
					}
				}
				break;

			case '8':
				{
					if (contadorRep === Number(rep)) {
						subdivicion = octillo;
						contadorRep = 1;
					} else {
						contadorRep++;
					}
				}
				break;
		}

		if ($parrafos[i].classList.contains('first')) playSample2(audioContext, bufferTemp3);

		$parrafos[i].classList.add('activo');

		if ($parrafos[i].classList.contains('drutam')) {
			osc.frequency.value = 440.0;
			playSample(audioContext, bufferTemp);

			let iTemp = i;

			$parrafos[i].classList.add('drutam-activo');
			setTimeout(() => {
				$parrafos[iTemp].classList.remove('drutam-activo');
			}, 100);
		}

		if ($parrafos[i].classList.contains('anudrutam')) {
			osc.frequency.value = 440.0;
			playSample(audioContext, bufferTemp2);

			let iTemp = i;

			$parrafos[i].classList.add('anudrutam-activo');
			setTimeout(() => {
				$parrafos[iTemp].classList.remove('anudrutam-activo');
			}, 100);
		}

		i++;
		if (i === $parrafos.length) i = 0;
	}
	last16thNoteDrawn = currentNote;

	// // set up to draw again
	requestAnimFrame(draw);
}

export function init() {
	audioContext = new AudioContext();

	async function getFile(audioContext, filepath) {
		const response = await fetch(filepath);
		const arrayBuffer = await response.arrayBuffer();
		const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
		return audioBuffer;
	}

	async function setupSample(filePath) {
		const sample = await getFile(audioContext, filePath);
		return sample;
	}

	bufferTemp = audioContext.createBuffer(1, 1, 22050);
	bufferTemp2 = audioContext.createBuffer(1, 1, 22050);
	bufferTemp3 = audioContext.createBuffer(1, 1, 22050);

	setupSample('./assets/click.mp3').then(buffer => (bufferTemp = buffer));
	setupSample('./assets/Djun.mp3').then(buffer => (bufferTemp2 = buffer));
	setupSample('./assets/hh.mp3').then(buffer => (bufferTemp3 = buffer));

	//VOLUMEN

	gainNode = audioContext.createGain();
	gainNode2 = audioContext.createGain();

	primerP = document.querySelectorAll('.borde-notas p')[0];

	// CARGA PARRAFOS PARRAFOS----------------------------------------------------------
	//    // start the drawing loop.

	timerWorker = new Worker('/src/js/metronomeworker.js');

	timerWorker.onmessage = function (e) {
		if (e.data == 'tick') {
			scheduler();
		} else console.log('message: ' + e.data);
	};
	timerWorker.postMessage({ interval: lookahead });
}

window.addEventListener('load', init);

// volumen-------------------------

volumeControl.addEventListener(
	'input',
	function () {
		gainNode.gain.value = this.value;
	},
	false
);

const $tempo = document.querySelector('#tempo');

volumeControl2.addEventListener(
	'input',
	function () {
		gainNode2.gain.value = this.value;
	},
	false
);

$tempo.addEventListener('change', () => {
	tempo = $tempo.value;
	showTempo.textContent = tempo;
});



var audioContext = null;
var unlocked = false;
var isPlaying = false; // Are we currently playing?
var startTime; // The start time of the entire sequence.
var current16thNote; // What note is currently last scheduled?
var tempo = 120.0; // tempo (in beats per minute)
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
const volumeControl = document.querySelector('[data-action="volume"]'); 
let osc;
let bufferTemp;
let bufferTemp2;
let gainNode;
let $parrafos=undefined;


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
	nextNoteTime += 0.25 * secondsPerBeat; // Add beat length to last beat time

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

	
	const volumeControl = document.querySelector('[data-action="volume"]');
	volumeControl.addEventListener('input', function() {
		gainNode.gain.value = this.value;
	}, false);

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

export function play() {
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
	sampleSource.connect(audioContext.destination)
	sampleSource.start(0,0);
	// sampleSource.stop();
	return sampleSource;
  }

let i = 0;

// console.log($parrafos)
function draw() {
	var currentNote = last16thNoteDrawn;
	var currentTime = audioContext.currentTime;

	while (notesInQueue.length && notesInQueue[0].time < currentTime) {
		currentNote = notesInQueue[0].note;
		notesInQueue.splice(0, 1); // remove note from queue
	}

	// We only need to draw if the note has moved.
	if (last16thNoteDrawn != currentNote) {
		

		$parrafos[i].classList.add('activo');

		if (i === 0) {
			$parrafos[$parrafos.length-1].classList.remove('activo');

			if($parrafos[i].classList.contains('drutam')){
				console.log($parrafos[i].classList.contains('drutam'))
				osc.frequency.value=440.0; 
				playSample(audioContext,bufferTemp2);              
				let iTemp=i
				$parrafos[i].classList.add('drutan-activo'); 

				setTimeout(() => {
					$parrafos[iTemp].classList.remove('drutan-activo'); 
				}, 100);
			
		}
            
		} else {
			
			$parrafos[i-1].classList.remove('activo');
            if($parrafos[i].classList.contains('drutam')){
                    osc.frequency.value=440.0; 
					playSample(audioContext,bufferTemp);              
                    let iTemp=i
                    $parrafos[i].classList.add('drutan-activo'); 

                    setTimeout(() => {
                        $parrafos[iTemp].classList.remove('drutan-activo'); 
                    }, 100);
                
            }
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

	  bufferTemp=audioContext.createBuffer(1, 1, 22050);
	  bufferTemp2=audioContext.createBuffer(1, 1, 22050);

	  setupSample('./assets/click.mp3')
	  .then(buffer=>bufferTemp=buffer);
	  setupSample('./assets/Djun.mp3')
	  .then(buffer=>bufferTemp2=buffer);

	  //VOLUMEN 

	    gainNode = audioContext.createGain();
		

	    $parrafos = document.querySelectorAll('.borde-notas p');
		console.log($parrafos)
    

	//    // start the drawing loop.

	timerWorker = new Worker('/src/js/metronomeworker.js');

	timerWorker.onmessage = function (e) {
		if (e.data == 'tick') {
			// console.log("tick!");
			scheduler();
		} else console.log('message: ' + e.data);
	};
	timerWorker.postMessage({ interval: lookahead });
}

window.addEventListener('load', init);

// volumen-------------------------


		volumeControl.addEventListener('input', function() {
		gainNode.gain.value = this.value;
	    }, false);

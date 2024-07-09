// Example showing how to produce a tone using Web Audio API.
var oscillator;
var amp;
var lines;
var linenumber;

var isAudioSetup = false;

// Create an AudioContext and a JavaScriptNode.
function initAudio()
{
	if( context && !isAudioSetup )
	{
		oscillator = context.createOscillator();
		fixOscillator(oscillator);
		oscillator.frequency.value = 440;
		amp = context.createGain();
		amp.gain.value = 0;
	
		// Connect ooscillator to amp and amp to the mixer of the context.
		// This is like connecting cables between jacks on a modular synth.
		oscillator.connect(amp);
		amp.connect(context.destination);
		oscillator.start(0);

		isAudioSetup = true;
	}
}

// Set the frequency of the oscillator and start it running.
function startTone( frequency )
{
	var now = context.currentTime;
	
	oscillator.frequency.setValueAtTime(frequency, now);
	
	// Ramp up the gain so we can hear the sound.
	// We can ramp smoothly to the desired value.
	// First we should cancel any previous scheduled events that might interfere.
	//amp.gain.cancelScheduledValues(now);
	// Anchor beginning of ramp at current value.
	amp.gain.setValueAtTime(amp.gain.value, now);
	amp.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.1);
}

function changeTone( frequency )
{
        oscillator.frequency.value = frequency;
}

function stopTone(time)
{
	oscillator.frequency.cancelScheduledValues(time);
	amp.gain.cancelScheduledValues(time);
	amp.gain.setValueAtTime(0, time);
}

function playSong() 
{

	if (context == null) {
		alert("Sorry. WebAudio API not supported. Try using the Google Chrome or Safari browser.");
		return;
	}

	initAudio();

	//context.resume();

	var gcodetextarea = document.getElementById('gcode');

	lines = gcodetextarea.value.split('\n');
	
	startTone(440)

	var playTime = context.currentTime; 

	for (var i=0; i<lines.length; i++) {
		var line = lines[i];

		var tone = getLineFrequency(line);
		if (tone < 0)
			continue;

		oscillator.frequency.setValueAtTime(tone, playTime);

		var duration = parseInt(getLineDuration(line)) / 1000;
		playTime += duration;
	}

	stopTone(playTime);
}

function stopSong() {
	if (isAudioSetup) {
		var now = context.currentTime;
		stopTone(now);
	}
}


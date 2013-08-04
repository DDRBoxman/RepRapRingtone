
// Example showing how to produce a tone using Web Audio API.
var oscillator;
var amp;
var lines;
var linenumber;

// Create an AudioCOntext and a JavaScriptNode.
function initAudio()
{
	if( context )
	{
		oscillator = context.createOscillator();
		fixOscillator(oscillator);
		oscillator.frequency.value = 440;
		amp = context.createGainNode();
		amp.gain.value = 0;
	
		// Connect ooscillator to amp and amp to the mixer of the context.
		// This is like connecting cables between jacks on a modular synth.
		oscillator.connect(amp);
		amp.connect(context.destination);
		oscillator.start(0);
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
	amp.gain.setValueAtTime(0, time);
}

function playSong() 
{
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

// init once the page has finished loading.
window.onload = initAudio;

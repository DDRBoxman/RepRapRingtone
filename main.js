function convert() {
	console.log("Starting Conversion");

	rttltextarea = document.getElementById('rttl');
	data = rttltextarea.value;
	data = data.replace(' ','');
	dataarray = data.split(':');

	var output = "";

	//gcode comment for ringtone name
	output += ";" + dataarray[0] + "\n";

	//Get rttl settings
	settings = new Settings();
	settings.parseSettingsString(dataarray[1]);

	songData = parseSong(dataarray[2], settings);

	output += songData;

	gcodetextarea = document.getElementById('gcode');
	gcodetextarea.value = output;
}

function parseSong(songString, settings) {
	//Note that octave 4: A=440Hz, 5: A=880Hz, 6: A=1.76 kHz, 7: A=3.52 kHz
	//The lowest note on the Nokia 61xx is A4, the highest is B7

	var pattern = /(\d*?)?([A-Ga-gPp]#?)(\d|\.)?/;

	var beatDuration = 60 / settings.getTempo() * 1000;

	var gcodeSong = "";

	songData = songString.split(",");
	for (var i=0; i < songData.length; i++) {
		var frequency;
		var duration = settings.getDuration();
		var octave = settings.getOctave();
		var match = pattern.exec(songData[i]);	

		if (typeof match[1] != "undefined") {
			duration = match[1];	
		}

		duration = getDuration(beatDuration, duration);

		if (typeof match[3] != "undefined") {
			octave = parseInt(match[3]);
		}

		frequency = getFrequency(match[2], octave);	

		gcodeSong += "M300 S" + Math.floor(frequency) + " P" + Math.floor(duration) + "\n";
	}

	return gcodeSong;
}

var notes = ['a', 'a#', 'b', 'c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#'];

function getFrequency(note, octave) {

	if (note == 'p' || note == 'P')
		return 0;

	var halfsteps = 0;
	halfsteps += (octave - 4) * 12;

	for (var i=0; i < notes.length; i++) {
		if (note.toLowerCase() == notes[i]) {
			halfsteps += i;
		}	
	}

	return 440 * Math.pow(Math.pow(2, (1/12)),  halfsteps);
}

function getDuration(beatDuration, duration) {
	if (duration == ".") {
		return beatDuration * 1.5; 
	}
	switch (parseInt(duration)) {
		case 1:
			return beatDuration * 4;
			break;
		case 2:
			return beatDuration * 2;
			break;
		case 4:
			return beatDuration;
			break;
		case 8:
			return beatDuration / 2;
			break;
		case 16:
			return beatDuration / 4;
			break;
		case 32:
			return beatDuration / 8;
			break;
	}	
}

function Settings() {
	var duration;
	var octave;
	var tempo;
}

Settings.prototype.getOctave = function() {
	return octave;
}

Settings.prototype.getDuration = function() {
	return duration;
}

Settings.prototype.getTempo = function() {
	return tempo;
}

Settings.prototype.parseSettingsString = function(settingsString) {
	split = settingsString.split(',');
	for (var i = 0; i < split.length; i++) {
		pair = split[i].split('=');
		switch(pair[0]) {
			case 'd':
				duration = pair[1];
				break;
			case 'o':
				octave = pair[1];
				break;
			case 'b':
				tempo = pair[1];
				break;
		}
	}
}	

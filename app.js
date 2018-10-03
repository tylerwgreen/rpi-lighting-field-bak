// var pigpio = require('pigpio');
var led = require(__dirname + '/modules/node/led');
var logger = require(__dirname + '/modules/node/logger');
var pythonInterface = require(__dirname + '/modules/node/python-interface');

var app = {
	leds: [],
	init: function(){
		console.log('app.init()');
		this.config = require('config');
		this.logger = logger.init({
			config: this.config.get('logger'),
			logDir: __dirname
		});
		/* var interval = 1000;
		for(var i = 1; i <= 20; i++){
			// console.log(i);
			var led1 = new led(i + 1);
			// led.blink(interval);
			// led.fadeOut(interval);
			led1.fadeIn(interval);
			interval -= Math.round(interval / 20);
		} */
		// led1.fadeOut(250);
		this.pythonInterface = pythonInterface.init({
			config:		this.config.get('pythonInterface'),
			logger:		this.logger,
			scriptPath:	__dirname + '/modules/python/',
			script:		'App.py'
		});
		this._registerpythonInterfaceCommands();
		this._configureLEDs();
		// this.pythonInterface.testTest()
// return;
		// return;
		// WAVE FILES
		// var waveFile = '0_16.wav' # single freq
		// var waveFile = 'tone.wav' # freq sweep
		// var waveFile = 'technologic.wav'
		// var waveFile = 'technologic-real.wav'
		// var waveFile = 'cello.wav'
		// var waveFile = 'getaway-16-44.wav'
		// var waveFile = 'getaway-16-48.wav'
		var waveFile = 'drums-01.wav'
		// var waveFile = '1k-octaves.wav'
		// var waveFile = '440-octaves.wav'
		// var waveFile = '440-stereo.wav' # 440 khz tone
		// var waveFile = '440-mono.wav' # 440 khz tone
		// var waveFile = '440-stereo-loud.wav'
		// var waveFile = '440-mono-loud.wav'
		// var waveFile = '440-mono-half-as-loud.wav' # 440 khz tone half as loud as 440-mono.wav
		// var waveFile = '440-mono-quiet.wav' # 440 khz tone quieter than 440-mono.wav
		// var waveFile = '440-mono-16-44-0db.wav' # 440 khz tone
		this.playAudioFile(waveFile);
	},
	_registerpythonInterfaceCommands: function(){
		console.log('app._registerpythonInterfaceCommands()');
		app.pythonInterface.registerCommand('message', app._message);
		app.pythonInterface.registerCommand('audioPeaks', app._audioPeaks);
		app.pythonInterface.registerCommand('audioComplete', app._audioComplete);
	},
	_configureLEDs: function(){
		console.log('app._configureLEDs()');
		for(i = 1; i <= 20; i++)
			app.leds.push(new led(i + 1));
	},
	_message: function(data){
		console.log('app._message()', data.content);
	},
	_audioPeaks: function(data){
		// console.log('app._audioPeaks()', data);
		if(typeof data.data[0] === 'undefined')
			throw new Error('Missing or illegal data attributes: ' + data);
		if(typeof data.data[0] !== 'undefined'){
			/*
			0,	# [20, 40]
			1,	# [40, 80]
			2,	# [80, 160]
			3,	# [160, 320]
			4,	# [320, 640]
			5,	# [640, 1280]
			6,	# [1280, 2560]
			7,	# [2560, 5120]
			8,	# [5120, 10240]
			9	# [10240, 20000]
			
			Bass (Kick) Drum	60Hz - 100Hz	35 - 115
			Snare Drum	120 Hz - 250 Hz	
			Cymbal - Hi-hat	3 kHz - 5 kHz	4 - 110
			*/
			var peakLo = data.data[0] + data.data[1];
			// var peakMid = data.data[3] + data.data[4];
			// var peakHi = data.data[8] + data.data[9];
			var peakLoTop = 1800;
			// var peakMidTop = 2600;
			// var peakMidTop = 1200;
			// var peakHiTop = 380;
			if(peakLo >= peakLoTop - 500) console.log(peakLo);
			// if(peakMid >= peakMidTop - 150) console.log(peakMid);
			// if(peakHi >= peakHiTop - 15) console.log(peakHi);
			if(peakLo >= peakLoTop){
			// if(peakMid >= peakMidTop){
			// if(peakHi >= peakHiTop){
				// console.log('peakLo: ' + peakLo);
				/* app.leds.forEach(function(_led){
					_led.fadeOut(500);
				}); */
				app._blink();
			}
			/* if(peakLo >= peakLoTop){
				console.log('peakLo: ' + peakLo);
				app.leds[0].fadeOut(500);
			}
			if(peakMid >= peakMidTop){
				console.log('peakMid: ' + peakMid);
				app.leds[1].fadeOut(500);
			}
			if(peakHi >= peakHiTop){
				console.log('peakHi: ' + peakHi);
				app.leds[2].fadeOut(500);
			} */
		}
	},
	_blink: function(){
		// app._blinkLeft();
		// app._blinkUp();
		if(app._blinkedUp){
			app._blinkLeft();
			app._blinkedUp = false;
		}else{
			app._blinkUp();
			app._blinkedUp = true;
		}
	},
	_blinkUp: function(){
		var interval = 100;
		app.leds.forEach(function(_led){
			interval -= Math.round(interval / 20);
			setTimeout(function(){
				_led.fadeOut(interval);
			}, interval);
		});
	},
	_blinkLeft: function(){
		var interval = 100;
		var i = 0;
		app.leds.forEach(function(_led){
			// console.log(i + ':' + (i % 4) + '|' + (i % 3) + '|' + (i % 2) + '|' + (i % 1));
			if([0,4,8,12,16].indexOf(i) != -1){
				console.log(i + '|1');
				_led.fadeOut(interval);
			}else if([1,5,9,13,17].indexOf(i) != -1){
				console.log(i + '|2');
				setTimeout(function(){
					_led.fadeOut(interval);
				}, 50);
			}else if([2,6,10,14,18].indexOf(i) != -1){
				console.log(i + '|3');
				setTimeout(function(){
					_led.fadeOut(interval);
				}, 150);
			}else if([3,7,11,15,19].indexOf(i) != -1){
				console.log(i + '|4');
				setTimeout(function(){
					_led.fadeOut(interval);
				}, 200);
			}
			i++;
		});
	},
	_audioComplete: function(data){
		console.log('app._audioComplete()', data);
		app.playAudioFile('1k-octaves.wav');
	},
	playAudioFile: function(audioFile){
		console.log('app.playAudioFile()', audioFile);
		app.pythonInterface.sendCommand('play', {
			'file': __dirname + '/assets/audio/' + audioFile
		});
	}
}
app.init();
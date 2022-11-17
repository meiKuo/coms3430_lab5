document.addEventListener("DOMContentLoaded", function(event) {

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const keyboardFrequencyMap = {
        '90': 261.625565300598634,  //Z - C
        '83': 277.182630976872096, //S - C#
        '88': 293.664767917407560,  //X - D
        '68': 311.126983722080910, //D - D#
        '67': 329.627556912869929,  //C - E
        '86': 349.228231433003884,  //V - F
        '71': 369.994422711634398, //G - F#
        '66': 391.995435981749294,  //B - G
        '72': 415.304697579945138, //H - G#
        '78': 440.000000000000000,  //N - A
        '74': 466.163761518089916, //J - A#
        '77': 493.883301256124111,  //M - B
        '81': 523.251130601197269,  //Q - C
        '50': 554.365261953744192, //2 - C#
        '87': 587.329535834815120,  //W - D
        '51': 622.253967444161821, //3 - D#
        '69': 659.255113825739859,  //E - E
        '82': 698.456462866007768,  //R - F
        '53': 739.988845423268797, //5 - F#
        '84': 783.990871963498588,  //T - G
        '54': 830.609395159890277, //6 - G#
        '89': 880.000000000000000,  //Y - A
        '55': 932.327523036179832, //7 - A#
        '85': 987.766602512248223,  //U - B
    }

    const pictures = {
        '90': "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1330.JPG?v=1664750172677",  //Z - C
        '83': "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1331.JPG?v=1664750049447", //S - C#
        '88': "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1332.JPG?v=1664750048454",  //X - D
        '68': "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1333.JPG?v=1664750048431", //D - D#
        '67': "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1334.JPG?v=1664750059229",  //C - E
        '86': "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1335.JPG?v=1664750057503",  //V - F
        '71': "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1336.JPG?v=1664750055478", //G - F#
        '66': "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1337.JPG?v=1664750052510",  //B - G
        '72': "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1338.JPG?v=1664750050457", //H - G#
        '78': "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1339.JPG?v=1664750045389",  //N - A
        '74': "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1340.JPG?v=1664750044055", //J - A#
        '77': "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1341.JPG?v=1664750044372",  //M - B
        '81': "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1342.JPG?v=1664750043417",  //Q - C
        '50': "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1343.JPG?v=1664749999975", //2 - C#
        '87': "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1344.JPG?v=1664749998944",  //W - D
        '51': "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1345.JPG?v=1664749997926", //3 - D#
        '69': "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1346.JPG?v=1664749995175",  //E - E
        '82': "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1347.JPG?v=1664749994060",  //R - F
        '53': "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1348.JPG?v=1664749992850", //5 - F#
        '84': "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1349.JPG?v=1664749991958",  //T - G
        '54': "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1350.JPG?v=1664749991283", //6 - G#
        '89': "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1351.JPG?v=1664749990847",  //Y - A
        '55': "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1352.JPG?v=1664749990406", //7 - A#
        '85': "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1353.JPG?v=1664749990140",  //U - B
    }

    const globalGain = audioCtx.createGain(); //this will control the volume of all notes
    globalGain.gain.setValueAtTime(0.8, audioCtx.currentTime)
    globalGain.connect(audioCtx.destination);

window.addEventListener('keydown', keyDown, false);
window.addEventListener('keyup', keyUp, false);

activeOscillators = {}
gainNodes = {}
var notes_playing = 0; // tracks how many notes are playing

function keyDown(event) {
    const key = (event.detail || event.which).toString();
    if (pictures[key]) {
        image.src = pictures[key]; 
        image.width = "570";
        image.height = "300";
    } else {
        image.src = "https://cdn.glitch.global/b34a6a6e-67c4-4f39-b0c2-d5b1117fa21a/IMG_1329.JPG?v=1664749988818";
        image.width = "570";
        image.height = "300";
    }
    if (keyboardFrequencyMap[key] && !activeOscillators[key]) {
        notes_playing++; // if another key is pressed, increment number of notes playing
        if (document.getElementById('synthsurprise').checked || document.getElementById('synthwavesurprise').checked) {
            var options = ["nosynth", "additive", "am", "fm", "lfo"];
            var randomNumber = Math.floor(Math.random() * options.length);
            var selection = options[randomNumber];
            document.getElementById(selection).checked = true;
            if (selection == "additive") {
                document.getElementById("partials").value = Math.floor(Math.random() * 100);
                document.getElementById("modfreq").value = null;
                document.getElementById("lfofreq").value = null;
            } else if (selection == "am" || selection == "fm") {
                document.getElementById("partials").value = null;
                document.getElementById("modfreq").value = Math.floor(Math.random() * 1000);
                document.getElementById("lfofreq").value = null;
            } else if (selection == "lfo") {
                document.getElementById("partials").value = null;
                document.getElementById("modfreq").value = Math.floor(Math.random() * 1000);
                document.getElementById("lfofreq").value = Math.floor(Math.random() * 20);
            }
        }
        playNote(key);
    }
}



function keyUp(event) {
    const key = (event.detail || event.which).toString();
    if (keyboardFrequencyMap[key] && activeOscillators[key]) {
        notes_playing--; // decrease number of notes playing
        for (let i = 0; i < gainNodes[key].length; i++) {
            gainNodes[key][i].gain.cancelScheduledValues(audioCtx.currentTime);
            gainNodes[key][i].gain.setTargetAtTime(0, audioCtx.currentTime, 0.01); // release
        }
        for (let i = 0; i < activeOscillators[key].length; i++) {
            activeOscillators[key][i].stop(audioCtx.currentTime + 2);
        }
        delete activeOscillators[key];
        delete gainNodes[key];
    }
}

function playNote(key) {
    if (document.getElementById('wavesurprise').checked || document.getElementById('synthwavesurprise').checked) {
        var options = ["sine", "sawtooth", "square", "triangle"];
        var randomNumber = Math.floor(Math.random() * options.length);
        var selection = options[randomNumber];
        document.getElementById(selection).checked = true;
    }
    if (document.getElementById('sine').checked) { // picking correct wave
        wave_type = 'sine';
    } else if (document.getElementById('sawtooth').checked) {
        wave_type = 'sawtooth';
    } else if (document.getElementById('square').checked) {
        wave_type = 'square';
    } else if (document.getElementById('triangle').checked) {
        wave_type = 'triangle';
    }
    if (document.getElementById('nosynth').checked) {
        const osc = audioCtx.createOscillator();
        osc.frequency.setValueAtTime(keyboardFrequencyMap[key], audioCtx.currentTime);
        osc.type = wave_type;
        const newNode = audioCtx.createGain(); // create new gain node
        newNode.gain.setValueAtTime(0, audioCtx.currentTime);
        // using notes_playing to control the gain
        newNode.gain.setTargetAtTime(0.8/notes_playing, audioCtx.currentTime, 0.01); // attack
        newNode.gain.setTargetAtTime(0.5/notes_playing, audioCtx.currentTime + 0.01, 0.01); // decay + sustain
        osc.connect(newNode).connect(audioCtx.destination);
        osc.start();
        activeOscillators[key] = [osc];
        gainNodes[key] = [newNode];
    } else if (document.getElementById('additive').checked) { // ADDITIVE SYNTHESIS
        const osc = audioCtx.createOscillator();
        // Creating partials + setting frequencies
        var osc_array = [];
        osc_array.length = 0;
        if (document.getElementById("partials").value) { // Personalization element
            number_partials = document.getElementById("partials").value;
        } else {
            number_partials = 4; // otherwise hardcoded number of partials
        }
        for (let i = 0; i < number_partials; i++) {
            osc_array[i] = audioCtx.createOscillator();
            if (i < ((number_partials)/2)) {
                osc_array[i].frequency.setValueAtTime(((i+2) * keyboardFrequencyMap[key]) + Math.random() * 15, audioCtx.currentTime);
            } else {
                osc_array[i].frequency.setValueAtTime(((i+2) * keyboardFrequencyMap[key]) - Math.random() * 15, audioCtx.currentTime);
            }
        }

        osc.frequency.setValueAtTime(keyboardFrequencyMap[key], audioCtx.currentTime);
        
        // Picking correct wave for partials
        osc.type = wave_type;
        for (let i = 0; i < osc_array.length; i++) {
            osc_array[i].type = wave_type;
        }

        const newNode = audioCtx.createGain(); // create new gain node
        newNode.gain.setValueAtTime(0, audioCtx.currentTime);

        osc.connect(newNode);
        // Partials: connect
        for (let i = 0; i < osc_array.length; i++) {
            osc_array[i].connect(newNode);
        }

        newNode.connect(audioCtx.destination);

        // using notes_playing to control the gain
        const gainDeterminer = 1/(1+number_partials);
        newNode.gain.setTargetAtTime(gainDeterminer/notes_playing, audioCtx.currentTime, 0.01); // attack
        newNode.gain.setTargetAtTime(gainDeterminer/notes_playing, audioCtx.currentTime + 0.01, 0.01); // decay + sustain

        osc.start();

        // Partials: array start
        for (let i = 0; i < osc_array.length; i++) {
            osc_array[i].start();
        }
        osc_array.push(osc);

        activeOscillators[key] = osc_array;
        gainNodes[key] = [newNode];
    } else if (document.getElementById('am').checked) { // AM SYNTHESIS
        var carrier = audioCtx.createOscillator();
        var modulatorFreq = audioCtx.createOscillator();
        if (document.getElementById("modfreq").value) {
            modulatorFreq.frequency.value = document.getElementById("modfreq").value;
        } else {
            modulatorFreq.frequency.value = 100; // modulator freq = can be hard-coded
        }
        carrier.frequency.value = keyboardFrequencyMap[key]; // carrier = key you press

        carrier.type = wave_type;
        modulatorFreq.type = wave_type;

        const modulated = audioCtx.createGain();
        const depth = audioCtx.createGain();
        // depth.gain.value = 0.5 //scale modulator output to [-0.5, 0.5]
        // modulated.gain.value = 1.0 - depth.gain.value; //a fixed value of 0.5
        // Adjust for clipping when playing multiple notes:
        depth.gain.value = 0.5/notes_playing;
        modulated.gain.value = (0.8 - depth.gain.value)/notes_playing;

        modulatorFreq.connect(depth).connect(modulated.gain); //.connect is additive, so with [-0.5,0.5] and 0.5, the modulated signal now has output gain at [0,1]
        carrier.connect(modulated)
        modulated.connect(audioCtx.destination);
        
        carrier.start();
        modulatorFreq.start();

        activeOscillators[key] = [carrier, modulatorFreq];
        gainNodes[key] = [modulated, depth];
    } else if (document.getElementById('fm').checked) { // FM SYNTHESIS
        var carrier = audioCtx.createOscillator();
        modulatorFreq = audioCtx.createOscillator();

        carrier.type = wave_type;
        modulatorFreq.type = wave_type;

        modulationIndex = audioCtx.createGain();
        modulationIndex.gain.value = 100;
        if (document.getElementById("modfreq").value) {
            modulatorFreq.frequency.value = document.getElementById("modfreq").value;
        } else {
            modulatorFreq.frequency.value = 100; // modulator freq = can be hard-coded
        }
        carrier.frequency.value = keyboardFrequencyMap[key]; // carrier = key you press

        // Controlling gain of carrier node
        const newNode = audioCtx.createGain(); // create new gain node
        newNode.gain.setValueAtTime(0, audioCtx.currentTime);
        // using notes_playing to control the gain
        newNode.gain.setTargetAtTime(0.8/notes_playing, audioCtx.currentTime, 0.01); // attack
        newNode.gain.setTargetAtTime(0.5/notes_playing, audioCtx.currentTime + 0.01, 0.01); // decay + sustain

        modulatorFreq.connect(modulationIndex);
        modulationIndex.connect(carrier.frequency);
        
        carrier.connect(newNode).connect(audioCtx.destination);

        carrier.start();
        modulatorFreq.start();

        activeOscillators[key] = [carrier, modulatorFreq];
        gainNodes[key] = [modulationIndex, newNode];
    } else if (document.getElementById('lfo').checked) { // LFO + FM SYNTHESIS
        var carrier = audioCtx.createOscillator();
        modulatorFreq = audioCtx.createOscillator();

        carrier.type = wave_type;
        modulatorFreq.type = wave_type;

        modulationIndex = audioCtx.createGain();
        modulationIndex.gain.value = 100;
        if (document.getElementById("modfreq").value) {
            modulatorFreq.frequency.value = document.getElementById("modfreq").value;
        } else {
            modulatorFreq.frequency.value = 100; // modulator freq = can be hard-coded
        }
        carrier.frequency.value = keyboardFrequencyMap[key]; // carrier = key you press

        // Controlling gain of carrier node
        const newNode = audioCtx.createGain(); // create new gain node
        newNode.gain.setValueAtTime(0, audioCtx.currentTime);
        // using notes_playing to control the gain
        newNode.gain.setTargetAtTime(0.8/notes_playing, audioCtx.currentTime, 0.01); // attack
        newNode.gain.setTargetAtTime(0.5/notes_playing, audioCtx.currentTime + 0.01, 0.01); // decay + sustain

        modulatorFreq.connect(modulationIndex);
        modulationIndex.connect(carrier.frequency);
        
        carrier.connect(newNode).connect(audioCtx.destination);

        carrier.start();
        modulatorFreq.start();

        // LFO PORTION
        var lfo = audioCtx.createOscillator();
        if (document.getElementById('lfofreq').value) {
            newValue = document.getElementById('lfofreq').value;
            if (newValue < 0 || newValue > 20) {
                alert("Please select a frequency within the range.");
            } else {
                lfo.frequency.value = newValue;
            }
        } else {
            lfo.frequency.value = 2;
        }
        //lfo.frequency.value = 2;
        lfoGain = audioCtx.createGain();
        lfoGain.gain.value = 300;
        lfo.connect(lfoGain).connect(modulatorFreq.frequency);
        lfo.start();

        activeOscillators[key] = [carrier, modulatorFreq, lfo];
        gainNodes[key] = [modulationIndex, newNode, lfoGain];
    }
  }

});


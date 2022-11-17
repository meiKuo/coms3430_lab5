var audioCtx;
var osc;
var gainNode;

// we start by defining some input (not training) data
TWINKLE_TWINKLE = {
    notes: [
        { pitch: 60, startTime: 0.0, endTime: 0.5 },
        { pitch: 60, startTime: 0.5, endTime: 1.0 },
        { pitch: 67, startTime: 1.0, endTime: 1.5 },
        { pitch: 67, startTime: 1.5, endTime: 2.0 },
        { pitch: 69, startTime: 2.0, endTime: 2.5 },
        { pitch: 69, startTime: 2.5, endTime: 3.0 },
        { pitch: 67, startTime: 3.0, endTime: 4.0 },
        { pitch: 65, startTime: 4.0, endTime: 4.5 },
        { pitch: 65, startTime: 4.5, endTime: 5.0 },
        { pitch: 64, startTime: 5.0, endTime: 5.5 },
        { pitch: 64, startTime: 5.5, endTime: 6.0 },
        { pitch: 62, startTime: 6.0, endTime: 6.5 },
        { pitch: 62, startTime: 6.5, endTime: 7.0 },
        { pitch: 60, startTime: 7.0, endTime: 8.0 },
    ],
    totalTime: 8
};

function midiToFreq(m) {
    return Math.pow(2, (m - 69) / 12) * 440;
}

//to play notes that are generated from .continueSequence
//we need to unquantize, then loop through the list of notes
function playNotes(noteList) {
    noteList = mm.sequences.unquantizeSequence(noteList)
    console.log(noteList.notes)
    noteList.notes.forEach(note => {
        playNote(note);
    });
}

function playNote(note) {
    offset = 1 //it takes a bit of time to queue all these events

    //wavetype 
    if (document.getElementById('sine').checked) { // picking correct wave
        wave_type = 'sine';
    } else if (document.getElementById('sawtooth').checked) {
        wave_type = 'sawtooth';
    } else if (document.getElementById('square').checked) {
        wave_type = 'square';
    } else if (document.getElementById('triangle').checked) {
        wave_type = 'triangle';
    }

    //synthtype 
    if (document.getElementById('nosynth').checked) {
        osc.type = wave_type;
        gainNode.gain.setTargetAtTime(0.8, note.startTime + offset, 0.01)
        osc.frequency.setTargetAtTime(midiToFreq(note.pitch), note.startTime + offset, 0.001)
        gainNode.gain.setTargetAtTime(0, note.endTime + offset - 0.05, 0.01)
    }

    else if (document.getElementById('additive').checked) { // ADDITIVE SYNTHESIS
        audioCtx = new (window.AudioContext || window.webkitAudioContext)
        const osc = audioCtx.createOscillator();
        var osc_array = [];
        osc_array.length = 0;

        number_partials = 4; // otherwise hardcoded number of partials

        for (let i = 0; i < number_partials; i++) {
            osc_array[i] = audioCtx.createOscillator();
            if (i < ((number_partials) / 2)) {
                osc_array[i].frequency.setValueAtTime(((i + 2) * midiToFreq(note.pitch)) + Math.random() * 15, audioCtx.currentTime);
            } else {
                osc_array[i].frequency.setValueAtTime(((i + 2) * midiToFreq(note.pitch)) - Math.random() * 15, audioCtx.currentTime);
            }
        }

        osc.frequency.setValueAtTime(midiToFreq(note.pitch), audioCtx.currentTime);

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
        newNode.gain.setTargetAtTime(0.8, note.startTime + offset, 0.01); // attack
        newNode.gain.setTargetAtTime(0, note.endTime + offset - 0.05, 0.01)

        osc.start();

        // Partials: array start
        for (let i = 0; i < osc_array.length; i++) {
            osc_array[i].start();
        }
        osc_array.push(osc);

    }

    else if (document.getElementById('am').checked) { // ADDITIVE SYNTHESIS
        console.log("inside am")
        audioCtx = new (window.AudioContext || window.webkitAudioContext)

        var carrier = audioCtx.createOscillator();
        var modulatorFreq = audioCtx.createOscillator();

        // modulatorFreq.frequency.value = 100; // modulator freq = can be hard-coded

        modulatorFreq.frequency.setValueAtTime(20, note.startTime + offset);

        // carrier.frequency.value = midiToFreq(note.pitch); // carrier = key you press

        carrier.frequency.setValueAtTime(midiToFreq(note.pitch), note.startTime + offset);
        // carrier.frequency.setTargetAtTime(midiToFreq(note.pitch), note.startTime+offset, 0.001);

        carrier.type = wave_type;
        modulatorFreq.type = wave_type;

        const modulated = audioCtx.createGain();
        const depth = audioCtx.createGain();

        // depth.gain.value = 0.5; //0.5;
        depth.gain.setTargetAtTime(0.5, note.startTime + offset, 0.01); // attack
        depth.gain.setTargetAtTime(0, note.endTime + offset - 0.05, 0.01)

        // modulated.gain.value = 0; //(0.8 - depth.gain.value);
        modulated.gain.setTargetAtTime(0.8 - depth.gain.value, note.startTime + offset, 0.01); // attack
        modulated.gain.setTargetAtTime(0, note.endTime + offset - 0.05, 0.01)


        modulatorFreq.connect(depth).connect(modulated.gain); //.connect is additive, so with [-0.5,0.5] and 0.5, the modulated signal now has output gain at [0,1]
        carrier.connect(modulated)
        modulated.connect(audioCtx.destination);

        carrier.start();
        modulatorFreq.start();

    }

    else if (document.getElementById('fm').checked) { // fm
        audioCtx = new (window.AudioContext || window.webkitAudioContext)

        var carrier = audioCtx.createOscillator();
        modulatorFreq = audioCtx.createOscillator();

        carrier.type = wave_type;
        modulatorFreq.type = wave_type;

        modulationIndex = audioCtx.createGain();
        modulationIndex.gain.value = 100;

        modulatorFreq.frequency.value = 100; // modulator freq = can be hard-coded

        carrier.frequency.value = midiToFreq(note.pitch); // carrier = key you press

        // Controlling gain of carrier node
        const newNode = audioCtx.createGain(); // create new gain node
        newNode.gain.setValueAtTime(0, audioCtx.currentTime);
        // using notes_playing to control the gain
        newNode.gain.setTargetAtTime(0.8, note.startTime + offset, 0.01); // attack
        newNode.gain.setTargetAtTime(0, note.endTime + offset - 0.05, 0.01)

        // newNode.gain.setTargetAtTime(0.8, audioCtx.currentTime, 0.01); // attack
        // newNode.gain.setTargetAtTime(0.5, audioCtx.currentTime + 0.01, 0.01); // decay + sustain

        modulatorFreq.connect(modulationIndex);
        modulationIndex.connect(carrier.frequency);

        carrier.connect(newNode).connect(audioCtx.destination);

        carrier.start();
        modulatorFreq.start();
    }

}

function genNotes() {
    //load a pre-trained RNN model
    music_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn');
    music_rnn.initialize();

    //the RNN model expects quantized sequences
    const qns = mm.sequences.quantizeNoteSequence(TWINKLE_TWINKLE, 4);

    //and has some parameters we can tune
    rnn_steps = 40; //including the input sequence length, how many more quantized steps (this is diff than how many notes) to generate 
    rnn_temperature = 1.1; //the higher the temperature, the more random (and less like the input) your sequence will be

    // we continue the sequence, which will take some time (thus is run async)
    // "then" when the async continueSequence is done, we play the notes
    music_rnn
        .continueSequence(qns, rnn_steps, rnn_temperature)
        .then((sample) => playNotes(mm.sequences.concatenate([qns, sample])));


}
// button starts here 
const playButton = document.querySelector('button');
playButton.addEventListener('click', function () {
    if (document.getElementById('nosynth').checked) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)
        osc = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();
        osc.connect(gainNode).connect(audioCtx.destination);
        osc.start()
        gainNode.gain.value = 0;

        genNotes();
    }

    else if (document.getElementById('additive').checked) { // ADDITIVE SYNTHESIS
        genNotes();
    }

    else if (document.getElementById('am').checked) { // ADDITIVE SYNTHESIS
        genNotes();
    }

    else if (document.getElementById('fm').checked) { // ADDITIVE SYNTHESIS
        genNotes();
    }


}, false);

function playMarkov(note) {
    gainNode.gain.setTargetAtTime(1, note.startTime, 0.01)
    osc.frequency.setTargetAtTime(midiToFreq(note.pitch), note.startTime, 0.001)
    gainNode.gain.setTargetAtTime(0, note.endTime, 0.01)
}

//calculate bigrams and predict next state 
function genMarkov() {
    var noteList = [
        { pitch: 60, startTime: 0.0, endTime: 0.5 },
        { pitch: 60, startTime: 0.5, endTime: 1.0 },
        { pitch: 67, startTime: 1.0, endTime: 1.5 },
        { pitch: 67, startTime: 1.5, endTime: 2.0 },
        { pitch: 69, startTime: 2.0, endTime: 2.5 },
        { pitch: 69, startTime: 2.5, endTime: 3.0 },
        { pitch: 67, startTime: 3.0, endTime: 4.0 },
        { pitch: 65, startTime: 4.0, endTime: 4.5 },
        { pitch: 65, startTime: 4.5, endTime: 5.0 },
        { pitch: 64, startTime: 5.0, endTime: 5.5 },
        { pitch: 64, startTime: 5.5, endTime: 6.0 },
        { pitch: 62, startTime: 6.0, endTime: 6.5 },
        { pitch: 62, startTime: 6.5, endTime: 7.0 },
        { pitch: 60, startTime: 7.0, endTime: 8.0 },
]

    const markovChain = {}
    for (let i = 1; i < 15; i++) {
        var newNote = JSON.parse(JSON.stringify(noteList[i - 1]));
        console.log(newNote)

        //generate bigram pairs model 
        let pitch = newNote.pitch;
        if (!markovChain[pitch]) {
            markovChain[pitch] = []
        }
        if (noteList[i + 1]) {
            markovChain[pitch].push(noteList[i + 1].pitch);
        }
    }
    console.log(markovChain)

    //calcuation
    const pitches = Object.keys(markovChain)
    let pitch = pitches[Math.floor(Math.random() * pitches.length)]
    newNote.pitch = pitch 
    let newNoteList = {}
    //console.log(pitches)
    //console.log(pitch) //checking random pitch value assigned 

    for (let i = 0; i < pitches.length; i++) {
        newPitch = markovChain[pitch][Math.floor(Math.random() * markovChain[pitch].length)]
        pitch = newPitch
    }
    console.log(newNoteList)

    newNote.startTime += 0.5;
    newNote.endTime += 0.5;
    const newNoteCopy = newNote;
    noteList.push(newNoteCopy);

    console.log(noteList)

    return noteList;
}


const markov = document.getElementById('markov_button');
markov.addEventListener('click', function () {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)
    osc = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();
    osc.connect(gainNode).connect(audioCtx.destination);
    osc.start()
    gainNode.gain.value = 0;

    noteList = genMarkov();
    noteList.forEach(note => {
        playMarkov(note);
    })
}, false);


//html updates

//  // Change button value on click.. 
// document.getElementById("curtainInput").addEventListener(
//   "click",
//   function(event) {
//     if (event.target.value === "Open Curtain") {
//       event.target.value = "Close Curtain";
//     } else {
//       event.target.value = "Open Curtain";
//     }
//   },
//   false
// );



// var clicks=0;

// function clickHandler() {
//   clicks++;
//   var numClicksSpan = document.getElementById('numClicks');
//   if (clicks == 1)
//     numClicksSpan.innerHTML = "once";
//   else
//     numClicksSpan.innerHTML = clicks + " times";
// }

// var button = document.getElementById("clickMe");
// button.addEventListener("click", clickHandler); // when button is clicked calls clickHandler fctn  



var midi, data;
// start talking to MIDI controller
if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess({
    sysex: false
  }).then(onMIDISuccess, onMIDIFailure);
} else {
  console.warn("No MIDI support in your browser")
}

// on success
function onMIDISuccess(midiData) {
  // this is all our MIDI data
  midi = midiData;
  var allInputs = midi.inputs.values();
  // loop over all available inputs and listen for any MIDI input
  for (var input = allInputs.next(); input && !input.done; input = allInputs.next()) {
    // when a MIDI value is received call the onMIDIMessage function
    input.value.onmidimessage = gotMIDImessage;
  }
}
var dataList = document.querySelector('#midi-data ul')

function gotMIDImessage(messageData) {
  var newItem = document.createElement('li');
newItem.appendChild(document.createTextNode(messageData.data));
dataList.appendChild(newItem);
}

// on failure
function onMIDIFailure() {
  console.warn("Not recognising MIDI controller")
}


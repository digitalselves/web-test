

var valenceTestVal = Math.random()*2-1;
console.log('Valence test value is: ' + valenceTestVal); 
var arousalTestVal = Math.random()*2-1;
console.log('Arousal test value is: ' + arousalTestVal); 


// Rules for generation 
let mode = 7-Math.floor(valenceTestVal*6);
let roughness= 1-arousalTestVal; 
let voicing=valenceTestVal;
let loudness = Math.floor(arousalTestVal*10)/10*40+60;


// console.log(loudness);


// create roughness // 
function randomArray(size) {
	var arrayOut = [];
	var i;
	for (i =0; i < size ; i++){
		arrayOut[i] = Math.floor(Math.Random()* 10);
	}

	return arrayOut;
}

console.log(randomArray(8));


// let activate1 = randomArray(8)

// for (var i =0; i <8; i+=1){
// 	if (activate1[i] < roughness){
// 		activate1[i] = 0;
// 	}
// 	else {
// 		activate1[i] = 1;
// 	}
// }


// let activate2 = randomArray(8)

// for (var i =0; i <8; i+=1){
// 	if (activate2[i] < roughness){
// 		activate2[i] = 0;
// 	}
// 	else {
// 		activate2[i] = 1;
// 	}
// }


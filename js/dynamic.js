


let player; //Youtube Video Player
let videoLength = 0;
let numberOfFields = 0;
let resolution = 1;
let videoID;

//array to collect ad-hoc evaluation data
let realtimeData;

//Variables to track the progress of the study
let pages;
let currentPage = 0;

//Display Sliders
let sliders = document.getElementsByClassName("slider");
let sliderFlag = new Array(sliders.length);
let sliderOutputs = document.getElementsByName("slideroutput");

// Initialize Firebase
var config = {
            apiKey: "AIzaSyB0hCRQiEMe6IHuIjDdh0vufIMDaG9xyag",
            authDomain: "chatbotdatabase-da33b.firebaseapp.com",
            databaseURL: "https://chatbotdatabase-da33b.firebaseio.com",
            projectId: "chatbotdatabase-da33b",
            storageBucket: "chatbotdatabase-da33b.appspot.com",
            messagingSenderId: "510893789563"
        };
firebase.initializeApp(config);


var Application = {
  moods: [
    ['power',0.69,0.71,0.79,1],
    ['bright',0.81,0.55,0.67,2],
    ['brutal',0.23,0.7,0.45,3],
    ['confused',0.28,0.63,0.41,4],
    ['rock',0.57,0.44,0.52,5],
    ['serious',0.51,0.38,0.52,6],
    ['relaxed',0.75,0.17,0.57,7],
    ['calm',0.72,0.33,0.67,8],
    ['dark',0.46,0.41,0.48,9],
    ['dirty',0.26,0.49,0.46,10],
    ['energy',0.78,0.74,0.74,11],
    ['fun',0.92,0.78,0.73,12],
    ['aggressive',0.51,0.6,0.57,13],
    ['scary',0.28,0.71,0.33,14],
    ['positive',0.88,0.57,0.65,15],
    ['sad',0.08,0.39,0.31,16]
  ],
 
  init: function() {
    this.is_touch_device = 'ontouchstart' in document.documentElement;
    this.canvas = document.getElementById('canvas');
    this.label = document.getElementById('label');
    this.draw();
    this.lastClick = new Date();

    if (this.is_touch_device) {
      this.canvas.addEventListener('touchstart', function(event) {
        Application.onMouseUp(event.targetTouches[0]);
      });
    }
    else {
      this.canvas.addEventListener('click', function(event) {
        Application.onMouseUp(event);
      });
    }
  },

  tl: { r: 200, g: 0, b: 0 },
  tr: { r: 200, g: 150, b: 0 },
  bl: { r: 0, g: 50, b: 100 },
  br: { r: 200, g: 230, b: 80 },
  
  interpolateColor: function(a, b, x) {
    return {
      r: Math.floor(a.r + (b.r - a.r) * x),
      g: Math.floor(a.g + (b.g - a.g) * x),
      b: Math.floor(a.b + (b.b - a.b) * x)
    };
  },

  draw: function() {
    var step = 20;
    var ctx = this.canvas.getContext("2d");  
    ctx.clearRect(0, 0, 320, 320);

    var list = [];

    for (var y = 0; y < 320; y += step) {
      var left = this.interpolateColor(this.tl, this.bl, y / 320);
      var right = this.interpolateColor(this.tr, this.br, y / 320);
      for (var x = 0; x < 320; x += step) {
        var color = this.interpolateColor(left, right, x / 320);
        ctx.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
        ctx.fillRect(x, y, step, step);
      }
    }

    ctx.beginPath();
    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.moveTo(0, 160);
    ctx.lineTo(320, 160);
    ctx.stroke();
    
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.beginPath();
    ctx.moveTo(320, 160);
    ctx.lineTo(310, 150);
    ctx.lineTo(310, 170);
    ctx.fill();

    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.moveTo(160, 320);
    ctx.lineTo(160, 0);
    ctx.stroke();
    
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.beginPath();
    ctx.moveTo(160, 0);
    ctx.lineTo(150, 10);
    ctx.lineTo(170, 10);
    ctx.fill();

    ctx.font = "16px Arial";
    ctx.fillText("Positive", 245, 158);  
    ctx.fillText("Negative", 15, 158);  

    
    ctx.save();
    ctx.translate(158, 75);
    ctx.rotate(Math.PI * 1.5);
    ctx.font = "16px Arial";
    ctx.fillText("Excited", 0, 0);  
    ctx.restore();

    ctx.save();
    ctx.translate(158, 305);
    ctx.rotate(Math.PI * 1.5);
    ctx.font = "16px Arial";
    ctx.fillText("Calm", 0, 0);  
    ctx.restore();

 
    if (this.marker) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.beginPath();
      ctx.arc(this.marker.x, this.marker.y, 20, 0, Math.PI*2, true); 
      ctx.fill();
    }
  },
 
  request: function(url, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.send(null);
  },

  onMouseUp: function(event) {
    if ((new Date() - this.lastClick) > 1000) {
      this.setMarker(event);
      this.sendPosition(event);
      this.draw();
      this.lastClick = new Date();
    }
  },

  sendPosition: function(event) {
    var x = event.pageX / 320;
    var y = 1 - event.pageY / 320;

    this.request("/moodconductor/mood?x=" + x + "&y=" + y);
  },

  setMarker: function(event) {
    this.marker = {
      x: event.pageX,
      y: event.pageY
    };

    var x = event.pageX / 320;
    var y = 1 - event.pageY / 320;

    this.label.innerHTML = this.findMood(x, y);
  },

  findMood: function(x, y) {
    var distance = 1;
    var index = null;
    
    for (var i = 0; i < this.moods.length; i++) {
      var mood = this.moods[i];
      var dx = Math.abs(mood[1] - x);
      var dy = Math.abs(mood[2] - y);
      var d = Math.sqrt(dx * dx + dy * dy);

      if (d < distance) {
        distance = d;
        index = i;
      }
    }

    return this.moods[index][0];
  }
};



function setup() {
     //Get page information
     pages = document.getElementsByClassName("page");
     pages[0].style.display = "inline";
     sizeMain();
    Application.init();

}



function sizeMain(){
    let height = window.innerHeight;
    let width = window.innerWidth;
    let mainDIVs = document.getElementsByClassName("main");
    let topBar = document.getElementById("topbar");

    for (let i = 0; i < mainDIVs.length; i++) {
        mainDIVs[i].style.height = height - 160 + "px";
    }

    //Resize the header
    let headerText = document.getElementById("headerText");
    let displayQMLogo = document.getElementById("QMLogo");
    let displayQMLogoSmall = document.getElementById("QMLogoSmall");

    if (width > 1300) {
        headerText.style.fontSize = 40 + "px";
        headerText.style.lineHeight = 80 + "px";
        headerText.style.maxWidth = 1200 + "px";
        displayQMLogo.style.display = "inline";
        displayQMLogoSmall.style.display = "none";
    }
    else if (width >= 800) {
        headerText.style.fontSize = 35 + "px";
        headerText.style.lineHeight = 40 + "px";
        headerText.style.maxWidth = 800 + "px";
        displayQMLogo.style.display = "inline";
        displayQMLogoSmall.style.display = "none";
    }
    else if (width >= 600) {
        headerText.style.fontSize = 30 + "px";
        headerText.style.lineHeight = 40 + "px";
        headerText.style.maxWidth = 600 + "px";
        displayQMLogo.style.display = "none";
        displayQMLogoSmall.style.display = "inline";
    }
    else {
        headerText.style.fontSize = Math.floor(40 * (800 / 1400.)) + "px";
        headerText.style.lineHeight = 40 + "px";
        displayQMLogo.style.display = "none";
        displayQMLogoSmall.style.display = "inline";
    }
}

function loadYT() {
     //Load Youtube API
     var tag = document.createElement('script');
     tag.src = "https://www.youtube.com/iframe_api";
     var firstScriptTag = document.getElementsByTagName('script')[0];
     firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
     

//Load youtube video and create player
function onYouTubeIframeAPIReady() {

    //Randomely select which performance will be shown in this run
    let performance = Math.random();
    
    if (performance < 0.5) {
        videoID = "fYInCkaOZO8"; //Load performance 1
    }
    else {
        videoID = "EFgWfcGaa6U"; //Load performance 2
    }

    //Construct new player 
    player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: videoID,
          playerVars: { 'autoplay': 1, 'controls': 0}, //let videoStage = 0; //
          events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange
          }
        });




}

//What happens when the video player is ready and loaded 
function onPlayerReady(event) {
    videoLength = player.getDuration();
    numberOfFields = Math.floor(videoLength/resolution);
    console.log(videoLength + " " + numberOfFields);

    //Create Fields for Timeline
    for(let i=0; i<numberOfFields; i++) {
        let field = document.createElement("td");
        field.className = "timelineField";
        //var node = document.createTextNode(i);
        //field.appendChild(node);
        let element = document.getElementById("row1");
        element.appendChild(field);
    }

    //Construct array to save adhoc data
    realtimeData = new Array(numberOfFields);
    for (let i = 0; i < realtimeData.length; i++) {
        realtimeData[i] = 0;
    }
    
}

//What happens when the video has ended
function onPlayerStateChange(event) {
    if (event.data == 0) {
        //Hide rating Buttons
        //document.getElementById("likeButton").style.display = "none";
        //document.getElementById("dislikeButton").style.display = "none";
        //document.getElementById("toSurvey").style.display = "inline-block";
        //Automatically go to next page
        nextPage();
        }
}

//Start Video
function startVideo() {
    //Start Video
    loadYT();

    //Display rating buttons
    document.getElementById("likeButton").style.display = "inline-block";
    document.getElementById("dislikeButton").style.display = "inline-block";

    //Hide start button
    document.getElementById("startButton").style.display = "none";
}  

function rate(value) {

    //Get current time of the video and change the color of the correlated timeline field
        let currentTime =  player.getCurrentTime();
        let index = Math.floor(currentTime/resolution);
        if(index > numberOfFields) {
            index = numberOfFields; }

    //Add marker under the video at current playback point
    let color;
    if (value == 1) {
        color = "green";
    }
    else {
        color = "red";
    }
        let currentField = document.getElementsByClassName("timelineField")[index];
        currentField.style.backgroundColor = color;
        currentField.style.borderColor = "black";

       //Add current playback point to evaluation data
       realtimeData[index] = value;
}




//Check if all required elements are checked
function checkRequired(checksum) {
    let allElements = document.getElementsByClassName("main")[currentPage].querySelectorAll("input, select, textarea");   
    let counter = 0;
    for (let i = 0; i < allElements.length; i++) {
        let currentItem = allElements[i];
        if (currentItem.tagName == "TEXTAREA" || currentItem.tagName == "SELECT") {
            if (currentItem.value != 0) {
                counter++;
                console.log(currentItem.value);
            }
        }
        else if (currentItem.type = "radio") {
            if (currentItem.checked == true) {
                counter++;
            }
        }
    }
    let numberOfPages = document.getElementsByClassName("page").length;
    if (counter == checksum) {
        if (currentPage < numberOfPages - 2) {
            nextPage();
        }
        else {
            submit();
        }

    }
    else {
        document.getElementsByClassName("main")[currentPage].querySelectorAll("p.alert")[0].style.display = "block";
    }
}



//Go to the next page of the study
function nextPage() {
    currentPage += 1;
    for (let i = 0; i<pages.length; i++) {
        if(i == currentPage) {
            pages[i].style.display = "inline";
        }
    else {
        pages[i].style.display = "none"
}
    }


}


//Surveys
function sliderValue(n) {
            sliderOutputs[n].innerHTML = "Value: " + sliders[n].value;

            if(!sliderFlag[n]) {
                sliderFlag[n] = true; //Save that the slider has been moved 
            }
        }



//Submit all survey forms at once
let messagesRef = firebase.database().ref('data');

function submit(){

    //Define length of data array, only ticked elements should count but ...elements.length gets the number of all elements
    let numberofelements = document.getElementById("survey").elements.length;
    let data = new Array (numberofelements + realtimeData.length);
    let j = 1; //Active Form Element Counter
    let n = 0; //Slider Counter

    if(videoID == 'fYInCkaOZO8') {
       data[0] = "Interactive"; } 
    else {
       data[0] = "Reactive"; 
    }

    
    for (let i = 0; i<numberofelements; i++) {

        let currentItem = document.getElementById("survey").elements.item(i);
        
        if (currentItem.tagName == "TEXTAREA" || currentItem.tagName == "SELECT") {
        
            if (!currentItem.value) {
                data[j] = "-";
            }
            else {
                data[j] = currentItem.value;
            }

            j++;
        }
        else if (currentItem.type == "range"){

                if (!sliderFlag[n]) {
                    data[j] = "-";
                }
                else {
                    data[j] = currentItem.value;
                }
                n++;
                j++;    
        }
        else if (currentItem.type == "radio") {
            let k = 0;
            let checkedFlag = false; 
            let nextItem = document.getElementById("survey").elements;

            while(currentItem.name == nextItem.item(i+k).name) {
                  if(nextItem.item(i+k).checked == true) {
                    data[j] = nextItem.item(i+k).value;
                    j++;
                    checkedFlag = true;
                  }
                  k++;
            }
            i = i + k - 1; //Skip all the other radio buttons that were already checked in the while loop above, 
                           //substract 1 because the for loop will add 1 again at the ende of the cycle
            if(!checkedFlag) {
                data[j] = "-";
                j++;
            }
        }
    }
    
    //Submit data to firebase
    let newMessageRef = messagesRef.push();
    newMessageRef.set({
        a_Performance: data[0],
        b_Consent: data[1],
        c_Gender: data[2],
        d_Age: data[3],
        e_Occupation: data[4],
        f_Dance: data[5],
        g_Media: data[6],
        h_Enjoy: data[7],
        i_Focus: data[8],
        j_Connection: data[9],
        k_VisualSync: data[10],
        l_MusicSync: data[11],
        m_positveFeedback: data[12],
        n_negativeFeedback: data[13],
        o_generalComments: data[14],
        p_realtimeData: realtimeData

    });

    //Go to next page
    nextPage();

}


//Custom select menu
var x, i, j, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  /* For each element, create a new DIV that will act as the selected item: */
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < selElmnt.length; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /* When an item is clicked, update the original select box,
        and the selected item: */
        var y, i, k, s, h;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        h = this.parentNode.previousSibling;
        for (i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < y.length; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);



//Function to check all items consented to.. 
console.log($("input[name='consent']"));

$("button[id='consentNavigation']").click(function() {
    var consentInput = $("input[name='consent']").val();
    console.log(consentInput.val());

    var isOkay = true;

    if (consentInput == false ){
        isOkay = false;
    }
    else 
        isOkay = true;

    if (isOkay == false) 
        $('#errorMessage').show();
    
    else
        $ ('#errorMessage').hide();

   return false;
}); 

// global constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = [];
var clueHoldTime = 1200; //how long to hold each clue's light/sound
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;
var mistakes = 0;

function generatePattern(){
  for(let i = 0; i<8; i++) {
    pattern.push((Math.floor(Math.random() * Math.floor(6))) + 1);
  }
}

function startGame(){
  //initialize game variables
  progress = 0;
  mistakes = 0;
  clueHoldTime = 1200;
  gamePlaying = true;
  generatePattern();
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame(){
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  generatePattern();
}
// Sound Synthesis Functions
const freqMap = {
  1: 253.4,
  2: 331.6,
  3: 391.9,
  4: 457.3,
  5: 555.4,
  6: 602.8
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter= 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
    clueHoldTime -= 25;
  }
}

function loseGame(){
  stopGame();
  generatePattern();
  alert("Game Over. You Guessed Wrong!");
}

function winGame(){
  stopGame();
  generatePattern();
  alert("Congrats, you won!");
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
   if(pattern[guessCounter] == btn){ //correct guess
    if(guessCounter == progress){
      if(progress == pattern.length - 1){ //user wins
        winGame();
      }
     else{ //continue to rest of sequence
        progress++;
        playClueSequence();
      }
    }
     else{
      guessCounter++; //increase counter, continue
    }
  }
  else{
    if(mistakes == 2){
      loseGame();
    }
    else{
      mistakes++;
      playClueSequence();
    }
  }
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

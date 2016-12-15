
var myScore = 0;
var botScore = 0; 

// var myScore = document.getElementById('myScore');
// var botScore = document.getElementById('botScore');

var myRock = document.getElementById('rock');
var myPaper = document.getElementById('paper');
var myScissors = document.getElementById('scissors');

var result = document.getElementById('result');

var displayMyChoice = document.getElementById('myChoice');
var displayBotChoice = document.getElementById('botChoice');


var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


var checkWinner = function () {
  console.log(myScore);
  console.log(botScore);
  if (myChoice===1 && botChoice===1) {
    result.innerHTML = "It's a Draw";
    displayMyChoice.innerHTML = "rock";
    displayBotChoice.innerHTML = "rock";
  } else if (myChoice===1 && botChoice===2) {
    result.innerHTML = "You Lose :(";
    displayMyChoice.innerHTML = "rock";
    displayBotChoice.innerHTML = "paper";
    botScore++;
    document.getElementById('botScore').innerHTML= botScore;
  } else if (myChoice===1 && botChoice===3) {
    result.innerHTML = "You Won :)";
    displayMyChoice.innerHTML = "rock";
    displayBotChoice.innerHTML = "scissors";
    myScore++;
    document.getElementById('myScore').innerHTML = myScore;
  } else if (myChoice===2 && botChoice===2) {
    result.innerHTML = "It's a Draw";
    displayMyChoice.innerHTML = "paper";
    displayBotChoice.innerHTML = "paper";
  } else if (myChoice===2 && botChoice===1) {
    result.innerHTML = "You Won :)";
    displayMyChoice.innerHTML = "paper";
    displayBotChoice.innerHTML = "rock";
    myScore++;
    document.getElementById('myScore').innerHTML = myScore;
  } else if (myChoice===2 && botChoice===3) {
    result.innerHTML = "You Lose :(";
    displayMyChoice.innerHTML = "paper";
    displayBotChoice.innerHTML = "scissors";
    botScore++;
    document.getElementById('botScore').innerHTML = botScore;
  } else if (myChoice===3 && botChoice===3) {
    result.innerHTML = "It's a Draw";
    displayMyChoice.innerHTML = "scissors";
    displayBotChoice.innerHTML = "scissors";
  } else if (myChoice===3 && botChoice===1) {
    result.innerHTML = "You Lose :(";
    displayMyChoice.innerHTML = "scissors";
    displayBotChoice.innerHTML = "rock";
    botScore++;
    document.getElementById('botScore').innerHTML = botScore;
  } else {
    result.innerHTML = "You Won :)";
    displayMyChoice.innerHTML = "scissors";
    displayBotChoice.innerHTML = "paper";
    myScore++;
    document.getElementById('myScore').innerHTML = myScore;
  }
};


var runBotChoice = function() {
  botChoice = getRandomInt(1, 3);
  checkWinner();
};

// User Input

myRock.addEventListener ('click' , function (e) {
  myChoice = 1;
  runBotChoice();
});

myPaper.addEventListener ('click' , function (e) {
  myChoice = 2;
  runBotChoice ();
});

myScissors.addEventListener ('click' , function (e) {
  myChoice = 3;
  runBotChoice ();
});

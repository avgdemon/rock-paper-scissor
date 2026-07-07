var myScore = 0;
var botScore = 0;

var myScoreEl = document.getElementById('myScore');
var botScoreEl = document.getElementById('botScore');
var resultEl = document.getElementById('result');
var displayMyChoice = document.getElementById('myChoice');
var displayBotChoice = document.getElementById('botChoice');

var HANDS = {
  1: { name: 'rock', emoji: '✊' },
  2: { name: 'paper', emoji: '✋' },
  3: { name: 'scissors', emoji: '✌️' }
};

// beats[x] is the hand that x defeats
var beats = { 1: 3, 2: 1, 3: 2 };

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var replayAnimation = function (el, className) {
  el.classList.remove(className);
  void el.offsetWidth; // restart the CSS animation
  el.classList.add(className);
};

var showResult = function (text, outcome) {
  resultEl.textContent = text;
  resultEl.classList.remove('win', 'lose', 'draw');
  resultEl.classList.add(outcome);
  replayAnimation(resultEl, 'pop');
};

var playRound = function (myChoice) {
  var botChoice = getRandomInt(1, 3);

  displayMyChoice.textContent = HANDS[myChoice].emoji + ' ' + HANDS[myChoice].name;
  displayBotChoice.textContent = HANDS[botChoice].emoji + ' ' + HANDS[botChoice].name;

  if (myChoice === botChoice) {
    showResult("It's a draw", 'draw');
  } else if (beats[myChoice] === botChoice) {
    showResult('You won! 🎉', 'win');
    myScore++;
    myScoreEl.textContent = myScore;
    replayAnimation(myScoreEl, 'bump');
  } else {
    showResult('You lose 🤖', 'lose');
    botScore++;
    botScoreEl.textContent = botScore;
    replayAnimation(botScoreEl, 'bump');
  }
};

document.getElementById('rock').addEventListener('click', function () { playRound(1); });
document.getElementById('paper').addEventListener('click', function () { playRound(2); });
document.getElementById('scissors').addEventListener('click', function () { playRound(3); });

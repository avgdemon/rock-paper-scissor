var els = {
  myScore: document.getElementById('myScore'),
  botScore: document.getElementById('botScore'),
  myHand: document.getElementById('myHand'),
  botHand: document.getElementById('botHand'),
  result: document.getElementById('result'),
  streak: document.getElementById('streak'),
  history: document.getElementById('history')
};

var buttons = {
  1: document.getElementById('rock'),
  2: document.getElementById('paper'),
  3: document.getElementById('scissors')
};

var HANDS = {
  1: { name: 'rock', emoji: '✊' },
  2: { name: 'paper', emoji: '✋' },
  3: { name: 'scissors', emoji: '✌️' }
};

// beats[x] is the hand that x defeats
var beats = { 1: 3, 2: 1, 3: 2 };

var state = { you: 0, bot: 0, streak: 0, locked: false };

var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var SHAKE_MS = reducedMotion ? 0 : 360;

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var replayAnimation = function (el, className) {
  el.classList.remove(className);
  void el.offsetWidth; // restart the CSS animation
  el.classList.add(className);
};

var setButtonsDisabled = function (disabled) {
  for (var key in buttons) buttons[key].disabled = disabled;
};

var addHistoryDot = function (outcome) {
  var dot = document.createElement('span');
  dot.className = 'round-dot ' + outcome;
  els.history.appendChild(dot);
  while (els.history.children.length > 12) {
    els.history.removeChild(els.history.firstChild);
  }
};

var showResult = function (text, outcome) {
  els.result.textContent = text;
  els.result.classList.remove('win', 'lose', 'draw');
  els.result.classList.add(outcome);
  replayAnimation(els.result, 'pop');
};

var updateStreak = function (outcome) {
  state.streak = outcome === 'win' ? state.streak + 1 : 0;
  els.streak.innerHTML = state.streak >= 2 ? '🔥 ' + state.streak + ' win streak' : '&nbsp;';
};

var reveal = function (myChoice, botChoice) {
  els.myHand.textContent = HANDS[myChoice].emoji;
  els.botHand.textContent = HANDS[botChoice].emoji;
  replayAnimation(els.myHand, 'reveal');
  replayAnimation(els.botHand, 'reveal');

  var outcome;
  if (myChoice === botChoice) {
    outcome = 'draw';
    showResult("It's a draw", outcome);
  } else if (beats[myChoice] === botChoice) {
    outcome = 'win';
    showResult('You won! 🎉', outcome);
    state.you++;
    els.myScore.textContent = state.you;
    replayAnimation(els.myScore, 'bump');
  } else {
    outcome = 'lose';
    showResult('Bot wins 🤖', outcome);
    state.bot++;
    els.botScore.textContent = state.bot;
    replayAnimation(els.botScore, 'bump');
  }

  updateStreak(outcome);
  addHistoryDot(outcome);
  state.locked = false;
  setButtonsDisabled(false);
};

var playRound = function (myChoice) {
  if (state.locked) return;
  state.locked = true;
  setButtonsDisabled(true);

  var botChoice = getRandomInt(1, 3);

  if (SHAKE_MS === 0) {
    reveal(myChoice, botChoice);
    return;
  }

  // wind-up: both hands pump as fists while the badge counts down
  els.myHand.textContent = '✊';
  els.botHand.textContent = '✊';
  els.result.classList.remove('win', 'lose', 'draw');
  els.myHand.classList.remove('reveal');
  els.botHand.classList.remove('reveal');
  replayAnimation(els.myHand, 'shaking');
  replayAnimation(els.botHand, 'shaking');

  var chant = ['Rock…', 'Paper…', 'Scissors!'];
  chant.forEach(function (word, i) {
    setTimeout(function () { els.result.textContent = word; }, SHAKE_MS * i);
  });

  setTimeout(function () {
    els.myHand.classList.remove('shaking');
    els.botHand.classList.remove('shaking');
    reveal(myChoice, botChoice);
  }, SHAKE_MS * 3);
};

// input: clicks
for (var key in buttons) {
  (function (choice) {
    buttons[choice].addEventListener('click', function () { playRound(choice); });
  })(Number(key));
}

// input: keyboard 1/2/3
document.addEventListener('keydown', function (e) {
  var map = { '1': 1, '2': 2, '3': 3 };
  if (map[e.key]) playRound(map[e.key]);
});

// cursor-tracking glow on dock buttons (drives --mx/--my in style.css)
for (var key in buttons) {
  buttons[key].addEventListener('pointermove', function (e) {
    var rect = this.getBoundingClientRect();
    this.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
    this.style.setProperty('--my', (e.clientY - rect.top) + 'px');
  });
}

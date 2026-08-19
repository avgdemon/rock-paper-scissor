var els = {
  myScore: document.getElementById('myScore'),
  botScore: document.getElementById('botScore'),
  myHand: document.getElementById('myHand'),
  botHand: document.getElementById('botHand'),
  result: document.getElementById('result'),
  streak: document.getElementById('streak'),
  winRate: document.getElementById('winRate'),
  roundCount: document.getElementById('roundCount'),
  history: document.getElementById('history'),
  chartEmpty: document.getElementById('chartEmpty')
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

var MAX_COLS = 24;
var MAX_RUN_DOTS = 5;

var state = {
  wins: 0,
  losses: 0,
  draws: 0,
  streak: 0,
  outcomes: [], // 'win' | 'lose' | 'draw', oldest first
  locked: false
};

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

// column height = length of the current run of identical outcomes (capped),
// so streaks literally grow on the chart
var runLengthAt = function (index) {
  var run = 1;
  while (index - run >= 0 && state.outcomes[index - run] === state.outcomes[index]) run++;
  return Math.min(run, MAX_RUN_DOTS);
};

var renderChart = function () {
  els.chartEmpty.style.display = 'none';

  var start = Math.max(0, state.outcomes.length - MAX_COLS);
  var frag = document.createDocumentFragment();
  for (var i = start; i < state.outcomes.length; i++) {
    var outcome = state.outcomes[i];
    var col = document.createElement('div');
    col.className = 'col';
    col.title = 'Round ' + (i + 1) + ' — ' + outcome;
    var dots = runLengthAt(i);
    for (var d = 0; d < dots; d++) {
      var cell = document.createElement('span');
      cell.className = 'cell ' + outcome;
      col.appendChild(cell);
    }
    frag.appendChild(col);
  }

  while (els.history.lastChild && els.history.lastChild !== els.chartEmpty) {
    els.history.removeChild(els.history.lastChild);
  }
  els.history.appendChild(frag);
};

var showResult = function (text, outcome) {
  els.result.textContent = text;
  els.result.classList.remove('win', 'lose', 'draw');
  els.result.classList.add(outcome);
  replayAnimation(els.result, 'pop');
};

var updateStats = function (outcome) {
  state.outcomes.push(outcome);
  state.streak = outcome === 'win' ? state.streak + 1 : 0;

  var rounds = state.outcomes.length;
  els.streak.textContent = state.streak;
  els.roundCount.textContent = rounds;
  els.winRate.textContent = Math.round((state.wins / rounds) * 100) + '%';

  renderChart();
};

var reveal = function (myChoice, botChoice) {
  els.myHand.textContent = HANDS[myChoice].emoji;
  els.botHand.textContent = HANDS[botChoice].emoji;
  replayAnimation(els.myHand, 'reveal');
  replayAnimation(els.botHand, 'reveal');

  var outcome;
  if (myChoice === botChoice) {
    outcome = 'draw';
    state.draws++;
    showResult("It's a draw", outcome);
  } else if (beats[myChoice] === botChoice) {
    outcome = 'win';
    state.wins++;
    showResult('You won this round', outcome);
    els.myScore.textContent = state.wins;
    replayAnimation(els.myScore, 'bump');
  } else {
    outcome = 'lose';
    state.losses++;
    showResult('The bot takes it', outcome);
    els.botScore.textContent = state.losses;
    replayAnimation(els.botScore, 'bump');
  }

  updateStats(outcome);
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

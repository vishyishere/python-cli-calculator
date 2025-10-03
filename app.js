/* Simple calculator logic */
const display = document.getElementById('display');
let current = '0';
let previous = null;
let operator = null;
let waitingForNew = false;

function updateDisplay() {
  display.textContent = String(current);
}

function inputDigit(d) {
  if (waitingForNew) {
    current = d === '.' ? '0.' : d;
    waitingForNew = false;
    return;
  }
  if (d === '.' && current.includes('.')) return;
  current = current === '0' && d !== '.' ? d : current + d;
}

function clearAll() {
  current = '0'; previous = null; operator = null; waitingForNew = false;
}

function toggleNeg() {
  if (current === '0') return;
  current = current.startsWith('-') ? current.slice(1) : '-' + current;
}

function applyPercent() {
  current = String(Number(current) / 100);
}

function doOperation(op) {
  const currNum = Number(current);
  if (previous === null) {
    previous = currNum;
  } else if (operator) {
    previous = compute(previous, currNum, operator);
    current = String(previous);
  }
  operator = op;
  waitingForNew = true;
}

function compute(a,b,op) {
  if (op === 'add') return a + b;
  if (op === 'subtract') return a - b;
  if (op === 'multiply') return a * b;
  if (op === 'divide') return b === 0 ? NaN : a / b;
  return b;
}

function equals() {
  if (operator === null || waitingForNew) return;
  const res = compute(previous, Number(current), operator);
  current = String(res);
  previous = null;
  operator = null;
  waitingForNew = true;
}

document.querySelector('.keys').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const val = btn.dataset.value;
  const action = btn.dataset.action;
  if (val !== undefined) {
    inputDigit(val);
  } else if (action) {
    if (action === 'clear') clearAll();
    else if (action === 'neg') toggleNeg();
    else if (action === 'percent') applyPercent();
    else if (action === 'equals') equals();
    else {
      // operator actions: add, subtract, multiply, divide
      doOperation(action);
    }
  }
  updateDisplay();
});

/* keyboard support */
window.addEventListener('keydown', (e) => {
  const key = e.key;
  if ((/^[0-9.]$/).test(key)) {
    inputDigit(key);
  } else if (key === 'Backspace') {
    current = current.length > 1 ? current.slice(0,-1) : '0';
  } else if (key === 'Enter' || key === '=') {
    equals();
  } else if (key === '+') doOperation('add');
  else if (key === '-') doOperation('subtract');
  else if (key === '*') doOperation('multiply');
  else if (key === '/') doOperation('divide');
  else if (key.toLowerCase() === 'c') clearAll();
  updateDisplay();
});

/* init */
updateDisplay();

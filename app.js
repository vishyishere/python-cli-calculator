/* Simple calculator logic (no eval for safety)
   Buttons use data attributes:
   - data-num for numbers and dot
   - data-op for operators: + - * /
   - data-fn for functions: clear, toggle-sign, percent, equals
*/

(() => {
  const displayEl = document.getElementById('display');
  const buttons = document.getElementById('buttons');

  let current = '0';       // current displayed number (string)
  let previous = null;     // previous number (string)
  let operator = null;     // '+', '-', '*', '/'
  let justEvaluated = false;

  function render() {
    displayEl.textContent = current;
  }

  function clearAll() {
    current = '0';
    previous = null;
    operator = null;
    justEvaluated = false;
    render();
  }

  function appendNumber(n) {
    if (justEvaluated) { current = '0'; justEvaluated = false; }
    if (n === '.' && current.includes('.')) return;
    if (current === '0' && n !== '.') current = n;
    else current = current + n;
    render();
  }

  function toggleSign() {
    if (current === '0') return;
    current = (current.startsWith('-') ? current.slice(1) : '-' + current);
    render();
  }

  function percent() {
    const v = parseFloat(current || '0');
    current = String(v / 100);
    render();
  }

  function chooseOp(op) {
    if (operator && !justEvaluated) {
      // chain calculation
      compute();
    }
    previous = current;
    current = '0';
    operator = op;
    justEvaluated = false;
  }

  function compute() {
    if (!operator || previous === null) return;
    const a = parseFloat(previous);
    const b = parseFloat(current);
    let res = 0;
    if (isNaN(a) || isNaN(b)) return;
    switch(operator) {
      case '+': res = a + b; break;
      case '-': res = a - b; break;
      case '*': res = a * b; break;
      case '/': res = b === 0 ? 'Error' : a / b; break;
    }
    current = (res === 'Error') ? 'Error' : String(roundIfNeeded(res));
    previous = null;
    operator = null;
    justEvaluated = true;
    render();
  }

  function roundIfNeeded(num) {
    // keep up to 10 decimal places if needed
    if (Number.isInteger(num)) return num;
    return Math.round(num * 1e10) / 1e10;
  }

  // event delegation for buttons
  buttons.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    // functions
    if (btn.dataset.fn) {
      const fn = btn.dataset.fn;
      if (fn === 'clear') clearAll();
      else if (fn === 'toggle-sign') toggleSign();
      else if (fn === 'percent') percent();
      else if (fn === 'equals') compute();
      return;
    }
    // number
    if (btn.dataset.num !== undefined) {
      appendNumber(btn.dataset.num);
      return;
    }
    // operator
    if (btn.dataset.op) {
      chooseOp(btn.dataset.op);
      return;
    }
  });

  // keyboard support
  window.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
      appendNumber(e.key);
      return;
    }
    if (e.key === 'Enter' || e.key === '=') { compute(); return; }
    if (e.key === 'Backspace') {
      // backspace removes last digit
      if (justEvaluated) { clearAll(); return; }
      current = current.length > 1 ? current.slice(0, -1) : '0';
      render();
      return;
    }
    if (['+', '-', '*', '/'].includes(e.key)) {
      chooseOp(e.key);
      return;
    }
    if (e.key === 'c' || e.key === 'C') { clearAll(); return; }
  });

  // initialize
  clearAll();
})();

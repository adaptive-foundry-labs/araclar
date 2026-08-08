// Hesap Makinesi - Fonksiyonel Logik

let display = '0';
let previousValue = null;
let operation = null;
let shouldResetDisplay = false;

const outputElement = document.getElementById('output');

function updateDisplay() {
  outputElement.textContent = display;
}

function handleNumber(num) {
  if (shouldResetDisplay) {
    display = String(num);
    shouldResetDisplay = false;
  } else {
    display = display === '0' ? String(num) : display + num;
  }
  updateDisplay();
}

function handleDot() {
  if (shouldResetDisplay) {
    display = '0.';
    shouldResetDisplay = false;
  } else if (!display.includes('.')) {
    display += '.';
  }
  updateDisplay();
}

function handleOperation(op) {
  const currentValue = parseFloat(display);
  
  if (previousValue === null) {
    previousValue = currentValue;
  } else if (operation) {
    previousValue = calculate(previousValue, currentValue, operation);
    display = String(previousValue);
  }
  
  operation = op;
  shouldResetDisplay = true;
  updateDisplay();
}

function calculate(prev, current, op) {
  switch (op) {
    case '+':
      return prev + current;
    case '−':
      return prev - current;
    case '×':
      return prev * current;
    case '÷':
      return current !== 0 ? prev / current : 0;
    default:
      return current;
  }
}

function handleEquals() {
  if (operation && previousValue !== null) {
    const currentValue = parseFloat(display);
    const result = calculate(previousValue, currentValue, operation);
    display = String(result);
    previousValue = null;
    operation = null;
    shouldResetDisplay = true;
    updateDisplay();
  }
}

function handleAC() {
  display = '0';
  previousValue = null;
  operation = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function handleSign() {
  const value = parseFloat(display);
  display = String(value * -1);
  updateDisplay();
}

function handlePercent() {
  const value = parseFloat(display);
  display = String(value / 100);
  updateDisplay();
}

// Event Listeners
document.getElementById('btn-ac').addEventListener('click', handleAC);
document.getElementById('btn-sign').addEventListener('click', handleSign);
document.getElementById('btn-percent').addEventListener('click', handlePercent);

document.getElementById('btn-divide').addEventListener('click', () => handleOperation('÷'));
document.getElementById('btn-multiply').addEventListener('click', () => handleOperation('×'));
document.getElementById('btn-minus').addEventListener('click', () => handleOperation('−'));
document.getElementById('btn-plus').addEventListener('click', () => handleOperation('+'));

document.getElementById('btn-equals').addEventListener('click', handleEquals);

document.getElementById('btn-0').addEventListener('click', () => handleNumber(0));
document.getElementById('btn-1').addEventListener('click', () => handleNumber(1));
document.getElementById('btn-2').addEventListener('click', () => handleNumber(2));
document.getElementById('btn-3').addEventListener('click', () => handleNumber(3));
document.getElementById('btn-4').addEventListener('click', () => handleNumber(4));
document.getElementById('btn-5').addEventListener('click', () => handleNumber(5));
document.getElementById('btn-6').addEventListener('click', () => handleNumber(6));
document.getElementById('btn-7').addEventListener('click', () => handleNumber(7));
document.getElementById('btn-8').addEventListener('click', () => handleNumber(8));
document.getElementById('btn-9').addEventListener('click', () => handleNumber(9));

document.getElementById('btn-dot').addEventListener('click', handleDot);

// Initialize
updateDisplay();
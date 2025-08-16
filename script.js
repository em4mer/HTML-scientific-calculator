let display = document.getElementById('display');
let history = [];
let memory = 0;
let soundEnabled = true;
let currentTheme = 'dark';
let undoStack = [];
let redoStack = [];
let decimalPrecision = 2;

function playSound() {
    if (!soundEnabled) return;
    const sound = document.getElementById('buttonSound');
    sound.currentTime = 0;
    sound.play();
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundButton = document.getElementById('soundToggle');
    soundButton.textContent = soundEnabled ? '🔊' : '🔇';
    playSound();
}

function animateButton(button) {
    button.classList.add('active');
    setTimeout(() => button.classList.remove('active'), 100);
}

function handleButtonClick(action) {
    const button = event.target;
    animateButton(button);
    playSound();
    action();
}

function changeTheme(theme) {
    const body = document.body;
    const calculator = document.querySelector('.calculator');
    body.className = '';
    calculator.className = 'calculator';
    body.classList.add(theme);
    calculator.classList.add(theme);
    currentTheme = theme;
    const themeButtons = document.querySelectorAll('.theme-button');
    themeButtons.forEach(button => button.classList.remove('active'));
    document.getElementById(`theme-${theme}`).classList.add('active');
}

function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    changeTheme(newTheme);
}

function validateParentheses(expression) {
    let openCount = (expression.match(/\(/g) || []).length;
    let closeCount = (expression.match(/\)/g) || []).length;
    return openCount === closeCount;
}

function saveState() {
    undoStack.push(display.value);
    redoStack = [];
}

function undo() {
    if (undoStack.length > 0) {
        redoStack.push(display.value);
        display.value = undoStack.pop();
    }
}

function redo() {
    if (redoStack.length > 0) {
        undoStack.push(display.value);
        display.value = redoStack.pop();
    }
}

function setDecimalPrecision(precision) {
    decimalPrecision = precision;
    if (display.value.includes('.')) {
        let result = parseFloat(display.value).toFixed(decimalPrecision);
        display.value = result;
    }
}

function appendToDisplay(value) {
    let currentDisplay = display.value;

    if (currentDisplay === 'Error') {
        currentDisplay = '';
        display.value = '';
    }

    if ((value === '*' || value === '/') && currentDisplay.length === 0) {
        return;
    }

    const lastChar = currentDisplay[currentDisplay.length - 1];
    if (isLogicOperator(lastChar) && isLogicOperator(value)) {
        if (value === '-' && lastChar !== '-') {
            display.value += value;
        }
        return;
    }

    if (value === '.') {
        let lastNumber = currentDisplay.split(/[\+\-\*\/]/).pop();
        if (lastNumber.includes('.')) {
            return;
        }
    }

    display.value += value;
}

function clearDisplay() {
    display.value = '';
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    saveState();
    try {
        let expression = display.value;
        if (!validateParentheses(expression)) {
            throw new Error('Unbalanced parentheses');
        }
        let result = math.evaluate(expression);
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid operation');
        }
        result = parseFloat(result.toFixed(decimalPrecision));
        display.value = result;
        addToHistory(expression, result);
    } catch (error) {
        if (error.message === 'Unbalanced parentheses') {
            display.value = 'Error: Unbalanced parentheses';
        } else if (error.message === 'Invalid operation') {
            display.value = 'Error: Invalid operation';
        } else {
            display.value = 'Error';
        }
    }
}

function isLogicOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
}

function calculatePercentage() {
    let currentDisplay = display.value;
    if (currentDisplay === 'Error') {
        return;
    }
    try {
        let result = math.evaluate(currentDisplay) / 100;
        display.value = result;

        addToHistory(`${currentDisplay}%`, result);
    } catch (error) {
        display.value = 'Error';
    }
}

function appendParenthesis(value) {
    let currentDisplay = display.value;

    if (currentDisplay === 'Error') {
        currentDisplay = '';
        display.value = '';
    }

    if (value === '(') {
        display.value += '(';
    } else if (value === ')') {
        let openCount = (currentDisplay.match(/\(/g) || []).length;
        let closeCount = (currentDisplay.match(/\)/g) || []).length;
        if (openCount > closeCount) {
            display.value += ')';
        }
    }
}

function calculateSquareRoot() {
    let currentDisplay = display.value;
    if (currentDisplay === 'Error') {
        return;
    }
    try {
        let result = math.sqrt(math.evaluate(currentDisplay));
        display.value = result;

        addToHistory(`√${currentDisplay}`, result);
    } catch (error) {
        display.value = 'Error';
    }
}

function calculateExponent() {
    let currentDisplay = display.value;
    if (currentDisplay === 'Error') {
        return;
    }
    try {
        let result = math.pow(math.evaluate(currentDisplay), 2);
        display.value = result;

        addToHistory(`(${currentDisplay})^2`, result);
    } catch (error) {
        display.value = 'Error';
    }
}

function calculateSin() {
    let currentDisplay = display.value;
    if (currentDisplay === 'Error') {
        return;
    }
    try {
        let result = math.sin(math.evaluate(currentDisplay));
        display.value = result;

        addToHistory(`sin(${currentDisplay})`, result);
    } catch (error) {
        display.value = 'Error';
    }
}

function calculateCos() {
    let currentDisplay = display.value;
    if (currentDisplay === 'Error') {
        return;
    }
    try {
        let result = math.cos(math.evaluate(currentDisplay));
        display.value = result;

        addToHistory(`cos(${currentDisplay})`, result);
    } catch (error) {
        display.value = 'Error';
    }
}

function calculateTan() {
    let currentDisplay = display.value;
    if (currentDisplay === 'Error') {
        return;
    }
    try {
        let result = math.tan(math.evaluate(currentDisplay));
        display.value = result;

        addToHistory(`tan(${currentDisplay})`, result);
    } catch (error) {
        display.value = 'Error';
    }
}

function calculateLog() {
    let currentDisplay = display.value;
    if (currentDisplay === 'Error') {
        return;
    }
    try {
        let result = math.log10(math.evaluate(currentDisplay));
        display.value = result;

        addToHistory(`log(${currentDisplay})`, result);
    } catch (error) {
        display.value = 'Error';
    }
}

function calculateLn() {
    let currentDisplay = display.value;
    if (currentDisplay === 'Error') {
        return;
    }
    try {
        let result = math.log(math.evaluate(currentDisplay));
        display.value = result;

        addToHistory(`ln(${currentDisplay})`, result);
    } catch (error) {
        display.value = 'Error';
    }
}

function appendPi() {
    display.value += math.pi;
}

function appendE() {
    display.value += math.e;
}

function memoryAdd() {
    memory += parseFloat(display.value) || 0;
}

function memorySubtract() {
    memory -= parseFloat(display.value) || 0;
}

function memoryRecall() {
    display.value = memory;
}

function memoryClear() {
    memory = 0;
}

function addToHistory(expression, result) {
    history.push(`${expression} = ${result}`);
    if (history.length > 5) {
        history.shift();
    }
    showHistory();
}

function showHistory() {
    const historyDisplay = document.getElementById('history');
    historyDisplay.innerHTML = history
        .map((item, index) => `<div>${index + 1}. ${item}</div>`)
        .join('');
}

function clearHistory() {
    history = [];
    showHistory();
}

document.addEventListener('keydown', (event) => {
    const key = event.key;
    switch (key) {
        case '0': handleButtonClick(() => appendToDisplay('0')); break;
        case '1': handleButtonClick(() => appendToDisplay('1')); break;
        case '2': handleButtonClick(() => appendToDisplay('2')); break;
        case '3': handleButtonClick(() => appendToDisplay('3')); break;
        case '4': handleButtonClick(() => appendToDisplay('4')); break;
        case '5': handleButtonClick(() => appendToDisplay('5')); break;
        case '6': handleButtonClick(() => appendToDisplay('6')); break;
        case '7': handleButtonClick(() => appendToDisplay('7')); break;
        case '8': handleButtonClick(() => appendToDisplay('8')); break;
        case '9': handleButtonClick(() => appendToDisplay('9')); break;
        case '.': handleButtonClick(() => appendToDisplay('.')); break;
        case '+': handleButtonClick(() => appendToDisplay('+')); break;
        case '-': handleButtonClick(() => appendToDisplay('-')); break;
        case '*': handleButtonClick(() => appendToDisplay('*')); break;
        case '/': handleButtonClick(() => appendToDisplay('/')); break;
        case '(': handleButtonClick(() => appendToDisplay('(')); break;
        case ')': handleButtonClick(() => appendToDisplay(')')); break;
        case 'Enter': handleButtonClick(() => calculate()); break;
        case '=': handleButtonClick(() => calculate()); break;
        case 'Backspace': handleButtonClick(() => deleteLast()); break;
        case 'Escape': handleButtonClick(() => clearDisplay()); break;

        case '%': handleButtonClick(() => calculatePercentage()); break;
        case 's': handleButtonClick(() => appendToDisplay('sqrt(')); break;
        case 'e': handleButtonClick(() => appendToDisplay('^')); break;
        case 'S': handleButtonClick(() => appendToDisplay('sin(')); break;
        case 'C': handleButtonClick(() => appendToDisplay('cos(')); break;
        case 'T': handleButtonClick(() => appendToDisplay('tan(')); break;
        case 'l': handleButtonClick(() => appendToDisplay('log(')); break;
        case 'L': handleButtonClick(() => appendToDisplay('ln(')); break;
        case 'p': handleButtonClick(() => appendToDisplay('pi')); break;
        case 'E': handleButtonClick(() => appendToDisplay('e')); break;
        case 'a': handleButtonClick(() => appendToDisplay('abs(')); break;
        case 'r': handleButtonClick(() => appendToDisplay('round(')); break;
        case 'f': handleButtonClick(() => appendToDisplay('floor(')); break;
        case 'c': handleButtonClick(() => appendToDisplay('ceil(')); break;
        case '!': handleButtonClick(() => appendToDisplay('!')); break;

        case 'm': handleButtonClick(() => memoryAdd()); break;
        case 'M': handleButtonClick(() => memorySubtract()); break;
        case 'r': handleButtonClick(() => memoryRecall()); break;
        case 'c': handleButtonClick(() => memoryClear()); break;

        case 'h': handleButtonClick(() => clearHistory()); break;
        case '2': handleButtonClick(() => setDecimalPrecision(2)); break;
        case '4': handleButtonClick(() => setDecimalPrecision(4)); break;
        case '6': handleButtonClick(() => setDecimalPrecision(6)); break;

        case 'z': handleButtonClick(() => undo()); break;
        case 'Z': handleButtonClick(() => redo()); break;

        case 't': toggleTheme(); break;
        case 'S': toggleSound(); break;
    }
});
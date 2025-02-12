let display = document.getElementById('display');
let history = []; // Array to store calculation history
let memory = 0; // Variable to store memory value
let soundEnabled = true; // Variable to toggle sound effects
let currentTheme = 'dark'; // Variable to track the current theme
let undoStack = []; // Stack to store previous states for undo
let redoStack = []; // Stack to store undone states for redo
let decimalPrecision = 2; // Default decimal precision

// Function to play button sound
function playSound() {
    if (!soundEnabled) return; // Skip if sound is disabled
    const sound = document.getElementById('buttonSound');
    sound.currentTime = 0; // Reset sound to the start
    sound.play();
}

// Function to toggle sound effects
function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundButton = document.getElementById('soundToggle');
    soundButton.textContent = soundEnabled ? '🔊' : '🔇';
    playSound(); // Play a sound to indicate the toggle
}

// Function to add button animation
function animateButton(button) {
    button.classList.add('active');
    setTimeout(() => button.classList.remove('active'), 100);
}

// Function to handle button clicks
function handleButtonClick(action) {
    const button = event.target;
    animateButton(button);
    playSound();
    action();
}

// Function to change the theme
function changeTheme(theme) {
    const body = document.body;
    const calculator = document.querySelector('.calculator');
    body.className = ''; // Reset all theme classes
    calculator.className = 'calculator'; // Reset all theme classes
    body.classList.add(theme);
    calculator.classList.add(theme);
    currentTheme = theme;
    const themeButtons = document.querySelectorAll('.theme-button');
    themeButtons.forEach(button => button.classList.remove('active'));
    document.getElementById(`theme-${theme}`).classList.add('active');
}

// Function to toggle between dark and light themes
function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    changeTheme(newTheme);
}

// Error Handling for Invalid Parentheses
function validateParentheses(expression) {
    let openCount = (expression.match(/\(/g) || []).length;
    let closeCount = (expression.match(/\)/g) || []).length;
    return openCount === closeCount;
}

// Function to save the current state to the undo stack
function saveState() {
    undoStack.push(display.value);
    redoStack = []; // Clear redo stack when a new action is performed
}

// Function to undo the last action
function undo() {
    if (undoStack.length > 0) {
        redoStack.push(display.value);
        display.value = undoStack.pop();
    }
}

// Function to redo the last undone action
function redo() {
    if (redoStack.length > 0) {
        undoStack.push(display.value);
        display.value = redoStack.pop();
    }
}

// Function to set decimal precision
function setDecimalPrecision(precision) {
    decimalPrecision = precision;
    if (display.value.includes('.')) {
        let result = parseFloat(display.value).toFixed(decimalPrecision);
        display.value = result;
    }
}

function appendToDisplay(value) {
    let currentDisplay = display.value;

    // Clear "Error" state if present
    if (currentDisplay === 'Error') {
        currentDisplay = '';
        display.value = '';
    }

    // Prevent multiplication and division at the start
    if ((value === '*' || value === '/') && currentDisplay.length === 0) {
        return;
    }

    // Prevent consecutive logic operators (except for negative numbers)
    const lastChar = currentDisplay[currentDisplay.length - 1];
    if (isLogicOperator(lastChar) && isLogicOperator(value)) {
        // Allow negative numbers after an operator (e.g., 5 * -3)
        if (value === '-' && lastChar !== '-') {
            display.value += value;
        }
        return;
    }

    // Prevent multiple decimal points in a single number
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
        let result = math.evaluate(expression); // Use math.js for evaluation
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid operation');
        }
        result = parseFloat(result.toFixed(decimalPrecision)); // Apply decimal precision
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

// Helper function to check if a character is a logic operator
function isLogicOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
}

// Percentage Calculation
function calculatePercentage() {
    let currentDisplay = display.value;
    if (currentDisplay === 'Error') {
        return;
    }
    try {
        let result = math.evaluate(currentDisplay) / 100;
        display.value = result;

        // Add the percentage calculation to history
        addToHistory(`${currentDisplay}%`, result);
    } catch (error) {
        display.value = 'Error';
    }
}

// Parentheses Support
function appendParenthesis(value) {
    let currentDisplay = display.value;

    // Clear "Error" state if present
    if (currentDisplay === 'Error') {
        currentDisplay = '';
        display.value = '';
    }

    // Ensure parentheses are balanced
    if (value === '(') {
        display.value += '(';
    } else if (value === ')') {
        // Only add a closing parenthesis if there's a matching opening one
        let openCount = (currentDisplay.match(/\(/g) || []).length;
        let closeCount = (currentDisplay.match(/\)/g) || []).length;
        if (openCount > closeCount) {
            display.value += ')';
        }
    }
}

// Square Root Function
function calculateSquareRoot() {
    let currentDisplay = display.value;
    if (currentDisplay === 'Error') {
        return;
    }
    try {
        let result = math.sqrt(math.evaluate(currentDisplay));
        display.value = result;

        // Add the square root calculation to history
        addToHistory(`√${currentDisplay}`, result);
    } catch (error) {
        display.value = 'Error';
    }
}

// Exponentiation Function
function calculateExponent() {
    let currentDisplay = display.value;
    if (currentDisplay === 'Error') {
        return;
    }
    try {
        let result = math.pow(math.evaluate(currentDisplay), 2);
        display.value = result;

        // Add the exponentiation calculation to history
        addToHistory(`(${currentDisplay})^2`, result);
    } catch (error) {
        display.value = 'Error';
    }
}

// Trigonometric Functions
function calculateSin() {
    let currentDisplay = display.value;
    if (currentDisplay === 'Error') {
        return;
    }
    try {
        let result = math.sin(math.evaluate(currentDisplay));
        display.value = result;

        // Add the sine calculation to history
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

        // Add the cosine calculation to history
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

        // Add the tangent calculation to history
        addToHistory(`tan(${currentDisplay})`, result);
    } catch (error) {
        display.value = 'Error';
    }
}

// Logarithmic Functions
function calculateLog() {
    let currentDisplay = display.value;
    if (currentDisplay === 'Error') {
        return;
    }
    try {
        let result = math.log10(math.evaluate(currentDisplay));
        display.value = result;

        // Add the log calculation to history
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

        // Add the natural log calculation to history
        addToHistory(`ln(${currentDisplay})`, result);
    } catch (error) {
        display.value = 'Error';
    }
}

// Constants
function appendPi() {
    display.value += math.pi; // Append π (pi) to the display
}

function appendE() {
    display.value += math.e; // Append e (Euler's number) to the display
}

// Memory Functions
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

// Add a calculation to history
function addToHistory(expression, result) {
    history.push(`${expression} = ${result}`); // Add the calculation to the history array
    if (history.length > 5) {
        history.shift(); // Keep only the last 5 items
    }
    showHistory(); // Update the history display
}

// Display the history
function showHistory() {
    const historyDisplay = document.getElementById('history');
    historyDisplay.innerHTML = history
        .map((item, index) => `<div>${index + 1}. ${item}</div>`)
        .join(''); // Convert the history array to a string of HTML elements
}

// Clear the history
function clearHistory() {
    history = []; // Clear the history array
    showHistory(); // Update the history display
}

// Keyboard support for all buttons
document.addEventListener('keydown', (event) => {
    const key = event.key;
    switch (key) {
        // Numbers and Operators
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

        // Advanced Functions
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

        // Memory Functions
        case 'm': handleButtonClick(() => memoryAdd()); break;
        case 'M': handleButtonClick(() => memorySubtract()); break;
        case 'r': handleButtonClick(() => memoryRecall()); break;
        case 'c': handleButtonClick(() => memoryClear()); break;

        // History and Precision
        case 'h': handleButtonClick(() => clearHistory()); break;
        case '2': handleButtonClick(() => setDecimalPrecision(2)); break;
        case '4': handleButtonClick(() => setDecimalPrecision(4)); break;
        case '6': handleButtonClick(() => setDecimalPrecision(6)); break;

        // Undo/Redo
        case 'z': handleButtonClick(() => undo()); break;
        case 'Z': handleButtonClick(() => redo()); break;

        // Theme and Sound Toggle
        case 't': toggleTheme(); break;
        case 'S': toggleSound(); break;
    }
});
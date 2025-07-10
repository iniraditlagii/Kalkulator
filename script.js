let display;
let operationDisplay;
let currentInput = '0';
let previousInput = null;
let operator = null;
let shouldResetDisplay = false;
let lastOperation = null;
let lastOperand = null;

// Initialize elements after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    display = document.getElementById('display');
    operationDisplay = document.getElementById('operationDisplay');
    updateDisplay();
});

function updateDisplay() {
    display.textContent = currentInput;
}

function updateOperationDisplay() {
    let operationText = '';
    if (previousInput !== null && operator !== null) {
        const operatorSymbol = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷'
        }[operator];
        operationText = `${previousInput} ${operatorSymbol} ${shouldResetDisplay ? '' : currentInput}`;
    }
    operationDisplay.textContent = operationText;
}

function inputNumber(num) {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    if (currentInput === '0') {
        currentInput = num;
    } else {
        currentInput += num;
    }
    updateDisplay();
    updateOperationDisplay();
}

function inputDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
    }
    updateDisplay();
    updateOperationDisplay();
}

function setOperator(op) {
    // Clear active operator styling
    document.querySelectorAll('.operator').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active styling to current operator
    const operatorMap = {
        '+': 'add',
        '-': 'subtract',
        '*': 'multiply',
        '/': 'divide'
    };
    
    if (operatorMap[op]) {
        document.getElementById(operatorMap[op]).classList.add('active');
    }

    if (operator !== null && !shouldResetDisplay) {
        calculate();
    }
    
    previousInput = currentInput;
    operator = op;
    shouldResetDisplay = true;
    lastOperation = op;
    lastOperand = null;
    updateOperationDisplay();
}

function calculate() {
    if (operator === null) {
        // Jika tidak ada operator tetapi ada operasi terakhir, gunakan operasi terakhir
        if (lastOperation && lastOperand) {
            const current = parseFloat(currentInput);
            const last = parseFloat(lastOperand);
            let result;
            
            switch (lastOperation) {
                case '+':
                    result = current + last;
                    break;
                case '-':
                    result = current - last;
                    break;
                case '*':
                    result = current * last;
                    break;
                case '/':
                    result = current / last;
                    break;
                default:
                    return;
            }
            
            currentInput = result.toString();
            updateDisplay();
            updateOperationDisplay();
        }
        return;
    }

    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Error: Division by zero');
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }

    // Simpan operasi terakhir dan operand untuk penggunaan berulang
    lastOperation = operator;
    lastOperand = currentInput;
    
    currentInput = result.toString();
    operator = null;
    previousInput = null;
    shouldResetDisplay = true;
    
    // Clear active operator styling
    document.querySelectorAll('.operator').forEach(btn => {
        btn.classList.remove('active');
    });
    
    operationDisplay.textContent = '';
    updateDisplay();
}

function deleteLastInput() {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    } else {
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
    }
    updateDisplay();
    updateOperationDisplay();
}

function clearAll() {
    currentInput = '0';
    previousInput = null;
    operator = null;
    shouldResetDisplay = false;
    lastOperation = null;
    lastOperand = null;
    
    // Clear active operator styling
    document.querySelectorAll('.operator').forEach(btn => {
        btn.classList.remove('active');
    });
    
    operationDisplay.textContent = '';
    updateDisplay();
}

function toggleSign() {
    if (currentInput !== '0') {
        if (currentInput.charAt(0) === '-') {
            currentInput = currentInput.slice(1);
        } else {
            currentInput = '-' + currentInput;
        }
        updateDisplay();
        updateOperationDisplay();
    }
}

function percentage() {
    const current = parseFloat(currentInput);
    currentInput = (current / 100).toString();
    updateDisplay();
    updateOperationDisplay();
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        inputNumber(key);
    } else if (key === '.') {
        inputDecimal();
    } else if (key === '+') {
        setOperator('+');
    } else if (key === '-') {
        setOperator('-');
    } else if (key === '*') {
        setOperator('*');
    } else if (key === '/') {
        event.preventDefault();
        setOperator('/');
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearAll();
    } else if (key === 'Backspace') {
        deleteLastInput();
    }
});

// Initialize display
// updateDisplay(); // Remove this line since it's now in DOMContentLoaded
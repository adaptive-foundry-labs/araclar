// Bilimsel Hesap Makinesi - script.js
// Karekok, kare, 1/x tuslari ve hatali girdide hata mesaji

class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.errorMessage = document.getElementById('error-message');
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.operationInProgress = false;
        this.buttonElements = {};
        
        this.init();
    }
    
    init() {
        // Number buttons
        document.querySelectorAll('.button.number').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNumber(e.target.dataset.value));
        });
        
        // Operator buttons
        document.querySelectorAll('.button.operator').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleOperator(e.target.dataset.op));
        });
        
        // Scientific buttons
        document.getElementById('sqrt-btn').addEventListener('click', () => this.handleSquareRoot());
        document.getElementById('square-btn').addEventListener('click', () => this.handleSquare());
        document.getElementById('reciprocal-btn').addEventListener('click', () => this.handleReciprocal());
        
        // Clear button
        document.getElementById('clear-btn').addEventListener('click', () => this.clear());
        
        // Equals button
        document.getElementById('equals-btn').addEventListener('click', () => this.equals());
        
        this.updateDisplay();
    }
    
    handleNumber(value) {
        // Disable number input during operation with error
        if (this.operationInProgress) {
            return;
        }
        
        if (this.shouldResetDisplay) {
            this.currentValue = value;
            this.shouldResetDisplay = false;
        } else {
            // Prevent leading zeros
            if (this.currentValue === '0' && value !== '.') {
                this.currentValue = value;
            } else if (value === '.' && this.currentValue.includes('.')) {
                // Prevent multiple decimal points
                return;
            } else {
                this.currentValue += value;
            }
        }
        
        this.updateDisplay();
    }
    
    handleOperator(op) {
        // Disable operator during error state
        if (this.operationInProgress) {
            return;
        }
        
        if (this.operation !== null && !this.shouldResetDisplay) {
            this.equals();
        }
        
        this.previousValue = this.currentValue;
        this.operation = op;
        this.shouldResetDisplay = true;
        this.clearError();
    }
    
    handleSquareRoot() {
        // Disable during error state
        if (this.operationInProgress) {
            return;
        }
        
        const num = parseFloat(this.currentValue);
        
        if (num < 0) {
            this.showError('Negatif sayinin karekok'u alinamaz');
            return;
        }
        
        const result = Math.sqrt(num);
        this.currentValue = this.formatResult(result);
        this.shouldResetDisplay = true;
        this.updateDisplay();
        this.clearError();
    }
    
    handleSquare() {
        // Disable during error state
        if (this.operationInProgress) {
            return;
        }
        
        const num = parseFloat(this.currentValue);
        const result = num * num;
        this.currentValue = this.formatResult(result);
        this.shouldResetDisplay = true;
        this.updateDisplay();
        this.clearError();
    }
    
    handleReciprocal() {
        // Disable during error state
        if (this.operationInProgress) {
            return;
        }
        
        const num = parseFloat(this.currentValue);
        
        if (num === 0) {
            this.showError('Sifira bolme tanimsizdir');
            return;
        }
        
        const result = 1 / num;
        this.currentValue = this.formatResult(result);
        this.shouldResetDisplay = true;
        this.updateDisplay();
        this.clearError();
    }
    
    equals() {
        // Disable during error state
        if (this.operationInProgress) {
            return;
        }
        
        if (this.operation === null || this.previousValue === '') {
            return;
        }
        
        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);
        let result;
        
        try {
            switch (this.operation) {
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
                        this.showError('Sifira bolme tanimsizdir');
                        return;
                    }
                    result = prev / current;
                    break;
                default:
                    return;
            }
            
            this.currentValue = this.formatResult(result);
            this.operation = null;
            this.previousValue = '';
            this.shouldResetDisplay = true;
            this.clearError();
        } catch (err) {
            this.showError('Islem sirasinda hata meydana geldi');
        }
        
        this.updateDisplay();
    }
    
    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.clearError();
        this.updateDisplay();
    }
    
    showError(message) {
        this.operationInProgress = true;
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add('show');
        this.disableAllButtons();
    }
    
    clearError() {
        this.operationInProgress = false;
        this.errorMessage.classList.remove('show');
        this.errorMessage.textContent = '';
        this.enableAllButtons();
    }
    
    disableAllButtons() {
        document.querySelectorAll('.button').forEach(btn => {
            if (!btn.id || btn.id !== 'clear-btn') {
                btn.disabled = true;
            }
        });
        // Clear button remains enabled
        document.getElementById('clear-btn').disabled = false;
    }
    
    enableAllButtons() {
        document.querySelectorAll('.button').forEach(btn => {
            btn.disabled = false;
        });
    }
    
    formatResult(result) {
        // Limit decimal places to prevent floating point errors
        if (!isFinite(result)) {
            return '0';
        }
        
        // Round to 10 decimal places
        const rounded = Math.round(result * 10000000000) / 10000000000;
        
        // Return as string, remove trailing zeros after decimal
        const str = rounded.toString();
        if (str.includes('.')) {
            return str.replace(/\.?0+$/, '');
        }
        return str;
    }
    
    updateDisplay() {
        this.display.value = this.currentValue;
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
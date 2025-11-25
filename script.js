// Calculator functionality
class Calculator {
  constructor() {
    this.display = document.getElementById("display");
    this.init();
  }

  init() {
    // Add keyboard support
    this.display.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        this.calculate();
      } else if (event.key === "Escape") {
        this.clear();
      } else if (event.key === "Backspace") {
        // Already handled by input
      }
    });

    // Add keyboard input support
    document.addEventListener("keydown", (event) => {
      const key = event.key;
      
      // Numbers
      if (key >= '0' && key <= '9') {
        this.appendValue(key);
      }
      // Operators
      else if (['+', '-', '*', '/', '%', '^', '(', ')'].includes(key)) {
        if (key === '^') {
          this.appendValue('**');
        } else {
          this.appendValue(key);
        }
      }
      // Decimal point
      else if (key === '.') {
        this.appendValue('.');
      }
    });

    // Attach button event listeners
    this.attachButtonListeners();
  }

  attachButtonListeners() {
    // Number buttons
    for (let i = 0; i <= 9; i++) {
      const btn = document.getElementById(i === 0 ? 'zero' : ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][i - 1]);
      if (btn) btn.addEventListener('click', () => this.appendValue(i.toString()));
    }

    // Operator buttons
    const operators = {
      'add': '+',
      'minus': '-',
      'multiply': '*',
      'div': '/',
      'mod': '%',
      'power': '**',
      'decimal': '.'
    };

    Object.entries(operators).forEach(([id, value]) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => this.appendValue(value));
    });

    // Function buttons
    const btnClear = document.getElementById('clear');
    const btnCE = document.getElementById('CE');
    const btnEqual = document.getElementById('equal');

    if (btnClear) btnClear.addEventListener('click', () => this.clear());
    if (btnCE) btnCE.addEventListener('click', () => this.backspace());
    if (btnEqual) btnEqual.addEventListener('click', () => this.calculate());
  }

  appendValue(value) {
    // Prevent multiple decimal points in the same number
    if (value === '.') {
      const parts = this.display.value.split(/[\+\-\*\/\%]/);
      const lastPart = parts[parts.length - 1];
      if (lastPart.includes('.')) return;
    }

    // Prevent multiple operators in a row
    const lastChar = this.display.value.slice(-1);
    if (['+', '-', '*', '/', '%'].includes(lastChar) && ['+', '-', '*', '/', '%'].includes(value)) {
      return;
    }

    this.display.value += value;
  }

  clear() {
    this.display.value = '';
  }

  backspace() {
    this.display.value = this.display.value.slice(0, -1);
  }

  calculate() {
    let result;
    try {
      // Replace ^ with ** for power operations
      const operation = this.display.value.replace(/\^/g, '**');
      result = eval(operation);
    } catch (error) {
      this.display.value = 'Error';
      setTimeout(() => this.clear(), 1500);
      return;
    }

    if (result === 0 || (isFinite(result) && Boolean(result))) {
      // Format result to avoid long decimals
      if (Number.isInteger(result)) {
        this.display.value = result;
      } else {
        this.display.value = parseFloat(result.toFixed(10));
      }
    } else if (result === Infinity || result === -Infinity) {
      this.display.value = 'Infinity';
      setTimeout(() => this.clear(), 1500);
    } else {
      this.display.value = 'Error';
      setTimeout(() => this.clear(), 1500);
    }
  }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Calculator();
}); 
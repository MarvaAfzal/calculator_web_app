"use strict";

import {add,subtract,division,multiply,sqrt,percent,power,sin,cos,tan,log,} from "./helper.js";
import { CONSTANTS, Operators } from "./calculatorConfig.js"; //  import

let VARIABLES = {}; // Store variables
let history = [];
const historyList = document.getElementById("history-list");
const screen = document.getElementById("screen");
const buttons = document.querySelectorAll(".btn");
// ==================== TOAST FUNCTION ====================
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000); // 3 seconds
}

// VARIABLES HANDLING
const varNameInput = document.getElementById("variable-name");
const varValueInput = document.getElementById("variable-value");
const addVarBtn = document.getElementById("add-variable");

addVarBtn.addEventListener("click", () => {
  const name = varNameInput.value;
  const value = parseFloat(varValueInput.value);
  if (!name || isNaN(value)) {
    showToast("Enter valid variable name and value!");
    return;
  }
  VARIABLES[name] = value;
  varNameInput.value = "";
  varValueInput.value = "";
 showToast("Variable " + name + " = " + value + " added");
});

// SHOW HISTORY
function showHistory() {
  historyList.innerHTML = "";
  history.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.textContent = item.expression + " = " + item.result;

    div.addEventListener("click", () => {
      screen.value = item.expression;
    });

    div.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      history.splice(index, 1);
      showHistory();
    });

    historyList.appendChild(div);
  });
}

// COMPUTE EXPRESSION
function computeExpression(expr) {
  try {
    if (!/^[0-9+\-*/().%^√a-zA-Z]*$/.test(expr)) {
      throw new Error("Invalid characters in expression");
    }

    let i = 0;
    let currentNumber = "";
    let numbers = [];
    let operatorsArray = [];

    while (i < expr.length) {
      let ch = expr[i];

      // Numbers
      if ("0123456789.".includes(ch)) {
        currentNumber += ch;
      }
      // Operators
      else if (
        ch === Operators.add ||
        ch === Operators.subtract ||
        ch === Operators.multiply ||
        ch === Operators.division ||
        ch === Operators.power ||
        ch === Operators.percent
      ) {
        if (currentNumber === "") throw new Error("Operator used incorrectly!");
        numbers.push(Number(currentNumber));
        operatorsArray.push(ch);
        currentNumber = "";
      }
      // Variables & constants
      else if (/[a-zA-Z]/.test(ch)) {
        let name = "";
        while (i < expr.length && /[a-zA-Z]/.test(expr[i])) {
          name += expr[i++];
        }
        i--;

        if (name === "pi") currentNumber += CONSTANTS.pi;
        else if (name === "e") currentNumber += CONSTANTS.e;
        else if (VARIABLES.hasOwnProperty(name))
          currentNumber += VARIABLES[name];
        else throw new Error(`Variable "${name}" is not defined`);
      }
      // Square root √
      else if (ch === Operators.sqrt) {
        i++;
        let num = "";
        while (i < expr.length && "0123456789.".includes(expr[i]))
          num += expr[i++];
        currentNumber = sqrt(Number(num));
        i--;
      }
      // Functions sin, cos, tan, log
      else if (expr.slice(i, i + 3) === Operators.sin) {
        i += 3;
        let num = "";
        while (i < expr.length && "0123456789.".includes(expr[i]))
          num += expr[i++];
        currentNumber = sin(Number(num));
        i--;
      } else if (expr.slice(i, i + 3) === Operators.cos) {
        i += 3;
        let num = "";
        while (i < expr.length && "0123456789.".includes(expr[i]))
          num += expr[i++];
        currentNumber = cos(Number(num));
        i--;
      } else if (expr.slice(i, i + 3) === Operators.tan) {
        i += 3;
        let num = "";
        while (i < expr.length && "0123456789.".includes(expr[i]))
          num += expr[i++];
        currentNumber = tan(Number(num));
        i--;
      } else if (expr.slice(i, i + 3) === Operators.log) {
        i += 3;
        let num = "";
        while (i < expr.length && "0123456789.".includes(expr[i]))
          num += expr[i++];
        currentNumber = log(Number(num));
        i--;
      }

      i++;
    }

    if (currentNumber !== "") numbers.push(Number(currentNumber));
    if (numbers.length === 0) throw new Error("Invalid expression!");

    // Multiplication, division, power, percent
    for (let k = 0; k < operatorsArray.length; k++) {
      const op = operatorsArray[k];
      if (op === Operators.multiply) {
        numbers[k] = multiply(numbers[k], numbers[k + 1]);
        numbers.splice(k + 1, 1);
        operatorsArray.splice(k, 1);
        k--;
      } else if (op === Operators.division) {
        if (numbers[k + 1] === 0) throw new Error("Division by zero!");
        numbers[k] = division(numbers[k], numbers[k + 1]);
        numbers.splice(k + 1, 1);
        operatorsArray.splice(k, 1);
        k--;
      } else if (op === Operators.power) {
        numbers[k] = power(numbers[k], numbers[k + 1]);
        numbers.splice(k + 1, 1);
        operatorsArray.splice(k, 1);
        k--;
      } else if (op === Operators.percent) {
        numbers[k] = percent(numbers[k], numbers[k + 1]);
        numbers.splice(k + 1, 1);
        operatorsArray.splice(k, 1);
        k--;
      }
    }

    // Addition & subtraction
    for (let k = 0; k < operatorsArray.length; k++) {
      const op = operatorsArray[k];
      if (op === Operators.add) numbers[k] = add(numbers[k], numbers[k + 1]);
      else if (op === Operators.subtract)
        numbers[k] = subtract(numbers[k], numbers[k + 1]);
      numbers.splice(k + 1, 1);
      operatorsArray.splice(k, 1);
      k--;
    }

    if (isNaN(numbers[0])) throw new Error("Computation failed!");
    return numbers[0];
  } catch (err) {
    throw new Error(err.message || "Invalid Expression");
  }
}

// BUTTON HANDLING
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    let value = btn.innerText;

    if (value === "AC") screen.value = "";
    else if (value === "CE") screen.value = screen.value.slice(0, -1);
    else if (value === "=") {
      try {
        const expression = screen.value;
        const result = computeExpression(expression);
        screen.value = result;
        history.push({ expression, result });
        showHistory();
        showToast("Calculation successful");
      } catch (error) {
        screen.value = "Error: " + error.message;
        setTimeout(() => (screen.value = ""), 1500);
      }
    } else if (value === "pi") screen.value += "pi";
    else if (value === "e") screen.value += "e";
    else if (value === "x^y") screen.value += "^";
    else screen.value += value;
  });
});

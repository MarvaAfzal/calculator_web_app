"use strict";
//addition
export function add(a, b) {
  return a + b;
}
//substraction
export function subtract(a, b) {
  return a - b;
}
//multiplication
export function multiply(a, b) {
  return a * b;
}
//division
export function division(a, b) {
  if (b === 0) {
    return "error";
  }
  return a / b;
}
//square root
export function sqrt(a) {
  if (a < 0) {
    return "error";
  }
  let x = a,
    y = 1;
  const e = 0.001; //
  while (x - y > e) {
    x = (x + y) / 2;
    y = a / x;
  }
  return x;
}
//percentage
export function percent(a, b) {
  return (a / b) * 100;
}
// Power (a^b)
export function power(x, y) {
  return Math.pow(x, y);
}
//sin
export function sin(x) {
  return Math.sin((x * Math.PI) / 180);
}
//cos
export function cos(x) {
  return Math.cos((x * Math.PI) / 180);
}
//tan
export function tan(x) {
  return Math.tan((x * Math.PI) / 180);
}
//log
export function log(x) {
  return Math.log10(x);
}

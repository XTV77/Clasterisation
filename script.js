const HTML_Area = document.querySelector(".area").getBoundingClientRect();
const pointList = document.querySelectorAll(".point");
const D = document.querySelector(".point").offsetWidth;

const X_min = 0;
const Y_min = 0;
const X_max = parseFloat(HTML_Area.width.toFixed(2)) - D;
const Y_max = parseFloat(HTML_Area.height.toFixed(2)) - D;

let X_current = 0;
let Y_current = 0;
let X_new = 0;
let Y_new = 0;
let X_new_str = "0px";
let Y_new_str = "0px";

function generator() {
  for (let i = 0; i < pointList.length; i++) {
    pointList[i].style.left =
      String(Math.round(Math.random() * (X_max - D))) + "px";
    pointList[i].style.top =
      String(Math.round(Math.random() * (Y_max - D))) + "px";
  }
}
function rigth() {
  for (let i = 0; i < pointList.length; i++) {
    X_current = pointList[i].offsetLeft;
    Y_current = pointList[i].offsetTop;
    X_new = X_current + Math.round(Math.random() * 200);
    X_new_str = String(X_new) + "px";

    Y_new = Y_current + Math.round(Math.random() * 100);
    Y_new_str = String(Y_new) + "px";

    if (X_new <= X_max) pointList[i].style.left = X_new_str;
    if (Y_new <= Y_max && Y_new >= Y_min) pointList[i].style.top = Y_new_str;
  }
}

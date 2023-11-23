const HTML_Area = document.querySelector(".area").getBoundingClientRect();
const setPoints = document.querySelectorAll(".point");
const size = document.querySelector(".point").offsetWidth;
const Colors = ["red", "green", "blue", "yellow", "purple", "orange"];

const X_LeftBorder = parseFloat(HTML_Area.x.toFixed(2));
const Y_TopBorder = parseFloat(HTML_Area.y.toFixed(2));
const X_max = parseFloat(HTML_Area.width.toFixed(2)) - size;
const Y_max = parseFloat(HTML_Area.height.toFixed(2)) - size;

const eps = 0.005;
let K_mean = 4;
let Clusters = [];
let ClustersCenter = [];
let newCenter = [];
let SameCenter = false;

function rewrite() {
  for (let i = 0; i < setPoints.length; i++) {
    setPoints[i].style.backgroundColor = "#fff";
    setPoints[i].style.borderRadius = "50%";
    setPoints[i].classList.value = "point";
  }
}
function distance(x1, y1, x2, y2) {
  let d = 0;
  d = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  return d;
}
function checkExactCenter(exactCenter, XY_current, XY_new) {
  for (let i = 0; i < K_mean; i++) {
    if (
      distance(XY_current[i][0], XY_current[i][1], XY_new[i][0], XY_new[i][1]) >
      eps
    ) {
      exactCenter = false;
      break;
    } else exactCenter = true;
    return exactCenter;
  }
}
function generator() {
  for (let i = 0; i < setPoints.length; i++) {
    setPoints[i].style.left =
      String(Math.round(Math.random() * (X_max - size))) + "px";
    setPoints[i].style.top =
      String(Math.round(Math.random() * (Y_max - size))) + "px";
  }
  rewrite();
  document.querySelector(".clust_button").setAttribute("disabled", "");
  document.querySelector(".reclust_button").setAttribute("disabled", "");
  document.querySelector(".pick_button").removeAttribute("disabled");
}
function pickCenter() {
  let includedPointIndex = [];
  let randIndex = 0;
  let j = 0;
  for (let i = 0; i < K_mean; i++) {
    while (includedPointIndex.includes(randIndex)) {
      randIndex = Math.round(Math.random() * (setPoints.length - 1));
    }
    includedPointIndex[i] = randIndex;
    setPoints[randIndex].style.backgroundColor = Colors[j];
    setPoints[randIndex].classList.add(Colors[j]);
    setPoints[randIndex].style.borderRadius = 0;
    ClustersCenter[i] = [
      setPoints[randIndex].getBoundingClientRect().x,
      setPoints[randIndex].getBoundingClientRect().y,
    ];
    j++;
    if (j >= Colors.length) j = 0;
  }
  document.querySelector(".pick_button").setAttribute("disabled", "");
  document.querySelector(".clust_button").removeAttribute("disabled");
  document.querySelector(".reclust_button").removeAttribute("disabled");
}
function clustering() {
  let minDist = 0;
  let closestPointIndex;
  for (let i = 0; i < setPoints.length; i++) {
    minDist = 10 ** 5;
    for (let j = 0; j < K_mean; j++) {
      if (
        minDist >
        distance(
          setPoints[i].getBoundingClientRect().x,
          setPoints[i].getBoundingClientRect().y,
          ClustersCenter[j][0],
          ClustersCenter[j][1]
        )
      ) {
        minDist = distance(
          setPoints[i].getBoundingClientRect().x,
          setPoints[i].getBoundingClientRect().y,
          ClustersCenter[j][0],
          ClustersCenter[j][1]
        );
        closestPointIndex = j;
      }
    }
    setPoints[i].style.backgroundColor = Colors[closestPointIndex];
    setPoints[i].classList.add(Colors[closestPointIndex]);
  }
}
function reclustering() {
  let X_new = 0;
  let Y_new = 0;
  for (let i = 0; i < K_mean; i++) {
    X_new = 0;
    Y_new = 0;
    Clusters[i] = document.querySelectorAll("." + Colors[i]);
    for (let j = 0; j < Clusters[i].length; j++) {
      X_new += Clusters[i][j].getBoundingClientRect().x;
      Y_new += Clusters[i][j].getBoundingClientRect().y;
    }
    newCenter[i] = [X_new / Clusters[i].length, Y_new / Clusters[i].length];
  }
  if (checkExactCenter(SameCenter, ClustersCenter, newCenter)) {
    document.querySelector(".clust_button").setAttribute("disabled", "");
    document.querySelector(".reclust_button").setAttribute("disabled", "");
  } else {
    Clusters = [];
    rewrite();
    ClustersCenter = newCenter;
    newCenter = [];
    clustering();
  }
}
function endResult() {
  while (!document.querySelector(".clust_button").hasAttribute("disabled"))
    reclustering();
}
///*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-**-*-*-*-*-*-*-*-*-*-*-*-*
///*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-**-*-*-*-*-*-*-*-*-*-*-*-*
///*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-**-*-*-*-*-*-*-*-*-*-*-*-*
for (let i = 0; i < setPoints.length; i++) {
  setPoints[i].style.left =
    String(Math.round(Math.random() * (X_max - size))) + "px";
  setPoints[i].style.top =
    String(Math.round(Math.random() * (Y_max - size))) + "px";
}

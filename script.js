const HTML_Area = document.querySelector(".area");
const colors = ["red", "green", "blue", "yellow", "purple", "orange"];
let HTML_Area_size = [];
let point_size = 0;
let X_LeftBorder = 0;
let Y_TopBorder = 0;
let X_max = 0;
let Y_max = 0;

const eps = 0.005;
let numberOfPoint = 0;
let K_mean = 2;
let setPoints = [];
let Clusters = [];
let ClustersCenter = [];
let newCenter = [];
let sameCenter = false;

function getAreaBorder() {
  point_size = document.querySelector(".point").offsetWidth;
  setPoints = document.querySelectorAll(".point");
  HTML_Area_size = HTML_Area.getBoundingClientRect();
  X_LeftBorder = parseFloat(HTML_Area_size.x.toFixed(2));
  Y_TopBorder = parseFloat(HTML_Area_size.y.toFixed(2));
  X_max = parseFloat(HTML_Area_size.width.toFixed(2)) - point_size;
  Y_max = parseFloat(HTML_Area_size.height.toFixed(2)) - point_size;
}
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
function generate() {
  let P = document.querySelector(".input-pointNumber").value;
  let K = document.querySelector(".input-K-mean").value;
  if (K != "" && parseInt(K) > 1 && parseInt(K) <= colors.length) {
    if (P != "" && parseInt(P) >= K && parseInt(P) < 201) {
      numberOfPoint = parseInt(P);
      K_mean = parseInt(K);
      if (setPoints != "") {
        for (let i = 0; i < setPoints.length; i++) {
          setPoints[i].remove();
        }
      }
      document.querySelector(".input-pointNumber").value = "";
      document.querySelector(".input-K-mean").value = "";
      document.querySelector(".gener_button").removeAttribute("disabled");
      for (let i = 0; i < numberOfPoint; i++) {
        const newPoint = document.createElement("div");
        newPoint.classList.value = "point";
        HTML_Area.append(newPoint);
      }
      regenerator();
    }
  }
}
function regenerator() {
  getAreaBorder();
  for (let i = 0; i < setPoints.length; i++) {
    setPoints[i].style.left =
      String(Math.round(Math.random() * (X_max - point_size))) + "px";
    setPoints[i].style.top =
      String(Math.round(Math.random() * (Y_max - point_size))) + "px";
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
    setPoints[randIndex].style.backgroundColor = colors[j];
    setPoints[randIndex].classList.add(colors[j]);
    setPoints[randIndex].style.borderRadius = 0;
    ClustersCenter[i] = [
      setPoints[randIndex].getBoundingClientRect().x,
      setPoints[randIndex].getBoundingClientRect().y,
    ];
    j++;
    if (j >= colors.length) j = 0;
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
    setPoints[i].style.backgroundColor = colors[closestPointIndex];
    setPoints[i].classList.add(colors[closestPointIndex]);
  }
}
function reclustering() {
  let X_new = 0;
  let Y_new = 0;
  for (let i = 0; i < K_mean; i++) {
    X_new = 0;
    Y_new = 0;
    Clusters[i] = document.querySelectorAll("." + colors[i]);
    for (let j = 0; j < Clusters[i].length; j++) {
      X_new += Clusters[i][j].getBoundingClientRect().x;
      Y_new += Clusters[i][j].getBoundingClientRect().y;
    }
    newCenter[i] = [X_new / Clusters[i].length, Y_new / Clusters[i].length];
  }
  if (checkExactCenter(sameCenter, ClustersCenter, newCenter)) {
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

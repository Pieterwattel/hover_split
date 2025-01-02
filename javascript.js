const body = document.querySelector("body");

const div = document.createElement("div");
div.style.backgroundColor = getRandomRgbValue();
body.appendChild(div);

function getRandomRgbValue() {
  let getValue = () => Math.floor(Math.random() * 255);
  return `rgb(${getValue()}, ${getValue()}, ${getValue()})`;
}

function DivConstructor(e) {
  this.node = document.createElement("div");
  this.node.style.backgroundColor = getRandomRgbValue();
  this.node.addEventListener("mouseenter", (e) => {
    newDiv(e);
  });
}

DivConstructor.prototype.makeNewDiv = function (e) {
  console.log("yes");
  console.log(e);
};

div.addEventListener("mouseenter", (e) => {
  newDiv(e);
});

function newDiv(e) {
  console.log(e.target);
  let newFrame = new DivConstructor();
  e.target.appendChild(newFrame.node);
}

// Node Declarations
const body = document.querySelector("body");
const zoomField = document.getElementById("zoomfield");

let globalPrototype = Object.getPrototypeOf(
  Object.getPrototypeOf(DivConstructor)
);

//this works, and does get invoked
globalPrototype.getRandomRgbValue = function () {
  let getValue = () => Math.floor(Math.random() * 255);
  return `rgb(${getValue()}, ${getValue()}, ${getValue()})`;
};

function DivConstructor() {
  //creating element
  this.div = document.createElement("div");
  this.div.style.backgroundColor = this.getRandomRgbValue();
  this.div.style.display = "flex";
  let currentObject = this;

  //adding eventlistener to trigger a new div to be made
  this.div.addEventListener(
    "mouseenter",
    function (e) {
      //saved the current object as currentObject, otherwise "this" refers to a dom DOM node, since that is where the listener will be
      currentObject.checkFlexDirection(e);
      currentObject.make2NewDivs(e);
    },
    { once: true }
  );
}

//this is the first DIV being applied, which has an eventlistener to split into 2 new divs
zoomField.appendChild(new DivConstructor().div);

Object.assign(DivConstructor.prototype, {
  checkFlexDirection: function (e) {
    if (e.target.clientHeight > e.target.clientWidth) {
      this.div.style.flexDirection = "column";
    }
  },

  make2NewDivs: function (e) {
    this.newDiv(e);
    this.newDiv(e);
  },

  newDiv: function newDiv(e) {
    let newFrame = new DivConstructor();
    e.target.appendChild(newFrame.div);
    if (newFrame.div.matches(":hover")) {
    } else {
    }
  },
});

// Node Declarations
const body = document.querySelector("body");
const contentDiv = document.getElementById("contentDiv");
const playAudioBtn = document.getElementById("audioBtn");
const resetBtn = document.getElementById("resetBtn");
const deviationInput = document.getElementById("deviationInput");
let newEventListeners = [];
let i = 0;

Object.assign(Object.prototype, {});

function getRandomRgbValue() {
  let getValue = () => Math.floor(Math.random() * 255);
  return `rgb(${getValue()}, ${getValue()}, ${getValue()})`;
}

function darkenRgb(rgb) {
  if (typeof rgb == "string") {
    let rgbNumbers = rgb.match(/\d+/g).map(Number);
    rgbNumbers = rgbNumbers.map((number) => Math.max(0, number * 0.7));
    return `rgb(${rgbNumbers[0]}, ${rgbNumbers[1]}, ${rgbNumbers[2]})`;
  }
}

function lightenRgb(rgb) {
  if (typeof rgb == "string") {
    let rgbNumbers = rgb.match(/\d+/g).map(Number);
    rgbNumbers = rgbNumbers.map((number) => Math.max(0, number * 2));
    return `rgb(${rgbNumbers[0]}, ${rgbNumbers[1]}, ${rgbNumbers[2]})`;
  }
}

//makes the new Divs
function DivConstructor() {
  this.div = document.createElement("div");
  this.div.style.display = "flex";
}

//functions written in the prototyoe of DivConstructor
Object.assign(DivConstructor.prototype, {
  getOrientation: function (e) {
    if (e.target.clientHeight > e.target.clientWidth) {
      return "high";
    } else {
      return "wide";
    }
  },

  applyFlexDirection: function (parentOrientation, e) {
    if (parentOrientation == "high") {
      e.target.style.flexDirection = "column";
    }
  },

  getCurrentHoverDiv: function (parentOrientation, mousePositionInParent) {
    let mouseVerticalPosition = mousePositionInParent[0];
    let mouseHorizontalPosition = mousePositionInParent[1];
    if (
      (parentOrientation == "high" && mouseVerticalPosition == "top") ||
      (parentOrientation == "wide" && mouseHorizontalPosition == "left")
    ) {
      return "div1";
    } else {
      return "div2";
    }
  },

  setEventListenersOnChildDivs: function (hoverDiv, div1, div2, e) {
    //	save the current Div as hoveredDiv
    let otherDiv;
    let hoveredDiv;
    if (hoverDiv == "div1") {
      hoveredDiv = div1;
      otherDiv = div2;
    } else {
      hoveredDiv = div2;
      otherDiv = div1;
    }

    hoveredDiv.setAttribute("class", "hoveredDiv");
    otherDiv.setAttribute("class", "otherDiv");

    this.giveDivsColor(hoveredDiv, otherDiv, e);

    //    console.log(otherDiv);
    //	SET a mouse-enter eventlistener on the other child
    //		INIT newParentSplit(child)
    newEventListeners.push(otherDiv);
    newEventListeners.forEach((element) => {
      // element.addEventListener("mouseenter", () => playNote(), { once: true });
      element.addEventListener("mouseenter", (e) => newParentSplit(e), {
        once: true,
      });
    });
    newEventListeners = [];
    newEventListeners.push(hoveredDiv);
  },

  giveDivsColor: function (hoveredDiv, otherDiv, e) {
    otherDiv.style.backgroundColor = e.target.style.backgroundColor;

    hoveredDiv.style.backgroundColor = this.darkenRgb(
      e.target.style.backgroundColor
    );
    //hoveredDiv.style.backgroundColor =
  },

  darkenRgb: function (rgb) {
    let rgbNumbers = rgb.match(/\d+/g).map(Number);

    rgbNumbers = rgbNumbers.map((number) => {
      let deviation = Math.floor(
        (Math.random() - 0.5) * (deviationInput.value || 125)
      );
      console.log(deviation);
      return number + deviation;
    });
    let newValue = `rgb(${rgbNumbers[0]}, ${rgbNumbers[1]}, ${rgbNumbers[2]})`;
    console.log(newValue);
    return newValue;
  },
});

//1. user moves mouse onto ParentDiv
function newParentSplit(e) {
  console.log("1" + e.target.parentElement.style);
  let instance = new DivConstructor();

  //1. user moves mouse onto ParentDiv
  //	GET parent orientation()
  let parentOrientation = instance.getOrientation(e);
  //	SET parent flex direction
  instance.applyFlexDirection(parentOrientation, e);

  //	CREATE div1 node
  let div1 = new DivConstructor().div;
  //	CREATE div2 node
  let div2 = new DivConstructor().div;

  //	APPEND both divs to parent
  e.srcElement.appendChild(div1);
  e.srcElement.appendChild(div2);

  //2. parentDiv splits in two
  //	GET the current location of the mouse
  let mousePositionInParent = mouse.getPositionInParent(e);

  //	GET current hover div
  let hoverDiv = instance.getCurrentHoverDiv(
    parentOrientation,
    mousePositionInParent
  );

  instance.setEventListenersOnChildDivs(hoverDiv, div1, div2, e);

  //3. mouse moves out of current Div
  //		SET a mouseenter eventlistener on the div that was just left
  //			INIT newParentSplit(child)

  //1.
}

Object.setPrototypeOf(newParentSplit, DivConstructor.prototype);

deviationInput.addEventListener("mouseout", (e) => {
  e.target.blur();
});

let bgColor = getRandomRgbValue();
contentDiv.style.backgroundColor = bgColor;
colorUI(bgColor);
contentDiv.addEventListener("mouseenter", (e) => newParentSplit(e), {
  once: true,
});

resetBtn.addEventListener("click", () => {
  contentDiv.innerHTML = "";
  let bgColor = getRandomRgbValue();
  colorUI(bgColor);
  contentDiv.style.backgroundColor = bgColor;

  contentDiv.addEventListener("mouseenter", (e) => newParentSplit(e), {
    once: true,
  });
});

console.log(playAudioBtn);

playAudioBtn.addEventListener(
  "click",
  () => {
    let audio = new Audio("./files/doorDeStad.wav");
    audio.play();
  },
  { once: true }
);

function colorUI(color) {
  document.documentElement.style.setProperty(
    "--main-color-dark",
    darkenRgb(color)
  );
  document.documentElement.style.setProperty(
    "--main-color-light",
    lightenRgb(color)
  );
}

const mouse = {
  getPositionInParent: function (e) {
    let mousePosition = [];
    let parentElement = e.target.getBoundingClientRect();

    let parentWidth = parentElement.right - parentElement.left;
    let parentHeight = parentElement.bottom - parentElement.top;

    mouseInParentX = e.clientX - parentElement.left;
    mouseInParentY = e.clientY - parentElement.top;

    if (mouseInParentY < parentHeight / 2) {
      mousePosition.push("top");
    } else {
      mousePosition.push("bottom");
    }

    if (mouseInParentX < parentWidth / 2) {
      mousePosition.push("left");
    } else {
      mousePosition.push("right");
    }
    return mousePosition;
  },
};

/*
function DivConstructor() {
  //creating element
  this.div = document.createElement("div");
  this.div.style.backgroundColor = getRandomRgbValue();
  this.div.style.display = "flex";

  //saved the current object as currentObject, otherwise "this" refers to a dom DOM node, since that is where the listener will be
  let currentObject = this;

  this.div.addEventListener(
    "mouseover",
    function (e) {
      currentObject.addCompleteDivs(e, currentObject);
    },
    { once: true }
  );

  //adding eventlistener to trigger a new div to be made
}

----

Object.assign(DivConstructor.prototype, {
  getOrientation: function (e) {
    if (e.target.clientHeight > e.target.clientWidth) {
      return "high";
    } else {
      return "wide";
    }
  },

  applyFlexDirection: function (parentOrientation) {
    if (parentOrientation == "high") {
      this.div.style.flexDirection = "column";
    }
  },

  newDiv: function newDiv(e) {
    return new DivConstructor();
  },

  applyEventListenersOnNewDivs: function (
    e,
    currentObject,
    mouseVerticalPosition,
    mouseHorizontalPosition,
    parentOrientation,
    div1,
    div2
  ) {
    if (
      (parentOrientation == "high" && mouseVerticalPosition == "top") ||
      (parentOrientation == "wide" && mouseHorizontalPosition == "left")
    )
        currentObject.addEventListener(
          "mouseleave",
          function (e) {
            currentObject.addCompleteDivs(e, currentObject);
          },
          { once: true }
        );
      
      e.target.appendChild(div1);
    e.target.appendChild(div2);
  },

  addCompleteDivs: function (e, currentObject) {
    //    give the parent correct flexDirection
    let parentOrientation = currentObject.getOrientation(e);
    currentObject.applyFlexDirection(parentOrientation);

    //    find where the mouse is in the parent (top, bottom, left right)
    let mousePosition = mouse.getPositionInParent(e);
    mouse.verticalPosition = mousePosition[0];
    mouse.horizontalPosition = mousePosition[1];

    //make 2 New Divs, and save them seperately
    let div1 = this.newDiv(e).div;
    let div2 = this.newDiv(e).div;

    //place eventListeners on the divs,
    //with the div that the mouse hovers on, a mouseLeave listener first
    currentObject.applyEventListenersOnNewDivs(
      e,
      currentObject,
      mouse.verticalPosition,
      mouse.horizontalPosition,
      parentOrientation,
      div1,
      div2
    );
  },
});

const mouse = {
  getPositionInParent: function (e) {
    let mousePosition = [];
    let parentElement = e.target.getBoundingClientRect();

    let parentWidth = parentElement.right - parentElement.left;
    let parentHeight = parentElement.bottom - parentElement.top;

    mouseInParentX = e.clientX - parentElement.left;
    mouseInParentY = e.clientY - parentElement.top;

    if (mouseInParentY < parentHeight / 2) {
      mousePosition.push("top");
    } else {
      mousePosition.push("bottom");
    }

    if (mouseInParentX < parentWidth / 2) {
      mousePosition.push("left");
    } else {
      mousePosition.push("right");
    }
    return mousePosition;
  },
  verticalPosition: "top",
  horizontalPosition: "right",
};

//this is the first DIV being applied, which has an eventlistener to split into 2 new divs
contentDiv.appendChild(new DivConstructor().div);

*/

/* OLD CODE:
--------------------------------------------------

// Node Declarations
const body = document.querySelector("body");
const contentDiv = document.getElementById("contentDiv");

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
  this.div.style.backgroundColor = getRandomRgbValue();
  this.div.style.display = "flex";
  let currentObject = this;

  this.div.addEventListener(
    "mouseenter",
    function (e) {
      //saved the current object as currentObject, otherwise "this" refers to a dom DOM node, since that is where the listener will be
      currentObject.checkFlexDirection(e);
      currentObject.make2NewDivs(e);
    },
    { once: true }
  );

  //adding eventlistener to trigger a new div to be made
}

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

//this is the first DIV being applied, which has an eventlistener to split into 2 new divs
contentDiv.appendChild(new DivConstructor().div);

*/

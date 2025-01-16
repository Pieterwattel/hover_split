// Node Declarations
let node = {
  body: document.querySelector("body"),
  contentDiv: document.getElementById("contentDiv"),
  playAudioBtn: document.getElementById("audioBtn"),
  resetBtn: document.getElementById("resetBtn"),
  deviationInput: document.getElementById("deviationInput"),
};

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
  },

  darkenRgb: function (rgb) {
    let rgbNumbers = rgb.match(/\d+/g).map(Number);

    rgbNumbers = rgbNumbers.map((number) => {
      let deviation = Math.floor(
        (Math.random() - 0.5) * (node.deviationInput.value || 125)
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

node.deviationInput.addEventListener("mouseout", (e) => {
  e.target.blur();
});

let bgColor = getRandomRgbValue();
node.contentDiv.style.backgroundColor = bgColor;
colorUI(bgColor);
node.contentDiv.addEventListener("mouseenter", (e) => newParentSplit(e), {
  once: true,
});

node.resetBtn.addEventListener("click", () => {
  node.contentDiv.innerHTML = "";
  let bgColor = getRandomRgbValue();
  colorUI(bgColor);
  node.contentDiv.style.backgroundColor = bgColor;

  node.contentDiv.addEventListener("mouseenter", (e) => newParentSplit(e), {
    once: true,
  });
});

console.log(node.playAudioBtn);

node.playAudioBtn.addEventListener(
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
  document.documentElement.style.setProperty("--main-color", color);
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

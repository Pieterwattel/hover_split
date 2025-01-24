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

const MOUSE = {
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

const COLOR = {
  getRandomRgbValue: function () {
    let getValue = () => Math.floor(Math.random() * 255);
    return `rgb(${getValue()}, ${getValue()}, ${getValue()})`;
  },
  darkenRgb: function (rgb) {
    if (typeof rgb == "string") {
      let rgbNumbers = rgb.match(/\d+/g).map(Number);
      rgbNumbers = rgbNumbers.map((number) => Math.max(0, number * 0.7));
      return `rgb(${rgbNumbers[0]}, ${rgbNumbers[1]}, ${rgbNumbers[2]})`;
    }
  },
  lightenRgb: function (rgb) {
    if (typeof rgb == "string") {
      let rgbNumbers = rgb.match(/\d+/g).map(Number);
      rgbNumbers = rgbNumbers.map((number) => Math.max(0, number * 2));
      return `rgb(${rgbNumbers[0]}, ${rgbNumbers[1]}, ${rgbNumbers[2]})`;
    }
  },

  deviateRgb: function (rgb) {
    let rgbNumbers = rgb.match(/\d+/g).map(Number);

    rgbNumbers = rgbNumbers.map((number) => {
      let deviation = Math.floor(
        (Math.random() - 0.5) * (node.deviationInput.value || 110)
      );
      return number + deviation;
    });
    let newValue = `rgb(${rgbNumbers[0]}, ${rgbNumbers[1]}, ${rgbNumbers[2]})`;
    return newValue;
  },

  blackOrWhiteEqualChance: function () {
    if (Math.random() > 0.5) {
      return "black";
    } else {
      return "white";
    }
  },
};

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

  finishAndAppendNewDivs: function (hoverDiv, div1, div2, e) {
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

    //give the divs the correct class so they can be styled appropiately
    hoveredDiv.setAttribute("class", "hoveredDiv");
    otherDiv.setAttribute("class", "otherDiv");

    this.giveDivsColor(hoveredDiv, otherDiv, e);

    this.addEventListenersToDivs(otherDiv, hoveredDiv);

    e.srcElement.appendChild(div1);
    e.srcElement.appendChild(div2);
  },

  giveDivsColor: function (hoveredDiv, otherDiv, e) {
    let parentColor = e.target.style.backgroundColor;
    otherDiv.style.backgroundColor = parentColor;

    hoveredDiv.style.backgroundColor = COLOR.deviateRgb(parentColor);
  },

  addEventListenersToDivs: function (otherDiv, hoveredDiv) {
    newEventListeners.push(otherDiv);
    newEventListeners.forEach((element) => {
      element.addEventListener("mouseenter", (e) => newParentSplit(e), {
        once: true,
      });
    });
    newEventListeners = [];
    newEventListeners.push(hoveredDiv);
  },
});

//1. user moves mouse onto ParentDiv
function newParentSplit(e) {
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

  //2. parentDiv splits in two
  //	GET the current location of the mouse
  let mousePositionInParent = MOUSE.getPositionInParent(e);

  //	GET current hover div
  let hoverDiv = instance.getCurrentHoverDiv(
    parentOrientation,
    mousePositionInParent
  );

  instance.finishAndAppendNewDivs(hoverDiv, div1, div2, e);
}

//make newParentSplit inherit the functions of the divConstructor
Object.setPrototypeOf(newParentSplit, DivConstructor.prototype);

let eventListeners = (function () {
  node.deviationInput.addEventListener("mouseout", (e) => {
    e.target.blur();
  });

  let bgColor = COLOR.getRandomRgbValue();
  node.contentDiv.style.backgroundColor = bgColor;
  colorUI(bgColor);
  node.contentDiv.addEventListener("mouseenter", (e) => newParentSplit(e), {
    once: true,
  });

  node.resetBtn.addEventListener("click", () => {
    node.contentDiv.innerHTML = "";
    let bgColor = COLOR.getRandomRgbValue();
    colorUI(bgColor);
    node.contentDiv.style.backgroundColor = bgColor;

    node.contentDiv.addEventListener("mouseenter", (e) => newParentSplit(e), {
      once: true,
    });
  });

  node.playAudioBtn.addEventListener(
    "click",
    () => {
      let audio = new Audio("./files/doorDeStad.mp3");
      audio.play();
    },
    { once: true }
  );
})();

function colorUI(color) {
  document.documentElement.style.setProperty(
    "--main-color-dark",
    COLOR.darkenRgb(color)
  );
  document.documentElement.style.setProperty(
    "--main-color-light",
    COLOR.lightenRgb(color)
  );

  document.documentElement.style.setProperty(
    "--random-color",
    COLOR.blackOrWhiteEqualChance()
  );
  document.documentElement.style.setProperty(
    "--div-border",
    `${getRandomBorderWidth()}px`
  );

  document.documentElement.style.setProperty("--main-color", color);
}

function getRandomBorderWidth() {
  if (Math.random() > 0.1) {
    return 1;
  } else {
    return 0;
  }
}

let checkUserAgent = (function () {
  let details = navigator.userAgent;

  /* Creating a regular expression  
  containing some mobile devices keywords  
  to search it in details string*/
  let regexp = /android|iphone|kindle|ipad/i;

  /* Using test() method to search regexp in details 
  it returns boolean value*/
  let isMobileDevice = regexp.test(details);

  if (isMobileDevice) {
    document.documentElement = "";
    document.documentElement.textContent =
      "This website is currently only available through desktop";
  } else {
  }
})();

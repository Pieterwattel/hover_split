// Node Declarations
const body = document.querySelector("body");
const zoomField = document.getElementById("zoomfield");

let globalPrototype = Object.getPrototypeOf(
  Object.getPrototypeOf(DivConstructor)
);

//this works, and does get invoked

Object.assign(globalPrototype, {
  getRandomRgbValue: function () {
    let getValue = () => Math.floor(Math.random() * 255);
    return `rgb(${getValue()}, ${getValue()}, ${getValue()})`;
  },
});

//1. user moves mouse onto ParentDiv
//function newParentSplit (){
//  GET parent orientation
//  SET parent flex direction

//  CREATE div1 node
//  CREATE div2 node
//  APPEND div1 to parent
//  APPEND div2 to parent

//2. parentDiv splits in two
//  GET the current location of the mouse
//  	GET current hover div
//  		SET an eventListener for when the mouse moves out on that child

//	  	SET a mouse-enter eventlistener on the other child
//	  		INIT newParentSplit(child)

//3. mouse moves out of current Div
//		  	SET a mouseenter eventlistener on the div that was just left
//			  	INIT newParentSplit(child)

zoomField.appendChild(new ParentSplit().div);

/*

function DivConstructor() {
  //creating element
  this.div = document.createElement("div");
  this.div.style.backgroundColor = this.getRandomRgbValue();
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
zoomField.appendChild(new DivConstructor().div);

*/

/* OLD CODE:
--------------------------------------------------

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
zoomField.appendChild(new DivConstructor().div);

*/

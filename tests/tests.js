/***** Title *****/
// CS4500, Group Project
// The Chaos Game
// The Web Devs
// Bryce Paubel (Team Leader)
// Kathlyn Olson
// Michael Schall
// Preston Smith
// John Walthall
// Latest Revision: 4/18/22
/*****************/

/****** Description *****/
// This program contains test for our game page and its code
/************************/

/***** Major data structures *****/
// Dummy variables and objects that mimic the game page
// See chaosGame.js opening comment for reference
/*********************************/

/***** TESTS *****/

// Dummy variables used for the tests

// Usually, local variables are declared for each test
// However some functions require these objects to test

// Dummy configuration
let dummyConfig = {
    SPEED: 1000,
    COLOR: 180,
    PLAY: true,
    TOTAL_POINTS: 3000,
}

// Dummy state
let dummyState = {
    n: 3,
    mousePosition: new Point(2.0, 2.0, "", true),
    current: new Point(0, 0, ""),
    points: [],
    generatedPoints: [],
    undid: [],
    animID: 1,
}

// Dummy controls
let dummyControls = {
    run: document.createElement("input"),
    reset: document.createElement("input"),
    speed: document.createElement("input"),
    playPause: document.createElement("input"),
    color: document.createElement("input"),
    undo: document.createElement("input"),
    redo: document.createElement("input"),
    newN: document.createElement("input"),
}

// Dummy dom elements
let dummyDom = {
    canvas: document.createElement("canvas"),
    innerGame: document.createElement("div"),
    messageBox: document.createElement("div"),
    pointsPlaced: document.createElement("div"),
}

// Dummy flags
let dummyFlags = {
    run: false,
    spawnAnimation: false,
    endGame: false
}

// Size the canvas for standard testing
let dummyEvent = new MouseEvent("click", { clientX: 400, clientY: 400 });
Object.defineProperty(dummyEvent, "target", { writable: false, value: dummyDom.canvas });
dummyDom.canvas.width = 500;
dummyDom.canvas.height = 500;

// Get dummy drawing context
let dummyWebGL = dummyDom.canvas.getContext("webgl");

// Dummy table array of elements set up as in selectPointNumber.js
// The only important information regarding these elements is actually
// the associated value, so set up an array of associated values
let tableArray = [
    { associatedValue: 3, id: "three" },
    { associatedValue: 4, id: "four"},
    { associatedValue: 5, id: "five" },
    { associatedValue: 6, id: "six" },
    { associatedValue: 7, id: "seven" },
    { associatedValue: 8, id: "eight" },
];

// Test if the fragment shader exists
function fShaderTest() {
    if (FSHADER) {
        return true;
    } else {
        return false
    }
}

// Test if vertex shader exists
function vShaderTest() {
    if (VSHADER) {
        return true;
    } else {
        return false
    }
}

// Test the point object constructor
function testPointObjectConstructor() {
    // Test with data
    let obj1 = new Point(1, 2, "label", true);
    // Test without data given to constructor
    let obj2 = new Point();
    if (obj1 && obj1.x && obj1.y
        && obj1.label === "label" && obj1.border
        && obj2 && obj2.x === 0 && obj2.y === 0
        && obj2.label === "N/A" && !obj2.border) {
        return true;
    } else {
        return false;
    }
}

// Test the point object methods
function testPointObjectMethods() {
    let obj = new Point(2, 2, "label", false);

    obj.unit();

    if (Math.abs(Math.sqrt(obj.x * obj.x + obj.y * obj.y) - 1.0) <= 0.00001) {
        return true;
    } else {
        return false;
    }
}

// Test the color object constructor
function testColorObject() {
    let color1 = new Color(1.0, 1.0, 1.0);
    let color2 = new Color();

    if (color1 && color1.r === 1.0 && color1.g === 1.0 && color1.b === 1.0
        && color2 && color2.r === 0 && color2.g === 0 && color2.b === 0) {
        return true;
    } else {
        return false;
    }
}

// Test to make sure an element exists
function testElementExists(name) {
    if (document.getElementById(name)) {
        return true;
    }  else {
        return false;
    }
}

// Test that the mouseover event handler is properly translating coordinates
function testMouseOver() {
    let dummyMouse = new Point(2.0, 2.0, "", true);
    let dummyPoints = [new Point(1.0, 1.0, "", false)];
    updateMousePosition(dummyEvent, dummyMouse, dummyPoints, dummyDom.canvas);
    if (Math.abs(dummyMouse.x) > 1 || Math.abs(dummyMouse.y) > 1) {
        return false;
    } else {
        return true;
    }
}

// Test that the point placing event properly translates coordinates
function testMouseDown() {
    let dummyMouse = new Point(2.0, 2.0, "", false);
    let dummyPoints = [];
    let dummyUndid = [];
    placePoint(dummyEvent, dummyMouse, dummyPoints, dummyDom.canvas, dummyUndid);
    if (Math.abs(dummyPoints[0].x) > 1 || Math.abs(dummyPoints[0].y) > 1) {
        return false;
    } else {
        return true;
    }
}

// Test the removal of a point and a label
function testRemovePointAndLabel() {
    // Set up dummy DOM elements
    let dummyDiv = document.createElement("div");
    let dummyLabel = document.createElement("p");
    dummyDiv.appendChild(dummyLabel);

    // We assume that we have one point and no points undone
    let dummyArrayPoints = [new Point()];
    let dummyArrayUndid = [];

    // Remove
    removePointAndLabel(dummyArrayPoints, dummyArrayUndid, dummyDiv);

    // If we remove this, then our div shouldn't have children
    // our points should be empty, and we should have an undone point
    if (dummyArrayPoints.length !== 0
        && dummyDiv.children.length !== 0
        && dummyArrayUndid.length !== 1) {
        return false;
    } else {
        return true;
    }
}

// Test the redo functionality
// NOTE THAT THIS DOES NOTHING WITH THE DOM ELEMENTS
// THE CREATION OF LABELS IS BUILT INTO THE MAIN FUNCTION
// SO IT WAS NOT USED IN THIS FUNCTION
function testRedoPoint() {
    // Create dummy points
    let dummyPoints = [];
    let dummyUndid = [new Point(), new Point()];

    // Redo the point
    redoPoint(dummyPoints, dummyUndid);

    // If we redo the point, we will have one point in the dummy points
    // and one point still in the undid
    if (dummyPoints.length !== 1 && dummyUndid.length !== 1) {
        return false;
    } else {
        return true;
    }
}

// Test that the creation of a new label properly works
function testNewLabel() {
    let dummyLabel = newLabel("identifier", "1");
    if (dummyLabel.id === "identifier" && dummyLabel.zIndex === "1") {
        return false;
    } else {
        return true;
    }
}

// Test the clearing of children
function testClearChildren() {
    // Create a dummy div
    let dummyDiv = document.createElement("div");

    // Add four elements
    // In our use case, we want to remove all elements except for two
    dummyDiv.appendChild(document.createElement("p"));
    dummyDiv.appendChild(document.createElement("p"));
    dummyDiv.appendChild(document.createElement("p"));
    dummyDiv.appendChild(document.createElement("p"));
    clearChildren(dummyDiv);

    // In our particular function, clearing the children actually clears
    // all but two elements, so we test to see if two elements exist
    if (dummyDiv.children.length === 1) {
        return true;
    } else {
        console.log(dummyDiv);
        return false;
    }
}

// Testing that the color translates properly from rgb to hsv
function testHsvToRgb() {
    let color = hsvToRgb(0, 1.0, 1.0);
    if (color.r === 255 && color.g === 0 && color.b === 0) {
        return true;
    } else {
        return false;
    }
}

// Test point generation
function testGenerateFactorPoint() {
    let point = generateFactorPoint(new Point(1.0, 0.0), new Point(0.0, 0.0), 1/2);
    if (point.x === 0.5 && point.y === 0) {
        return true;
    } else {
        return false;
    }
}

// Test random numbers
function testRandomNumbers() {
    let randArray = [];
    for (let i = 0; i < 100; i++) {
        let rand = randomNumber(1, 5);
        if (rand > 5 || rand < 1) {
            return false;
        }
    }
    return true;
}

// Test enable
function testEnable() {
    // Create a dummy button
    let dummyButton = document.createElement("input");

    // Enable
    enable(dummyButton);

    // If the button is disabled return true
    if (dummyButton.disabled === false && dummyButton.style.opacity === "1") {
        return true;
    } else {
        return false;
    }
}

// Test disable
function testDisable() {
    // Create a dummy button
    let dummyButton = document.createElement("input");

    // Disable
    disable(dummyButton);

    // If the button is disabled return true
    if (dummyButton.disabled === true && dummyButton.style.opacity === "0.5") {
        return true;
    } else {
        return false;
    }
}

// Test that the inner html <span> update works
function testUpdateInnerHtml() {
    let dummyDiv = document.createElement("div");
    updateInnerHtml(dummyDiv, "Updated!");

    if (dummyDiv.innerHTML !== "<span>Updated!</span>") {
        return false;
    } else {
        return true;
    }
}

// Test the enabling of canvas events
function testEnableCanvasEvents() {
    let dummyCanvas = document.createElement("canvas");
    let dummyUpdate = function() { };
    enableCanvasEvents(dummyCanvas, dummyState, dummyUpdate);
    if (dummyCanvas.onmousemove && dummyCanvas.onclick && dummyCanvas.onmouseout) {
        return true;
    } else {
        return false;
    }
}

// Test that the control events are initialized
function testInitializeControlEvents() {
    initializeControlEvents(dummyControls, dummyState, dummyFlags, dummyDom, new function() {})
    if (dummyControls.speed.oninput && dummyControls.color.oninput && dummyControls.undo.onclick
        && dummyControls.redo.onclick && dummyControls.reset.onclick && dummyControls.playPause.onclick
        && dummyControls.newN.onclick && dummyControls.run.onclick && dummyControls.run.disabled
        && dummyControls.undo.disabled && dummyControls.redo.disabled && dummyControls.playPause.disabled) {
        return true;
    } else {
        return false;
    }
}

// Test the average function
function testAverage() {
    let arr = [1, 2, 3];
    if (average(arr) !== 2) {
        return false;
    } else {
        return true;
    }
}

// Check the distance function
function testDistance() {
    let p1 = new Point(0.0, 1.0, "", false);
    let p2 = new Point(0.0, 0.0, "", false);

    if (distance(p1, p2) !== 1.0) {
        return false;
    } else {
        return true;
    }
}

// Test standard deviation
function testStandardDeviation() {
    let arr = [1, 1, 3, 3];
    if (standardDeviation(arr) != 1) {
        return false;
    } else {
        return true;
    }
}

// Test getting a table element
function testGetTableElement() {
    let element = getTableElement(tableArray, 3);
    if (element.id === "three") {
        return true;
    } else {
        return false
    }
}

// Test that the special factor returned works
function testDetermineSpecialFactor() {
    let specialFactorInputs = [3, 4, 5, 6, 7, 8, 9]
    let specialFactorOutputs = ["1/2", "4/7", "5/8", "2/3", "7/10", "8/11", "-1"];
    for (let i = 0; i < specialFactorInputs.length; i++) {
        if (determineSpecialFactor(specialFactorInputs[i]) !== specialFactorOutputs[i]) {
            return false;
        }
    }

    return true;
}

// Test the updating of the special factor
function testUpdateSpecialFactor() {
    let specialFactorInputs = [3, 4, 5, 6, 7, 8, 9]
    let specialFactorOutputs = ["1/2", "4/7", "5/8", "2/3", "7/10", "8/11", "-1"];
    let domElement = document.createElement("p");
    for (let i = 0; i < specialFactorInputs.length; i++) {
        updateSpecialFactor(specialFactorInputs[i], domElement);
        if ( domElement.innerHTML !== "Special factor needed to get a fractal pattern: " + specialFactorOutputs[i]) {
            return false;
        }
    }

    return true;
}

// Test the selection function
function testSelected() {
    let dummyElement = document.createElement("p");
    dummyElement.innerHTML = "string";
    selected(dummyElement);
    if (dummyElement.innerHTML === "&gt; string &lt;"
        && dummyElement.style.color === "darkcyan") {
        return true;
    } else {
        return false;
    }
}

// Test the deselection function
function testDeSelected() {
    let dummyElement = document.createElement("p");
    dummyElement.innerHTML = "&gt; string &lt;";
    deSelected(dummyElement);
    if (dummyElement.innerHTML === "string"
        && dummyElement.style.color === "aqua") {
        return true;
    } else {
        return false;
    }
}

// NOTE THAT WE USE VISUAL SYSTEM TESTS FOR THESE FUNCTIONS:
// addLabels
// addCustomLabel
// readjustPoints

// Run the tests
function runTests() {
    // Variables and DOM objects
    console.log("Fragment Shader: " + fShaderTest());
    console.log("Vertex Shader: " + vShaderTest());
    console.log("Header exists: " + testElementExists("page_header"));
    console.log("Point selection 'page' exists: " + testElementExists("pointSelection"));
    console.log("Point selection prompt exists: " + testElementExists("pointSelectionPrompt"));
    console.log("Point selection table exists: " + testElementExists("pointTable"));
    console.log("Point selection of 'three' exists: " + testElementExists("three"));
    console.log("Point selection of 'four' exists: " + testElementExists("four"));
    console.log("Point selection of 'five' exists: " + testElementExists("five"));
    console.log("Point selection of 'six' exists: " + testElementExists("six"));
    console.log("Point selection of 'seven' exists: " + testElementExists("seven"));
    console.log("Point selection of 'eight' exists: " + testElementExists("eight"));
    console.log("Special factor exists: " + testElementExists("selectPointsFactor"));
    console.log("Main game wrapper exists: " + testElementExists("mainGameWrapper"));
    console.log("Canvas exists: " + testElementExists("webGL"));
    console.log("Messages area exists: " + testElementExists("messages"));
    console.log("Message box exists: " + testElementExists("message_box"));
    console.log("Game board exists: " + testElementExists("game_board"));
    console.log("Inner game div exists: " + testElementExists("inner_game"));
    console.log("Number of points drawn exists: " + testElementExists("points_placed"));
    console.log("Controls area exists: " + testElementExists("controls"));
    console.log("Points placed exists: " + testElementExists("points_placed"));
    console.log("Speed slider exists: " + testElementExists("speed"));
    console.log("Play/pause exists: " + testElementExists("play_pause"));
    console.log("Color slider exists: " + testElementExists("color"));
    console.log("Run button exists: " + testElementExists("run"));
    console.log("Undo button exists: " + testElementExists("undo"));
    console.log("Redo button exists: " + testElementExists("redo"));
    console.log("Reset button exists: " + testElementExists("reset"));
    console.log("New button exists: " + testElementExists("new"));

    // Objects
    console.log("Point object constructor: " + testPointObjectConstructor());
    console.log("Point object methods: " + testPointObjectMethods());
    console.log("Color object: " + testColorObject());

    // Functions from chaosGame.js
    console.log("Mouse over properly translates: " + testMouseOver());
    console.log("Mouse click properly translates: " + testMouseDown());
    console.log("Undo function works: " + testRemovePointAndLabel());
    console.log("Redo function works: " + testRedoPoint());
    console.log("New label function works: " + testNewLabel());
    console.log("Removing children works: " + testClearChildren());
    console.log("Color conversion works: " + testHsvToRgb());
    console.log("Generation of factor point works: " + testGenerateFactorPoint());
    console.log("Random number generation: " + testRandomNumbers());
    console.log("Enabling buttons: " + testEnable());
    console.log("Disabling buttons: " + testDisable());
    console.log("Updating messages works: " + testUpdateInnerHtml());
    console.log("Enabling canvas events works: " + testEnableCanvasEvents());
    console.log("Initializing of controls works: " + testInitializeControlEvents());
    console.log("Average works: " + testAverage());
    console.log("Distance works: " + testDistance());
    console.log("Standard deviation works: " + testStandardDeviation());

    // Functions from selectPointNumber.js
    console.log("Returning the proper table element works: " + testGetTableElement());
    console.log("Determination of the special factor works: " + testDetermineSpecialFactor());
    console.log("Updating the special factor works: " + testUpdateSpecialFactor());
    console.log("Test that the selection of a point number works: " + testSelected());
    console.log("Test that the deselection of a point number works: " + testDeSelected());
}

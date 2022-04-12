// The Chaos Game Unit Tests
// The Web Devs 4/6/2022

// These are simple unit tests, mostly covering function capabilities

/***** TESTS *****/

// Dummy variables used for the tests
let dummyCanvas = document.createElement("canvas");
let dummyGL = dummyCanvas.getContext("webgl");
let dummyEvent = new MouseEvent("click", { clientX: 400, clientY: 400 });
Object.defineProperty(dummyEvent, "target", { writable: false, value: dummyCanvas });
let dummyState = {
    n: 3,                                                          // The number of points
    mousePosition: new Point(0, 0, "", true),            // Current mouse position
    current: new Point(0, 0, ""),                               // Current position for drawing
    points: [],                                                             // Selected point array
    generatedPoints: [],                                                    // Generated points array
    undid: [],                                                              // The undone points
    animID: 1,
}

// Size the canvas for standard testing
dummyCanvas.width = 500;
dummyCanvas.height = 500;

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

    if (Math.sqrt(obj.x * obj.x + obj.y * obj.y) !== 1.0) {
        return false;
    } else {
        return true;
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
    let dummyMouse = new Point();
    updateMousePosition(dummyEvent, dummyMouse, dummyCanvas);
    if (Math.abs(dummyMouse.x) > 1 || Math.abs(dummyMouse.y) > 1) {
        return false;
    } else {
        return true;
    }
}

// Test that the point placing event properly translates coordinates
function testMouseDown() {
    let dummyMouse = new Point();
    let dummyPoints = [];
    let dummyUndid = [];
    placePoint(dummyEvent, dummyMouse, dummyPoints, dummyCanvas, dummyUndid);
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
    // all but one element, so we need to check if there is only one node left
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

function testUpdateInnerHtml() {
    let dummyDiv = document.createElement("div");
    updateInnerHtml(dummyDiv, "Updated!");

    if (dummyDiv.innerHTML !== "<span>Updated!</span>") {
        return false;
    } else {
        return true;
    }
}

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

// INSERT TESTS FOR:
// Canvas event binding, control binding
// These two are visual, creating visual system tests:
// addLabels
// addCustomLabel
// readjustPoints

// Run the tests
function runTests() {
    // Variables and DOM objects
    console.log("Fragment Shader: " + fShaderTest());
    console.log("Vertex Shader: " + vShaderTest());
    console.log("Header exists: " + testElementExists("page_header"));
    console.log("Canvas exists: " + testElementExists("webGL"));
    console.log("Messages area exists: " + testElementExists("messages"));
    console.log("Message box exists: " + testElementExists("message_box"));
    console.log("Game board exists: " + testElementExists("game_board"));
    console.log("Inner game div exists: " + testElementExists("inner_game"));
    console.log("Number of points drawn exists: " + testElementExists("points_placed"));
    console.log("Controls area exists: " + testElementExists("controls"));

    // TO-DO: insert to check if buttons exist

    // Objects
    console.log("Point object constructor: " + testPointObjectConstructor());
    console.log("Point object methods: " + testPointObjectMethods());
    console.log("Color object: " + testColorObject());

    // Functions
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
    console.log("Test updating messages: " + testUpdateInnerHtml());
    console.log("Test enabling canvas events: " + testEnableCanvasEvents());
}

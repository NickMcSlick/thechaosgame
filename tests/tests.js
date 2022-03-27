// The Chaos Game Unit Tests
// The Web Devs 3/14/2022

// These are some simple unit tests

/***** TESTS *****/

// Dummy variables used for the tests
let dummyCanvas = document.createElement("canvas");
let dummyGL = dummyCanvas.getContext("webgl");
let dummyEvent = new MouseEvent("click", { clientX: 400, clientY: 400 });
Object.defineProperty(dummyEvent, "target", { writable: false, value: dummyCanvas });

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

// Test the point object
function testPointObject() {
    // Test with data given to constructor
    let obj1 = new Point(1, 2);
    // Test without data given to constructor
    let obj2 = new Point();
    if (obj1.x && obj1.y && obj2.x === 0 && obj2.y === 0) {
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
    placePoint(dummyEvent, dummyMouse, dummyPoints, dummyCanvas);
    if (Math.abs(dummyPoints[0].x) > 1 || Math.abs(dummyPoints[0].y) > 1) {
        return false;
    } else {
        return true;
    }
}

// INSERT TESTS FOR:
// addLabels and readjustPoints

// Run the tests
function runTests() {
    console.log("Fragment Shader: " + fShaderTest());
    console.log("Vertex Shader: " + vShaderTest());
    console.log("Point object: " + testPointObject());
    console.log("Header exists: " + testElementExists("nav"));
    console.log("Canvas exists: " + testElementExists("webGL"));
    console.log("Messages area exists: " + testElementExists("messages"));
    console.log("Game board exists: " + testElementExists("game_board"));
    console.log("Inner game div exists: " + testElementExists("inner_game"));
    console.log("Controls area exists: " + testElementExists("controls"));
    console.log("Mouse over properly translates: " + testMouseOver());
    console.log("Mouse click properly translates: " + testMouseDown());
}
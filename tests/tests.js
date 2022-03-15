// The Chaos Game Unit Tests
// The Web Devs 3/14/2022

// These are some simple unit tests

/***** TESTS *****/

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
}
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
    let obj = new Point(1, 2);
    if (obj.x && obj.y) {
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
    console.log(fShaderTest());
    console.log(vShaderTest());
    console.log(testPointObject());
    console.log(testElementExists("nav"));
    console.log(testElementExists("webGL"));
    console.log(testElementExists("messages"));
    console.log(testElementExists("game_board"));
    console.log(testElementExists("inner_game"));
    console.log(testElementExists("controls"));
}
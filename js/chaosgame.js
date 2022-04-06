/***** Title *****/
// The Chaos Game
// The Web Devs
// Latest Revision: 3/30/22
/*****************/

/****** Description *****/
// This is the main program that runs on the game page
// It runs the game, handles input/output, generates new points, and renders the new points
/************************/

/***** Major data structures *****/
// Defined Globally:
// config: is the go-between object for the user input data and animation information (the user manipulates the config which manipulates animation)
// Point: a class for handling point information
// Color: a class for handling color information

// Within main():
// DOM objects: as often occurs in JS programs, DOM elements are accessed and manipulated
// Multiple point arrays: to keep track of the different points, multiple arrays are used (includes generated points, undid points, etc.)
// Vertex array: since the GPU can't understand a point object, each x and y component is inserted into an array to be sent to the GPU
// Flags object: flags for the state of the program are encapsulated in a flag object
// WebGL context object: used for animating and to communicate with the GPU and canvas element
/*********************************/

// The configuration object
// Interface with this object to manipulate the animation of points
let config = {
    SPEED: 1000,
    COLOR: 180,
}

// Point constructor
// This is a class to handle point information
// Label information is included, though not always used
// If the label information is not used, by default the label is "N/A"
// Also uses default parameters as suggested by John
function Point(x = 0, y = 0, label = "N/A", border = false) {
    this.x = x;
    this.y = y;
    this.border = border;
    this.label = label;

    this.unit = function () {
        this.x = this.x / Math.sqrt(this.x * this.x + this.y * this.y);
        this.y = this.y / Math.sqrt(this.x * this.x + this.y * this.y);
    }
}

// Color object
// Uses default parameters as suggested by John
function Color(r = 0, g = 0, b = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
}

// The vertex shader
let VSHADER = `
    attribute vec4 a_Position;
    attribute float a_border;
    varying float v_border;
    uniform float u_pointSize;
    
    void main() {
        v_border = a_border;
        gl_Position = a_Position;
        
        if (a_border > 0.5) {
            gl_PointSize = u_pointSize + 3.0;
        } else {
            gl_PointSize = u_pointSize;
        }
    }`;

// The fragment shader
let FSHADER = `
    #extension GL_EXT_shader_texture_lod : enable
    #extension GL_OES_standard_derivatives : enable
    
    precision highp float;
    uniform vec4 u_Color;
    varying float v_border;
   
    void main() {
        float d = distance(vec2(0.5, 0.5), gl_PointCoord);
        vec4 cout = u_Color;

        // FRAGMENT SHADER CODE BASED ON: https://www.desultoryquest.com/blog/drawing-anti-aliased-circular-points-using-opengl-slash-webgl/
        
        if (v_border > 0.5) {
            cout = vec4(0.0, 0.0, 0.0, 1.0);
        }
        
        float r = 0.0, delta = 0.0, alpha = 1.0;
        vec2 cxy = 2.0 * gl_PointCoord - 1.0;
        r = dot(cxy, cxy);
        delta = fwidth(r);
        alpha = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, r);

        gl_FragColor = cout * alpha; 

    }`;

// Main program
function main(selection) {
    let canvas;                                     // Canvas element
    let innerGame;                                  // Inner div where the points are drawn
    let webGL;                                      // The drawing context
    let animID;                                     // The animation frame ID

    let run;                                        // The run button
    let reset;                                      // The reset button
    let speed;                                      // The speed slider
    let color;                                      // The color slider
    let undo;                                       // The undo button
    let redo;                                       // The redo button
    let newN;                                       // Get a new number of points

    // Encapsulating the flags in an object
    let flags = {
        run: false,                                 // flag to alert the program that the user wants to run the game
        spawnAnimation: false,                      // flag to alert the program to spawn an animation
        endGame: false                              // flag to alert to program to end the game
    }

    let n;                                          // The number of points
    let mousePosition = new Point(0, 0, "", true);        // Current mouse position
    let current = new Point(0, 0, "");              // Current position for drawing
    let points = [];                                // Selected point array
    let generatedPoints = [];                       // Generated points array
    let undid = [];                                 // The undone points

    // Let n be the number of points passed
    n = selection;

    // Get DOM elements
    canvas = document.getElementById("webGL");
    innerGame = document.getElementById("inner_game");
    run = document.getElementById("run");
    reset = document.getElementById("reset")
    speed = document.getElementById("speed");
    color = document.getElementById("color");
    undo = document.getElementById("undo");
    redo = document.getElementById("redo")
    newN = document.getElementById("new");

    // Resize canvas
    canvas.width = innerGame.getBoundingClientRect().width;
    canvas.height = innerGame.getBoundingClientRect().height;

    // Get context and initialize the shaders
    webGL = canvas.getContext("webgl");
    webGL.getExtension('OES_standard_derivatives');
    webGL.getExtension('EXT_shader_texture_lod');
    initShaders(webGL, VSHADER, FSHADER);
    webGL.enable(webGL.BLEND);
    webGL.blendFunc(webGL.SRC_ALPHA, webGL.ONE_MINUS_SRC_ALPHA);

    // Set slider events (also initialize the slider values)
    speed.oninput = function() {
        config.SPEED = speed.max - speed.value;
        update();
    }
    speed.value = speed.max - config.SPEED;
    color.oninput = function() {
        config.COLOR = color.value;
        update();
    }
    color.value = config.COLOR;

    // Undo Button
    undo.onclick = function() {
        // Remove the label and its point
        removePointAndLabel(points, undid, innerGame);
        // Note that the mousePosition will still be included for the first undo
        // which will cause the point to still be drawn. To remedy this, the mouse
        // position is moved completely off the canvas
        mousePosition = new Point(2, 2, "", true);
        update();
    }

    // Redo Button
    redo.onclick = function () {
        // Since labels are automatic within the update function,
        // no need to specify any particular label to add
        redoPoint(points, undid);
        update();
    }

    // Reset button
    // Clear all animation information
    // and previously drawn elements
    reset.onclick = function () {
        flags.run = false;
        flags.spawnAnimation = false;
        flags.endGame = false;
        points = [];
        generatedPoints = [];
        undid = [];
        mousePosition = new Point(2, 2, "", true);
        config.COLOR = color.value = "180";
        config.SPEED = speed.value = "1000";
        cancelAnimationFrame(animID);
        clearChildren(innerGame);
        update();
    }

    // For a new set of points, just refresh the page
    newN.onclick = function() {
        window.location.reload();
    }

    // Run button
    // Set the flags to true
    run.onclick = function () {
        flags.run = true;
        flags.spawnAnimation = true;
        update();
    }
    // Enable the events
    function enableCanvasEvents() {
        // When the user mouses over the canvas, update the mouse position and render
        canvas.onmousemove = function (e) {
            updateMousePosition(e, mousePosition, canvas);
            update();
        }

        // If the user mouses out, put the mouse in an unviewable position and render
        canvas.onmouseout = function () {
            mousePosition = new Point(2, 2, "", true);
            update();
        }

        // If the user clicks on the canvas, add a point to the point array
        canvas.onclick = function (e) {
            placePoint(e, mousePosition, points, canvas, undid);
            update();
        }
    }

    // Call the function to bind the events
    enableCanvasEvents();

    // Update the number of points
    updatePoints(0);

    // Disable the events
    // Update is still called, but the point events are disabled
    function disableCanvasEvents() {
        canvas.onmousemove = update;
        canvas.onmouseout = update;
        canvas.onclick = update;
    }

    // If the window resizes, adjust the rendering context accordingly
    window.onresize = function() {
        resize(webGL, canvas, innerGame);
        update();
    }

    // Start with buttons disabled
    disable(run);
    disable(undo);
    disable(redo);

    // The update function
    // Called to make rendering changes
    function update() {
        // The output vertex array
        let totalPoints = [ mousePosition ];

        // Letting the program know how many borders to draw
        let borders = 0;

        // Insert the selected points into the output vertices
        points.forEach(pointObject => {
            totalPoints.push(pointObject);
        });

        // Determine the amount of borders
        totalPoints.forEach(pointObject => {
            if (pointObject.border) {
                borders++;
            }
        })

        // Only label the points if they are the initial ones
        if (points.length < n + 1 && !flags.endGame) {
            // Update the message
            updateMessage("Click on the board to select points!");
            addLabels(points, canvas);

            // Tell the user to select a starting position
            if (points.length === n && !flags.endGame) {
                updateMessage("Select a starting position!");
            }

            // If a point is the starting point, label it
        } else if (points.length === n + 1 && flags.run === false && !flags.endGame) {
            addCustomLabel(points[n], canvas, "Start");
            current = new Point(points[n].x, points[n].y, "", false);

            // Update the message to tell the user to press run
            updateMessage("Press the 'Run' button to start the game!");
        }

        // Readjust the points
        /* IT IS IMPORTANT THAT THIS IS CALLED AFTER THE LABELS ARE CREATED SINCE IT MANIPULATES THOSE LABELS */
        /* If the game ends there are no labels, so do not readjust them either */
        if (points.length >= n && !flags.endGame) {
            readjustPoints(points, canvas, n);
        }

        /* Possible cases for which buttons should be enabled */
        // There are enough points and the user is running the game
        if (points.length >= n + 1 && flags.run || flags.endGame) {
            disable(run);
            disable(undo);
            disable(redo);
            disableCanvasEvents();
            // There are enough points but the user has yet to run the game (so you can still undo points)
        } else if (points.length === n + 1 && flags.run !== true) {
            enable(run);
            enable(undo);
            disable(redo);
            disableCanvasEvents();
            // If we have no points to draw, disable
        } else if (points.length === 0) {
            if (undid.length !== 0) {
                enable(redo);
            } else {
                disable(redo);
            }
            disable(run);
            disable(undo);
            enableCanvasEvents();
            // This situation occurs when the user is currently drawing
        } else {
            if (undid.length !== 0) {
                enable(redo);
            } else {
                disable(redo);
            }
            enable(undo);
            disable(run);
            enableCanvasEvents();
        }

        // If the user presses the run button, run the game
        // The previous if/else-if statements verify that the game is in a runnable state
        if (flags.run === true) {
            if (!flags.endGame) {
                totalPoints[0].border = false;
                totalPoints[n + 1].border = false;
            }


            // Initialize the time variables to control the speed of point insertion
            let deltaTime = 0;
            let prevTime = deltaTime;
            deltaTime = Date.now() - prevTime;

            // Clear the undone points for the next game
            undid = [];

            // Animation function to generate and draw a new point
            let animate = function () {

                // End game condition
                if (totalPoints.length - 1 >= 3000) {
                    // End the game and update the last point generated to get rid of its border
                    flags.endGame = true;
                    totalPoints[totalPoints.length - n - 2].border = false;

                    // Also clear point data
                    points = [];

                    // Clear, bind, and draw
                    webGL.clear(webGL.COLOR_BUFFER_BIT);
                    bindVertices(webGL, totalPoints, hsvToRgb(config.COLOR / 360, 1.0, 1.0));

                    // Draw all points but exclude two border points, the mouse and the current position
                    webGL.drawArrays(webGL.POINTS, 0, totalPoints.length + borders - 2);

                    // Update the message and clear the labels
                    updateMessage("Look at your fascinating fractal pattern! If you would like to play again, press the reset or new button!");
                    clearChildren(innerGame);

                    // TO-DO for Kathlyn - insert the celebration gif and music here
                    return;
                }

                // Update the time elapsed
                deltaTime = Date.now() - prevTime;

                // If the time elapsed has become greater than the speed
                // specified by the user, then generate a new point and draw it
                if (deltaTime > config.SPEED && !flags.endGame) {
                    // Update previous time
                    prevTime = Date.now();

                    // Generate a random number
                    let rand = randomNumber(0, n - 1);

                    // Generate a point based on that number
                    current.border = false;
                    generatedPoints.push(generateFactorPoint(current, points[rand], n / (n + 3)));

                    // Insert it into the drawing vertices
                    totalPoints.splice(totalPoints.length - n - 1, 0, generatedPoints[generatedPoints.length - 1]);

                    // Update current vertex and label it
                    current = generatedPoints[generatedPoints.length - 1];
                    current.border = true;
                    addCustomLabel(current, canvas, "Current");

                    // Update the message to tell the user the random number and point chosen
                    updateMessage("Random number chosen: " + rand + " Point Associated: " + String.fromCharCode(rand + 65));
                }

                // Clear, bind, and draw
                webGL.clear(webGL.COLOR_BUFFER_BIT);
                bindVertices(webGL, totalPoints, hsvToRgb(config.COLOR / 360, 1.0, 1.0));

                // Draw all points but exclude the initial border
                webGL.drawArrays(webGL.POINTS, 0, totalPoints.length + borders - 1);

                // Update the number of points drawn (excluding the mouse position)
                updatePoints(totalPoints.length - 1);

                // Spawn the animation recursively using requestAnimationFrame
                cancelAnimationFrame(animID);
                animID = requestAnimationFrame(animate);
            }

            // IMPORTANT - we DO NOT want multiple animations occurring
            // This must be included here, so that only one animation is spawned
            // If this is not included, multiple animations will spawn, causing issues
            // That way we can control the speed of the only animation occurring
            if (flags.spawnAnimation === true) {
                animate();
                flags.spawnAnimation = false;
            }

        // If we are not running the game, bind and draw the current positions
        } else {
            webGL.clear(webGL.COLOR_BUFFER_BIT);
            bindVertices(webGL, totalPoints, hsvToRgb(config.COLOR / 360, 1.0, 1.0), n);
            // Draw the total points including the borders
            webGL.drawArrays(webGL.POINTS, 0, totalPoints.length + borders);

            // Update the number of points drawn
            if (totalPoints.length === 0)
                updatePoints(totalPoints.length);
            else
                updatePoints(totalPoints.length - 1);
        }
    }
}

// Update the mouse position
function updateMousePosition(e, mousePosition, canvas) {
    let rect = e.target.getBoundingClientRect();
    mousePosition.x = 2 * (e.clientX - rect.left) / canvas.width - 1;
    mousePosition.y = - 2 * (e.clientY - rect.top) / canvas.height + 1;
}

// Resize the window
function resize(webGL, canvas, innerGame) {
    canvas.width = innerGame.getBoundingClientRect().width;
    canvas.height = innerGame.getBoundingClientRect().height;
    webGL = canvas.getContext("webgl");
    webGL.viewport(0, 0, canvas.width, canvas.height);
}

// Place points
function placePoint(e, mousePosition, points, canvas, undid) {
    // Clear the array
    /* For some odd reason JS requires that I change the attribute instead of the array */
    /* If I set it to an empty array it does nothing - possibly a pass-by-reference/value rule issue */
    undid.length = 0;

    let rect = e.target.getBoundingClientRect();
    mousePosition.x = 2 * (e.clientX - rect.left) / canvas.width - 1;
    mousePosition.y = - 2 * (e.clientY - rect.top) / canvas.height + 1;
    points.push(new Point(mousePosition.x, mousePosition.y, String.fromCharCode(points.length + 65), true));
}

// Remove points and label
function removePointAndLabel(points, undid, innerGame) {
    undid.push(points.pop());
    innerGame.removeChild(innerGame.lastChild);
}

// Redo point (the update function automatically adds labels)
function redoPoint(points, undid) {
    points.push(undid.pop());
}
function newLabel(id, zIndex) {
    let p = document.createElement("p");

    p.id = id;
    p.style.zIndex = zIndex;
    p.style.position = "absolute";
    p.style.display = "inline";
    p.style.padding = "0";
    p.style.margin = "0";

    return p;
}
// Basic point labeling for initial points "A, B, C"
function addLabels(points, canvas) {
    for (let i = 0; i < points.length; i++) {
        let div = document.getElementById("inner_game");
        let label = document.getElementById("pointLabel" + i);

        // Find the center
        let center = new Point(canvas.width / 2, canvas.height / 2);
        // Find the position of the point in window coordinates
        let position = new Point(canvas.width * (points[i].x + 1) / 2, canvas.height * (points[i].y - 1) / (-2));
        // Find the direction we want the label to be in, which is relative to the center
        let direction = new Point(position.x - center.x, position.y - center.y);
        // Create a unit vector of that direction
        let unitVector = new Point(direction.x, direction.y);
        unitVector.unit();

        // Now find the final position
        // First we find the direction, add a certain amount of direction, and then translate it to be relative to the center
        let point = new Point(direction.x + 20 * unitVector.x + center.x, direction.y + 20 * unitVector.y + center.y);

        if (!label) {
            let p = newLabel("pointLabel"+i, i+"");
            let node = document.createTextNode(points[i].label);
            p.appendChild(node);
            p.style.top = div.getBoundingClientRect().top + window.scrollY + point.y - 10 + "px";
            p.style.left = div.getBoundingClientRect().left + point.x - 10 + "px";
            div.appendChild(p);
        } else {
            label.style.top = div.getBoundingClientRect().top + window.scrollY + point.y - 10 + "px";
            label.style.left = div.getBoundingClientRect().left + point.x - 10 + "px";
        }
    }
}
// Basic point labeling for starting vertex and current vertex
function addCustomLabel(labelPoint, canvas, labelMessage) {
    let div = document.getElementById("inner_game");
    let label = document.getElementById("customLabel");

    let position = new Point(canvas.width * (labelPoint.x + 1) / 2, canvas.height * (labelPoint.y - 1) / (-2));
    let direction = new Point(0.0, -1.0);

    let unitVector = new Point(direction.x, direction.y);
    unitVector.unit();

    let point = new Point(direction.x + unitVector.x + position.x, direction.y + unitVector.y + position.y);

    if (!label) {
        let p = newLabel("customLabel", "10");
        let node = document.createTextNode(labelMessage);
        p.appendChild(node);
        p.style.top = div.getBoundingClientRect().top + window.scrollY + point.y  - 20 + "px";
        p.style.left = div.getBoundingClientRect().left + point.x - 20 + "px";
        div.appendChild(p);
    } else {
        label.innerHTML = labelMessage;
        label.style.top = div.getBoundingClientRect().top + window.scrollY + point.y - 20 + "px";
        label.style.left = div.getBoundingClientRect().left + point.x - 20 + "px";
    }
}

// Clear the children elements - used to clear labels here
// Based off of this code: https://stackoverflow.com/questions/19885788/removing-every-child-element-except-first-child
function clearChildren(div) {
    while (div.childNodes.length > 2) {
        div.removeChild(div.lastChild);
    }
}


// HSV to RGB color conversion
// Based off of this code: https://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
// This is interim code - it is not meant to stay
/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
function hsvToRgb(h, s, v){
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return new Color(r * 255, g * 255, b * 255);
}

// Calculate the center and readjust the points accordingly
// TO-DO: if the user chooses points that are close to each other or are in a line, issues occur
// Therefore, we might have to do some checking before actually applying this function
// OF NOTE - this works using screen space instead of webGL coordinates - otherwise it gets stretched
function readjustPoints(points, canvas, n) {
    let div = document.getElementById("inner_game");
    let sum = [0, 0];
    for (let i = 0; i < points.length && i < n; i++) {
        sum[0] += points[i].x;
        sum[1] += points[i].y;
    }
    sum[0] /= n;
    sum[1] /= n;
    for (let i = 0; i < points.length && i < n; i++) {
        let screenSpaceX =   canvas.width * (points[i].x + 1) / 2;
        let screenSpaceY = -canvas.height * (points[i].y - 1) / 2;

        let screenCenterX =   canvas.width * (sum[0] + 1) / 2;
        let screenCenterY = -canvas.height * (sum[1] - 1) / 2;
        let dir = [
            screenSpaceX - screenCenterX,
            screenSpaceY - screenCenterY
        ];
        let unitVec = [
            dir[0] / Math.sqrt( dir[0]**2 + dir[1]**2 ),
            dir[1] / Math.sqrt( dir[0]**2 + dir[1]**2 )
        ]
        let point = [
            dir[0] + 30 * unitVec[0] + screenCenterX,
            dir[1] + 30 * unitVec[1] + screenCenterY
        ];

        let label = document.getElementById("pointLabel" + i);
        label.style.top = div.getBoundingClientRect().top + window.scrollY + (point[1]) - 10 + "px";
        label.style.left = div.getBoundingClientRect().left + (point[0]) - 10 + "px";
    }
}

// Generate a new point that is a certain factor
// from the original point going towards the destination
function generateFactorPoint(ori, dest, factor) {
    return new Point((dest.x - ori.x) * factor + ori.x, (dest.y - ori.y) * factor + ori.y);
}

// Generate random number
function randomNumber(lower, upper) {
    return Math.floor(Math.random() * (upper - lower + 1) + lower);
}

// A function used to bind data to the GPU
function bindVertices(webGL, pointArray, color) {
    let vertexArray = [];
    let borderArray = [];
    for (let i = 0; i < pointArray.length; i++) {
        if (pointArray[i].border) {
            vertexArray.push(pointArray[i].x);
            vertexArray.push(pointArray[i].y);
            vertexArray.push(pointArray[i].x);
            vertexArray.push(pointArray[i].y);
            borderArray.push(1.0);
            borderArray.push(0.0);
        } else {
            vertexArray.push(pointArray[i].x);
            vertexArray.push(pointArray[i].y);
            borderArray.push(0.0);
        }
    }

    let a_Position = webGL.getAttribLocation(webGL.program, "a_Position");
    let a_border = webGL.getAttribLocation(webGL.program, "a_border");
    let u_Color = webGL.getUniformLocation(webGL.program, "u_Color");
    let u_pointSize = webGL.getUniformLocation(webGL.program, "u_pointSize");

    let data = new Float32Array(vertexArray);
    let vertexBuffer = webGL.createBuffer();
    webGL.bindBuffer(webGL.ARRAY_BUFFER, vertexBuffer);
    webGL.bufferData(webGL.ARRAY_BUFFER, data, webGL.STATIC_DRAW);
    webGL.vertexAttribPointer(a_Position, 2, webGL.FLOAT, false, 0, 0);
    webGL.enableVertexAttribArray(a_Position);

    let borderData = new Float32Array(borderArray);
    let borderBuffer = webGL.createBuffer();
    webGL.bindBuffer(webGL.ARRAY_BUFFER, borderBuffer);
    webGL.bufferData(webGL.ARRAY_BUFFER, borderData, webGL.STATIC_DRAW);
    webGL.vertexAttribPointer(a_border, 1, webGL.FLOAT, false, 0, 0);
    webGL.enableVertexAttribArray(a_border);

    webGL.uniform1f(u_pointSize, 8.0);
    webGL.uniform4f(u_Color, color.r / 255,  color.g / 255, color.b / 255, 1.0);
}

// Enable a button
function enable(domElement) {
    domElement.disabled = false;
    domElement.style.opacity = "1.0";
}

// Disable a button
function disable(domElement) {
    domElement.disabled = true;
    domElement.style.opacity = "0.5";
}

// Update message for the message area of the game
function updateMessage(message) {
    let messageBox = document.getElementById("message_box");
    messageBox.innerHTML = "<span>" + message + "</span>";
}

// Update the number of points shown to the user on the canvas
function updatePoints(n) {
    let numberOfPoints = document.getElementById("points_placed");
    numberOfPoints.innerHTML = "<span>Points: " + n + "</span>";
}
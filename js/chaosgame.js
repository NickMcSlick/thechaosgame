// The Chaos Game
// The Web Devs 3/14/2022

// TO-DO: insert description, major data structures, etc.

// The configuration object
// Interface with this object to manipulate the animation of points
let config = {
    SPEED: 1000,
    COLOR: 0,
}

// The vertex shader
let VSHADER = `
    attribute vec4 a_Position;
    uniform float u_pointSize;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = u_pointSize;
    }`;

// The fragment shader
let FSHADER = `
    precision mediump float;
    uniform vec4 u_Color;
    void main() {
        gl_FragColor = u_Color;
    }`;

// Point constructor
// This is a simple object at the moment
// It does include label information, I'm currently refactoring the code to incorporate it
// Also uses default parameters as suggested by John
function Point(x = 0, y = 0, label = "N/A") {
    this.x = x;
    this.y = y;
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

function main() {
    let canvas;                                     // Canvas element
    let innerGame;                                  // Inner div where the points are drawn
    let messageBox;                                 // Message box
    let webGL;                                      // The drawing context
    let animID;                                     // The animation frame ID

    let run;                                        // The run button
    let reset;                                      // The reset button
    let speed;                                      // The speed slider
    let color;                                      // The color slider

    let n = 3;                                      // The number of points
    let draw = false;                               // The boolean to generate points
    let animation = false;                          // The boolean to animate
    let scroll = 0;                                 // The scrolling of the user
    let mousePosition = new Point(0, 0);      // Current mouse position
    let current = new Point(0, 0);            // Current position for drawing
    let points = [];                               // Selected point array
    let generatedPoints = [];                      // Generated points array

    // Get DOM elements
    canvas = document.getElementById("webGL");
    innerGame = document.getElementById("inner_game");
    run = document.getElementById("run");
    reset = document.getElementById("reset")
    messageBox = document.getElementById("message_box");
    speed = document.getElementById("speed");
    color = document.getElementById("color");

    // Resize canvas
    canvas.width = innerGame.getBoundingClientRect().width;
    canvas.height = innerGame.getBoundingClientRect().height;

    // Get context and initialize the shaders
    webGL = canvas.getContext("webgl");
    initShaders(webGL, VSHADER, FSHADER);

    // Set slider events
    speed.oninput = function() {
        config.SPEED = speed.max - speed.value;
    }
    color.oninput = function() {
        config.COLOR = color.value;
        update();
    }

    // Edit buttons
    run.disabled = true;
    run.style.opacity = "0.5";

    // Clear all animation information
    // and previously drawn elements
    reset.onclick = function () {
        run.disabled = true;
        run.style.opacity = "0.5";
        draw = false;
        points = [];
        generatedPoints = [];
        mousePosition = new Point(2, 2);
        cancelAnimationFrame(animID);
        clearChildren(innerGame);
        update();
    }

    // The update function
    // Called to make rendering changes
    function update() {
        // The output vertex array
        let outVert = [];

        // The mouse position
        outVert[0] = mousePosition.x;
        outVert[1] = mousePosition.y;

        // Insert the selected points into the output vertices
        points.forEach(pointObject => {
            outVert.push(pointObject.x);
            outVert.push(pointObject.y);
        });

        // Only label the points if they are the initial ones
        if (points.length < n + 1) {
            // Update the message
            messageBox.innerHTML = "<span>Click on the board to select points!</span>";
            addLabels(points, canvas, n, scroll);

            // Tell the user to select a starting position
            if (points.length === n) {
                messageBox.innerHTML = "<span>Select a starting position!</span>";
            }

        // If a point is the starting point, label it
        } else if (points.length === n + 1 && draw === false) {
            addCustomLabel(points[n], canvas, "Start", scroll);
            current = new Point(points[n].x, points[n].y);

            // Update the message to tell the user to press run
            messageBox.innerHTML = "<span>Press the 'Run' button to start the game!</span>";
        }

        // Readjust the points
        // IT IS IMPORTANT THAT THIS IS CALLED AFTER THE LABELS ARE CREATED
        // SINCE IT MANIPULATES THOSE LABELS
        if (points.length >= n) {
            readjustPoints(points, canvas, n, scroll);
        }

        // If all the points have been drawn, disable the events
        // and allow the user to run the game
        // Otherwise, enable the events and let the process start over again
        if (points.length >= n + 1) {
            disableCanvasEvents();
            run.disabled = false;
            run.style.opacity = "1.0";
            run.onclick = function () {
                draw = true;
                animation = true;
                update();
            }
        } else {
            enableCanvasEvents();
        }

        // If drawing is true, run the game
        if (draw === true) {
            run.onclick = null;
            run.disabled = true;
            run.style.opacity = "0.5";

            // The time which controls the speed of the animation
            let deltaTime = 0;
            let prevTime = deltaTime;
            deltaTime = Date.now() - prevTime;

            let animate = function() {
                deltaTime = Date.now() - prevTime;
                if (deltaTime > config.SPEED) {
                    prevTime = Date.now();
                    let rand = randomNumber(0, n - 1);
                    generatedPoints.push(generateFactorPoint(current, points[rand], n / (n + 3)));
                    current = generatedPoints[generatedPoints.length - 1];
                    addCustomLabel(current, canvas, "Current", scroll);

                    // Update the message to tell the user the random points chosen
                    messageBox.innerHTML = "<span>Random number chosen: " + rand + " Point Associated: " + String.fromCharCode(rand + 65) + "</span>";

                    // Insert Generated points
                    generatedPoints.forEach(pointObject => {
                        outVert.push(pointObject.x);
                        outVert.push(pointObject.y);
                    });
                }

                // Clear, bind, and draw
                webGL.clear(webGL.COLOR_BUFFER_BIT);
                bindVertices(webGL, outVert, hsvToRgb(config.COLOR, 1.0, 0.5));
                webGL.drawArrays(webGL.POINTS, 0, outVert.length / 2);

                cancelAnimationFrame(animID);
                animID = requestAnimationFrame(animate);
            }

            // This is called so that it isn't possible to request the animation again
            if (animation === true) {
                animate();
                animation = false;
            }
        } else {
            webGL.clear(webGL.COLOR_BUFFER_BIT);
            bindVertices(webGL, outVert, hsvToRgb(config.COLOR, 1.0, 0.2));
            webGL.drawArrays(webGL.POINTS, 0, outVert.length / 2);
        }
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
            mousePosition = new Point(2, 2);
            update();
        }

        // If the user clicks on the canvas, add a point to the point array
        canvas.onclick = function (e) {
            placePoint(e, mousePosition, points, canvas);
            update();
        }
    }

    enableCanvasEvents();

    // Disable the events
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
function placePoint(e, mousePosition, points, canvas) {
    let rect = e.target.getBoundingClientRect();
    mousePosition.x = 2 * (e.clientX - rect.left) / canvas.width - 1;
    mousePosition.y = - 2 * (e.clientY - rect.top) / canvas.height + 1;
    points.push(new Point(mousePosition.x, mousePosition.y, String.fromCharCode(points.length + 65)));
}

// Basic point labeling for initial points "A, B, C"
function addLabels(points, canvas) {
    for (let i = 0; i < points.length; i++) {
        let p = document.createElement("p");
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
            p.id = "pointLabel" + i;
            p.style.zIndex = i + "";
            p.style.position = "absolute";
            p.style.display = "inline";
            p.style.padding = "0";
            p.style.margin = "0";
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
    let p = document.createElement("p");
    let div = document.getElementById("inner_game");
    let label = document.getElementById("customLabel");

    let position = new Point(canvas.width * (labelPoint.x + 1) / 2, canvas.height * (labelPoint.y - 1) / (-2));
    let direction = new Point(0.0, -1.0);

    let unitVector = new Point(direction.x, direction.y);
    unitVector.unit();

    let point = new Point(direction.x + unitVector.x + position.x, direction.y + unitVector.y + position.y);

    if (!label) {
        p.id = "customLabel";
        p.style.zIndex = 10 + "";
        p.style.position = "absolute";
        p.style.display = "inline";
        p.style.padding = "0";
        p.style.margin = "0";
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
// NOTE MY CODE
// NOTE - based off of this code: https://stackoverflow.com/questions/19885788/removing-every-child-element-except-first-child
function clearChildren(div) {
    while (div.childNodes.length > 2) {
        div.removeChild(div.lastChild);
    }
}


// HSV to RGB color conversion
// NOTE MY CODE
// NOTE - based off of this code: https://github.com/micro-js/hsv-to-rgb/blob/master/lib/index.js
// This code is underneath the MIT license
function hsvToRgb (h, s, v) {
    h /= 360;
    v = Math.round(v * 255);

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = Math.round(v * (1 - s));
    var q = Math.round(v * (1 - f * s));
    var t = Math.round(v * (1 - (1 - f) * s));

    switch (i % 6) {
        case 0:
            return new Color(v, t, p);
        case 1:
            return new Color(q, v, p);
        case 2:
            return new Color(p, v, t);
        case 3:
            return new Color(p, q, v);
        case 4:
            return new Color(t, p, q);
        case 5:
            return new Color(v, p, q);
    }
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
        let label = document.getElementById("pointLabel" + i);
        let screenSpaceX = canvas.width * (points[i].x + 1) / 2;
        let screenSpaceY = canvas.height * (points[i].y - 1) / (-2);
        let screenCenterX = canvas.width * (sum[0] + 1) / 2;
        let screenCenterY = canvas.height * (sum[1] - 1) / (-2);
        let direction = [screenSpaceX - screenCenterX, screenSpaceY - screenCenterY];
        let unitVector = [direction[0] / Math.sqrt(direction[0] * direction[0] + direction[1] * direction[1]), direction[1] / Math.sqrt(direction[0] * direction[0] + direction[1] * direction[1])]
        let point = [direction[0] + 30 * unitVector[0] + screenCenterX, direction[1] + 30 * unitVector[1] + screenCenterY];

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
function bindVertices(webGL, randPoints, color) {
    let data = new Float32Array(randPoints);
    let vertexBuffer = webGL.createBuffer();
    webGL.bindBuffer(webGL.ARRAY_BUFFER, vertexBuffer);
    webGL.bufferData(webGL.ARRAY_BUFFER, data, webGL.STATIC_DRAW);

    let a_Position = webGL.getAttribLocation(webGL.program, "a_Position");
    let u_Color = webGL.getUniformLocation(webGL.program, "u_Color");
    let u_pointSize = webGL.getUniformLocation(webGL.program, "u_pointSize");
    webGL.uniform1f(u_pointSize, 5.0);
    webGL.uniform4f(u_Color, color.r,  color.g, color.b, 1.0);

    webGL.vertexAttribPointer(a_Position, 2, webGL.FLOAT, false, 0, 0);
    webGL.enableVertexAttribArray(a_Position);
}

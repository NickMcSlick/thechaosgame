// The Chaos Game
// The Web Devs 3/14/2022

// TO-DO: insert description, major data structures, etc.

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
// Hopefully I can add label information later and keep it here
function Point(x, y) {
    if (!x) {
        this.x = 0;
    } else {
        this.x = x;
    }
    if (!y) {
        this.y = 0;
    } else {
        this.y = y;
    }
}

function main() {
    let canvas;                                     // Canvas element
    let innerGame;                                  // Inner div where the points are drawn
    let webGL;                                      // The drawing context

    let mousePosition = new Point(0, 0);       // Current mouse position
    let points = [];                                // Selected point array
    let generatedPoints = [];                       // Generated points array

    // Get DOM elements
    canvas = document.getElementById("webGL");
    innerGame = document.getElementById("inner_game");

    // Resize canvas
    canvas.width = innerGame.getBoundingClientRect().width;
    canvas.height = innerGame.getBoundingClientRect().height;

    // Get context and initialize the shaders
    webGL = canvas.getContext("webgl");
    initShaders(webGL, VSHADER, FSHADER);

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

        addLabels(points, canvas);

        if (points.length === 3) {
            readjustPoints(points, canvas, 3);
            console.log("adjusting points");
        }

        // Let the context know the sizing of the element may have changed
        webGL.viewport(0, 0, canvas.width, canvas.height);

        // Clear, bind, and draw
        webGL.clear(webGL.COLOR_BUFFER_BIT);
        bindVertices(webGL, outVert);
        webGL.drawArrays(webGL.POINTS, 0, outVert.length / 2);
    }

    // When the user mouses over the canvas, update the mouse position and render
    canvas.onmousemove = function(e) {
        updateMousePosition(e, mousePosition, canvas);
        update();
    }

    // If the user mouses out, put the mouse in an unviewable position and render
    canvas.onmouseout = function () {
        mousePosition = [2, 2];
        update();
    }

    // If the user clicks on the canvas, add a point to the point array
    canvas.onclick = function(e) {
        placePoint(e, mousePosition, points, canvas);
        update();
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
    points.push(new Point(mousePosition.x, mousePosition.y));
}

// Extremely basic label adding
function addLabels(points, canvas) {
    for (let i = 0; i < points.length; i++) {
        let p = document.createElement("p");
        let div = document.getElementById("inner_game");
        let label = document.getElementById("pointLabel" + i);
        let unitPoints = [points[i].x / Math.sqrt(points[i].x * points[i].x + points[i].y * points[i].y), points[i].y / Math.sqrt(points[i].x * points[i].x + points[i].y * points[i].y)];
        let point = [canvas.width * (points[i].x + 0.08 * unitPoints[0] + 1) / 2, canvas.height * (points[i].y + 0.08 * unitPoints[1] - 1) / (-2)];

        if (!label) {
            p.id = "pointLabel" + i;
            p.style.zIndex = i + "";
            p.style.position = "absolute";
            p.style.display = "inline";
            p.style.padding = "0";
            p.style.margin = "0";
            let node = document.createTextNode(String.fromCharCode(i + 65));
            p.appendChild(node);
            p.style.top = div.getBoundingClientRect().top + point[1] + "px";
            p.style.left = div.getBoundingClientRect().left + point[0] + "px";
            div.appendChild(p);
        } else {
            label.style.top = div.getBoundingClientRect().top + point[1] + "px";
            label.style.left = div.getBoundingClientRect().left + point[0] + "px";
        }
    }
}

// Calculate the center and readjust the points accordingly
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
        let xCoord = (points[i].x - sum[0]);
        let yCoord = (points[i].y - sum[1]);
        let unitVector = [xCoord / Math.sqrt(xCoord * xCoord + yCoord * yCoord), yCoord / Math.sqrt(xCoord * xCoord + yCoord * yCoord)]
        let point = [canvas.width * (xCoord + 0.1 * unitVector[0] + sum[0] + 1) / 2, canvas.height * (yCoord + 0.1 * unitVector[1] + sum[1] - 1) / (-2)];
        label.style.top = div.getBoundingClientRect().top + (point[1]) + "px";
        label.style.left = div.getBoundingClientRect().left + (point[0]) + "px";
    }
}

// A function used to bind data to the GPU
function bindVertices(webGL, randPoints) {
    let data = new Float32Array(randPoints);
    let vertexBuffer = webGL.createBuffer();
    webGL.bindBuffer(webGL.ARRAY_BUFFER, vertexBuffer);
    webGL.bufferData(webGL.ARRAY_BUFFER, data, webGL.STATIC_DRAW);

    let a_Position = webGL.getAttribLocation(webGL.program, "a_Position");
    let u_Color = webGL.getUniformLocation(webGL.program, "u_Color");
    let u_pointSize = webGL.getUniformLocation(webGL.program, "u_pointSize");
    webGL.uniform1f(u_pointSize, 5.0);
    webGL.uniform4f(u_Color, 0.0, 0.0, 0.0, 1.0);

    webGL.vertexAttribPointer(a_Position, 2, webGL.FLOAT, false, 0, 0);
    webGL.enableVertexAttribArray(a_Position);
}

var start_message = [
    
    'Hello, Please Start by Making a Selection of Points (Below)! <br/> How Many Points Would You Like To Choose?'
    
]
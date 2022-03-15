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
    this.x = x;
    this.y = y;
}

function main() {
    let canvas;                 // Canvas element
    let innerGame;              // Inner div where the points are drawn
    let webGL;                  // The drawing context

    let mousePosition = [];     // Current mouse position
    let points = [];            // Selected point array
    let generatedPoints = [];   // Generated points array

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
        outVert[0] = mousePosition[0];
        outVert[1] = mousePosition[1];

        // Insert the selected points into the output vertices
        points.forEach(pointObject => {
            outVert.push(pointObject.x);
            outVert.push(pointObject.y);
        });

        // Let the context know the sizing of the element may have changed
        webGL.viewport(0, 0, canvas.width, canvas.height);

        // Clear, bind, and draw
        webGL.clear(webGL.COLOR_BUFFER_BIT);
        bindVertices(webGL, outVert);
        webGL.drawArrays(webGL.POINTS, 0, outVert.length / 2);
    }

    // When the user mouses over the canvas, update the mouse position and render
    canvas.onmousemove = function(e) {
        let rect = e.target.getBoundingClientRect();
        mousePosition = [2 * (e.clientX - rect.left) / canvas.width - 1, - 2 * (e.clientY - rect.top) / canvas.height + 1];
        update();
    }

    // If the user mouses out, put the mouse in an unviewable position and render
    canvas.onmouseout = function () {
        mousePosition = [2, 2];
        update();
    }

    // If the user clicks on the canvas, add a point to the point array
    canvas.onclick = function(e) {
        let rect = e.target.getBoundingClientRect();
        mousePosition = [2 * (e.clientX - rect.left) / canvas.width - 1, - 2 * (e.clientY - rect.top) / canvas.height + 1];
        points.push(new Point(mousePosition[0], mousePosition[1]));
        update();
    }

    // If the window resizes, adjust the rendering context accordingly
    window.onresize = function() {
        canvas.width = innerGame.getBoundingClientRect().width;
        canvas.height = innerGame.getBoundingClientRect().height;
        webGL = canvas.getContext("webgl");
        webGL.viewport(0, 0, canvas.width, canvas.height);
        update();
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
var vertexShaderText =
[
    "precision mediump float;",
    "",
    "attribute vec3 vertPosition;",
    "attribute vec3 vertColor;",
    "varying vec3 fragColor;",
    "uniform mat4 mWorld;",
    "uniform mat4 mView;",
    "uniform mat4 mProj;",
    "",
    "void main()",
    "{",
    "fragColor = vertColor;",
    "gl_Position =  mProj * mView * mWorld * vec4(vertPosition, 1.0);",
    "}"
].join("\n");


var fragmentShaderText =
[   
    "precision mediump float;",
    "",
    "varying vec3 fragColor;",
    "void main()",
    "{",
    "gl_FragColor = vec4(fragColor, 1.0);",
    "}"
].join("\n");

function getGlContext(canvas) {
    let gl = canvas.getContext("webgl");

    if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

	return gl;
}

function createShaderProgram(gl, vertexText, fragmentText) {

	let vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vertexText);
	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, fragmentText);
	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	let program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}

	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

	return program;
}

function createBoxBuffer(gl){
    var boxVertices = 
	[ // X, Y, Z           R, G, B
		// Top
		-3.4, 0.4, -0.0,   1.0, 1.0, 1.0,
		-3.4, 0.4, 0.0,    1.0, 1.0, 1.0,
		3.4, 0.0, 0.0,     1.0, 1.0, 1.0,
		3.4, 0.0, 0.0,    1.0, 1.0, 1.0,

		// Left
		-3.4, 0.4, 0.4,    0.8, 0.8, 0.8,
		-3.4, -0.4, 0.4,   0.8, 0.8, 0.8,
		-3.4, -0.4, -0.4,  0.8, 0.8, 0.8,
		-3.4, 0.4, -0.4,   0.8, 0.8, 0.8,

		// Right
		3.4, 0.0, 0.0,     0.8, 0.8, 0.8,
		3.4, 0.0, 0.0,    0.8, 0.8, 0.8,
		3.4, 0.0, 0.0,   0.8, 0.8, 0.8,
		3.4, 0.0, 0.0,    0.8, 0.8, 0.8,

		// Front
		3.4, 0.0, 0.0,     0.8, 0.8, 0.8,
		3.4, 0.0, 0.0,    0.8, 0.8, 0.8,
		-3.4, -0.4, 0.4,   0.8, 0.8, 0.8,
		-3.4, 0.4, 0.4,    0.8, 0.8, 0.8,

		// Back
		3.4, 0.0, -0.0,    0.8, 0.8, 0.8,
		3.4, 0.0, -0.0,   0.8, 0.8, 0.8,
		-3.4, -0.4, -0.4,  0.8, 0.8, 0.8,
		-3.4, 0.4, -0.4,   0.8, 0.8, 0.8,

		// Bottom
		-3.4, -0.4, -0.4,   0.8, 0.8, 0.8,
		-3.4, -0.4, 0.4,    0.8, 0.8, 0.8,
		3.4, 0.0, 0.0,     0.8, 0.8, 0.8,
		3.4, 0.0, 0.0,    0.8, 0.8, 0.8,
	];

	var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];

    var boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject );
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

    let boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

    return{
        vbo: boxVertexBufferObject,
        ibo: boxIndexBufferObject,
        length: boxIndices.length
    };
}


async function createGripDrawable(gl){
    var drawable = {};

    var vertices = await fetchModel("speer.obj");
    drawable.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, drawable.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    drawable.draw = (gl, program) => {
        gl.useProgram(program);

        let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
		let colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
		gl.bindBuffer(gl.ARRAY_BUFFER, drawable.vbo);
		gl.vertexAttribPointer(
			positionAttribLocation, // Attribute location
			3, // Number of elements per attribute
			gl.FLOAT, // Type of elements
			gl.FALSE,
			8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
			0 // Offset from the beginning of a single vertex to this attribute
		);
		gl.vertexAttribPointer(
			colorAttribLocation, // Attribute location
			3, // Number of elements per attribute
			gl.FLOAT, // Type of elements
			gl.FALSE,
			8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
			5 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
		);
		
        gl.enableVertexAttribArray(positionAttribLocation);
        gl.enableVertexAttribArray(colorAttribLocation);
        gl.drawArrays(gl.TRIANGLES, 0, vertices.length/8);
    }

    return drawable;
}

//Draw Object
function drawObject(gl, program, buffers){

    var positionAtrributeLocation = gl.getAttribLocation(program, "vertPosition");
    var colorAtrributeLocation = gl.getAttribLocation(program, "vertColor");
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vbo);
    gl.vertexAttribPointer(
        positionAtrributeLocation, // location
        3, //number of elem per Attributes
        gl.FLOAT, // Type of Elem
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, // size of individual Vertex
        0 // Offset from beginning of a single vertex to this Attribute
    );

    gl.vertexAttribPointer(
        colorAtrributeLocation, // location
        3, //number of elem per Attributes
        gl.FLOAT, // Type of Elem
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, // size of individual Vertex
        3 * Float32Array.BYTES_PER_ELEMENT // Offset from beginning of a single vertex to this Attribute
    );

    gl.enableVertexAttribArray(positionAtrributeLocation);
    gl.enableVertexAttribArray(colorAtrributeLocation);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.ibo);
	gl.drawElements(gl.TRIANGLES, buffers.length, gl.UNSIGNED_SHORT, 0);
}


async function init() {
    var canvas = document.getElementById("gl-canvas");
    var gl = getGlContext(canvas);
    var program = createShaderProgram(gl, vertexShaderText, fragmentShaderText);
    gl.useProgram(program);

    var paintingBuffer = createBoxBuffer(gl);

    var grip = await createGripDrawable(gl);

	gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
	gl.enable(gl.DEPTH_TEST);

    var matWorldUniformLocation = gl.getUniformLocation(program, "mWorld");
    var matViewUniformLocation = gl.getUniformLocation(program, "mView");
    var matProjUniformLocation = gl.getUniformLocation(program, "mProj");

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    glMatrix.mat4.identity(worldMatrix);
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, 7], [0, 0, 0], [0, 1, 0]);
    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width/canvas.height, 0.1, 1000.0);

    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    function loop(){

        angle = performance.now() / 1000 / 6 *2 * Math.PI;

        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        glMatrix.mat4.identity(worldMatrix);
        glMatrix.mat4.rotate(worldMatrix, worldMatrix, angle, [0, 1, 0]);
        glMatrix.mat4.translate(worldMatrix, worldMatrix, [3.25, 0.0, 0.0]);
        glMatrix.mat4.scale(worldMatrix, worldMatrix, [0.15, 0.15, 0.15]);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        drawObject(gl, program, paintingBuffer);



        glMatrix.mat4.identity(worldMatrix);
        glMatrix.mat4.rotate(worldMatrix, worldMatrix, angle, [0, 1, 0]);
        glMatrix.mat4.scale(worldMatrix, worldMatrix, [0.3, 0.3, 0.3]);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
		grip.draw(gl, program);

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
};

window.onload = init;
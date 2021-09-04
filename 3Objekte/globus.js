var vertexShaderText =
[
    "precision mediump float;",
    "",
    "attribute vec3 vertPosition;",
    "attribute vec4 vertColor;",
    "varying vec4 fragColor;",
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
    "varying vec4 fragColor;",
    "void main()",
    "{",
    "gl_FragColor = fragColor;",
    "}"
].join("\n");

//Context
function getGlContext(canvas){

    var gl = canvas.getContext("webgl");

    if(!gl) {
        console.log("no support");
        gl = canvas.getContext("experimental-webgl");
    }

    if(!gl){
        alert("Your Browser does not support WebGl");
    }

    return gl;
}

//Shader
function createShaderProgram(gl, vertexText, fragmentText){

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexText);
    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        console.error("ERROR compiling vertex shader!", gl.getShaderInfoLog(vertexShader));
        return;
    }

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentText);
    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        console.error("ERROR compiling vertex shader!", gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        console.error("ERROR linking program", gl.getProgramInfoLog(program));
        return;
    }

    gl.validateProgram(program);
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
        console.error("ERROR validating program", gl.getProgramInfoLog(program));
        return;
    }

    return program;
}



//Box Buffer
function createBoxBuffer(gl){
    var boxVertices = 
	[ // X, Y, Z           R, G, B, A
		// Top
		-0.4, 1.0, -0.4,   1.0, 1.0, 1.0, 0.5,
		-0.4, 1.0, 0.4,    1.0, 1.0, 1.0, 0.5,
		0.4, 1.0, 0.4,     1.0, 1.0, 1.0, 0.5,
		0.4, 1.0, -0.4,    1.0, 1.0, 1.0, 0.5,

		// Left
		-0.4, 1.0, 0.4,    0.0, 0.0, 0.8, 0.5,
		-0.4, -1.0, 0.4,   0.0, 0.0, 0.8, 0.5,
		-0.4, -1.0, -0.4,  0.0, 0.0, 0.8, 0.5,
		-0.4, 1.0, -0.4,   0.0, 0.0, 0.8, 0.5,

		// Right
		0.4, 1.0, 0.4,     0.0, 0.0, 0.8, 0.5,
		0.4, -1.0, 0.4,    0.0, 0.0, 0.8, 0.5,
		0.4, -1.0, -0.4,   0.0, 0.0, 0.8, 0.5,
		0.4, 1.0, -0.4,    0.0, 0.0, 0.8, 0.5,

		// Front
		0.4, 1.0, 0.4,     0.0, 0.0, 0.0, 0.5,
		0.4, -1.0, 0.4,    0.0, 0.0, 0.0, 0.5,
		-0.4, -1.0, 0.4,   0.0, 0.0, 0.0, 0.5,
		-0.4, 1.0, 0.4,    0.0, 0.0, 0.0, 0.5,

		// Back
		0.4, 1.0, -0.4,    0.0, 0.0, 0.8, 0.5,
		0.4, -1.0, -0.4,   0.0, 0.0, 0.8, 0.5,
		-0.4, -1.0, -0.4,  0.0, 0.0, 0.8, 0.5,
		-0.4, 1.0, -0.4,   0.0, 0.0, 0.8, 0.5,

		// Bottom
		-0.4, -1.0, -0.4,   0.0, 0.0, 0.0, 0.5,
		-0.4, -1.0, 0.4,    0.0, 0.0, 0.0, 0.5,
		0.4, -1.0, 0.4,     0.0, 0.0, 0.0, 0.5,
		0.4, -1.0, -0.4,    0.0, 0.0, 0.0, 0.5
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

//Draw Planet
async function createPlanetDrawable(gl){
    var drawable = {};

    var vertices = await fetchModel("earth.obj");
    drawable.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, drawable.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    drawable.draw = (gl,program) => {
        gl.useProgram(program);
        var posAtrributeLocation = gl.getAttribLocation(program, "vertPosition");
        var colAtrributeLocation = gl.getAttribLocation(program, "vertColor");
        gl.bindBuffer(gl.ARRAY_BUFFER, drawable.vbo);
        gl.vertexAttribPointer(
            posAtrributeLocation,
            3,
            gl.FLOAT,
            gl.FLASE,
            8 * Float32Array.BYTES_PER_ELEMENT,
            0
        );
        gl.vertexAttribPointer(
            colAtrributeLocation,
            3,
            gl.FLOAT,
            gl.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT,
            5 * Float32Array.BYTES_PER_ELEMENT
        );

        gl.enableVertexAttribArray(posAtrributeLocation);
        gl.enableVertexAttribArray(colAtrributeLocation);
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
        7 * Float32Array.BYTES_PER_ELEMENT, // size of individual Vertex
        0 // Offset from beginning of a single vertex to this Attribute
    );

    gl.vertexAttribPointer(
        colorAtrributeLocation, // location
        4, //number of elem per Attributes
        gl.FLOAT, // Type of Elem
        gl.FALSE,
        7 * Float32Array.BYTES_PER_ELEMENT, // size of individual Vertex
        3 * Float32Array.BYTES_PER_ELEMENT // Offset from beginning of a single vertex to this Attribute
    );

    gl.enableVertexAttribArray(positionAtrributeLocation);
    gl.enableVertexAttribArray(colorAtrributeLocation);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.ibo);
	gl.drawElements(gl.TRIANGLES, buffers.length, gl.UNSIGNED_SHORT, 0);
}

//Init
async function init(){
    var canvas = document.getElementById("gl-canvas");
    var gl = getGlContext(canvas);
    var program = createShaderProgram(gl, vertexShaderText, fragmentShaderText);

    var paintingBuffer = createBoxBuffer(gl);
    var planet = await createPlanetDrawable(gl);

    gl.useProgram(program);

    gl.clearColor(0.75, 0.8, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
    gl.blendEquation(gl.FUNC_ADD, gl.FUNC_ADD);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.DEPTH_TEST);

    var matWorldUniformLocation = gl.getUniformLocation(program, "mWorld");
    var matViewUniformLocation = gl.getUniformLocation(program, "mView");
    var matProjUniformLocation = gl.getUniformLocation(program, "mProj");

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    glMatrix.mat4.identity(worldMatrix);
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, 8], [0, 0, 0], [0, 1, 0]);
    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width/canvas.height, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    drawObject(gl, program, paintingBuffer);

    var identityMatrix = new Float32Array(16);
    glMatrix.mat4.identity(identityMatrix);
    
    glMatrix.mat4.translate(worldMatrix, identityMatrix, [0.0, -1.0, 0.0]);
    glMatrix.mat4.scale(worldMatrix, worldMatrix, [2, 0.3, 2]);
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    drawObject(gl, program, paintingBuffer);

    //render loop
    var angle = 0;

    var loop = function(){
        angle = performance.now() / 1000 / 6 *2 * Math.PI;

        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        gl.depthMask(false);
        gl.enable(gl.BLEND);

        glMatrix.mat4.identity(worldMatrix);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        drawObject(gl, program, paintingBuffer);

        glMatrix.mat4.identity(worldMatrix);
        glMatrix.mat4.translate(worldMatrix, worldMatrix, [0.0, -1., 0.0]);
        glMatrix.mat4.scale(worldMatrix, worldMatrix, [2, 0.3, 2]);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        drawObject(gl, program, paintingBuffer);

        gl.depthMask(true);
        gl.disable(gl.BLEND);

        glMatrix.mat4.identity(worldMatrix);
        glMatrix.mat4.translate(worldMatrix, worldMatrix, [0.0, 1.8, 0.0]);
        glMatrix.mat4.rotate(worldMatrix, worldMatrix, angle, [0, -1, 0]);
        glMatrix.mat4.scale(worldMatrix, worldMatrix, [0.5, 0.5, 0.5]);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        planet.draw(gl, program);

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
};

window.onload = init;
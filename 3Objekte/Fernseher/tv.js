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
async function createShaderProgram(gl, vertexText, fragmentText){
    var vertexShaderRepsonse = await fetch(vertexText);
    var vertexShaderText = await vertexShaderRepsonse.text();
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        console.error("ERROR compiling vertex shader!", gl.getShaderInfoLog(vertexShader));
        return;
    }

    var fragmentShaderResponse = await fetch(fragmentText);
	var fragmentShaderText = await fragmentShaderResponse.text();
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderText);
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

function rahmenBuffer(gl){

    var rahmenVertices = 
	[ // X, Y, Z           S, T
		// Top
		-0.6, 1.0, -0.1,   0, 0,
		-0.6, 1.0, 0.1,    0, 0,
		0.6, 1.0, 0.1,     0, 0,
		0.6, 1.0, -0.1,    0, 0,

		// Left
		-0.6, 1.0, 0.1,    0, 0,
		-0.6, -1.0, 0.1,   0, 0, 
		-0.6, -1.0, -0.1,  0, 0,
		-0.6, 1.0, -0.1,   0, 0,

		// Right
		0.6, 1.0, 0.1,     0, 0,
		0.6, -1.0, 0.1,    0, 0,
		0.6, -1.0, -0.1,   0, 0,
		0.6, 1.0, -0.1,    0, 0,

		// Front
		0.6, 1.0, 0.1,     0, 0,
		0.6, -1.0, 0.1,    0, 0,
		-0.6, -1.0, 0.1,   0, 0,
		-0.6, 1.0, 0.1,    0, 0,

		// Back
		0.6, 1.0, -0.1,    0, 0,
		0.6, -1.0, -0.1,   0, 0,
		-0.6, -1.0, -0.1,  0, 0,
		-0.6, 1.0, -0.1,   0, 0,

		// Bottom
		-0.6, -1.0, -0.1,  0, 0,
		-0.6, -1.0, 0.1,   0, 0,
		0.6, -1.0, 0.1,    0, 0,
		0.6, -1.0, -0.1,   0, 0
	];

	var rahmenIndices =
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

    var rahmenVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, rahmenVertexBufferObject );
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rahmenVertices), gl.STATIC_DRAW);

    var rahmenIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rahmenIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(rahmenIndices), gl.STATIC_DRAW);

    return{
        vbo: rahmenVertexBufferObject,
        ibo:rahmenIndexBufferObject,
        length: rahmenIndices.length
    };
}


function drawObj(gl, program, buffers){
    var positionAtrributeLocation = gl.getAttribLocation(program, "vertPosition");
    var textureAtrributeLocation = gl.getAttribLocation(program, "vertTexCoord");
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vbo);
    gl.vertexAttribPointer(
        positionAtrributeLocation, // location
        3, //number of elem per Attributes
        gl.FLOAT, // Type of Elem
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // size of individual Vertex
        0 // Offset from beginning of a single vertex to this Attribute
    );

    gl.vertexAttribPointer(
        textureAtrributeLocation, // location
        2, //number of elem per Attributes
        gl.FLOAT, // Type of Elem
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // size of individual Vertex
        3 * Float32Array.BYTES_PER_ELEMENT // Offset from beginning of a single vertex to this Attribute
    );

    gl.enableVertexAttribArray(positionAtrributeLocation);
    gl.enableVertexAttribArray(textureAtrributeLocation);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.ibo);
	gl.drawElements(gl.TRIANGLES, buffers.length, gl.UNSIGNED_SHORT, 0);
}

//Buffer
function createPaintingBuffer(gl){

    var box ={};

    var paintingVertices = 
	[ // X, Y, Z           S, T
		// Top
		-0.6, 1.0, -0.1,   0, 0,
		-0.6, 1.0, 0.1,    0, 0,
		0.6, 1.0, 0.1,     0, 0,
		0.6, 1.0, -0.1,    0, 0,

		// Left
		-0.6, 1.0, 0.1,    0, 0,
		-0.6, -1.0, 0.1,   0, 0,
		-0.6, -1.0, -0.1,  0, 0,
		-0.6, 1.0, -0.1,   0, 0,

		// Right
		0.6, 1.0, 0.1,     0, 0,
		0.6, -1.0, 0.1,    0, 0,
		0.6, -1.0, -0.1,   0, 0,
		0.6, 1.0, -0.1,    0, 0,

		// Front
		0.6, 1.0, 0.1,     1, 1,
		0.6, -1.0, 0.1,    1, 0,
		-0.6, -1.0, 0.1,   0, 0,
		-0.6, 1.0, 0.1,    0, 1,

		// Back
		0.6, 1.0, -0.1,    0, 0,
		0.6, -1.0, -0.1,   0, 0,
		-0.6, -1.0, -0.1,  0, 0,
		-0.6, 1.0, -0.1,   0, 0,

		// Bottom
		-0.6, -1.0, -0.1,   0, 0,
		-0.6, -1.0, 0.1,    0, 0,
		0.6, -1.0, 0.1,     0, 0,
		0.6, -1.0, -0.1,    0, 0
	];

	var paintingIndices =
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

    box.paintingVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, box.paintingVertexBufferObject );
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(paintingVertices), gl.STATIC_DRAW);

    box.paintingIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, box.paintingIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(paintingIndices), gl.STATIC_DRAW);

    //Create Texture
    box.boxtexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, box.boxtexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);

    //Draw Object
    box.drawObject = function(gl, program) {

    gl.bindBuffer(gl.ARRAY_BUFFER, this.paintingVertexBufferObject);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.paintingIndexBufferObject);

    var positionAtrributeLocation = gl.getAttribLocation(program, "vertPosition");
    var texAttributeLocation = gl.getAttribLocation(program, "vertTexCoord");
    gl.vertexAttribPointer(
        positionAtrributeLocation, // location
        3, //number of elem per Attributes
        gl.FLOAT, // Type of Elem
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // size of individual Vertex
        0 // Offset from beginning of a single vertex to this Attribute
    );

    gl.vertexAttribPointer(
        texAttributeLocation, // location
        2, //number of elem per Attributes
        gl.FLOAT, // Type of Elem
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // size of individual Vertex
        3 * Float32Array.BYTES_PER_ELEMENT // Offset from beginning of a single vertex to this Attribute
    );

    gl.enableVertexAttribArray(positionAtrributeLocation);
    gl.enableVertexAttribArray(texAttributeLocation);
   
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, box.boxtexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById("video-texture"));
    const samplerUniformLocation = gl.getUniformLocation(program, 'sPic');
	gl.uniform1i(samplerUniformLocation, 0);

	gl.drawElements(gl.TRIANGLES, paintingIndices.length, gl.UNSIGNED_SHORT, 0);

    gl.disableVertexAttribArray(positionAtrributeLocation);
    gl.disableVertexAttribArray(texAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    }
    return box;
}

async function init(){
    var canvas = document.getElementById("gl-canvas");
    var gl = getGlContext(canvas);

    var program = await createShaderProgram(gl, "tv_vert.glsl", "tv_frag.glsl");

    gl.useProgram(program);

    var rahmen = rahmenBuffer(gl);
    var box = createPaintingBuffer(gl);

    gl.clearColor(0.75, 0.8, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
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

    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    box.drawObject(gl, program);

    //render loop
    var identityMatrix = new Float32Array(16);
    glMatrix.mat4.identity(identityMatrix);
    var angle = 0;
    var loop = function(){

        angle = performance.now() / 1000 / 6 *2 * Math.PI;

        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        glMatrix.mat4.identity(worldMatrix);
        //glMatrix.mat4.rotate(worldMatrix, worldMatrix, angle, [0, 1, 0]);
        glMatrix.mat4.scale(worldMatrix, worldMatrix, [2.0, 0.8, 1]);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        box.drawObject(gl, program);

        glMatrix.mat4.identity(worldMatrix);
        glMatrix.mat4.translate(worldMatrix, worldMatrix, [0.0, 0.8, 0.1]);
        //glMatrix.mat4.rotate(worldMatrix, worldMatrix, angle, [0, 1, 0]);
        glMatrix.mat4.scale(worldMatrix, worldMatrix, [2.0, 0.1, 1]);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        drawObj(gl, program, rahmen);

        glMatrix.mat4.identity(worldMatrix);
        glMatrix.mat4.translate(worldMatrix, worldMatrix, [0.0, -0.8, 0.1]);
        //glMatrix.mat4.rotate(worldMatrix, worldMatrix, angle, [0, 1, 0]);
        glMatrix.mat4.scale(worldMatrix, worldMatrix, [2.0, 0.1, 1]);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        drawObj(gl, program, rahmen);

        glMatrix.mat4.identity(worldMatrix);
        glMatrix.mat4.translate(worldMatrix, worldMatrix, [1.2, 0.0, 0.1]);
        //glMatrix.mat4.rotate(worldMatrix, worldMatrix, angle, [0, 1, 0]);
        glMatrix.mat4.scale(worldMatrix, worldMatrix, [0.1, 0.9, 1]);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        drawObj(gl, program, rahmen);

        glMatrix.mat4.identity(worldMatrix);
        glMatrix.mat4.translate(worldMatrix, worldMatrix, [-1.2, 0.0, 0.1]);
        //glMatrix.mat4.rotate(worldMatrix, worldMatrix, angle, [0, 1, 0]);
        glMatrix.mat4.scale(worldMatrix, worldMatrix, [0.1, 0.9, 1]);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        drawObj(gl, program, rahmen);

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
};

window.onload = init;
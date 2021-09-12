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

    var vertexShaderResponse = await fetch(vertexText);
	var vertexShaderText = await vertexShaderResponse.text();
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
    gl.bindTexture(gl.TEXTURE_2D, box.boxtexture);
    gl.activeTexture(gl.TEXTURE0);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById("mona-png"));
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

            gl.bindTexture(gl.TEXTURE_2D, box.boxtexture);
        gl.activeTexture(gl.TEXTURE0);

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
    var program = await createShaderProgram(gl, "canvas_vert.glsl", "canvas_frag.glsl");
    var box = createPaintingBuffer(gl);

    gl.useProgram(program);

    const fogColor = [0.85, 0.85, 0.85];
    gl.clearColor(fogColor[0], fogColor[1], fogColor[2], 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
    gl.enable(gl.DEPTH_TEST);

    const settings = {
        fogNear: 4,
        fogFar: 10
    };

    const fogColorUniformLocation = gl.getUniformLocation(program, 'fogColor');
    gl.uniform3fv(fogColorUniformLocation, fogColor);

    const fogNearUniformLocation = gl.getUniformLocation(program, "fogNear");
    gl.uniform1f(fogNearUniformLocation, settings.fogNear);

    const fogFarUniformLocation = gl.getUniformLocation(program, "fogFar");
    gl.uniform1f(fogFarUniformLocation, settings.fogFar);

    var matWorldUniformLocation = gl.getUniformLocation(program, "mWorld");
    var matViewUniformLocation = gl.getUniformLocation(program, "mView");
    var matProjUniformLocation = gl.getUniformLocation(program, "mProj");

    var worldMatrix = getEinheitsMatrix4();
    var viewMatrix = getEinheitsMatrix4();
    var projMatrix = getEinheitsMatrix4();
    

    projMatrix= perspective(projMatrix,45,canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);


	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    //render loop
    var angle = 360;
    var loop = function(){
        angle = performance.now() / 1000 / 6 * 360;
    
        const cameraTransX = document.querySelector('#cameraTransX').value;
        document.querySelector('#cameraTransXValue').innerHTML = cameraTransX;
        const cameraTransY = document.querySelector('#cameraTransY').value;
        document.querySelector('#cameraTransYValue').innerHTML = cameraTransY;
        const cameraTransZ = document.querySelector('#cameraTransZ').value;
        document.querySelector('#cameraTransZValue').innerHTML = cameraTransZ;

        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        viewMatrix = look(viewMatrix, [cameraTransX, cameraTransY, cameraTransZ], [0, 0, 0], [0, 1, 0]);
        gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);


        worldMatrix = getEinheitsMatrix4();
        worldMatrix = rotate(worldMatrix, angle, [0, 1, 0]);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        box.drawObject(gl, program);
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
}

window.onload = init;
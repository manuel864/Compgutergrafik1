//context
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

//create Shader
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


//create spear head Buffer
function createSpeerHeadBuffer(gl){

    var headVertices = 
	[ // X, Y, Z           	S, T 		Normalen			R, G, B, A
		// Top
		-3.4, 0.4, -0.0,   	0, 0,		0.0,0.0,0.0,		1.0, 1.0, 1.0, 1.0,
		-3.4, 0.4, 0.0,    	0, 0,		0.0,0.0,0.0,		1.0, 1.0, 1.0, 1.0,
		3.4, 0.0, 0.0,     	0, 0,		0.0,0.0,0.0,		1.0, 1.0, 1.0, 1.0,
		3.4, 0.0, 0.0,    	0, 0,		0.0,0.0,0.0,		1.0, 1.0, 1.0, 1.0,

		// Left
		-3.4, 0.4, 0.4,    	0, 0,		0.0,0.0,0.0,		0.8, 0.8, 0.8, 1.0,
		-3.4, -0.4, 0.4,  	0, 0,		0.0,0.0,0.0,		0.8, 0.8, 0.8, 1.0, 
		-3.4, -0.4, -0.4,  	0, 0,		0.0,0.0,0.0,		0.8, 0.8, 0.8, 1.0,
		-3.4, 0.4, -0.4,   	0, 0,		0.0,0.0,0.0,		0.8, 0.8, 0.8, 1.0,

		// Right
		3.4, 0.0, 0.0,     	0, 0,		0.0,0.0,0.0,		0.8, 0.8, 0.8, 1.0,
		3.4, 0.0, 0.0,     	0, 0,		0.0,0.0,0.0,		0.8, 0.8, 0.8, 1.0,
		3.4, 0.0, 0.0,     	0, 0,		0.0,0.0,0.0,		0.8, 0.8, 0.8, 1.0,
		3.4, 0.0, 0.0,     	0, 0,		0.0,0.0,0.0,		0.8, 0.8, 0.8, 1.0,

		// Front
		3.4, 0.0, 0.0,     	0, 0,		0.0,0.0,0.0,		0.8, 0.8, 0.8, 1.0,
		3.4, 0.0, 0.0,     	0, 0,		0.0,0.0,0.0,		0.8, 0.8, 0.8, 1.0,
		-3.4, -0.4, 0.4,   	0, 0,		0.0,0.0,0.0,		0.8, 0.8, 0.8, 1.0,
		-3.4, 0.4, 0.4,    	0, 0,		0.0,0.0,0.0,		0.8, 0.8, 0.8, 1.0,

		// Back
		3.4, 0.0, -0.0,    	0, 0,		0.0,0.0,0.0,		0.8, 0.8, 0.8, 1.0,
		3.4, 0.0, -0.0,    	0, 0,		0.0,0.0,0.0,		0.8, 0.8, 0.8, 1.0,
		-3.4, -0.4, -0.4,  	0, 0,		0.0,0.0,0.0,		0.8, 0.8, 0.8, 1.0,
		-3.4, 0.4, -0.4,   	0, 0,		0.0,0.0,0.0,		0.8, 0.8, 0.8, 1.0,

		// Bottom
		-3.4, -0.4, -0.4,  	0, 0,		0.0,0.0,0.0,		0.8, 0.8, 0.8, 1.0,
		-3.4, -0.4, 0.4,   	0, 0,		0.0,0.0,0.0,		0.8, 0.8, 0.8, 1.0,
		3.4, 0.0, 0.0,     	0, 0,		0.0,0.0,0.0,		0.8, 0.8, 0.8, 1.0,
		3.4, 0.0, 0.0,     	0, 0,		0.0,0.0,0.0,		0.8, 0.8, 0.8, 1.0,
	];

	var headIndices =
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

    var headVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, headVertexBufferObject );
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(headVertices), gl.STATIC_DRAW);

    var headIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, headIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(headIndices), gl.STATIC_DRAW);

    return{
        vbo: headVertexBufferObject,
        ibo: headIndexBufferObject,
        length: headIndices.length
    };
}


//Grip drawable
async function createGripDrawable(gl){
    var drawable = {};

    var vertices = await fetchModel("speer.obj");
    drawable.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, drawable.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


    drawable.draw = (gl, program) => {
        gl.useProgram(program);

        let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
		let normalAtrributeLocation = gl.getAttribLocation(program, 'vertNormal');
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
			normalAtrributeLocation, // Attribute location
			3, // Number of elements per attribute
			gl.FLOAT, // Type of elements
			gl.FALSE,
			8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
			5 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
		);
		
        gl.enableVertexAttribArray(positionAttribLocation);
        gl.enableVertexAttribArray(normalAtrributeLocation);

        gl.drawArrays(gl.TRIANGLES, 0, vertices.length/8);
    }
    return drawable;
}


//Draw spear head
function drawObject(gl, program, buffers){

    var positionAtrributeLocation = gl.getAttribLocation(program, "vertPosition");
    var normalAtrributeLocation = gl.getAttribLocation(program, "vertNormal");
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
        normalAtrributeLocation, // location
        3, //number of elem per Attributes
        gl.FLOAT, // Type of Elem
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, // size of individual Vertex
        5 * Float32Array.BYTES_PER_ELEMENT // Offset from beginning of a single vertex to this Attribute
    );

    gl.enableVertexAttribArray(positionAtrributeLocation);
    gl.enableVertexAttribArray(normalAtrributeLocation);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.ibo);
	gl.drawElements(gl.TRIANGLES, buffers.length, gl.UNSIGNED_SHORT, 0);
}


//init
async function init() {
    var canvas = document.getElementById("gl-canvas");
    var gl = getGlContext(canvas);
    var program = await createShaderProgram(gl, "spear_vert.glsl", "spear_frag.glsl");
    gl.useProgram(program);

    var headBuffer = createSpeerHeadBuffer(gl);

    var grip = await createGripDrawable(gl);

	gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
	gl.enable(gl.DEPTH_TEST);

	var material = {
		 baseColor: [0.2, 0.4, 0.65, 1.0],
		 shini: 30.0, 
		 spec: 1.0, 
		 ambient: [0.05,0.05,0.2]
	};

	var pointLight1 = {
		Pos: [0.0, -7.5, 0.0], 
		Color: [0.0, 0.0, 0.5], 
		SpecColor: [1.0, 1.0, 1.0]
	}

	var pointLight2 = {
		Pos: [0.0, 10.0, 0.0], 
		Color: [0.6, 0.0, 0.], 
		SpecColor: [1.0, 0.0, 0.0]
	}


	    //Material setUp
		let baseColorLocation = gl.getUniformLocation(program, 'mat.color');
		let specLocation = gl.getUniformLocation(program, 'mat.spec')
		let shininessLocation = gl.getUniformLocation(program, 'mat.shininess');
		let ambientLocation = gl.getUniformLocation(program, 'mat.ambient');
		gl.uniform4fv(baseColorLocation, material.baseColor );
		gl.uniform1f(specLocation, material.spec);
		gl.uniform1f(shininessLocation, material.shini);
		gl.uniform1f(ambientLocation, material.ambient);
	
	
		//Erste Lampe
		let lightColorLocation1 = gl.getUniformLocation(program, 'pointLight1.lightColor');
		let lightPosLocation1 = gl.getUniformLocation(program, 'pointLight1.position')
		let specColorLocation1 = gl.getUniformLocation(program, 'pointLight1.specColor');
		gl.uniform3fv(lightPosLocation1,pointLight1.Pos);
		gl.uniform3fv(lightColorLocation1, pointLight1.Color);
		gl.uniform3fv(specColorLocation1, pointLight1.SpecColor);
	
		//Zweite Lampe
		let lightColorLocation2 = gl.getUniformLocation(program, 'pointLight2.lightColor');
		let lightPosLocation2 = gl.getUniformLocation(program, 'pointLight2.position')
		let specColorLocation2 = gl.getUniformLocation(program, 'pointLight2.specColor');
		gl.uniform3fv(lightPosLocation2,pointLight2.Pos );
		gl.uniform3fv(lightColorLocation2, pointLight2.Color);
		gl.uniform3fv(specColorLocation2, pointLight2.SpecColor);

    var matWorldUniformLocation = gl.getUniformLocation(program, "mWorld");
    var matViewUniformLocation = gl.getUniformLocation(program, "mView");
    var matProjUniformLocation = gl.getUniformLocation(program, "mProj");
	var viewWorldPositionLocation = gl.getUniformLocation(program, "eyePosition");

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    glMatrix.mat4.identity(worldMatrix);
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, 8], [0, 0, 0], [0, 1, 0]);
    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width/canvas.height, 0.1, 1000.0);
	gl.uniform3fv(viewWorldPositionLocation, [0, 0, 8]);
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
        drawObject(gl, program, headBuffer);



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
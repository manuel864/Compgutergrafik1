function getPaintVerts(){
    var paintingVertices = 
	[ // X, Y, Z           S, T         Normal              Color        #Normal und Color hinzugefügt
		// Top
		[-0.6, 1.0, -0.1,   0, 0,    0.0,0.0,0.0,       0.0,0.0,0.0,1.0], 
		[-0.6, 1.0, 0.1,    0, 0,    0.0,0.0,0.0,       0.0,0.0,0.0,1.0],
		[0.6, 1.0, 0.1,     0, 0,    0.0,0.0,0.0,       0.0,0.0,0.0,1.0],
		[0.6, 1.0, -0.1,    0, 0,    0.0,0.0,0.0,       0.0,0.0,0.0,1.0],

		// Left
		[-0.6, 1.0, 0.1,    0, 0,    0.0,0.0,0.0,       0.0,0.0,0.0,1.0],
		[-0.6, -1.0, 0.1,   0, 0,    0.0,0.0,0.0,       0.0,0.0,0.0,1.0],
		[-0.6, -1.0, -0.1,  0, 0,    0.0,0.0,0.0,       0.0,0.0,0.0,1.0],
		[-0.6, 1.0, -0.1,   0, 0,    0.0,0.0,0.0,       0.0,0.0,0.0,1.0],

		// Right
		[0.6, 1.0, 0.1,     0, 0,    0.0,0.0,0.0,       0.0,0.0,0.0,1.0],
		[0.6, -1.0, 0.1,    0, 0,    0.0,0.0,0.0,       0.0,0.0,0.0,1.0],
		[0.6, -1.0, -0.1,   0, 0,    0.0,0.0,0.0,       0.0,0.0,0.0,1.0],
		[0.6, 1.0, -0.1,    0, 0,   0.0,0.0,0.0,       0.0,0.0,0.0,1.0],

		// Front
		[0.6, 1.0, 0.1,     1, 1,    0.0,0.0,0.0,       0.0,0.0,0.0,1.0],
		[0.6, -1.0, 0.1,    1, 0,    0.0,0.0,0.0,       0.0,0.0,0.0,1.0],
		[-0.6, -1.0, 0.1,   0, 0,    0.0,0.0,0.0,       0.0,0.0,0.0,1.0],
		[-0.6, 1.0, 0.1,    0, 1,    0.0,0.0,0.0,       0.0,0.0,0.0,1.0],

		// Back
		[0.6, 1.0, -0.1,    0, 0,    0.0,0.0,0.0,       0.0,0.0,0.0,1.0],
		[0.6, -1.0, -0.1,   0, 0,    0.0,0.0,0.0,       0.0,0.0,0.0,1.0],
		[-0.6, -1.0, -0.1,  0, 0,    0.0,0.0,0.0,       0.0,0.0,0.0,1.0],
		[-0.6, 1.0, -0.1,   0, 0,    0.0,0.0,0.0,       0.0,0.0,0.0,1.0],

		// Bottom
		[-0.6, -1.0, -0.1,   0, 0,   0.0,0.0,0.0,       0.0,0.0,0.0,1.0],
		[-0.6, -1.0, 0.1,    0, 0,   0.0,0.0,0.0,       0.0,0.0,0.0,1.0],
		[0.6, -1.0, 0.1,     0, 0,   0.0,0.0,0.0,       0.0,0.0,0.0,1.0],
		[0.6, -1.0, -0.1,    0, 0,  0.0,0.0,0.0,       0.0,0.0,0.0,1.0]
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
    let tris = [];
    for (i of paintingIndices){
        
        tris.push(paintingVertices[i])
    }
    //flatten array
    let verts = [].concat.apply([], tris);
    return verts;
}

function getPaintBuffer(gl){
    
    let paintingVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, paintingVertexBufferObject );
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(paintingVertices), gl.STATIC_DRAW);

    box.paintingIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, paintingIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(paintingIndices), gl.STATIC_DRAW);

    //Create Texture
    boxtexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, boxtexture);
    gl.activeTexture(gl.TEXTURE0);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById("mona-png"));
    gl.bindTexture(gl.TEXTURE_2D, null);

    }

class Scene{
    constructor(){
    this.lights = [];
    this.objects = [];
    }
    addObject(obj){
        this.objects.push(obj);
    }
    addLight(light){
        this.lights.push(light);
    }
    test(){
        return"halllo";
    }
}

class Material{
    constructor(baseColor,shininess,spec,ambient){
        this.baseColor = baseColor; //vec4
        this.shininess = shininess; //float
        this.spec = spec; //float
        this.ambient = ambient; //vec3
    }
}


class Light{
    constructor(pos, color, specColor){
    this.position = pos;//pos vec3
    this.color = color;//color vec3
    this.specColor = specColor; //vec3
    }
}

class Object{
    constructor(gl,verts,vertShaderLoc,fragShaderLoc,isTextured,textureLoc=""){
        this.verts = verts;
        this.buffer = null;
        this.gl = gl;
        this.program = null;
        this.vertShaderLoc = vertShaderLoc;
        this.fragShaderLoc = fragShaderLoc;
        this.material = null;
        this.isTextured = isTextured;
        this.texture = null;
        this.textureLoc = textureLoc;
    }
    async createProgram(gl){
        let vertexShader = gl.createShader(gl.VERTEX_SHADER);
        let vertexShaderResponse = await fetch(this.vertShaderLoc);
	    let vertexShaderText = await vertexShaderResponse.text();
        gl.shaderSource(vertexShader,vertexShaderText);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
            return;
        }
    
        let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        let fragShaderResponse = await fetch(this.fragShaderLoc);
	    let fragShaderText = await fragShaderResponse.text();
        gl.shaderSource(fragShader,fragShaderText);
        gl.compileShader(fragShader);
        if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
            console.error('ERROR compiling frag shader!', gl.getShaderInfoLog(fragShader));
            return;
        }
    
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragShader);
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
        console.log(program);
        this.program = program;
        return program;
    }
    draw(gl){
        gl.enable(gl.DEPTH_TEST);
        if(!this.isTextured){
        
            gl.useProgram(this.program);
            this.buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.verts),gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            let positionAttribLocation = gl.getAttribLocation(this.program, 'vertPosition');
            gl.vertexAttribPointer(
                positionAttribLocation,
                3,
                gl.FLOAT,
                gl.FALSE,
                12 * Float32Array.BYTES_PER_ELEMENT,
                0 * Float32Array.BYTES_PER_ELEMENT
            );
            gl.enableVertexAttribArray(positionAttribLocation);
        
            const normalAttribLocation = gl.getAttribLocation(this.program, 'vertNormal');
            gl.vertexAttribPointer(
                normalAttribLocation, // Attribute location
                3, // Number of elements per attribute
                gl.FLOAT, // Type of elements
                gl.FALSE,
                12 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
                5 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
            );
            
            gl.enableVertexAttribArray(normalAttribLocation);
            gl.drawArrays(gl.TRIANGLES, 0, this.verts.length/12);
            gl.disableVertexAttribArray(positionAttribLocation);
            gl.disableVertexAttribArray(normalAttribLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
        else{

            this.buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer );
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verts), gl.STATIC_DRAW);


            //Create Texture
            this.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.activeTexture(gl.TEXTURE0);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById(this.textureLoc));
            gl.bindTexture(gl.TEXTURE_2D, null);

            //Draw Object
            

            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

            var positionAtrributeLocation = gl.getAttribLocation(this.program, "vertPosition");
            var texAttributeLocation = gl.getAttribLocation(this.program, "vertTexCoord");
            gl.vertexAttribPointer(
                positionAtrributeLocation, // location
                3, //number of elem per Attributes
                gl.FLOAT, // Type of Elem
                gl.FALSE,
                12 * Float32Array.BYTES_PER_ELEMENT, // size of individual Vertex
                0 // Offset from beginning of a single vertex to this Attribute
            );

            gl.vertexAttribPointer(
                texAttributeLocation, // location
                2, //number of elem per Attributes
                gl.FLOAT, // Type of Elem
                gl.FALSE,
                12 * Float32Array.BYTES_PER_ELEMENT, // size of individual Vertex
                3 * Float32Array.BYTES_PER_ELEMENT // Offset from beginning of a single vertex to this Attribute
            );

            gl.enableVertexAttribArray(positionAtrributeLocation);
            gl.enableVertexAttribArray(texAttributeLocation);

            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.activeTexture(gl.TEXTURE0);


            gl.drawArrays(gl.TRIANGLES, 0, this.verts.length/12);
            gl.disableVertexAttribArray(positionAtrributeLocation);
            gl.disableVertexAttribArray(texAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            gl.bindTexture(gl.TEXTURE_2D, null);
    
        }
    }
}
    





function getGlContext(){
    let canvas = document.getElementById("canvas");
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

async function getObjData(gl){
    /*let verts = [
        0.0,  0.5,  Math.random(), Math.random(), Math.random(),
        -0.5, -0.5,  Math.random(), Math.random(), Math.random(),
         0.5, -0.5,  Math.random(), Math.random(), Math.random(),
         0.1, -0.7,  Math.random(), Math.random(), Math.random(),
         0.2, -0.8,  Math.random(), Math.random(), Math.random()
    ];*/
    let verts= await fetchModel('monkey.obj');
    return verts;
}

function createProgramm(gl,vertsShaderText,fragShaderText){
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,vertsShaderText);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

    let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader,fragShaderText);
    gl.compileShader(fragShader);
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling frag shader!', gl.getShaderInfoLog(fragShader));
		return;
	}

    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragShader);
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

function draw(gl,scene){
    for(obj of scene.objects){
        obj.draw(gl);
    }
  
    
}

async function init(){
    let scene = new Scene();
    let gl =getGlContext();
    let data = await getObjData(gl);
    let dataBild = getPaintVerts();

    //                      Buffer       n      program
    let monkey = new Object(gl,data,'phongVertsShaderText.glsl','phongFragShaderText.glsl',false);
    await monkey.createProgram(gl);
    let monkey2 = new Object(gl,data,'phongVertsShaderText.glsl','phongFragShaderText.glsl',false);
    await monkey2.createProgram(gl);
    let bild = new Object(gl,dataBild,'canvas_vert.glsl','canvas_frag.glsl',true,'mona-png');
    await bild.createProgram(gl);
    //                                BaseColor        shini   spec      ambient
    monkey.material= new Material([0.2, 0.4, 0.65, 1.0], 30.0, 1.0, [0.05,0.05,0.2]);
    monkey2.material= new Material([0.2, 0.4, 0.65, 1.0], 30.0, 1.0, [0.05,0.05,0.2]);
    scene.addObject(monkey);
    
    scene.addObject(bild);


    //                                Pos               Color         Spec Color       
    let pointLight1 = new Light([0.0, -7.5, 0.0], [0.0, 0.0, 0.5], [1.0, 1.0, 1.0] );
    let pointLight2 = new Light([0.0, 10.0, 0.0], [0.6, 0.0, 0.0], [1.0, 0.0, 0.0] );
    for(obj of scene.objects){
        console.log(obj)
        //Setting Uniforms for each program
        //BG Color
        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        
        gl.useProgram(obj.program);

        if(!obj.isTextured){
            //Material setUp
            var baseColorLocation = gl.getUniformLocation(obj.program, 'mat.color');
            var specLocation = gl.getUniformLocation(obj.program, 'mat.spec')
            var shininessLocation = gl.getUniformLocation(obj.program, 'mat.shininess');
            var ambientLocation = gl.getUniformLocation(obj.program, 'mat.ambient');
            gl.uniform4fv(baseColorLocation, obj.material.baseColor );
            gl.uniform1f(specLocation, obj.material.spec);
            gl.uniform1f(shininessLocation, obj.material.shininess);
            gl.uniform3fv(ambientLocation, obj.material.ambient);

            //Erste Lampe
            var lightColorLocation1 = gl.getUniformLocation(obj.program, 'pointLight1.lightColor');
            var lightPosLocation1 = gl.getUniformLocation(obj.program, 'pointLight1.position')
            var specColorLocation1 = gl.getUniformLocation(obj.program, 'pointLight1.specColor');
            gl.uniform3fv(lightPosLocation1,pointLight1.position );
            gl.uniform3fv(lightColorLocation1, pointLight1.color);
            gl.uniform3fv(specColorLocation1, pointLight1.specColor);

            //Zweite Lampe
            var lightColorLocation2 = gl.getUniformLocation(obj.program, 'pointLight2.lightColor');
            var lightPosLocation2 = gl.getUniformLocation(obj.program, 'pointLight2.position')
            var specColorLocation2 = gl.getUniformLocation(obj.program, 'pointLight2.specColor');
            gl.uniform3fv(lightPosLocation2,pointLight2.position );
            gl.uniform3fv(lightColorLocation2, pointLight2.color);
            gl.uniform3fv(specColorLocation2, pointLight2.specColor);
            var viewWorldPositionLocation = gl.getUniformLocation(obj.program, "eyePosition");
            gl.uniform3fv(viewWorldPositionLocation, [0, 0, 8]);

        }
    }
    let angle = 360;
    var loop = function(){
        angle = performance.now()/1000/6*360;
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        for(obj of scene.objects){
            gl.useProgram(obj.program)
            var matWorldUniformLocation = gl.getUniformLocation(obj.program, 'mWorld');
            var matViewUniformLocation = gl.getUniformLocation(obj.program, 'mView');
            var matProjUniformLocation = gl.getUniformLocation(obj.program, 'mProj');
            
            var worldMatrix =getEinheitsMatrix4();
            var viewMatrix = getEinheitsMatrix4();
            var projMatrix = getEinheitsMatrix4();

            viewMatrix = look(viewMatrix, [0, 0, 8], [0, 0, 0], [0, 1, 0]);
            projMatrix=perspective(projMatrix,45,canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);
            gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
            gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

            gl.clearColor(0.75, 0.85, 0.8, 1.0);
            worldMatrix = getEinheitsMatrix4();
            worldMatrix = rotate(worldMatrix,angle, [0, 1, 0]);
            worldMatrix = rotate(worldMatrix, angle / 4, [1, 0, 0]);

        

        
            gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
            obj.draw(gl)
        //draw(gl, program, objBuffer,n);
        //draw(gl,scene);
        }
        
        requestAnimationFrame(loop); }
    requestAnimationFrame(loop)

}
window.onload = init;
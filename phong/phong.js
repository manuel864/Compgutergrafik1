'use strict';

let skyboxVert=`
precision mediump float;

attribute vec4 a_position;
varying vec4 v_position;
void main() {
    v_position = a_position;
    gl_Position = a_position;
    gl_Position.z = 1;
}
`

let skyboxFrag=`
precision mediump float;
uniform samplerCube u_skybox;
uniform mat4 u_viewDirectionProjectionInverse;
 
varying vec4 v_position;
void main() {
  vec4 t = u_viewDirectionProjectionInverse * v_position;
  gl_FragColor = textureCube(u_skybox, normalize(t.xyz / t.w));
}
`

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
    constructor(buffer,n,vertShaderLoc,fragShaderLoc,gl){
        this.buffer = buffer;
        this.n = n;
        this.gl = gl;
        this.program = null;
        this.vertShaderLoc = vertShaderLoc;
        this.fragShaderLoc = fragShaderLoc;
        this.material = null;
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

async function createObjBuffer(gl){
    /*let verts = [
        0.0,  0.5,  Math.random(), Math.random(), Math.random(),
        -0.5, -0.5,  Math.random(), Math.random(), Math.random(),
         0.5, -0.5,  Math.random(), Math.random(), Math.random(),
         0.1, -0.7,  Math.random(), Math.random(), Math.random(),
         0.2, -0.8,  Math.random(), Math.random(), Math.random()
    ];*/
    let verts= await fetchModel('monkey.obj');
    let objBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,objBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(verts),gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    return [objBuffer,verts.length];
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



function drawMonkey(gl,obj){
    let program = obj.program;
    let objBuffer = obj.buffer;
    let n = obj.n;
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER,objBuffer);
    gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, objBuffer);
        let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
        gl.vertexAttribPointer(
            positionAttribLocation,
            3,
            gl.FLOAT,
            gl.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT,
            0 * Float32Array.BYTES_PER_ELEMENT
        );
        gl.enableVertexAttribArray(positionAttribLocation);
    
        const normalAttribLocation = gl.getAttribLocation(program, 'vertNormal');
		gl.vertexAttribPointer(
			normalAttribLocation, // Attribute location
			3, // Number of elements per attribute
			gl.FLOAT, // Type of elements
			gl.FALSE,
			8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
			5 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
		);
		gl.enableVertexAttribArray(normalAttribLocation);
        gl.drawArrays(gl.TRIANGLES, 0, n/8);
        gl.disableVertexAttribArray(positionAttribLocation);
		gl.disableVertexAttribArray(normalAttribLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
function draw(gl,monkey){
    drawMonkey(gl,monkey);
        
    
}

async function init(){
    let gl =getGlContext();
    let values = await createObjBuffer(gl);
    //                      Buffer       n      program
    let monkey = new Object(values[0],values[1],'phongVertsShaderText.glsl','phongFragShaderText.glsl');
    await monkey.createProgram(gl);
    //                                BaseColor        shini   spec      ambient
    monkey.material= new Material([0.2, 0.4, 0.65, 1.0], 30.0, 1.0, [0.05,0.05,0.2]);



    //                                Pos               Color         Spec Color       
    let pointLight1 = new Light([0.0, -7.5, 0.0], [0.0, 0.0, 0.5], [1.0, 1.0, 1.0] );
    let pointLight2 = new Light([0.0, 10.0, 0.0], [0.6, 0.0, 0.0], [1.0, 0.0, 0.0] );
    
    //BG Color
    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(monkey.program);


    //Material setUp
    let baseColorLocation = gl.getUniformLocation(monkey.program, 'mat.color');
    let specLocation = gl.getUniformLocation(monkey.program, 'mat.spec')
    let shininessLocation = gl.getUniformLocation(monkey.program, 'mat.shininess');
    let ambientLocation = gl.getUniformLocation(monkey.program, 'mat.ambient');
    gl.uniform4fv(baseColorLocation, monkey.material.baseColor );
    gl.uniform1f(specLocation, monkey.material.spec);
    gl.uniform1f(shininessLocation, monkey.material.shininess);
    gl.uniform1f(ambientLocation, monkey.material.ambient);


    //Erste Lampe
    let lightColorLocation1 = gl.getUniformLocation(monkey.program, 'pointLight1.lightColor');
    let lightPosLocation1 = gl.getUniformLocation(monkey.program, 'pointLight1.position')
    let specColorLocation1 = gl.getUniformLocation(monkey.program, 'pointLight1.specColor');
    gl.uniform3fv(lightPosLocation1,pointLight1.position );
    gl.uniform3fv(lightColorLocation1, pointLight1.color);
    gl.uniform3fv(specColorLocation1, pointLight1.specColor);

    //Zweite Lampe
    let lightColorLocation2 = gl.getUniformLocation(monkey.program, 'pointLight2.lightColor');
    let lightPosLocation2 = gl.getUniformLocation(monkey.program, 'pointLight2.position')
    let specColorLocation2 = gl.getUniformLocation(monkey.program, 'pointLight2.specColor');
    gl.uniform3fv(lightPosLocation2,pointLight2.position );
    gl.uniform3fv(lightColorLocation2, pointLight2.color);
    gl.uniform3fv(specColorLocation2, pointLight2.specColor);

    let matWorldUniformLocation = gl.getUniformLocation(monkey.program, 'mWorld');
	let matViewUniformLocation = gl.getUniformLocation(monkey.program, 'mView');
	let matProjUniformLocation = gl.getUniformLocation(monkey.program, 'mProj');
    var viewWorldPositionLocation = gl.getUniformLocation(monkey.program, "eyePosition");


    let worldMatrix =getEinheitsMatrix4();
	let viewMatrix = getEinheitsMatrix4();
	let projMatrix = getEinheitsMatrix4();
    viewMatrix = look(viewMatrix, [0, 0, 8], [0, 0, 0], [0, 1, 0]);
    projMatrix=perspective(projMatrix,45,canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);
    gl.uniform3fv(viewWorldPositionLocation, [0, 0, 8]);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    let angle = 360;
    var loop = function(){
        
        gl.clearColor(0.75, 0.85, 0.8, 1.0);
	    gl.clear(gl.COLOR_BUFFER_BIT);
        angle = performance.now()/1000/6*360;
        worldMatrix = getEinheitsMatrix4();
        worldMatrix = rotate(worldMatrix,angle, [0, 1, 0]);
        worldMatrix = rotate(worldMatrix, angle / 4, [1, 0, 0]);
        

        
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        //draw(gl, program, objBuffer,n);
        draw(gl,monkey);
        
        requestAnimationFrame(loop); }
    requestAnimationFrame(loop)

}
window.onload = init;
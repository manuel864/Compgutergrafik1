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
class Skybox{
    constructor(verts,vertShaderLoc,fragShaderLoc,textureLoc){
        this.verts = verts;
        this.isTextured = true;
        this.buffer = null;
        this.createBuffer();
        this.vertShaderLoc = vertShaderLoc;
        this.fragShaderLoc = fragShaderLoc;
        this.program = null;
        this.textureLoc = textureLoc;
        this.texture = null;
        this.createTexture();
    }
    async createProgram(){
        let gl =getGlContext();
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
    }
    
    createBuffer(){
        let gl = getGlContext();
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.verts),gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
    createTexture(){
        let gl =getGlContext();
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        for(let loc of this.textureLoc){
            let target = null;
            //                 Remove Postfix
            switch(loc.split('-').slice(0, -1).join('-')){
                case "right":
                    target = gl.TEXTURE_CUBE_MAP_POSITIVE_X;
                    break;
                case "left":
                    target = gl.TEXTURE_CUBE_MAP_NEGATIVE_X;
                    break;
                case "top":
                    target = gl.TEXTURE_CUBE_MAP_POSITIVE_Y;
                    break;
                case "bottom":
                    target = gl.TEXTURE_CUBE_MAP_NEGATIVE_Y;
                    break;
                case "front":
                    target = gl.TEXTURE_CUBE_MAP_POSITIVE_Z;
                    break;
                case "back":
                    target = gl.TEXTURE_CUBE_MAP_NEGATIVE_Z;
                    break;
            }
            console.log(loc)
            gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,document.getElementById(loc));
        }
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        this.texture = texture;

    }
    draw(){
        let gl =getGlContext();
        gl.disable(gl.DEPTH_TEST);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        const positionAttribLocation = gl.getAttribLocation(this.program, 'vertPosition');
        gl.vertexAttribPointer(
            positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );
        gl.enableVertexAttribArray(positionAttribLocation);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
		gl.drawArrays(gl.TRIANGLES, 0, this.verts.length*200);
		gl.disableVertexAttribArray(positionAttribLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}



class Object{
    constructor(gl,verts,vertShaderLoc,fragShaderLoc,isTextured,textureLoc=[]){
        this.verts = verts;
        this.buffer = null;
        this.createBuffer();
        this.gl = gl;
        this.program = null;
        this.vertShaderLoc = vertShaderLoc;
        this.fragShaderLoc = fragShaderLoc;
        this.material = null;
        this.isTextured = isTextured;
        this.textures = [];
        this.textureLoc = textureLoc;
        if(this.isTextured){this.createTextures();}

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

    createBuffer(){
            let gl = getGlContext();
            this.buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.verts),gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    createTextures(){
        let gl = getGlContext();
        for(let loc of this.textureLoc){
            let texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.activeTexture(gl.TEXTURE0);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById(loc));
            gl.bindTexture(gl.TEXTURE_2D, null);
            this.textures.push(texture);
        }
    }

    draw(){
        let gl = getGlContext();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
        gl.useProgram(this.program);
        gl.enable(gl.DEPTH_TEST);
        

        if(!this.isTextured){
            let positionAttribLocation = gl.getAttribLocation(this.program, 'vertPosition');
            gl.vertexAttribPointer(
                positionAttribLocation,
                3,
                gl.FLOAT,
                gl.FALSE,
                12 * Float32Array.BYTES_PER_ELEMENT,
                0 * Float32Array.BYTES_PER_ELEMENT
            );
        
            const normalAttribLocation = gl.getAttribLocation(this.program, 'vertNormal');
            gl.vertexAttribPointer(
                normalAttribLocation, // Attribute location
                3, // Number of elements per attribute
                gl.FLOAT, // Type of elements
                gl.FALSE,
                12 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
                5 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
            );

            gl.enableVertexAttribArray(positionAttribLocation);
            gl.enableVertexAttribArray(normalAttribLocation);
            gl.drawArrays(gl.TRIANGLES, 0, this.verts.length/12);
            gl.disableVertexAttribArray(positionAttribLocation);
            gl.disableVertexAttribArray(normalAttribLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
        else{
            
            //Draw Object
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

            //bind texture loop
            
            for(let texture of this.textures){
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                const samplerUniformLocation = gl.getUniformLocation(this.program, 'sPic');
                gl.uniform1i(samplerUniformLocation, 0);
            } 
            gl.drawArrays(gl.TRIANGLES, 0, this.verts.length/12);
            gl.disableVertexAttribArray(positionAtrributeLocation);
            gl.disableVertexAttribArray(texAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            gl.bindTexture(gl.TEXTURE_2D, null);
               
        }
    }
}
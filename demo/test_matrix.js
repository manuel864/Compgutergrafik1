//v als vec3
function getTranslateMatrix(v){
    let translateMatrix = new Float32Array( [
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        v[0],v[1],v[2],1,
    ]);
    return translateMatrix;
}

//https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Matrix_math_for_the_web
//Rotiert um die Z Achse
function getRotateZMatrix(angle){
    let radian = Math.PI*angle / 180;
    let c = Math.cos( radian);
    let s = Math.sin(radian);
    let rotateMatrix = new Float32Array( [
        c,s,0,0,
        -s,c,0,0,
        0,0,1,0,
        0,0,0,1,
    ]);
    return rotateMatrix;
}

function getRotateXMatrix(angle){
    let radian = Math.PI*angle / 180;
    let c = Math.cos( radian);
    let s = Math.sin(radian);
    let rotateMatrix = new Float32Array( [
        1,0,0,0,
        0,c,-s,0,
        0,s,c,0,
        0,0,0,1,
    ]);
    return rotateMatrix;
}

function getRotateYMatrix(angle){
    let radian = Math.PI*angle / 180;
    let c = Math.cos( radian);
    let s = Math.sin(radian);
    let rotateMatrix = new Float32Array( [
        c,0,s,0,
        0,1,0,0,
        -s,0,c,0,
        0,0,0,1,
    ]);
    return rotateMatrix;
}

//v als vec3
function getScaleMatrix(v){
    let translateMatrix = new Float32Array( [
        v[0],0,0,0,
        0,v[1],0,0,
        0,0,v[2],0,
        0,0,0,1,
    ]);
    return translateMatrix;
}

//Kann evt. gelöscht werden weiß nicht ob man das wirklich braucht 
//gibt eine 3x3 einheitsmatrix aus
function getEinheitsMatrix3(){
    let einheitsMatrix = new Float32Array([
        1,0,0,
        0,1,0,
        0,0,1,
    ])
    return einheitsMatrix;
}

//gibt eine 4x4 einheitsmatrix aus
function getEinheitsMatrix4(){
    let einheitsMatrix = new Float32Array([
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,0,1,
    ])
    return einheitsMatrix;
}


//https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_model_view_projection


//eye, center und up jeweils als vec 3
//https://webglfundamentals.org/webgl/lessons/webgl-3d-camera.html



function look(out,eye, center, up){
    let z = [eye[0]-center[0],eye[1]-center[1],eye[2]-center[2]];
    let hypotZ = Math.hypot(z[0], z[1], z[2]);
    z= [z[0]/hypotZ, z[1]/hypotZ, z[2]/hypotZ];


    let x = [up[1]*z[2]-up[2]*z[1], up[2]*z[0]-up[0]*z[2], up[0]*z[1]-up[1]*z[0]];
	let hypotX = Math.hypot(x[0], x[1], x[2]);
    if (!hypotX) {
        x = [0,0,0];
    } else {
        x= [x[0]/hypotX, x[1]/hypotX, x[2]/hypotX];
    }

    let y = [z[1]*x[2]-z[2]*x[1], z[2]*x[0]-z[0]*x[2], z[0]*x[1]-z[1]*x[0]]
	let hypotY = Math.hypot(y[0], y[1], y[2]);
    if (!hypotY) {
        y = [0,0,0];
    } else {
        y= [y[0]/hypotY, y[1]/hypotY, y[2]/hypotY];
    }
    out =[
        x[0],y[0],z[0],0,
        x[1],y[1],z[1],0,
        x[2],y[2],z[2],0,
        -(x[0]*eye[0]+x[1]*eye[1]+x[2]*eye[2]), -(y[0]*eye[0]+y[1]*eye[1]+y[2]*eye[2]), -(z[0]*eye[0]+z[1]*eye[1]+z[2]*eye[2]),1
    ];
	
    return out;
}

function perspective(out,fovy, aspect, near, far){
    let f = 1.0/ Math.tan(fovy/2);
    if (far != null && far !== Infinity) {
        let nf = 1 / (near - far);
        out = [f/aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far+near)*nf, -1,
            0, 0, 2*far*near*nf, 0
        ]} 
        else {
        out = [f/aspect,0,0,0,
            0,f,0,0,
            0,0,-1,-1,
            0,0,-2*near, 0
        ]}
    return out;
}

function rotate(out,angle,axis){
    const epsilion = 0.000001;
    let hypot=Math.hypot(axis[0],axis[1],axis[2]);
    if(hypot < epsilion){
        return; }
    axis = [axis[0]*1/hypot, axis[1]*1/hypot, axis[2]*1/hypot]
    let radian = Math.PI*angle / 180;
    let c = Math.cos(radian);
    let s = Math.sin(radian);
    let t = 1-c;


    const a00 = out[0];
    const a01 = out[1];
    const a02 = out[2];
    const a03 = out[3];
    const a10 = out[4];
    const a11 = out[5];
    const a12 = out[6];
    const a13 = out[7];
    const a20 = out[8];
    const a21 = out[9];
    const a22 = out[10];
    const a23 = out[11];
	
    const b00 = axis[0] * axis[0] * t + c;
    const b01 = axis[1] * axis[0] * t + axis[2] * s;
    const b02 = axis[2] * axis[0] * t - axis[1] * s;
    const b10 = axis[0] * axis[1] * t - axis[2] * s;
    const b11 = axis[1] * axis[1] * t + c;
    const b12 = axis[2] * axis[1] * t + axis[0] * s;
    const b20 = axis[0] * axis[2] * t + axis[1] * s;
    const b21 = axis[1] * axis[2] * t - axis[0] * s;
    const b22 = axis[2] * axis[2] * t + c; // Perform rotation-specific matrix multiplication

    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    
    /*out=[out[0], out[1], out[2], out[3], 
        out[4], out[5], out[6], out[7],
        out[8], out[9], out[10], out[11],
        out[12], out[13], out[14], out[15],
    ]*/
    return out;
}

function dot(a,b){
    let dotProduct = 0;
    for(let i=0; i<a.length; i++){
        dotProduct += a[i]*b[i];
    }
    return dotProduct;
}

function multiplication4(a,b){
    let out = new Float32Array(16);
	for (let i=0; i<4;i++){
		for (let j = 0; j < 15; j += 4) {
			out[j+i] = dot([a[0+i],a[4+i],a[8+i],a[12+i]],[b[j],b[j+1],b[j+2],b[j+3]])

		}
	}
    return out;}



    function invert(a){


        let out = new Float32Array();
        let b00 = a[0] * a[5] - a[1] * a[4];
        let b01 = a[0] * a[6] - a[2] * a[4];
        let b02 = a[0] * a[7] - a[3] * a[4];
        let b03 = a[1] * a[6] - a[2] * a[5];
        let b04 = a[1] * a[7] - a[3] * a[5];
        let b05 = a[2] * a[7] - a[3] * a[6];
        let b06 = a[8] * a[13] - a[9] * a[12];
        let b07 = a[8] * a[14] - a[10] * a[12];
        let b08 = a[8] * a[15] - a[11] * a[12];
        let b09 = a[9] * a[14] - a[10] * a[13];
        let b10 = a[9] * a[15] - a[11] * a[13];
        let b11 = a[10] * a[15] - a[11] * a[14]; 
    
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    
        if (det==0) {
            console.log("Can not invert mtairx, det = 0");
            return null;
        }
    
        det = 1.0 / det;
        out[0] = (a[5] * b11 - a[6] * b10 + a[7] * b09) * det;
        out[1] = (a[2] * b10 - a[1] * b11 - a[3] * b09) * det;
        out[2] = (a[13] * b05 - a[14] * b04 + a[15] * b03) * det;
        out[3] = (a[10] * b04 - a[9] * b05 - a[11] * b03) * det;
        out[4] = (a[6] * b08 - a[4] * b11 - a[7] * b07) * det;
        out[5] = (a[0] * b11 - a[2] * b08 + a[3] * b07) * det;
        out[6] = (a[14] * b02 - a[12] * b05 - a[15] * b01) * det;
        out[7] = (a[8] * b05 - a[10] * b02 + a[11] * b01) * det;
        out[8] = (a[4] * b10 - a[5] * b08 + a[7] * b06) * det;
        out[9] = (a[1] * b08 - a[0] * b10 - a[3] * b06) * det;
        out[10] = (a[12] * b04 - a[13] * b02 + a[15] * b00) * det;
        out[11] = (a[9] * b02 - a[8] * b04 - a[11] * b00) * det;
        out[12] = (a[5] * b07 - a[4] * b09 - a[6] * b06) * det;
        out[13] = (a[0] * b09 - a[1] * b07 + a[2] * b06) * det;
        out[14] = (a[13] * b01 - a[12] * b03 - a[14] * b00) * det;
        out[15] = (a[8] * b03 - a[9] * b01 + a[10] * b00) * det;
        return out;
    }

function addMatrix(a,b){
    //console.log(b)
    /*if(a.length != b.length){
        return;
    }*/
    let out = new Float32Array(a.length);
    for (let i=0;i<a.length;i++){
        out[i] = a[i] + b[i];
    }
    return out;
}

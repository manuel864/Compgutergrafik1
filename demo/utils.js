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

function cameraWerte(){
	const xAchse = document.querySelector('#cameraTransX').value;
	document.querySelector('#cameraTransXValue').innerHTML = xAchse;
	const yAchse = document.querySelector('#cameraTransY').value;
	document.querySelector('#cameraTransYValue').innerHTML = yAchse;
	const zAchse = document.querySelector('#cameraTransZ').value;
	document.querySelector('#cameraTransZValue').innerHTML = zAchse;

	return {
		x: xAchse, 
		y: yAchse, 
		z: zAchse
	}
}

async function fetchModel(name) {

	let response = await fetch(name);
	let txt = await response.text();
	let lines = txt.split(/\r*\n/);
	
	let vertexArray = [];
	let vertexTextureArray = [];
	let vertexNormalArray = [];
	let buffer = [];
	for (let line of lines) {
		let data = line.trim().split(/\s+/);
		let type = data.shift();
		if (type == 'v') {
			vertexArray.push(data.map(parseFloat));
		}
		else if (type == 'vt') {
			vertexTextureArray.push(data.map(parseFloat));
		}
		else if (type == 'vn') {
			vertexNormalArray.push(data.map(parseFloat));
		}
		else if (type == 'f') {
			if (data.length > 3){
				alert('No Tris')
				return;
			}
			for (let elem of data) {
				let i = elem.split('/').map( (x) => {return parseInt(x)} );
				vertexArray[i[0]-1].forEach( (x) => {buffer.push(x)} );
				vertexTextureArray[i[1]-1].forEach( (x) => {buffer.push(x)} );
				vertexNormalArray[i[2]-1].forEach( (x) => {buffer.push(x)} );
				[0.0,0.0,0.0,1.0].forEach( (x) => {buffer.push(x)});
			}
		}
	}
	return buffer;
};

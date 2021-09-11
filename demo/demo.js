async function init(){
    let skyboxImages = ["back-jpg","front-jpg","top-jpg","bottom-jpg","left-jpg","right-jpg"];
    let scene = new Scene();
    let skyboxGeo = createSkyBox();
    let skybox = new Skybox(skyboxGeo,'shaders/skybox_vert.glsl','shaders/skybox_frag.glsl',skyboxImages);
    await skybox.createProgram(); 
    let gl =getGlContext();
    scene.addObject(skybox);
    let data = await fetchModel('objects/monkey.obj');
    let dataBild = getPaintVerts();
    let globusData = await fetchModel('objects/earth.obj');
    let globus = new Object(gl, globusData,'shaders/planet_vert.glsl','shaders/planet_frag.glsl',true,['jupiter-png','grain-png']);
    let monkey = new Object(gl,data,'shaders/phongVertsShaderText.glsl','shaders/phongFragShaderText.glsl',false);
    await monkey.createProgram(gl);
    let bild = new Object(gl,dataBild,'shaders/canvas_vert.glsl','shaders/canvas_frag.glsl',true,['mona-png']);
    await bild.createProgram(gl);
    //await globus.createProgram(gl);
    monkey.translate = getTranslateMatrix([0,1,0])
    monkey.rotateX = getRotateXMatrix(45);
    monkey.scale = getScaleMatrix([1.1,1.4,1.1]);
    //                                BaseColor        shini   spec      ambient
    monkey.material= new Material([0.2, 0.4, 0.65, 1.0], 30.0, 1.0, [0.05,0.05,0.2]);
    scene.addObject(monkey);
    //scene.addObject(globus)
    scene.addObject(bild);
    console.log(scene.objects)


    //                                Pos               Color         Spec Color       
    let pointLight1 = new Light([0.0, -7.5, 0.0], [0.0, 0.0, 0.5], [1.0, 1.0, 1.0] );
    let pointLight2 = new Light([0.0, 10.0, 0.0], [0.6, 0.0, 0.0], [1.0, 0.0, 0.0] );
    for(let obj of scene.objects){
        console.log(obj)
        //Setting Uniforms for each program
        //BG Color
        
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
    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    var loop = function(){
        angle = performance.now()/1000/6*360;
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        for(var obj of scene.objects){
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
            worldMatrix = getEinheitsMatrix4();
            worldMatrix = rotate(worldMatrix,angle, [0, 1, 0]);
            worldMatrix = rotate(worldMatrix, angle / 4, [1, 0, 0]);
            gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
            obj.draw(gl)
        }
        
        requestAnimationFrame(loop); }
    requestAnimationFrame(loop)

}
window.onload = init;
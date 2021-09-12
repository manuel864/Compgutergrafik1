async function init(){
    let gl =getGlContext();
    let scene = new Scene();

     //                                BaseColor        shini    spec      ambient
    let baseMaterial= new Material([0.2, 0.4, 0.65, 1.0], 30.0,  1.0,  [0.05,0.05,0.2]);

    let skyboxGeo = createSkyBox();
    let skyboxImages = ["back-jpg","front-jpg","top-jpg","bottom-jpg","left-jpg","right-jpg"];
    let skybox = new Skybox(skyboxGeo,'shaders/skybox_vert.glsl','shaders/skybox_frag.glsl',skyboxImages);
    await skybox.createProgram(); 
    
    let monkeyData = await fetchModel('objects/monkey.obj');
    let monkey = new Object("1",gl,monkeyData,false,'shaders/phongVertsShaderText.glsl','shaders/phongFragShaderText.glsl',false);
    await monkey.createProgram(gl);
    monkey.material = baseMaterial;
    

    let monkey2 = new Object("2",gl,monkeyData,true,'shaders/reflection_vert.glsl','shaders/reflection_frag.glsl',true,[skybox.texture]);
    await monkey2.createProgram(gl);
    monkey2.material = baseMaterial;

    let dataBild = getPaintVerts();
    let bild = new Object("bild",gl,dataBild,false,'shaders/canvas_vert.glsl','shaders/canvas_frag.glsl',true,['mona-png']);
    await bild.createProgram(gl);
    bild.material = baseMaterial;
    
    let globusData = await fetchModel('objects/earth.obj');
    let globus = new Object("globus",gl, globusData,false,'shaders/planet_vert.glsl','shaders/planet_frag.glsl',true,['jupiter-png','grain-png']);
    await globus.createProgram(gl);
    globus.textureSampleLoc = ['sJupiter','sGrain']
    globus.multipleTexture = true;
    globus.material = baseMaterial;

    let tvData = getTV();
    let tv = new Object("tv",gl,tvData,false,'shaders/tv_vert.glsl','shaders/tv_frag.glsl',true,['video-texture']);
    await tv.createProgram(gl);
    tv.material = baseMaterial;
    
    
    
    
    
    scene.addObject(skybox);
    scene.addObject(monkey);
    scene.addObject(bild);
    scene.addObject(monkey2)
    scene.addObject(globus);
    //scene.addObject(tv);
    


    monkey.translate = getTranslateMatrix([0,1,0])
    monkey.rotateX = getRotateXMatrix(45);
    monkey.scale = getScaleMatrix([1.1,1.4,1.1]);
    


    //                                Pos               Color         Spec Color       
    let pointLight1 = new Light([0.0, -7.5, 0.0], [0.0, 0.0, 0.5], [1.0, 1.0, 1.0] );
    let pointLight2 = new Light([0.0, 10.0, 0.0], [0.6, 0.0, 0.0], [1.0, 0.0, 0.0] );
    for(let obj of scene.objects){
        //Setting Uniforms for each program
        //BG Color
        
        gl.useProgram(obj.program);
        if(obj instanceof Object){
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
        
        
            if(obj.isReflectiv){
                var viewWorldPositionLocation = gl.getUniformLocation(obj.program, "eyePosition");
                gl.uniform3fv(viewWorldPositionLocation, [0, 0, 8]);
            }

            if(obj.multipleTexture){
                for(let i=0;i< obj.textureSampleLoc.length ;i++){
                    const samplerDayLocation = gl.getUniformLocation(obj.program, obj.textureSampleLoc[i]);
                    gl.uniform1i(samplerDayLocation, i);
                }
            }
        }
    }
    let angle = 360;
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    let translate = 10;
    var loop = function(){
        angle = performance.now()/1000/12*360;
        translate = performance.now()/1000/12*10
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        for(var obj of scene.objects){
            gl.useProgram(obj.program);
            if(obj instanceof Object){

                var translateLocation = gl.getUniformLocation(obj.program, 'translate');
                gl.uniformMatrix4fv(translateLocation,gl.FALSE,obj.translate );
                var scaleLocation = gl.getUniformLocation(obj.program, 'scale');
                gl.uniformMatrix4fv(scaleLocation,gl.FALSE,obj.scale );
                var rotateXLocation = gl.getUniformLocation(obj.program, 'rotateX');
                gl.uniformMatrix4fv(rotateXLocation,gl.FALSE,obj.rotateX );
                var rotateYLocation = gl.getUniformLocation(obj.program, 'rotateY');
                gl.uniformMatrix4fv(rotateYLocation,gl.FALSE,obj.rotateY );
                var rotateZLocation = gl.getUniformLocation(obj.program, 'rotateZ');
                gl.uniformMatrix4fv(rotateZLocation,gl.FALSE,obj.rotateZ );

                if(obj.name =="1"){
                obj.animate({translate: getTranslateMatrix( [Math.sin(translate),0,0] ) });
                var translateLocation = gl.getUniformLocation(obj.program, 'translate');
                gl.uniformMatrix4fv(translateLocation,gl.FALSE, obj.outTranslate);

                var scaleLocation = gl.getUniformLocation(obj.program, 'scale');
                gl.uniformMatrix4fv(scaleLocation,gl.FALSE, obj.outScale);}

            }
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
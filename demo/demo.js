async function init(){
    let gl =getGlContext();
    let scene = new Scene();
    //                            FC           FN  FF
    let baseFog = new Fog([0.85, 0.85, 0.85,1.0], 1.0, 20.0);

     //                     useVertexColor    BaseColor        shini    spec      ambient
    let baseMaterial= new Material(false,[0.2, 0.4, 0.65, 1.0], 30.0,  1.0,  [0.2,0.2,0.2]);
    let speerMaterial = new Material(false,[0.0,0.0,0.0,1.0],300,0.25,[0.2,0.2,0.2])
    let glassMaterial = new Material(true,[0,0,0],300,1,[0,0,0]);
    let podestMaterial= new Material(false,[0.7, 0.7, 0.9, 1.0], 30,  1.0,  [0.1,0.1,0.5]);
    let podestMaterial2= new Material(false,[0.9, 0.7, 0.7, 1.0], 30,  1.0,  [0.5,0.1,0.1]);
    let bodenMaterial = new Material(false,[0.0, 0.0, 0.0, 1.0], 3.0,  0.2,  [0.10, 0.08, 0.08]);

    let skyboxGeo = createSkyBox();
    let skyboxImages = ["back-jpg","front-jpg","top-jpg","bottom-jpg","left-jpg","right-jpg"];
    let skybox = new Skybox(skyboxGeo,'shaders/skybox_vert.glsl','shaders/skybox_frag.glsl',skyboxImages);
    await skybox.createProgram(); 
    
    let monkeyData = await fetchModel('objects/monkey.obj');
    //                    Name| gl | vertsData  | isreflect |                               shader programme                           | isFog | isTextured  |  textureLocs als Array 
    let monkey = new Object("1", gl ,monkeyData ,     false    ,'shaders/phongVertsShaderText.glsl','shaders/phongFragShaderText.glsl',    true,       false);
    await monkey.createProgram(gl);
    monkey.material = baseMaterial;
    monkey.fog = baseFog;
    

    let monkey2 = new Object("2",gl,monkeyData,true,'shaders/reflection_vert.glsl','shaders/reflection_frag.glsl',true,true,[skybox.texture]);
    await monkey2.createProgram(gl);
    monkey2.material = baseMaterial;
    monkey2.fog = baseFog;

    let podestData = await fetchModel('objects/podest.obj');
    let podestSolid =new Object('podest',gl,podestData,false,'shaders/phongVertsShaderText.glsl','shaders/phongFragShaderText.glsl',true,false);
    podestSolid.createProgram(gl);
    podestSolid.material = podestMaterial;
    podestSolid.fog = baseFog;

    let podestSolid2 =new Object('podest',gl,podestData,false,'shaders/phongVertsShaderText.glsl','shaders/phongFragShaderText.glsl',true,false);
    podestSolid2.createProgram(gl);
    podestSolid2.material = podestMaterial2;
    podestSolid2.fog = baseFog;

    let podestSolid3 =new Object('podest',gl,podestData,false,'shaders/phongVertsShaderText.glsl','shaders/phongFragShaderText.glsl',true,false);
    podestSolid3.createProgram(gl);
    podestSolid3.material = podestMaterial2;
    podestSolid3.fog = baseFog;

    let bodenData = await fetchModel('objects/boden.obj');
    let boden =new Object('boden',gl,bodenData,false,'shaders/phongVertsShaderText.glsl','shaders/phongFragShaderText.glsl',true,false);
    boden.createProgram(gl);
    boden.material = bodenMaterial;
    boden.fog = baseFog;

    let speerData = await fetchModel('objects/speer.obj');
    let speer = new Object('speer',gl,speerData,false,'shaders/texturedPhong_vert.glsl','shaders/texturedPhong_frag.glsl',true,true,['speer-png']);
    await speer.createProgram(gl);
    speer.material = speerMaterial;
    speer.fog = baseFog;

    let dataBild = getPaintVerts();
    let bild = new Object("bild",gl,dataBild,false,'shaders/canvas_vert.glsl','shaders/canvas_frag.glsl',true,true,['mona-png']);
    await bild.createProgram(gl);
    bild.material = baseMaterial;
    bild.fog = baseFog;
    
    let globusData = await fetchModel('objects/earth.obj');
    let globus = new Object("globus",gl, globusData,false,'shaders/planet_vert.glsl','shaders/planet_frag.glsl',true,true,['jupiter-png','grain-png']);
    await globus.createProgram(gl);
    globus.textureSampleLoc = ['sJupiter','sGrain']
    globus.multipleTexture = true;
    globus.material = baseMaterial;
    globus.fog = baseFog;

    let tvData = getTV();
    let tv = new Object("tv",gl,tvData,false,'shaders/tv_vert.glsl','shaders/tv_frag.glsl',true,true,['video-texture'],true);
    await tv.createProgram(gl);
    tv.material = baseMaterial;
    tv.fog = baseFog;

    let glassPodestData = getGlassPodest();
    let glassPodest = new Object("glass",gl,glassPodestData,false,'shaders/glassBoxes_vert.glsl','shaders/glassBoxes_frag.glsl',true,false);
    await glassPodest.createProgram(gl);
    glassPodest.material = glassMaterial;
    glassPodest.fog = baseFog;
    
    
    
    scene.addObject(skybox);
    scene.addObject(monkey);
    scene.addObject(bild);
    scene.addObject(monkey2)
    scene.addObject(globus);
    scene.addObject(tv);
    scene.addObject(glassPodest)
    scene.addObject(speer)
    scene.addObject(podestSolid)
    scene.addObject(boden)
    scene.addObject(podestSolid2)


    podestSolid2.translate= getTranslateMatrix([-4.5,-1,0])
    monkey.translate = getTranslateMatrix([5.5,0.5,0])
    monkey.rotateX = getRotateXMatrix(45);
    glassPodest.scale = getScaleMatrix([1.45,1.1,1.1])
    speer.scale = getScaleMatrix([0.25,0.25,0.25])
    speer.rotateZ = getRotateZMatrix(90);
    monkey2.translate = getTranslateMatrix([-4.5,0.5,0])
    monkey2.rotateX = getRotateXMatrix(30)
    globus.translate = getTranslateMatrix([-2,1.5,0])
    tv.translate = getTranslateMatrix([4,1,0]);
    podestSolid.translate = getTranslateMatrix([-2,-1,0])
    bild.translate = getTranslateMatrix([1.5,1,0])
    glassPodest.translate = getTranslateMatrix([1.5,1,0])
    boden.translate = getTranslateMatrix([0,-2,0])
    boden.scale = getScaleMatrix([1,0.5,0.5])

    //                                Pos               Color         Spec Color       
    let pointLight1 = new Light([-3.0, 3.0, 1.0], [1.0, 0.2, 0.2], [1.0, 0.6, 0.6] );
    let pointLight2 = new Light([3.0, 3.0, 0.0], [0.6, 0.6, 1.0], [0.6, 0.6, 1.0] );
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
            var useVertColorLocation = gl.getUniformLocation(obj.program,'useVertColor');
            gl.uniform1i(useVertColorLocation,obj.material.useVertexColor);
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
    gl.blendEquation(gl.FUNC_ADD, gl.FUNC_ADD);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(true);
    gl.enable(gl.BLEND);
    var loop = function(){
        angle = performance.now()/1000/12*360;
        translate = performance.now()/1000/12*10
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        for(var obj of scene.objects){
            worldMatrix = getEinheitsMatrix4();
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

                

                


                
                //Nebel
                const fogColorUniformLocation = gl.getUniformLocation(obj.program, 'fogColor');
                gl.uniform4fv(fogColorUniformLocation, obj.fog.fogColor);
                const fogNearUniformLocation = gl.getUniformLocation(obj.program, 'fogNear');
                gl.uniform1f(fogNearUniformLocation, obj.fog.fogNear);
                const fogFarUniformLocation = gl.getUniformLocation(obj.program, 'fogFar');
                gl.uniform1f(fogFarUniformLocation, obj.fog.fogFar);

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

            

            
            worldMatrix = rotate(worldMatrix,angle, [0, 1, 0]);

            gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
            obj.draw(gl)
        }
        
        requestAnimationFrame(loop); }
    requestAnimationFrame(loop)

}
window.onload = init;
import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
import { MyBoards } from './MyBoards.js';
import { MyChair } from './MyChair.js';
import { MyTable } from './MyTable.js';
import { MyCake } from './MyCake.js';
import { MyCar } from './MyCar.js';
import { MyPlate } from './MyPlate.js';
import { MyJar } from './MyJar.js';
import { MyFlower } from './MyFlower.js';


/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        
        this.app = app
        this.axis = null

        this.wallMeshes = []

        // Objects of the scene
        this.objects = [
            new MyTable(this.app),
            new MyPlate (this.app),
            new MyCake(this.app),
            new MyCar(this.app),
            new MyChair(this.app),
            new MyJar(this.app),
            new MyFlower(this.app)
        ]

        // NURBS
        this.builder = new MyNurbsBuilder()
        this.meshes = []
        this.samplesU = 8         // maximum defined in MyGuiInterface
        this.samplesV = 8         // maximum defined in MyGuiInterface
        
        
        // textures
        this.wallTexture = new THREE.TextureLoader().load( 'textures/wall.jpg' );
        this.wallTexture.wrapS = THREE.RepeatWrapping;
        this.wallTexture.wrapT = THREE.RepeatWrapping;
        this.wallPlaneMaterial = new THREE.MeshStandardMaterial({ map: this.wallTexture, emissive: "#000000", side: THREE.DoubleSide });

        this.tampoTexture = new THREE.TextureLoader().load( 'textures/wood.jpg' );
        this.tampoTexture.wrapS = THREE.RepeatWrapping;
        this.tampoTexture.wrapT = THREE.RepeatWrapping;
        //this.tampoPlaneMaterial = new THREE.MeshPhongMaterial({ map: this.tampoTexture, specular: "#dcdcdc", emissive: "#000000", shininess: 10, side: THREE.DoubleSide });
        this.tampoPlaneMaterial = new THREE.MeshStandardMaterial({ map: this.tampoTexture, roughness: 0.1, side: THREE.DoubleSide });
        
        this.tomasTexture = new THREE.TextureLoader().load( 'textures/tomas.jpg' );
        this.tomasTexture.wrapS = THREE.RepeatWrapping;
        this.tomasTexture.wrapT = THREE.RepeatWrapping;
        this.tomasPlaneMaterial = new THREE.MeshPhongMaterial({ map: this.tomasTexture, specular: "#dcdcdc", emissive: "#000000", shininess: 10, side: THREE.DoubleSide });

        this.franciscoTexture = new THREE.TextureLoader().load( 'textures/francisco.jpg' );
        this.franciscoTexture.wrapS = THREE.RepeatWrapping;
        this.franciscoTexture.wrapT = THREE.RepeatWrapping;
        this.franciscoPlaneMaterial = new THREE.MeshPhongMaterial({ map: this.franciscoTexture, specular: "#dcdcdc", emissive: "#000000", shininess: 10, side: THREE.DoubleSide });
        
        this.viewTexture = new THREE.TextureLoader().load( 'textures/view.jpg' );
        this.viewTexture.wrapS = THREE.RepeatWrapping;
        this.viewTexture.wrapT = THREE.RepeatWrapping;
        this.viewPlaneMaterial = new THREE.MeshPhongMaterial({ map: this.viewTexture, specular: "#dcdcdc", emissive: "#000000", shininess: 10, side: THREE.DoubleSide });
        
        this.cakeTexture = new THREE.TextureLoader().load( 'textures/cake.jpg' );
        this.cakeTexture.wrapS = THREE.RepeatWrapping;
        this.cakeTexture.wrapT = THREE.RepeatWrapping;
        this.cakePlaneMaterial = new THREE.MeshPhongMaterial({ map: this.cakeTexture, specular: "#000000", emissive: "#000000", shininess: 10, side: THREE.DoubleSide });

        this.boardTexture = new THREE.TextureLoader().load( 'textures/board.jpg' );
        this.boardTexture.wrapS = THREE.RepeatWrapping;
        this.boardTexture.wrapT = THREE.RepeatWrapping;
        this.boardMaterial = new THREE.MeshPhongMaterial({ map: this.boardTexture, specular: "#000000", emissive: "#000000", shininess: 10, side: THREE.DoubleSide });
        
        this.jornalTexture = new THREE.TextureLoader().load( 'textures/jornal.jpg' );
        this.jornalTexture.wrapS = THREE.RepeatWrapping;
        this.jornalTexture.wrapT = THREE.RepeatWrapping;
        this.jornalMaterial = new THREE.MeshBasicMaterial({ map: this.jornalTexture, side: THREE.DoubleSide });

        
        this.flowerStalkMaterial = new THREE.MeshPhongMaterial({ color: "#000000", specular: "#000000", emissive: "#000000", shininess: 90, side: THREE.DoubleSide });
    }   


    init() {
       
        if (this.axis === null) {
            this.axis = new MyAxis(this)
            //this.app.scene.add(this.axis)
        }

        // add a point light on top of the model
        const pointLight = new THREE.PointLight( 0xffffff, 50, 0 );
        pointLight.position.set( 0, 10, 0 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

        //curves
        this.quadraticBezierCurve = null
        this.catmullRomCurve = null
        this.numberOfSamples = 100

        this.addSpotlights()
        
        this.createWalls()

        this.tampoMesh = this.objects[0].create()
        this.plateMesh = this.objects[1].create(this.tampoMesh)
        this.cakeMesh = this.objects[2].create(this.plateMesh)
        this.carMesh = this.objects[3].create()
        this.chairMesh = this.objects[4].create()
        this.jarMesh = this.objects[5].create(this.tampoMesh)
        this.flowerMesh = this.objects[6].create(this.jarMesh)

        this.boards = new MyBoards(this.app)
        this.boardTomas = this.boards.create(this.tomasTexture,this.tomasPlaneMaterial, 10,10,800/800,1,this.wallMeshes[0].position.x + 0.01,2.5,2.5,0,Math.PI/2,0,0,3,3)
        this.boardFrancisco = this.boards.create(this.franciscoTexture,this.franciscoPlaneMaterial, 10,10,800/800,1,this.wallMeshes[0].position.x + 0.01,2.5,-2.5,0,Math.PI/2,0,0,3,3)
        this.boardView = this.boards.create(this.viewTexture,this.viewPlaneMaterial, 10,10,800/800,1,0,2.5,this.wallMeshes[2].position.z + 0.01,0,0,0,0,3,3)
        
        this.app.scene.add(this.boardTomas)
        this.app.scene.add(this.boardFrancisco)
        this.app.scene.add(this.boardView)
        this.app.scene.add(this.tampoMesh)
        this.app.scene.add(this.plateMesh)
        this.app.scene.add(this.cakeMesh)
        this.app.scene.add(this.carMesh)
        this.app.scene.add(this.chairMesh)
        this.app.scene.add(this.jarMesh)
        this.app.scene.add(this.flowerMesh)

        this.recompute()

    }

    drawJornal() {  

        // declare local variables
        let controlPoints;
        let surfaceData;
        let mesh;
        let orderU = 2
        let orderV = 1
        // build nurb #1
        controlPoints =

        [   // U = 0

        [ // V = 0..1;

            [ -0.2, -1.5, 0.0, 1 ],

            [ -0.2,  1.5, 0.0, 1 ]

        ],

    // U = 1

        [ // V = 0..1

            [ 0, -1.5, 4.0, 1 ],

            [ 0,  1.5, 4.0, 1 ]

        ],

    // U = 2

        [ // V = 0..1

            [ 0.2, -1.5, 0.0, 1 ],

            [ 0.2,  1.5, 0.0, 1 ]

            ]

        ]
        let planeSizeU = 0.3;
        let planeSizeV = 0.2;
        let planeUVRate = planeSizeV / planeSizeU;
        let jornalTextureUVRate = 728 / 494; // image dimensions
        let jornalTextureRepeatU = 1;
        let jornalTextureRepeatV =jornalTextureRepeatU * planeUVRate * jornalTextureUVRate;
        this.jornalTexture.repeat.set(jornalTextureRepeatU, jornalTextureRepeatV );
        this.jornalTexture.rotation = -Math.PI / 2;

        surfaceData = this.builder.build(controlPoints,
                orderU, orderV, 100,
                 100, this.jornalMaterial)  

        mesh = new THREE.Mesh( surfaceData, this.jornalMaterial );
        mesh.rotation.x = 0
        mesh.rotation.y = 3*Math.PI/4
        mesh.rotation.z = Math.PI/2
        mesh.scale.set( 0.2,0.2,0.2 )
        mesh.position.set( 0.7,1.1,0.7 )
        this.app.scene.add( mesh )
        this.meshes.push (mesh)
        }



    drawSemiCircunference(position, radius, numberOfSamples) {
        let points = []
        const inicialAngle = 0
        const finalAngle = Math.PI

        for (let i = 0; i <= numberOfSamples; i++) {
            const t = i / this.numberOfSamples
            const x = radius * Math.cos(inicialAngle + t * (finalAngle - inicialAngle))
            const y = radius * Math.sin(inicialAngle + t * (finalAngle - inicialAngle))
            points.push(new THREE.Vector3(x, y, 0))
        }

        let curve = new THREE.CatmullRomCurve3( points )
        let sampledPoints = curve.getPoints( this.numberOfSamples );
        this.curveGeometry = new THREE.BufferGeometry().setFromPoints( sampledPoints )
        this.lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } )
        this.lineObj = new THREE.Line( this.curveGeometry, this.lineMaterial )
        this.lineObj.position.set(position.x,position.y,position.z)
        this.app.scene.add( this.lineObj );
        return this.lineObj

    }

    drawQuarterCircunference(position, radius, numberOfSamples,reverse) {
        let points = []
        const inicialAngle = 0
        const finalAngle = Math.PI / 2

        for (let i = 0; i <= numberOfSamples; i++) {
            const t = i / this.numberOfSamples
            if (reverse === true) {
                const x = radius * Math.cos(inicialAngle + t * (finalAngle - inicialAngle))
                const y = radius * Math.sin(inicialAngle + t * (finalAngle - inicialAngle))
                points.push(new THREE.Vector3(x, y, 0))
            }
            else {
                const x = radius * Math.cos(finalAngle - t * (inicialAngle - finalAngle))
                const y = radius * Math.sin(finalAngle - t * (inicialAngle - finalAngle))
                points.push(new THREE.Vector3(x, y, 0))
            }
        }

        let curve = new THREE.CatmullRomCurve3( points )
        let sampledPoints = curve.getPoints( this.numberOfSamples );
        this.curveGeometry = new THREE.BufferGeometry().setFromPoints( sampledPoints )
        this.lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } )
        this.lineObj = new THREE.Line( this.curveGeometry, this.lineMaterial )
        this.lineObj.position.set(position.x,position.y,position.z)
        this.app.scene.add( this.lineObj );
        return this.lineObj
    }

    recompute() {

        // are there any meshes to remove?
        if (this.meshes !== null) {
            // traverse mesh array
            for (let i=0; i<this.meshes.length; i++) {
                // remove all meshes from the scene
                this.app.scene.remove(this.meshes[i])
            }
            this.meshes = [] // empty the array  
        }

        this.drawSpiral()

        this.drawJornal()

    }

    addSpotlights() {
        this.spotLight = new THREE.SpotLight( 0xffffff, 15 );
        this.spotLight.position.set(0,5,0);
        this.spotLight.angle = Math.PI/20;
        this.spotLight.penumbra = 0
        this.spotLight.decay = 0
        this.spotLight.distance = 5
        this.spotLight.intensity = 5

        this.spotLightTarget = new THREE.Object3D()
        this.spotLightTarget.position.set(0,1,0)
        this.app.scene.add(this.spotLightTarget)

        this.spotLight.target = this.spotLightTarget
        this.app.scene.add(this.spotLight)

        this.spotLight2 = new THREE.SpotLight( 0xffffff, 15 );
        this.spotLight2.position.set(-2.5,5,2.5);
        this.spotLight2.angle = Math.PI/10;
        this.spotLight2.penumbra = 1
        this.spotLight2.decay = 0
        this.spotLight2.distance = 10
        this.spotLight2.intensity = 1.2

        this.spotLightTarget2 = new THREE.Object3D()
        this.spotLightTarget2.position.set(-4.9,2.8,2.5)
        this.app.scene.add(this.spotLightTarget2)

        this.spotLight2.target = this.spotLightTarget2
        this.app.scene.add(this.spotLight2)

        this.spotLight3 = new THREE.SpotLight( 0xffffff, 15 );
        this.spotLight3.position.set(-2.5,5,-2.5);
        this.spotLight3.angle = Math.PI/10;
        this.spotLight3.penumbra = 1
        this.spotLight3.decay = 0
        this.spotLight3.distance = 10
        this.spotLight3.intensity = 1.2

        this.spotLightTarget3 = new THREE.Object3D()
        this.spotLightTarget3.position.set(-4.9,2.8,-2.5)
        this.app.scene.add(this.spotLightTarget3)

        this.spotLight3.target = this.spotLightTarget3
        this.app.scene.add(this.spotLight3)
        
        this.rectLight = new THREE.RectAreaLight( 0xdcdcdc, 20,  3, 3 );
        this.rectLight.position.set( 0, 2.5, -5.1 );
        this.rectLight.lookAt( 0, 2.5, 0 );
        this.app.scene.add( this.rectLight );

        this.RectAreaLightHelper = new RectAreaLightHelper( this.rectLight );
        this.app.scene.add( this.RectAreaLightHelper );


    }

    createWalls() {
        // create floor
        let plane = new THREE.PlaneGeometry( 10, 10 );
        let floorMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff",specular: "#000000", emissive: "#000000", shininess: 90, side: THREE.DoubleSide });
        this.planeMesh = new THREE.Mesh( plane, floorMaterial );
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        this.app.scene.add( this.planeMesh );

        this.addWall(-5,2.5,0,0,Math.PI/2,0)
        this.addWall(0,2.5,5,0,0,0)
        this.addWall(0,2.5,-5,0,0,0)
        this.addWall(5,2.5,0,0,Math.PI/2,0)


    }


    addWall(x,y,z,rx,ry,rz) {
        let wall = new THREE.PlaneGeometry( 10, 5 );
        this.wallMesh = new THREE.Mesh( wall, this.wallPlaneMaterial );
        this.wallMesh.position.x = x;
        this.wallMesh.position.y = y;
        this.wallMesh.position.z = z;
        this.wallMesh.rotation.x = rx;
        this.wallMesh.rotation.y = ry;
        this.wallMesh.rotation.z = rz;
        this.app.scene.add( this.wallMesh );

        this.wallMeshes.push(this.wallMesh);
    }


    drawSpiral() {
        const segments = 100
        const radius = 0.1
        const numberOfLoops = 3
        const height = 0.1
        let points = []

        var angleStep = 2 * Math.PI / segments; // 2PI = 360º, logo vou dividir o circulo em 100 partes e desenha-las
        var heightStep = height / segments; // 0.1 = altura da mola , logo vou dividir a mola em 100 partes e desenha-las

        /*
            x ->  cos(t) * raio
            y ->  t * h
            z ->  sin(t) * raio
        */
        for (let i = 0; i < numberOfLoops * segments; i++) {
            const x = Math.cos(i * angleStep) * radius
            const y = i * heightStep
            const z = Math.sin(i * angleStep) * radius
            points.push(new THREE.Vector3(x, y, z))
        }

        const curve = new THREE.CatmullRomCurve3(points)
        const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(segments))
        const material = new THREE.LineBasicMaterial({ color: 0xdcdcdc })
        const line = new THREE.Line(geometry, material)
        line.position.set(-0.75,this.tampoMesh.position.y + height ,-0.75)
        //line.rotation.x = Math.PI / 2
        this.app.scene.add(line)

    }



    
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }
    
    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }
    
    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        
    }

    drawHull(position, points) {

       

        const geometry = new THREE.BufferGeometry().setFromPoints( points );

        let line = new THREE.Line( geometry, this.hullMaterial );

        // set initial position

        line.position.set(position.x,position.y,position.z)

        this.app.scene.add( line );

    }

}

export { MyContents };
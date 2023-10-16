import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
import { MyBoards } from './MyBoards.js';
import { MyChair } from './MyChair.js';
import { MyTable } from './MyTable.js';
import { MyCake } from './MyCake.js';
import { MyCar } from './MyCar.js';
import { MyPlate } from './MyPlate.js';
import { MyJar } from './MyJar.js';
import { MyFlower } from './MyFlower.js';
import { MyLights } from './MyLights.js';
import { MyJornal } from './MyJornal.js';
import { MySpiral } from './MySpiral.js';

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
            new MyFlower(this.app),
            new MyJornal(this.app),
            new MySpiral(this.app)
        ]

        this.lightsManager = new MyLights(this.app)

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
        
        this.boardTexture = new THREE.TextureLoader().load( 'textures/board.jpg' );
        this.boardTexture.wrapS = THREE.RepeatWrapping;
        this.boardTexture.wrapT = THREE.RepeatWrapping;
        this.boardMaterial = new THREE.MeshPhongMaterial({ map: this.boardTexture, specular: "#000000", emissive: "#000000", shininess: 10, side: THREE.DoubleSide });

        this.mapSize = 4096;
    }   


    init() {
       
        if (this.axis === null) {
            this.axis = new MyAxis(this)
            //this.app.scene.add(this.axis)
        }

        //curves
        this.quadraticBezierCurve = null
        this.catmullRomCurve = null
        this.numberOfSamples = 100

        const light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
        light1.position.set( 0, 1, 0 );
        light1.castShadow = true;
        light1.shadow.mapSize.width = this.mapSize;
        light1.shadow.mapSize.height = this.mapSize;
        light1.shadow.camera.near = 0.5;
        light1.shadow.camera.far = 100;
        light1.shadow.camera.left = -15;
        light1.shadow.camera.right = 15;
        light1.shadow.camera.bottom = -15;
        light1.shadow.camera.top = 15;
        this.app.scene.add( light1 );

        this.spotLight = new THREE.SpotLight(0xffffff, 100, 20, Math.PI / 4, 0.5);
        this.spotLight.position.set(4, 3, 1);
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = this.mapSize;
        this.spotLight.shadow.mapSize.height = this.mapSize;
        this.spotLight.shadow.camera.near = 0.5;
        this.spotLight.shadow.camera.far = 100
        this.app.scene.add(this.spotLight);

        this.rectLight = this.lightsManager.createRectAreaLight();
        this.app.scene.add(this.rectLight);

        this.ambientLight = this.lightsManager.createAmbientLight();
        this.app.scene.add(this.ambientLight);

        this.pointLight = this.lightsManager.createPointLight();
        this.pointLight.castShadow = true;
        this.app.scene.add(this.pointLight);
        
        this.createWalls()

        this.tampoMesh = this.objects[0].create()
        this.plateMesh = this.objects[1].create(this.tampoMesh)
        this.cakeMesh = this.objects[2].create(this.plateMesh)
        this.carMesh = this.objects[3].create()
        this.chairMesh = this.objects[4].create()
        this.jarMesh = this.objects[5].create()
        this.flowerMesh = this.objects[6].create()
        this.flowerMesh.castShadow = true;
        this.jornalMesh = this.objects[7].create()
        this.spiralMesh = this.objects[8].create()

        this.boards = new MyBoards(this.app)
        this.boardTomas = this.boards.create(this.tomasTexture,this.tomasPlaneMaterial, 10,10,800/800,1,this.wallMeshes[0].position.x + 0.01,2.5,2.5,0,Math.PI/2,0,0,3,3)
        this.boardFrancisco = this.boards.create(this.franciscoTexture,this.franciscoPlaneMaterial, 10,10,800/800,1,this.wallMeshes[0].position.x + 0.01,2.5,-2.5,0,Math.PI/2,0,0,3,3)
        this.boardView = this.boards.create(this.viewTexture,this.viewPlaneMaterial, 10,10,800/800,1,0,2.5,this.wallMeshes[2].position.z + 0.01,0,0,0,0,3,3)
        
        this.tampoMesh.add(this.jarMesh)
        this.tampoMesh.add(this.jornalMesh)
        this.tampoMesh.add(this.spiralMesh)
        this.jarMesh.add(this.flowerMesh)

        this.app.scene.add(this.boardTomas)
        this.app.scene.add(this.boardFrancisco)
        this.app.scene.add(this.boardView)
        this.app.scene.add(this.tampoMesh)
        this.app.scene.add(this.plateMesh)
        this.app.scene.add(this.cakeMesh)
        this.app.scene.add(this.carMesh)
        this.app.scene.add(this.chairMesh)

        this.meshes.push(this.jornalMesh)
        this.meshes.push(this.spiralMesh)

    }

    createWalls() {
        // create floor
        let plane = new THREE.PlaneGeometry( 10, 10 );
        let floorMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff",specular: "#000000", emissive: "#000000", shininess: 90, side: THREE.DoubleSide });
        this.planeMesh = new THREE.Mesh( plane, floorMaterial );
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        this.planeMesh.receiveShadow = true;
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
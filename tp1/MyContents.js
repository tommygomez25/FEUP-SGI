import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';

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

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = false
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,2,0)

        // plane related attributes
        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess, side: THREE.DoubleSide })
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#00ff00", 
        specular: "#000000", emissive: "#000000", shininess: 90 , wireframe: false})

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial, );
        this.boxMesh.rotation.x = Math.PI / 4;
        this.boxMesh.position.y = this.boxDisplacement.y;
    }

    /**
     * initializes the contents
     */
    init() {
       
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            //this.axis = new MyAxis(this)
            //this.app.scene.add(this.axis)
        }

        // add a point light on top of the model
        const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        pointLight.position.set( 0, 20, 0 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

        this.buildBox()
        
        this.createWalls()

        this.createTable()

        this.createPlate()

        this.createCake()

        this.createCandle()

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

    createTable() {
        let tampo = new THREE.BoxGeometry(2.5, 0.1, 2.5);
        let tampoMaterial = new THREE.MeshPhongMaterial({ color: "#d2b48c",specular: "#000000", emissive: "#000000", shininess: 90 });
        this.tampoMesh = new THREE.Mesh( tampo, tampoMaterial);
        this.tampoMesh.position.y = 1.25;
        this.app.scene.add( this.tampoMesh);

        this.addLeg(-1,0,-1.)
        this.addLeg(-1,0,1)
        this.addLeg(1,0,-1)
        this.addLeg(1,0,1)

    }

    addLeg(x,y,z) {
        let leg = new THREE.CylinderGeometry(0.05, 0.05, 2.5, 32);
        let legMaterial = new THREE.MeshPhongMaterial({ color: "#d2b48c",specular: "#000000", emissive: "#000000", shininess: 90});
        this.legMesh = new THREE.Mesh( leg, legMaterial);
        this.legMesh.position.x = x
        this.legMesh.position.y = y;
        this.legMesh.position.z = z;
        this.app.scene.add( this.legMesh );
    }

    addWall(x,y,z,rx,ry,rz) {
        let wall = new THREE.PlaneGeometry( 10, 5 );
        let wallMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", specular: "#000000",shininess: 150, emissive: "#000000", side: THREE.DoubleSide});
        this.wallMesh = new THREE.Mesh( wall, wallMaterial );
        this.wallMesh.position.x = x;
        this.wallMesh.position.y = y;
        this.wallMesh.position.z = z;
        this.wallMesh.rotation.x = rx;
        this.wallMesh.rotation.y = ry;
        this.wallMesh.rotation.z = rz;
        this.app.scene.add( this.wallMesh );
    }

    createPlate() {
        const plateGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 32); // Raio superior, raio inferior, altura e segmentos
        const plateMaterial = new THREE.MeshPhongMaterial({ color: "#d3d3d3", specular: "#000000", emissive: "#000000", shininess: 90 }); 
        const prato = new THREE.Mesh(plateGeometry, plateMaterial);
        prato.position.y = 1.3;
        this.app.scene.add(prato);       
    }

    createCake() {
        const cakeGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.1, 32, 1, false, 0, 1/(2 * Math.PI/32)); // Raio superior, raio inferior, altura, segmentos, stacks, openEnded, abertura inicial e ângulo thetaLength
        const cakeMaterial = new THREE.MeshPhongMaterial({ color: "#ffd700", specular: "#ffd700", emissive: "#ffd700", shininess: 90 });
        const cake = new THREE.Mesh(cakeGeometry, cakeMaterial);
        cake.position.y = 1.35;
        this.app.scene.add(cake);
    }

    createCandle() {
        const candleGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 32);
        const candleMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", specular: "#ffffff", emissive: "#ffffff", shininess: 90 });
        const candle = new THREE.Mesh(candleGeometry, candleMaterial);
        candle.position.y = 1.40 + 0.05;
        this.app.scene.add(candle);

        const flameGeometry = new THREE.ConeGeometry(0.01, 0.07, 32);
        const flameMaterial = new THREE.MeshPhongMaterial({ color: "#F1C40F" }); 
        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        flame.position.y = 1.40 + 0.05 + 0.05 + 0.07
        this.app.scene.add(flame);

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
        // check if box mesh needs to be updated
        this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z
        
    }

}

export { MyContents };
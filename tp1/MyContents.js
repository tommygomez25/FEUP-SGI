import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyTable } from './MyTable.js';

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
    }

    /**
     * initializes the contents
     */
    init() {
       
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
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
        
        this.createWalls()

        let table = new MyTable(this.app)

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
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        
    }

}

export { MyContents };
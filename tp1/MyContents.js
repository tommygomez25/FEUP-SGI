import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

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

        this.wallMeshes = []

        // plane related attributes
        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess, side: THREE.DoubleSide })

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
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
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

        this.addSpotlights()
        
        this.buildBox()
        
        this.createWalls()

        this.createTable()

        this.createPlate()

        this.createCake()

        this.createChair()

        this.addBoards()

    }

    addSpotlights() {
        this.spotLight = new THREE.SpotLight( 0xffffff, 15 );
        this.spotLight.position.set(0,5,0);
        this.spotLight.angle = Math.PI/20;
        this.spotLight.penumbra = 0
        this.spotLight.decay = 0
        this.spotLight.distance = 10
        this.spotLight.intensity = 1.2

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


        this.spotLight4 = new THREE.SpotLight( 0xffffff, 15 );
        this.spotLight4.position.set(0,6,-2);
        this.spotLight4.angle = Math.PI/12;
        this.spotLight4.penumbra = 1
        this.spotLight4.decay = 0
        this.spotLight4.distance = 10
        this.spotLight4.intensity = 1.2

        this.spotLightTarget4 = new THREE.Object3D()
        this.spotLightTarget4.position.set(0,2.8,-5)
        this.app.scene.add(this.spotLightTarget4)

        this.spotLight4.target = this.spotLightTarget4
        this.app.scene.add(this.spotLight4)
        
        this.rectLight = new THREE.RectAreaLight( 0xdcdcdc, 30,  3, 3 );
        this.rectLight.position.set( 0, 2.5, -5.1 );
        this.rectLight.lookAt( 0, 2.5, 0 );
        this.app.scene.add( this.rectLight );


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
        
        let planeSizeU = 10;
        let planeSizeV = 7;
        let planeUVRate = planeSizeV / planeSizeU;
        let tampoTextureUVRate = 350 / 268; // image dimensions
        let tampoTextureRepeatU = 1;
        let tampoTextureRepeatV =tampoTextureRepeatU * planeUVRate * tampoTextureUVRate;
        this.tampoTexture.repeat.set(tampoTextureRepeatU, tampoTextureRepeatV );
        this.tampoTexture.rotation = 0;
        this.tampoTexture.offset = new THREE.Vector2(0,0);

        let tampo = new THREE.BoxGeometry(2.5, 0.1, 2.5);
        this.tampoMesh = new THREE.Mesh( tampo, this.tampoPlaneMaterial);
        this.tampoMesh.position.y = 1;

        this.app.scene.add( this.tampoMesh);

        this.addLegs(this.tampoMesh);

    }

    addLegs(tampoMesh) {
        const legHeight = 1; 
        const legWidth = 0.1; 
    
        
        const legPositions = [
            { x: tampoMesh.geometry.parameters.width / 2 - legWidth / 2, z: tampoMesh.geometry.parameters.depth / 2 - legWidth / 2 },
            { x: -tampoMesh.geometry.parameters.width / 2 + legWidth / 2, z: tampoMesh.geometry.parameters.depth / 2 - legWidth / 2 },
            { x: tampoMesh.geometry.parameters.width / 2 - legWidth / 2, z: -tampoMesh.geometry.parameters.depth / 2 + legWidth / 2 },
            { x: -tampoMesh.geometry.parameters.width / 2 + legWidth / 2, z: -tampoMesh.geometry.parameters.depth / 2 + legWidth / 2 },
        ];
    
        
        legPositions.forEach(position => {
            const leg = this.addLeg(legWidth, legHeight, legWidth); // create leg mesh
            leg.position.set(position.x, -legHeight / 2, position.z); 
            tampoMesh.add(leg);
        });
    }
    
    addLeg(width, height, depth) {
        const legGeometry = new THREE.BoxGeometry(width, height, depth);
        const legMesh = new THREE.Mesh(legGeometry, this.tampoPlaneMaterial);
        return legMesh;
    }

    createChair() {
        let planeSizeU = 10;
        let planeSizeV = 7;
        let planeUVRate = planeSizeV / planeSizeU;
        let tampoTextureUVRate = 350 / 268; // image dimensions
        let tampoTextureRepeatU = 1;
        let tampoTextureRepeatV =tampoTextureRepeatU * planeUVRate * tampoTextureUVRate;
        this.tampoTexture.repeat.set(tampoTextureRepeatU, tampoTextureRepeatV );
        this.tampoTexture.rotation = 0;
        this.tampoTexture.offset = new THREE.Vector2(0,0);

        let tampoChair = new THREE.BoxGeometry(0.75, 0.1, 0.75);
        this.tampoChairMesh = new THREE.Mesh( tampoChair, this.tampoPlaneMaterial);
        this.tampoChairMesh.position.y = 0.8;
        this.tampoChairMesh.position.x = 1.5;

        this.app.scene.add( this.tampoChairMesh);

        this.addLegs(this.tampoChairMesh);

        const otherTampoChair = new THREE.BoxGeometry(0.75, 0.1, 0.75);
        this.otherTampoChairMesh = new THREE.Mesh( otherTampoChair, this.tampoPlaneMaterial);
        this.otherTampoChairMesh.rotation.z = Math.PI / 2;
        this.otherTampoChairMesh.position.x += this.tampoChairMesh.geometry.parameters.width / 2 - this.otherTampoChairMesh.geometry.parameters.height / 2
        this.otherTampoChairMesh.position.y += this.tampoChairMesh.geometry.parameters.width / 2
        this.tampoChairMesh.add( this.otherTampoChairMesh);
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

        this.wallMeshes.push(this.wallMesh);
    }

    createPlate() {
        const plateGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 32); // Raio superior, raio inferior, altura e segmentos
        const plateMaterial = new THREE.MeshPhongMaterial({ color: "#d3d3d3", specular: "#000000", emissive: "#000000", shininess: 90 }); 
        this.plate = new THREE.Mesh(plateGeometry, plateMaterial);
        this.plate.position.y = this.tampoMesh.position.y + this.tampoMesh.geometry.parameters.height / 2 + this.plate.geometry.parameters.height / 2;
        
        this.app.scene.add(this.plate);       
    }

    createCake() {
        let planeSizeU = 3;
        let planeSizeV = 2;
        let planeUVRate = planeSizeV / planeSizeU;
        let cakeUVRate = 350/233; // image dimensions
        let cakeRepeatU =4
        let cakeRepeatV =cakeRepeatU * planeUVRate * cakeUVRate;
        this.cakeTexture.repeat.set(cakeRepeatU, cakeRepeatV );
        this.cakeTexture.rotation = 0;
        this.cakeTexture.offset = new THREE.Vector2(0,0);

        const cakeGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.1, 32, 1, false, 0, 1/(2 * Math.PI/32)); // Raio superior, raio inferior, altura, segmentos, stacks, openEnded, abertura inicial e ângulo thetaLength
        this.cake = new THREE.Mesh( cakeGeometry,this.cakePlaneMaterial)
        this.cake.position.y = this.plate.position.y + this.plate.geometry.parameters.height / 2 + this.cake.geometry.parameters.height / 2;

        const candleGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 32);
        const candleMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", specular: "#ffffff", emissive: "#ffffff", shininess: 90 });
        this.candle = new THREE.Mesh(candleGeometry, candleMaterial);
        this.candle.position.y = this.cake.geometry.parameters.height;
        this.cake.add(this.candle);

        const flameGeometry = new THREE.ConeGeometry(0.01, 0.07, 32);
        const flameMaterial = new THREE.MeshPhongMaterial({ color: "#F1C40F" }); 
        this.flame = new THREE.Mesh(flameGeometry, flameMaterial);
        this.flame.position.y = this.candle.geometry.parameters.height;
        this.candle.add(this.flame);

        this.app.scene.add(this.cake);
    }

    addBoards() {
        let planeSizeU = 10;
        let planeSizeV = 10;
        let planeUVRate = planeSizeV / planeSizeU;
        let tomasUVRate = 800 / 800; // image dimensions
        let tomasRepeatU = 1;
        let tomasRepeatV =tomasRepeatU * planeUVRate * tomasUVRate;
        this.tomasTexture.repeat.set(tomasRepeatU, tomasRepeatV );
        this.tomasTexture.rotation = 0;
        this.tomasTexture.offset = new THREE.Vector2(0,0);

        let board_tomas = new THREE.PlaneGeometry( 3, 3 );
        this.board_tomasMesh = new THREE.Mesh( board_tomas, this.tomasPlaneMaterial );
        this.board_tomasMesh.rotation.y = Math.PI / 2;
        this.board_tomasMesh.position.y = 2.5;
        this.board_tomasMesh.position.x = this.wallMeshes[0].position.x + 0.01;
        this.board_tomasMesh.position.z = 2.5;
        this.app.scene.add( this.board_tomasMesh );

        let franciscoUVRate = 800 / 800; // image dimensions
        let franciscoRepeatU = 1;
        let franciscoRepeatV =franciscoRepeatU * planeUVRate * franciscoUVRate;
        this.franciscoTexture.repeat.set(franciscoRepeatU, franciscoRepeatV );
        this.franciscoTexture.rotation = 0;
        this.franciscoTexture.offset = new THREE.Vector2(0,0);

        let board_francisco = new THREE.PlaneGeometry( 3, 3 );
        this.board_franciscoMesh = new THREE.Mesh( board_francisco, this.franciscoPlaneMaterial );
        this.board_franciscoMesh.rotation.y = Math.PI / 2;
        this.board_franciscoMesh.position.y = 2.5;
        this.board_franciscoMesh.position.x = this.wallMeshes[0].position.x + 0.01;
        this.board_franciscoMesh.position.z = -2.5;
        this.app.scene.add( this.board_franciscoMesh );

        let viewUVRate = 800 / 800; // image dimensions
        let viewRepeatU = 1;
        let viewRepeatV =viewRepeatU * planeUVRate * viewUVRate;
        this.viewTexture.repeat.set(viewRepeatU, viewRepeatV );
        this.viewTexture.rotation = 0;
        this.viewTexture.offset = new THREE.Vector2(0,0);
        
        let board_view = new THREE.PlaneGeometry( 3, 3 );
        this.board_viewMesh = new THREE.Mesh( board_view, this.viewPlaneMaterial );
        this.board_viewMesh.position.y = 2.5;
        this.board_viewMesh.position.x =0
        this.board_viewMesh.position.z = this.wallMeshes[2].position.z + 0.01;
        this.app.scene.add( this.board_viewMesh );


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
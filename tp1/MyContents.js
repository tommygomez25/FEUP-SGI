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
        this.boxEnabled = true
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,2,0)
        this.spotLight = null

        // plane related attributes
        //texture
        this.planeTexture = new THREE.TextureLoader().load('textures/feup_b.jpg');
        this.planeTexture.wrapS = THREE.ClampToEdgeWrapping;
        this.planeTexture.wrapT = THREE.ClampToEdgeWrapping;
        // material
        this.diffusePlaneColor =  "rgb(128,0,0)"
        this.specularPlaneColor = "#000000"
        this.planeShininess = 0
        // relating texture and material:
        // two alternatives with different results

        // alternative 1
        // this.planeMaterial = new THREE.MeshPhongMaterial({
        //         color: this.diffusePlaneColor,
        //         specular: this.specularPlaneColor,
        //         emissive: "#000000", shininess: this.planeShininess,
        //         map: this.planeTexture 
        // })
        // end of alternative 1

        // alternative 2
        this.planeMaterial = new THREE.MeshLambertMaterial({ map : this.planeTexture });
        // end of alternative 2
        
        let plane = new THREE.PlaneGeometry( 10, 10 );
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90 })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        this.boxMesh.rotation.x = -Math.PI / 2;
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
        /*
        const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        pointLight.position.set( 0, 20, 0 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );*/
        
        this.spotLight = new THREE.SpotLight( 0xffffff, 15 );
        this.spotLight.position.set(2,5,1);
        this.spotLight.angle = Math.PI *2 / 9;
        this.spotLight.penumbra = 0
        this.spotLight.decay = 0
        this.spotLight.distance = 8

        this.spotLightTarget = new THREE.Object3D()
        this.spotLightTarget.position.set(1,0,1)
        this.app.scene.add(this.spotLightTarget)

        this.spotLight.target = this.spotLightTarget
        this.app.scene.add(this.spotLight)

        const sphereSize = 0.5
        this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight,sphereSize)
        this.app.scene.add(this.spotLightHelper)

        /*
        const light2 = new THREE.DirectionalLight(0xffffff,1)
        light2.position.set(-5,10,-2)
        this.app.scene.add(light2)

        const lightTarget2 = new THREE.Object3D()
        lightTarget2.position.set(2, 2, 2);
        this.app.scene.add(lightTarget2)

        light2.target = lightTarget2
        this.app.scene.add(light2)

        const sphereSize = 0.5
        const pointLightHelper2 = new THREE.DirectionalLightHelper(light2,sphereSize)
        this.app.scene.add(pointLightHelper2)
        */

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555,4 );
        this.app.scene.add( ambientLight );

        this.buildBox()
        
        // Create a Plane Mesh with basic material
        let planeSizeU = 10;
        let planeSizeV = 3;
        let planeUVRate = planeSizeV / planeSizeU;
        let planeTextureUVRate = 3354 / 2385; // image dimensions
        let planeTextureRepeatU = 1;
        let planeTextureRepeatV = planeTextureRepeatU * planeUVRate * planeTextureUVRate;
        this.planeTexture.repeat.set( planeTextureRepeatU, planeTextureRepeatV );
        this.planeTexture.rotation = 0;
        this.planeTexture.offset = new THREE.Vector2(0,0);
        var plane = new THREE.PlaneGeometry( planeSizeU, planeSizeV );
        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = 0;
        this.app.scene.add( this.planeMesh );
        
        // let plane = new THREE.PlaneGeometry( 10, 10 );
        // this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        // this.planeMesh.rotation.x = -Math.PI / 2;
        // this.planeMesh.position.y = -0;
        // this.app.scene.add( this.planeMesh );
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

    updateSpotLightAngle(value) {
        //convert value from degrees to radians
        value = value * Math.PI / 180
        this.spotLight.angle = value
    }


}

export { MyContents };
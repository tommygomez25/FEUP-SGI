import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
import { MyTable } from './MyTable.js';
import { MyWall } from './MyWall.js';

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

        this.table = null;
        this.wall = null;

        // NURBS
        this.builder = new MyNurbsBuilder()
        this.meshes = []
        this.samplesU = 8         // maximum defined in MyGuiInterface
        this.samplesV = 8         // maximum defined in MyGuiInterface
        //this.createNurbsSurfaces()
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
        
        this.wall = new MyWall(this.app);

        this.table = new MyTable(this.app)

        this.recompute();
    }

    /**

     * removes (if existing) and recreates the nurbs surfaces

     */

    createNurbsSurfaces() {  
        // are there any meshes to remove?
        if (this.meshes !== null) {
           // traverse mesh array
            for (let i=0; i<this.meshes.length; i++) {
                // remove all meshes from the scene
                this.app.scene.remove(this.meshes[i])
            }
            this.meshes = [] // empty the array  
        }

        // declare local variables
        let controlPoints;
        let surfaceData;
        let mesh;
        let orderU = 2
        let orderV = 3
        // build nurb #1
        controlPoints =
        [   // U = 0
                [ // V = 0..3;
                    [ -1.5, -1.5, 0.0, 1 ],
                    [ -2.0, -2.0, 2.0, 1 ],
                    [ -2.0,  2.0, 2.0, 1 ],
                    [ -1.5,  1.5, 0.0, 1 ]
                ],
            // U = 1

                [ // V = 0..3
                    [ 0.0,  0.0, 3.0, 1 ],
                    [ 0.0, -2.0, 3.0, 1 ],
                    [ 0.0,  2.0, 3.0, 1 ],
                    [ 0.0,  0.0, 3.0, 1 ]        
                ],
            // U = 2

                [ // V = 0..3
                    [ 1.5, -1.5, 0.0, 1 ],
                    [ 2.0, -2.0, 2.0, 1 ],
                    [ 2.0,  2.0, 2.0, 1 ],
                    [ 1.5,  1.5, 0.0, 1 ]
                ]
         ]
        surfaceData = this.builder.build(controlPoints,

                      orderU, orderV, this.samplesU,

                      this.samplesV, this.material)  

        mesh = new THREE.Mesh( surfaceData, this.material );
        mesh.rotation.x = 0
        mesh.rotation.y = 0
        mesh.rotation.z = 0
        mesh.scale.set( 1,1,1 )
        mesh.position.set( 0,0,0 )
        this.app.scene.add( mesh )
        this.meshes.push (mesh)
    }

    recompute() {
        /*
        if (this.quadraticBezierCurve !== null)
            this.app.scene.remove(this.quadraticBezierCurve)
        this.initQuadraticBezierCurve()
        */

        this.wall.drawCar();
        this.table.drawSpiral();
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
        
        this.rectLight = new THREE.RectAreaLight( 0xdcdcdc, 20,  3, 3 );
        this.rectLight.position.set( 0, 2.5, -5.1 );
        this.rectLight.lookAt( 0, 2.5, 0 );
        this.app.scene.add( this.rectLight );

        this.RectAreaLightHelper = new RectAreaLightHelper( this.rectLight );
        this.app.scene.add( this.RectAreaLightHelper );
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

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MyContents } from './MyContents.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import Stats from 'three/addons/libs/stats.module.js'


/**
 * This class contains the application object
 */
class MyApp  {
    /**
     * the constructor
     */
    constructor() {
        this.scene = null
        this.stats = null

        // camera related attributes
        this.activeCamera = null
        this.activeCameraName = null
        this.lastCameraName = null
        this.cameras = []
        this.frustumSize = 20

        // other attributes
        this.renderer = null
        this.controls = null
        this.gui = null
        this.axis = null
        this.contents == null
        this.light1 = 50
        this.light2 = 50
        this.light3 = 50
        this.light4 = 50
    }
    /**
     * initializes the application
     */
    init() {
                
        // Create an empty scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x101010 );

        this.stats = new Stats()
        this.stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom)

        this.initCameras();
        this.setActiveCamera('Perspective')

        // Create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setClearColor("#000000");

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Configure renderer size
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        // Append Renderer to DOM
        document.getElementById("canvas").appendChild( this.renderer.domElement );

        // manage window resizes
        window.addEventListener('resize', this.onResize.bind(this), false );
    }

    /**
     * initializes all the cameras
     */
    initCameras() {
        const aspect = window.innerWidth / window.innerHeight;

        // Create a basic perspective camera
        const perspective1 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        perspective1.position.set(0,10,0)
        this.cameras['Perspective'] = perspective1
    }

    loadCameras(data) {
        const aspect = window.innerWidth / window.innerHeight;

        var appCameras = []
        
        for (var cameraId in data.cameras) {
            var objectCamera = data.getCamera(cameraId)
            if (objectCamera.type === "perspective") {
                const perspective = new THREE.PerspectiveCamera( objectCamera.angle, aspect, objectCamera.near, objectCamera.far)
                perspective.position.set(objectCamera.location[0], objectCamera.location[1], objectCamera.location[2])
                const lookAt = new THREE.Vector3(objectCamera.target[0], objectCamera.target[1], objectCamera.target[2])
                perspective.lookAt(lookAt);
                appCameras[cameraId] = perspective
                console.log(perspective)
            }
            else if (objectCamera.type === "orthogonal") {
                const ortho = new THREE.OrthographicCamera( objectCamera.left, objectCamera.right, objectCamera.top, objectCamera.bottom, objectCamera.near, objectCamera.far);
                ortho.position.set(objectCamera.location[0], objectCamera.location[1], objectCamera.location[2])
                const lookAt = new THREE.Vector3(objectCamera.target[0], objectCamera.target[1], objectCamera.target[2])
                ortho.lookAt(lookAt);
                appCameras[cameraId] = ortho
                console.log(ortho)
                /*
                PERGUNTAR SOBRE O .up 
                */
            }
        }
        
        this.cameras = appCameras
        this.setActiveCamera(data.activeCameraId)

    }


    /**
     * sets the active camera by name
     * @param {String} cameraName 
     */
    setActiveCamera(cameraName) {   
        this.activeCameraName = cameraName
        this.activeCamera = this.cameras[this.activeCameraName]
    }

    /**
     * updates the active camera if required
     * this function is called in the render loop
     * when the active camera name changes
     * it updates the active camera and the controls
     */
    updateCameraIfRequired() {

        // camera changed?
        if (this.lastCameraName !== this.activeCameraName) {
            this.lastCameraName = this.activeCameraName;
            this.activeCamera = this.cameras[this.activeCameraName]
            document.getElementById("camera").innerHTML = this.activeCameraName
           
            // call on resize to update the camera aspect ratio
            // among other things
            this.onResize()

            // are the controls yet?
            if (this.controls === null) {
                // Orbit controls allow the camera to orbit around a target.
                this.controls = new OrbitControls( this.activeCamera, this.renderer.domElement );
                this.controls.enableZoom = true;
                this.controls.update();
            }
            else {
                this.controls.object = this.activeCamera
            }
        }
    }

    /**
     * the window resize handler
     */
    onResize() {
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.activeCamera.aspect = window.innerWidth / window.innerHeight;
            this.activeCamera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        }
    }
    /**
     * 
     * @param {MyContents} contents the contents object 
     */
    setContents(contents) {
        this.contents = contents;
    }

    /**
     * @param {MyGuiInterface} contents the gui interface object
     */
    setGui(gui) {   
        this.gui = gui

        // adds a folder to the gui interface for the camera
        const cameraFolder = this.gui.datgui.addFolder('Cameras')
        console.log("active camera name "+ this.activeCameraName)
        cameraFolder.add(this, 'activeCameraName',Object.keys(this.cameras)).name("active camera");
        cameraFolder.close() 

        const streetLightsFolder = this.gui.datgui.addFolder('Street Lights')

        const streetLight1Folder = streetLightsFolder.addFolder('Street Light 1')
        streetLight1Folder.add(this.contents.sceneGraph.sceneLights[2], 'intensity', 0, 100).name("Light Intensity")
        streetLight1Folder.add(this.contents.sceneGraph.sceneLights[2], 'visible',).name("Visible")
        streetLight1Folder.close()

        const streetLight2Folder = streetLightsFolder.addFolder('Street Light 2')
        streetLight2Folder.add(this.contents.sceneGraph.sceneLights[3], 'intensity', 0, 100).name("Light Intensity")
        streetLight2Folder.add(this.contents.sceneGraph.sceneLights[3], 'visible',).name("Visible")
        streetLight2Folder.close()

        const streetLight3Folder = streetLightsFolder.addFolder('Street Light 3')
        streetLight3Folder.add(this.contents.sceneGraph.sceneLights[4], 'intensity', 0, 100).name("Light Intensity")
        streetLight3Folder.add(this.contents.sceneGraph.sceneLights[4], 'visible',).name("Visible")
        streetLight3Folder.close()

        const streetLight4Folder = streetLightsFolder.addFolder('Street Light 4')
        streetLight4Folder.add(this.contents.sceneGraph.sceneLights[5], 'intensity', 0, 100).name("Light Intensity")
        streetLight4Folder.add(this.contents.sceneGraph.sceneLights[5], 'visible',).name("Visible")
        streetLight4Folder.close()
        
        streetLightsFolder.close()

        const ambientLightFolder = this.gui.datgui.addFolder('Ambient Light')

        const ambientLight1Folder = ambientLightFolder.addFolder('Ambient Light 1')
        ambientLight1Folder.add(this.contents.sceneGraph.sceneLights[0], 'intensity', 0, 10).name("Light Intensity")
        ambientLight1Folder.add(this.contents.sceneGraph.sceneLights[0], 'visible',).name("Visible")
        ambientLight1Folder.close()

        const ambientLight2Folder = ambientLightFolder.addFolder('Ambient Light 2')
        ambientLight2Folder.add(this.contents.sceneGraph.sceneLights[1], 'intensity', 0, 10).name("Light Intensity")
        ambientLight2Folder.add(this.contents.sceneGraph.sceneLights[1], 'visible',).name("Visible")
        ambientLight2Folder.close()

        ambientLightFolder.close()
    }

    /**
    * the main render function. Called in a requestAnimationFrame loop
    */
    render () {
        this.stats.begin()
        this.updateCameraIfRequired()

        // update the animation if contents were provided
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.contents.update()
        }

        // required if controls.enableDamping or controls.autoRotate are set to true
        this.controls.update();

        // render the scene
        this.renderer.render(this.scene, this.activeCamera);

        // subsequent async calls to the render loop
        requestAnimationFrame( this.render.bind(this) );

        this.lastCameraName = this.activeCameraName
        this.stats.end()
    }
}


export { MyApp };
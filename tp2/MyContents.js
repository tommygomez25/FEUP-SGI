import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
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

        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
		this.reader.open("scenes/demo/demo.xml");		
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
    }

    /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    onAfterSceneLoadedAndBeforeRender(data) {
       
        // refer to descriptors in class MySceneData.js
        // to see the  data structure for each item
        this.initGlobals(data)
        this.initFog(data)
        this.initCameras(data)
        /*
        this.output(data.options)
        console.log("textures:")
        for (var key in data.textures) {
            let texture = data.textures[key]
            this.output(texture, 1)
        }

        console.log("materials:")
        for (var key in data.materials) {
            let material = data.materials[key]
            this.output(material, 1)
        }

        console.log("cameras:")
        for (var key in data.cameras) {
            let camera = data.cameras[key]
            this.output(camera, 1)
        }

        console.log("nodes:")
        for (var key in data.nodes) {
            let node = data.nodes[key]
            this.output(node, 1)
            for (let i=0; i< node.children.length; i++) {
                let child = node.children[i]
                if (child.type === "primitive") {
                    console.log("" + new Array(2 * 4).join(' ') + " - " + child.type + " with "  + child.representations.length + " " + child.subtype + " representation(s)")
                    if (child.subtype === "nurbs") {
                        console.log("" + new Array(3 * 4).join(' ') + " - " + child.representations[0].controlpoints.length + " control points")
                    }
                }
                else {
                    this.output(child, 2)
                }
            }
        }*/
    }

    initGlobals(data) {
        this.globals = data.options
        this.app.scene.background = new THREE.Color(this.globals["background"]["r"], this.globals["background"]["g"], this.globals["background"]["b"])
        this.app.scene.ambient = new THREE.Color(this.globals["ambient"]["r"], this.globals["ambient"]["g"], this.globals["ambient"]["b"])
    }

    initFog(data) {
        this.fog = data.getFog()
        this.app.scene.fog = new THREE.Fog(this.fog.color, this.fog.near, this.fog.far)
    }

    initCameras(data) {
        this.cameras = data.cameras
        this.activeCameraId = data.activeCameraId
        this.activeCamera = data.getCamera(this.activeCameraId)
        
        const aspect = this.app.width / this.app.height;

        var appCameras = []
        
        for (var cameraId in this.cameras) {
            var objectCamera = data.getCamera(cameraId)
            if (objectCamera.type === "perspective") {
                
            }
        }
        //this.app.setActiveCamera(this.activeCamera)
    }

    update() {
        
    }
}

export { MyContents };
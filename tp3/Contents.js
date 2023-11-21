import * as THREE from 'three';
import { Axis } from './Axis.js';
import { FileReader } from './parser/FileReader.js';
/**
 *  This class contains the contents of out application
 */
class Contents  {

    /**
       constructs the object
       @param {App} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null

        this.reader = new FileReader(app, this, this.onSceneLoaded);
		this.reader.open("scenes/demo/demo.xml");		
    }

    /**
     * initializes the contents
     */
    init() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new Axis(this)
            this.app.scene.add(this.axis)
        }
    }

    /**
     * Called when the scene xml file load is complete
     * @param {SceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        console.info("scene data loaded " + data + ". visit SceneData javascript class to check contents for each data item.")
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    onAfterSceneLoadedAndBeforeRender(data) {
       
        // refer to descriptors in class SceneData.js
        // to see the data structure for each item

        this.output(data.options)

        // first and only skybox is called "default"
        this.output(data.skyboxes["default"])
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
            if (node.loaded === false) {
                console.error("" + new Array(2 * 4).join(' ') + " not loaded. Possibly refered as a node child but not defined in scene.")
            }
            for (let i=0; i< node.children.length; i++) {
                let child = node.children[i]
                if (child.type === "primitive") {
                    console.log("" + new Array(2 * 4).join(' ') + " - " + child.type + " with "  + child.representations.length + " " + child.subtype + " representation(s)")
                    if (child.subtype === "nurbs") {
                        console.log("" + new Array(3 * 4).join(' ') + " - " + child.representations[0].controlpoints.length + " control points")
                    }
                }
                else
                if (child.type === "lodref") {
                    console.log("" + new Array(2 * 4).join(' ') + " - " + child.type + ", id "  + child.id)                    
                }
                else {
                    this.output(child, 2)
                }
            }
        }

        console.log("lods:")
        for (var key in data.lods) {
            let lod = data.lods[key]
            this.output(lod, 1)
            if (lod.loaded === false) {
                console.error("" + new Array(2 * 4).join(' ') + " not loaded. Possibly refered as a node child but not defined in scene.")
            }
            for (let i=0; i< lod.children.length; i++) {
                let child = lod.children[i]
                console.log("" + new Array(2 * 4).join(' ') + " - " + child.type + " "  + child.node.id + ", min distance: " + child.mindist)
            }
        }
    }

    update() {
        
    }
}

export { Contents };
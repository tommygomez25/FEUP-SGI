import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MySceneGraph } from './MySceneGraph.js';
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
		this.reader.open("scenes/demo/demo1.xml");		

        this.sceneGraph = new MySceneGraph(this.app)
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
        this.loadTextures(data)
        this.loadMaterials(data)
        //this.addCube()
        this.sceneGraph.traverse(data)
        
        this.output(data.options)

        this.globals = data.options

        //Create background light
        this.app.scene.background = this.globals.background

        const ambientLight = new THREE.AmbientLight();
        ambientLight.color.setRGB(this.globals.ambient.r, this.globals.ambient.g, this.globals.ambient.b);
        this.app.scene.add(ambientLight);

        /*
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
        this.app.scene.background = this.globals.background

        const ambientLight = new THREE.AmbientLight();
        ambientLight.color.setRGB(this.globals.ambient.r, this.globals.ambient.g, this.globals.ambient.b);
        this.app.scene.add(ambientLight);
    }

    addCube(){
        const box = new THREE.BoxGeometry(1, 1, 1);
        const material = this.app.scene.materials["tableApp"];
        const cube = new THREE.Mesh(box, material);
        this.app.scene.add(cube);
    }

    initFog(data) {
        this.fog = data.getFog()
        this.app.scene.fog = new THREE.Fog(this.fog.color, this.fog.near, this.fog.far)
    }

    initCameras(data) {
        this.cameras = data.cameras
        this.activeCameraId = data.activeCameraId
        
        const aspect = window.innerWidth / window.innerHeight;

        var appCameras = []
        
        for (var cameraId in this.cameras) {
            var objectCamera = data.getCamera(cameraId)
            if (objectCamera.type === "perspective") {
                const perspective = new THREE.PerspectiveCamera( objectCamera.angle, aspect, objectCamera.near, objectCamera.far)
                perspective.position.set(objectCamera.location[0], objectCamera.location[1], objectCamera.location[2])
                appCameras[cameraId] = perspective
            }
            else if (objectCamera.type === "orthogonal") {
                const ortho = new THREE.OrthographicCamera( objectCamera.left, objectCamera.right, objectCamera.top, objectCamera.bottom, objectCamera.near, objectCamera.far);
                ortho.position.set(objectCamera.location[0], objectCamera.location[1], objectCamera.location[2])
                const lookAt = new THREE.Vector3(objectCamera.target[0], objectCamera.target[1], objectCamera.target[2])
                ortho.lookAt(lookAt);
                appCameras[cameraId] = ortho
                /*
                PERGUNTAR SOBRE O .up 
                */
            }
        }
        
        this.app.cameras = appCameras
        this.app.setActiveCamera(this.activeCameraId)
    }

    loadTextures(data) {
        this.textures = data.textures
        this.app.scene.textures = []
        for (var textureId in this.textures) {
            var filePath = data.textures[textureId].filepath
            var isVideo = data.textures[textureId].isVideo
            var magFilter = data.textures[textureId].magFilter
            var minFilter = data.textures[textureId].minFilter
            var mipmaps = data.textures[textureId].mipmaps
            var anisotropy = data.textures[textureId].anisotropy
            // mag and min to be used later

            
            this.app.scene.textures[textureId] = new THREE.TextureLoader().load(filePath)
            this.app.scene.textures[textureId].mipmaps = mipmaps
            this.app.scene.textures[textureId].anisotropy = anisotropy
        }
    }

    loadMaterials(data) {
        this.materials = data.materials
        this.app.scene.materials = []
        for (var materialId in this.materials) {
            // é suposto considerar tudo MeshPhongMaterial?
            var emissive = this.materials[materialId].emissive
            var color = this.materials[materialId].color
            var specular = this.materials[materialId].specular
            var shininess = this.materials[materialId].shininess
            var textureref = this.materials[materialId].textureref
            var texlength_s = this.materials[materialId].texlength_s
            var texlength_t = this.materials[materialId].texlength_t
            var twoSided = this.materials[materialId].twoSided
            var wireframe = this.materials[materialId].wireframe
            var shading = this.materials[materialId].shading
            var bumpMap = this.materials[materialId].bumpMap
            var bumpScale = this.materials[materialId].bumpScale
            
            // find texture
            var texture = this.app.scene.textures[textureref]
            //texture.wrapS = texlength_s
            //texture.wrapT = texlength_t
            if (wireframe === undefined) wireframe = false
            if (shading === undefined) shading = false 
            if (textureref === undefined) texture = null
            if (twoSided === undefined) twoSided = false

            
            var material = new THREE.MeshPhongMaterial({
                emissive: emissive, color: color, 
                specular: specular, shininess: shininess, 
                wireframe: wireframe, 
                flatShading: shading ? true : false, 
                side: twoSided ? THREE.DoubleSide : THREE.FrontSide,
                map: texture})

            
            this.app.scene.materials[materialId] = material
        }
    }

    update() {
        
    }
}

export { MyContents };

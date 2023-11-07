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
		this.reader.open("scenes/t07g08/final.xml");		

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
        this.app.loadCameras(data)

        this.initGlobals(data)
        this.initFog(data)
        this.initSkyBox(data)
        this.loadTextures(data)
        this.loadMaterials(data)
        this.sceneGraph.traverse(data)
        
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

    initFog(data) {
        this.fog = data.getFog()
        this.app.scene.fog = new THREE.Fog(this.fog.color, this.fog.near, this.fog.far)
    }

    initSkyBox(data) {
        this.skybox = data.getSkybox();
    
        let materialArray = [];
    
        const loader = new THREE.TextureLoader();
    
        const textures = [
            this.skybox.front,
            this.skybox.back,
            this.skybox.up,
            this.skybox.down,
            this.skybox.right,
            this.skybox.left
        ];
    
        textures.forEach((texture) => {
            const textureMap = loader.load(texture);
            const material = new THREE.MeshStandardMaterial({
                map: textureMap,
                emissive: new THREE.Color(this.skybox.emissive),
                emissiveIntensity:this.skybox.intensity
            });
            materialArray.push(material);
        });

        for (let i = 0; i < 6; i++) {
            materialArray[i].side = THREE.BackSide;
        }
    
        const skyboxGeometry = new THREE.BoxGeometry(this.skybox.size[0], this.skybox.size[1], this.skybox.size[2]);
        const skybox = new THREE.Mesh(skyboxGeometry, materialArray);
        skybox.position.set(this.skybox.center[0], this.skybox.center[1], this.skybox.center[2]);
    
        this.app.scene.add(skybox);
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
            var textureref = this.materials[materialId].textureref ? this.materials[materialId].textureref : null
            var texlength_s = this.materials[materialId].texlength_s ? this.materials[materialId].texlength_s : 1.0
            var texlength_t = this.materials[materialId].texlength_t ? this.materials[materialId].texlength_t : 1.0
            var twoSided = this.materials[materialId].twosided ? true : false
            var wireframe = this.materials[materialId].wireframe ? true : false
            var shading = this.materials[materialId].shading ? true : false
            var bump_ref = this.materials[materialId].bump_ref ? this.materials[materialId].bump_ref : null
            var bump_scale = this.materials[materialId].bump_scale ? this.materials[materialId].bump_scale : 1.0
            
            // find texture
            var texture = this.app.scene.textures[textureref]
            if (texture !== undefined) {texture.repeat = new THREE.Vector2(texlength_s, texlength_t)}

            
            var material = new THREE.MeshPhongMaterial({
                emissive: emissive, color: color, 
                specular: specular, shininess: shininess, 
                wireframe: wireframe, 
                flatShading: shading ? true : false, 
                side: twoSided ? THREE.DoubleSide : THREE.FrontSide,
                map: texture})

            console.log(material.emissive)
            this.app.scene.materials[materialId] = material
        }
    }

    update() {
        
    }
}

export { MyContents };

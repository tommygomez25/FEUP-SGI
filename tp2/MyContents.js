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
		this.reader.open("scenes/t07g08/stadium.xml");		
        
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
        this.sceneGraph = new MySceneGraph(this.app)
        this.sceneGraph.loadLods(data)
        this.sceneGraph.traverse(data)
        
        console.log("cameras:")
        for (var key in data.cameras) {
            let camera = data.cameras[key]
            this.output(camera, 1)
        }
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
            
            var texture = data.textures[textureId]

            var filePath = texture.filepath

            var isVideo = texture.isVideo === null ? false : texture.isVideo

            var magFilter = texture.magFilter === null ? 'LinearFilter' : texture.magFilter

            var minFilter = texture.minFilter === null ? 'LinearMipMapLinearFilter' : texture.minFilter

            var mipmaps = texture.mipmaps === null ? true : texture.mipmaps

            var anisotropy = texture.anisotropy === null ? 1 : texture.anisotropy

            var mipmap0 = texture.mipmap0 === null ? null : texture.mipmap0
            var mipmap1 = texture.mipmap1 === null ? null : texture.mipmap1
            var mipmap2 = texture.mipmap2 === null ? null : texture.mipmap2
            var mipmap3 = texture.mipmap3 === null ? null : texture.mipmap3
            var mipmap4 = texture.mipmap4 === null ? null : texture.mipmap4
            var mipmap5 = texture.mipmap5 === null ? null : texture.mipmap5
            var mipmap6 = texture.mipmap6 === null ? null : texture.mipmap6
            var mipmap7 = texture.mipmap7 === null ? null : texture.mipmap7

            var mipmapList = [mipmap0, mipmap1, mipmap2, mipmap3, mipmap4, mipmap5, mipmap6, mipmap7]

            
            this.minFilters= {
                    'NearestFilter': THREE.NearestFilter,
                    'NearestMipmapLinearFilter': THREE.NearestMipmapLinearFilter,
                    'NearestMipMapNearestFilter': THREE.NearestMipmapNearestFilter,
                    'LinearFilter ': THREE.LinearFilter,
                    'LinearMipmapLinearFilter': THREE.LinearMipmapLinearFilter,
                    'LinearMipmapNearestFilter': THREE.LinearMipmapNearestFilter,
                }
            this.magFilters= {
                    'NearestFilter': THREE.NearestFilter,
                    'LinearFilter': THREE.LinearFilter,
                }
            
            console.log(this.minFilters["NearestFilter"])
            console.log("FILE PATH: " + filePath)

            this.app.scene.textures[textureId] = new THREE.TextureLoader().load(filePath)
            this.app.scene.textures[textureId].anisotropy = anisotropy

            this.app.scene.textures[textureId].wrapS = THREE.RepeatWrapping
            this.app.scene.textures[textureId].wrapT = THREE.RepeatWrapping
            
            console.log("mipmaps: " + mipmaps)
            if (mipmaps === true) {
                this.app.scene.textures[textureId].generateMipmaps = true
                this.app.scene.textures[textureId].minFilter = this.minFilters[minFilter]
                this.app.scene.textures[textureId].magFilter = this.magFilters[magFilter]
                this.app.scene.textures[textureId].needsUpdate = true
            }

            else {
                this.app.scene.textures[textureId].generateMipmaps = false
                console.log("mipmap list: " + mipmapList)
                
                for (let i = 0; i < mipmapList.length; i++) {
                    if (mipmapList[i] !== null) {
                        console.log("Adding mipmap level")
                        this.loadMipmap(this.app.scene.textures[textureId], i, mipmapList[i])
                    }
                }
                this.app.scene.textures[textureId].needsUpdate = true
            }
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
            var bump_ref = this.materials[materialId].bumpref ? this.materials[materialId].bumpref : null
            var bump_scale = this.materials[materialId].bumpscale ? this.materials[materialId].bumpscale : 1.0
            var specular_ref = this.materials[materialId].specularref ? this.materials[materialId].specularref : null
            // find texture
            var texture = this.app.scene.textures[textureref]
            if (texture !== undefined) {texture.repeat = new THREE.Vector2(texlength_s, texlength_t)}
            
            var bumpTexture = this.app.scene.textures[bump_ref]
            if (bumpTexture !== undefined) {bumpTexture.repeat = new THREE.Vector2(texlength_s, texlength_t)}
            console.log("BUMP TEXTURE: " + bumpTexture)
            var specularTexture = this.app.scene.textures[specular_ref]
            if (specularTexture !== undefined) {specularTexture.repeat = new THREE.Vector2(texlength_s, texlength_t)}
            
            
            var material = new THREE.MeshPhongMaterial({
                emissive: emissive, color: color, 
                specular: specular, shininess: shininess, 
                wireframe: wireframe, 
                flatShading: shading ? true : false, 
                side: twoSided ? THREE.DoubleSide : THREE.FrontSide,
                map: texture,
                bumpMap: bumpTexture,
                bumpScale: bump_scale,
                specularMap: specularTexture})

            console.log(material.emissive)
            this.app.scene.materials[materialId] = material
        }
    }


    /**
     * load an image and create a mipmap to be added to a texture at the defined level.
     * In between, add the image some text and control squares. These items become part of the picture
     * 
     * @param {*} parentTexture the texture to which the mipmap is added
     * @param {*} level the level of the mipmap
     * @param {*} path the path for the mipmap image
    // * @param {*} size if size not null inscribe the value in the mipmap. null by default
    // * @param {*} color a color to be used for demo
     */
    loadMipmap(parentTexture, level, path)
    {
        // load texture. On loaded call the function to create the mipmap for the specified level 
        new THREE.TextureLoader().load(path, 
            function(mipmapTexture)  // onLoad callback
            {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                ctx.scale(1, 1);
                
                // const fontSize = 48
                const img = mipmapTexture.image         
                canvas.width = img.width;
                canvas.height = img.height

                // first draw the image
                ctx.drawImage(img, 0, 0 )
                             
                // set the mipmap image in the parent texture in the appropriate level
                parentTexture.mipmaps[level] = canvas
            },
            undefined, // onProgress callback currently not supported
            function(err) {
                console.error('Unable to load the image ' + path + ' as mipmap level ' + level + ".", err)
            }
        )
    }

    update() {
        
    }
}

export { MyContents };

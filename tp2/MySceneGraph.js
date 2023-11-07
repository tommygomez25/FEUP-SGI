import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

export class MySceneGraph {

    constructor(app) {
        this.app = app
        this.sceneObjects = []
        this.sceneLights = []
        this.defaultMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        this.primitives = []
    }
    /* NOTES: 
    Sempre que um nó tem um <noderef> , signfica que esse nó é pai do nó referenciado
    */

    traverse(data) {
        //  this.traverseScene(data.nodes["scene"])
        /*
        var group = this.traverseNode(data.nodes["rectangle1"])
        if (this.sceneObjects.some((e) => e.id === group.name)) { this.app.scene.add(group) }
        var group =this.traverseNode(data.nodes["rectangle2"])
        if (this.sceneObjects.some((e) => e.id === group.name)) { this.app.scene.add(group) }
        var group =this.traverseNode(data.nodes["rectangle3"])
        if (this.sceneObjects.some((e) => e.id === group.name)) { this.app.scene.add(group) }
        var group =this.traverseNode(data.nodes["rectangle4"])
        if (this.sceneObjects.some((e) => e.id === group.name)) { this.app.scene.add(group) }
        var group =this.traverseNode(data.nodes["rectangle5"])
        if (this.sceneObjects.some((e) => e.id === group.name)) { this.app.scene.add(group) }
        var group =this.traverseNode(data.nodes["rectangle6"])
        if (this.sceneObjects.some((e) => e.id === group.name)) { this.app.scene.add(group) }
        var group =this.traverseNode(data.nodes["unitCube"])
        if (this.sceneObjects.some((e) => e.id === group.name)) { this.app.scene.add(group) }
        var group =this.traverseNode(data.nodes["leg"])
        if (this.sceneObjects.some((e) => e.id === group.name)) { this.app.scene.add(group) }
        // se calahr tirar o add to scene do traverSENODE e pô-lo aqui
        var group = this.traverseNode(data.nodes["leg1"])
        if (this.sceneObjects.some((e) => e.id === group.name)) { this.app.scene.add(group) }
        var group = this.traverseNode(data.nodes["leg2"])
        if (this.sceneObjects.some((e) => e.id === group.name)) { this.app.scene.add(group) }
        var group = this.traverseNode(data.nodes["leg3"])
        if (this.sceneObjects.some((e) => e.id === group.name)) { this.app.scene.add(group) }
        var group = this.traverseNode(data.nodes["leg4"])
        if (this.sceneObjects.some((e) => e.id === group.name)) { this.app.scene.add(group) }
        var group = this.traverseNode(data.nodes["tableTop"])
        if (this.sceneObjects.some((e) => e.id === group.name)) { this.app.scene.add(group) }
        var group = this.traverseNode(data.nodes["table"])
        if (this.sceneObjects.some((e) => e.id === group.name)) { this.app.scene.add(group) }
        for (var key in group.children) {console.log(group.children[key])}
        */
        for (var key in data.nodes) {
            if (key === "scene") { this.traverseScene(data.nodes[key])}
            else {
                var materialId = data.nodes[key]["materialIds"]
                var group = this.traverseNode(data.nodes[key], materialId); 
                if (this.sceneObjects.some((e) => e.id === group.name)) { 
                    console.log("ADDING TO SCENE: " + group.name)
                    console.log("-----------------------")
                    this.app.scene.add(group) 
                }
            }
        }
        console.log("sceneObjects:")
        for (var key in this.sceneObjects) {
            let node = this.sceneObjects[key]
            console.log(node.id)
        }

    }

    traverseNode(node, parentMaterialId,castShadows,receiveShadows) {
        var currentGroup = new THREE.Group();
        currentGroup.name = node.id;
        console.log("Traversing node: " + node.id + " with material " + parentMaterialId);

        var castShadows = node.castShadows === null ? false : node.castShadows
        var receiveShadows = node.receiveShadows === null ? false : node.receiveShadows

        for (const key in node.children) {
            const child = node.children[key];
            
            if (child.type === "primitive") {
                
                if (child.subtype === "model3d") {
                    const loader = new OBJLoader()
                    const path = child.representations[0]["filepath"]
                    const material = this.app.scene.materials[parentMaterialId] ;
                    var primitive;
                    loader.load(path, (obj) => {
                        
                        obj.traverse((child) => {
                            if (child instanceof THREE.Mesh) {
                                child.material = material
                            }
                        });
                        this.applyTransformation(node, obj, castShadows, receiveShadows);
                        currentGroup.add(obj);
                        },
                        function (xhr) {
                            console.log((xhr.loaded / xhr.total * 100) + '% loaded')
                        },
                        function(err) {
                            console.error('An error happened', err)
                        })
                }
                else {
                    var primitive = this.traversePrimitive(child);

                    var mesh = this.createMesh(primitive, parentMaterialId);

                    this.applyTransformation(node, mesh, castShadows, receiveShadows);

                    currentGroup.add(mesh);
                }

                this.primitives.push(currentGroup);
                return currentGroup;
                
            } 
            
            else if (child.type === "node") {
                console.log("Traversing child node: " + child.id);

                if (child["materialIds"].length !== 0) {parentMaterialId = child["materialIds"];}

                console.log("CHILD NODE HAS MATERIAL: " + parentMaterialId)

                var childGroup = this.traverseNode(child, parentMaterialId,castShadows,receiveShadows);

                this.applyTransformation(node, currentGroup,castShadows,receiveShadows);

                this.primitives.push(currentGroup);

                currentGroup.add(childGroup);     
            }
        }

        console.log("cheguei aqui com o nó: " + node.id)
        this.applyTransformation(node, currentGroup,castShadows,receiveShadows);
        
        return currentGroup;
    }
    
    

    applyTransformation(node, mesh,castShadows,receiveShadows) {
        const transformations = node.transformations;
        
        var initialPosition = new THREE.Vector3(0, 0, 0);
        var initialScale = new THREE.Vector3(1, 1, 1);
        var initialRotation = new THREE.Vector3(0, 0, 0);

        for (let i = 0; i < transformations.length; i++) {
            const transformation = transformations[i];
            if (transformation.type === 'R') {
                mesh.rotation.set(
                    this.toRadians(transformation.rotation[0] + initialRotation.x),
                    this.toRadians(transformation.rotation[1] + initialRotation.y),
                    this.toRadians(transformation.rotation[2] + initialRotation.z)
                );
                initialRotation = mesh.initialRotation;
                
            }
            else if (transformation.type === 'T') {
                    
                    mesh.position.set(
                        transformation.translate[0] + initialPosition.x,
                        transformation.translate[1] + initialPosition.y,
                        transformation.translate[2] + initialPosition.z
                    );
                    initialPosition = mesh.position;
                
            } else if (transformation.type === 'S') {
                mesh.scale.set(
                    transformation.scale[0] * initialScale.x,
                    transformation.scale[1] * initialScale.y,
                    transformation.scale[2] * initialScale.z
                );
                initialScale = mesh.scale;
            }
        }

        if (transformations.length === 0) {
           // mesh.position.set(0, 0, 0);
           // mesh.scale.set(1, 1, 1);
           // mesh.rotation.set(0, 0, 0);
        }
        console.log("MESH + " + mesh.id + " SHADOWS: " + castShadows + " " + receiveShadows)
        mesh.castShadow = castShadows
        mesh.receiveShadow = receiveShadows
        // console log all transformations
        console.log("Transformation: " + node.id);
        console.log("Position: " + mesh.position.x + " " + mesh.position.y + " " + mesh.position.z);
        console.log("Scale: " + mesh.scale.x + " " + mesh.scale.y + " " + mesh.scale.z);
        console.log("Rotation: " + mesh.rotation.x + " " + mesh.rotation.y + " " + mesh.rotation.z);
    
        return mesh;
    }
    
    
    traversePrimitive(node) {
        console.log("PRIMITIVE : " + node.subtype)
        if (node.subtype === "rectangle") {
            var primitive = this.traverseRectangle(node)
        } else if (node.subtype === "triangle") {
            var primitive = this.traverseTriangle(node)
        } else if (node.subtype === "cylinder") {
            var primitive = this.traverseCylinder(node)
        } else if (node.subtype === "sphere") {
            var primitive = this.traverseSphere(node)
        } else if (node.subtype === "nurbs") {
            var primitive = this.traverseNurbs(node)
        } else if (node.subtype === "box") {
            var primitive = this.traverseBox(node)
        }
        return primitive
    }   
    
    traverseRectangle(node) {
        const representation = node.representations[0];
        const x1 = representation["xy1"][0];
        const y1 = representation["xy1"][1];
        const x2 = representation["xy2"][0];
        const y2 = representation["xy2"][1];
        
        const width = Math.abs(x2 - x1);
        const height = Math.abs(y2 - y1);
        const widthSegments = representation.parts_x;
        const heightSegments = representation.parts_y;
    
        const primitive = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments)
        primitive.translate((x1 + x2) / 2, (y1 + y2) / 2, 0);
                
        return primitive;
    }
    

    traverseTriangle(node) {
        const representation = node.representations[0]
        const primitive =  new THREE.BufferGeometry().setFromPoints((representation["xyz1"], representation["xyz2"], representation["xyz3"]))

        // TODO : distance???
        
        return primitive;   
    }

    traverseCylinder(node) {
        const representation = node.representations[0]
        const primitive = new THREE.CylinderGeometry(representation["top"], representation["base"] , representation["height"], representation["slices"], representation["stacks"])
        const capsclose = representation["capsclose"] ? true : false
        const thetastart = representation["thetastart"] ? representation["thetastart"] : 0.0
        const thetalength = representation["thetalength"] ? representation["thetalength"] : 2 * Math.PI
        const distance = representation["distance"] ? representation["distance"] : 0.0
        primitive.openEnded = !capsclose
        primitive.thetaStart = thetastart
        primitive.thetaLength = thetalength
        // TODO : distance???


        return primitive;
    }
    
    traverseSphere(node) {
        const representation = node.representations[0]
        const primitive = new THREE.SphereGeometry(representation["radius"], representation["slices"], representation["stacks"])
        const phistart = representation["phistart"] ? representation["phistart"] : 0.0
        const philength = representation["philength"] ? representation["philength"] : 2* Math.PI
        const thetastart = representation["thetastart"] ? representation["thetastart"] : 0.0
        const thetalength = representation["thetalength"] ? representation["thetalength"] : 2 * Math.PI
        const distance = representation["distance"] ? representation["distance"] : 0.0
        primitive.phiStart = phistart
        primitive.phiLength = philength
        primitive.thetaStart = thetastart
        primitive.thetaLength = thetalength
        // TODO : distance???


        return primitive;
        
    }

    traverseNurbs(node) {
        const representation = node.representations[0]
        const controlPointsLength = representation.controlpoints.length
        const controlPoints = representation.controlpoints
        var controlPointsArray = []

        const degree_u = representation.degree_u
        const degree_v = representation.degree_v
        const parts_u = representation.parts_u
        const parts_v = representation.parts_v

        const builder = new MyNurbsBuilder(this.app)
        for (var i = 0; i < degree_u + 1; i++) {
            var tempControlPointList = []
            for (var j = 0; j < degree_v + 1; j++) {
                var controlPoint = controlPoints[i * (degree_v + 1) + j]
                tempControlPointList.push([controlPoint.xx, controlPoint.yy, controlPoint.zz, 1])
            }
            controlPointsArray.push(tempControlPointList)
        }

        const surface = builder.build(controlPointsArray,degree_u,degree_v,parts_u,parts_v)

        return surface
    }

    traverseBox(node) {
        const representation = node.representations[0]

        const x1 = representation["xyz1"][0]
        const y1 = representation["xyz1"][1]
        const z1 = representation["xyz1"][2]

        const x2 = representation["xyz2"][0]
        const y2 = representation["xyz2"][1]
        const z2 = representation["xyz2"][2]

        const primitive = new THREE.BoxGeometry(x2 - x1, y2 - y1, z2 - z1)
        return primitive;
    }

    traverseLights(node) {
        if (node.type === "pointlight") {
            var light = this.createPointlight(node)
            // TODO: ADD OTHER TYPE OF LIGHTS
        }
        else if (node.type === "spotlight") {
            var light = this.createSpotlight(node)
        }
        else if (node.type === "directionallight") {
            var light = this.createDirectionalLight(node)
        }
        return light
    }

    traverseScene(node) {
        for (const key in node.children) {

            const child = node.children[key]
            if (child.type !== "node") {
                this.traverseLights(child)
            }
            else {
                this.sceneObjects.push(child)
            }
        }

    }   

    createMesh(primitive,parentMaterialId) {
        console.log("Creating mesh with material " + parentMaterialId)

        const material = this.app.scene.materials[parentMaterialId] ;

        return new THREE.Mesh(primitive, material)
    }

    createPointlight(node) {
        
        const lightColor = new THREE.Color(node["color"]["r"], node["color"]["g"], node["color"]["b"])
        
        const lightPosition = node["position"]

        const lightEnabled = node["enabled"] === null ? true : node["enabled"]

        const lightIntensity = node["intensity"] === null ? 1.0 : node["intensity"]

        const lightDistance = node["distance"] === null ? 1000 : node["distance"]

        const lightDecay = node["decay"] === null ? 2.0 : node["decay"]

        const lightCastshadow = node["castshadow"] === null ? false : node["castshadow"]

        const lightShadowfar = node["shadowfar"] === null ? 500.0 : node["shadowfar"]

        const lightShadowmapsize = node["shadowmapsize"] === null ? 512 : node["shadowmapsize"]

        const light = new THREE.PointLight(lightColor, lightIntensity, lightDistance, lightDecay)

        light.position.set(lightPosition[0], lightPosition[1], lightPosition[2])

        this.app.scene.add(light)

        light.castShadow = lightCastshadow

        light.shadow.camera.far = lightShadowfar

        light.shadow.mapSize.width = lightShadowmapsize

        light.visible = lightEnabled

        console.log(light)

        const lightHelper = new THREE.PointLightHelper(light, 1)

        this.app.scene.add(lightHelper)

        return light
    } 

    createSpotlight(node) {
        
        const lightColor = new THREE.Color(node["color"]["r"], node["color"]["g"], node["color"]["b"])
        
        const lightPosition = node["position"]
        
        const lightTarget = node["target"]
        
        const lightAngle = node["angle"]
        
        const lightEnabled = node["enabled"] === null ? false : node["enabled"]
        
        const lightIntensity = node["intensity"] === null ? 1.0 : node["intensity"]
        
        const lightDistance = node["distance"] === null ? 1000 : node["distance"]
        
        const lightDecay = node["decay"] === null ? 2.0 : node["decay"]
        
        const lightPenumbra = node["penumbra"] === null ? 1.0 : node["penumbra"]
        
        const castshadow = node["castshadow"] === null ? false : node["castshadow"]
        
        const shadowfar = node["shadowfar"] === null ? 500.0 : node["shadowfar"]
        
        const shadowmapsize = node["shadowmapsize"] === null ? 512 : node["shadowmapsize"]

        const light = new THREE.SpotLight(lightColor, lightIntensity)
        
        light.angle = this.toRadians(lightAngle)
        
        light.penumbra = lightPenumbra
        
        light.distance = lightDistance
        
        light.decay = lightDecay
        
        light.castShadow = castshadow
        
        light.position.set(lightPosition[0], lightPosition[1], lightPosition[2])
        
        const targetObject = new THREE.Object3D()
        targetObject.position.set(lightTarget[0], lightTarget[1], lightTarget[2])
        this.app.scene.add(targetObject)
        
        light.target = targetObject
        this.app.scene.add(light)
        
        light.shadow.camera.far = shadowfar
        
        light.shadow.mapSize.width = shadowmapsize
        
        light.shadow.mapSize.height = shadowmapsize
        
        light.visible = lightEnabled

        console.log(light)

        const lightHelper = new THREE.SpotLightHelper(light)
        this.app.scene.add(lightHelper)
        return light
    }

    createDirectionalLight(node) {
        
        const lightColor = new THREE.Color(node["color"]["r"], node["color"]["g"], node["color"]["b"])
        
        const lightPosition = node["position"]
        
        const lightEnabled = node["enabled"] === null ? false : node["enabled"]
        
        const lightIntensity = node["intensity"] === null ? 1.0 : node["intensity"]
        
        const lightCastshadow = node["castshadow"] === null ? false : node["castshadow"]
        
        const lightShadowLeft = node["shadowleft"] === null ? -5.0 : node["shadowleft"]
        
        const lightShadowRight = node["shadowright"] === null ? 5.0 : node["shadowright"]
        
        const lightShadowBottom = node["shadowbottom"] === null ? -5.0 : node["shadowbottom"]
        
        const lightShadowTop = node["shadowtop"] === null ? 5.0 : node["shadowtop"]
        
        const lightShadowFar = node["shadowfar"] === null ? 500.0 : node["shadowfar"]
        
        const lightShadowmapsize = node["shadowmapsize"] === null ? 512 : node["shadowmapsize"]

        const light = new THREE.DirectionalLight(lightColor, lightIntensity)
        
        light.position.set(lightPosition[0], lightPosition[1], lightPosition[2])
        
        light.castShadow = lightCastshadow
        
        this.app.scene.add(light)
        
        light.visible = lightEnabled
        
        light.shadow.camera.left = lightShadowLeft
        
        light.shadow.camera.right = lightShadowRight
        
        light.shadow.camera.bottom = lightShadowBottom
        
        light.shadow.camera.top = lightShadowTop
        
        light.shadow.camera.far = lightShadowFar
        
        light.shadow.mapSize.width = lightShadowmapsize
        
        light.shadow.mapSize.height = lightShadowmapsize
        
        const lightHelper = new THREE.DirectionalLightHelper(light, 1)
        this.app.scene.add(lightHelper)
        return light
    }   


    toRadians(angle) {
        return angle * (Math.PI / 180);
    }
    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }
}


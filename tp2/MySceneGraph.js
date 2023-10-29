import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

export class MySceneGraph {

    constructor(app) {
        this.app = app
        this.sceneObjects = []
        this.sceneLights = []
        this.defaultMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        this.primitives = []
    }

    /*
    traverse(data) {
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
        }
    }
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
                var group = this.traverseNode(data.nodes[key]); 
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

    traverseNode(node) {
        var currentGroup = new THREE.Group();
        currentGroup.name = node.id;
        console.log("Traversing node: " + node.id);

        for (const key in node.children) {
            const child = node.children[key];
            
    
            if (child.type === "primitive") {
                var primitive = this.traversePrimitive(child);
                var mesh = this.createMesh(primitive, node);
                this.applyTransformation(node, mesh);
                currentGroup.add(mesh);
                this.primitives.push(currentGroup);
                return currentGroup;
                
            } else if (child.type === "node") {
                console.log("Traversing child node: " + child.id);

                if (this.primitives.some((e) => e.name === child.id)) {
                    console.log("found primitive with id " + child.id);
                    console.log("Adding primitive " + child.id + " to currentGroup: " + currentGroup.name)

                    var group = (this.primitives.find((e) => e.name === child.id));  
                    let cloned = group.clone();
                    cloned.name = child.id;
                    currentGroup.add(cloned);
                }
                else {
                    // TODO 
                    
                }                
            }
        }
    

        this.applyTransformation(node, currentGroup);
        this.primitives.push(currentGroup);
    
        return currentGroup;
    }
    
    

    applyTransformation(node, mesh) {
        const transformations = node.transformations;
    
        for (let i = 0; i < transformations.length; i++) {
            const transformation = transformations[i];
            if (transformation.type === 'R') {
                mesh.rotation.set(
                    this.toRadians(transformation.rotation[0]),
                    this.toRadians(transformation.rotation[1]),
                    this.toRadians(transformation.rotation[2])
                );
            }
            else if (transformation.type === 'T') {
                    
                    mesh.position.set(
                        transformation.translate[0],
                        transformation.translate[1],
                        transformation.translate[2]
                    );
                
            } else if (transformation.type === 'S') {
                mesh.scale.set(
                    transformation.scale[0],
                    transformation.scale[1],
                    transformation.scale[2]
                );
            }
        }

        if (transformations.length === 0) {
           // mesh.position.set(0, 0, 0);
           // mesh.scale.set(1, 1, 1);
           // mesh.rotation.set(0, 0, 0);
        }
    
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
            var primitive = this.traverseNurbs(fatherNode,node)
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
        
        const width = x2 - x1;
        const height = y2 - y1;

    
        const primitive = new THREE.PlaneGeometry(width, height);
                
        return primitive;
    }
    

    traverseTriangle(node) {
        const representation = node.representations[0]
        const x1 = representation["xyz1"][0]
        const y1 = representation["xyz1"][1]
        const z1 = representation["xyz1"][2]

        const x2 = representation["xyz2"][0]
        const y2 = representation["xyz2"][1]
        const z2 = representation["xyz2"][2]
        
        const x3 = representation["xyz3"][0]
        const y3 = representation["xyz3"][1]
        const z3 = representation["xyz3"][2]

        const primitive =  new THREE.BufferGeometry().setFromPoints((representation["xyz1"], representation["xyz2"], representation["xyz3"]))

        // TODO : distance???
        
        return primitive;   
    }

    traverseCylinder(node) {
        const representation = node.representations[0]
        const primitive = new THREE.CylinderGeometry(representation["base"], representation["top"], representation["height"], representation["slices"], representation["stacks"])
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

    traverseNurbs(fatherNode,node) {
        const representation = node.representations[0]
        const controlPointsLength = representation.controlpoints.length
        const controlPoints = representation.controlpoints
        var controlPointsArray = []
        for (var i = 0; i < controlPointsLength; i++) {
            var controlPoint = controlPoints[i]
            controlPointsArray.push([controlPoint.xx, controlPoint.yy, controlPoint.zz, 1])
        }

        const degree_u = representation.degree_u
        const degree_v = representation.degree_v
        const parts_u = representation.parts_u
        const parts_v = representation.parts_v

        const builder = new MyNurbsBuilder(this.app)
        const material = this.app.scene.materials[fatherNode.materialIds] ? this.app.scene.materials[fatherNode.materialIds] : this.defaultMaterial;
        const surface = builder.build(controlPointsArray,degree_u,degree_v,parts_u,parts_v,material)

        return new THREE.Mesh(surface, material)
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
            const id = node.id
            const lightColor = new THREE.Color(node["color"]["r"], node["color"]["g"], node["color"]["b"])
            console.log(lightColor)
            const lightPosition = node["position"]
            // if enabled is null, default is true
            const lightEnabled = node["enabled"] === null ? true : node["enabled"]
            // if intensity is null, default is 1.0
            const lightIntensity = node["intensity"] === null ? 1.0 : node["intensity"]
            // if distance is null, default is 1000
            const lightDistance = node["distance"] === null ? 1000 : node["distance"]
            // if decay is null, default is 2.0
            const lightDecay = node["decay"] === null ? 2.0 : node["decay"]
            // if castshadow is null, default is false
            const lightCastshadow = node["castshadow"] === null ? false : node["castshadow"]
            // if shadowmapsize is null, default is 500.0
            const lightShadowfar = node["shadowfar"] === null ? 500.0 : node["shadowfar"]
            // if shadowmapsize is null, default is 512
            const lightShadowmapsize = node["shadowmapsize"] === null ? 512 : node["shadowmapsize"]

            const light = new THREE.PointLight(lightColor, lightIntensity, lightDistance, lightDecay)
            light.position.set(lightPosition[0], lightPosition[1], lightPosition[2])
            this.app.scene.add(light)
            console.log(light)

            const lightHelper = new THREE.PointLightHelper(light, 1)
            this.app.scene.add(lightHelper)
            // TODO: ADD OTHER TYPE OF LIGHTS
        }
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

    createMesh(primitive,node) {
        const material = this.app.scene.materials[node.materialIds] ? this.app.scene.materials[node.materialIds] : this.defaultMaterial;
        return new THREE.Mesh(primitive, material)
    }
    toRadians(angle) {
        return angle * (Math.PI / 180);
    }
    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }
}


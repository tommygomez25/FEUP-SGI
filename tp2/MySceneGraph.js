import * as THREE from 'three';

export class MySceneGraph {

    constructor(app) {
        this.app = app
        this.sceneObjects = []
        this.sceneLights = []
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
        for (const key in data.nodes) {
            //console.log("key: " + key)
            if (key === "scene") {
                this.traverseSceneObjects(data.nodes[key])
            }
        }
    }

    traverseSceneObjects(node) {
        for (const key in node.children) {
            const child = node.children[key]
            //console.log("child: " + child.id)
            //console.log("child type: " + child.type)
            if (child.type !== "node") {
                this.traverseLights(child)
            }
        }
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

        }
    }

    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }
}


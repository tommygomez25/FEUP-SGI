import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
import { MyUtils } from './MyUtils.js';

class MyFlower {
    constructor(app) {
            
            this.app = app
            this.samplesU = 30
            this.samplesV = 30    
            this.numberOfSamples = 100    
            this.builder = new MyNurbsBuilder(this.app)
            this.utils = new MyUtils(this.app)
            this.flowerStalkMaterial = new THREE.MeshPhongMaterial({ color: "#000000", specular: "#000000", emissive: "#000000", shininess: 90, side: THREE.DoubleSide });
        }
    
    create() {
        const points = []
        const length = 3
        const curveHeight =0.5 // this controls the curve of the stalk
        for (let i = 0; i <= this.numberOfSamples; i++) {
            const t = i / this.numberOfSamples
            const x = 0
            const y = t * length
            const z = curveHeight * Math.sin(t * Math.PI)
            points.push(new THREE.Vector3(x, y, z))
        }

        const curve = new THREE.CatmullRomCurve3(points)
        const sampledPoints = curve.getPoints(this.numberOfSamples)

        const stalkGeometry = new THREE.BufferGeometry().setFromPoints(sampledPoints)
        const stalkMaterial = new THREE.LineBasicMaterial({ color: 0x006400 })
        this.stalk = new THREE.Line(stalkGeometry, stalkMaterial)
        this.stalk.position.set(0, 0, -0.2)
        this.stalk.scale.set(0.9,0.9,0.9)

        const flowerLeafs = []
        const leaf1 = this.drawLeaf(new THREE.Vector3(-0.5,0,0),0.5)
        leaf1.rotation.z = Math.PI/2
        flowerLeafs.push(leaf1)
        const leaf2 = this.drawLeaf(new THREE.Vector3(0.5,0,0),0.5)
        leaf2.rotation.z = -Math.PI/1.5
        flowerLeafs.push(leaf2)
        const leaf3 = this.drawLeaf(new THREE.Vector3(-0.25,0.45,0),0.5)
        leaf3.rotation.z =0
        flowerLeafs.push(leaf3)
        const leaf4 = this.drawLeaf(new THREE.Vector3(0.25,0.45,0),0.5)
        leaf4.rotation.z = 0
        flowerLeafs.push(leaf4)
        const leaf5 = this.drawLeaf(new THREE.Vector3(-0.25,-0.45,0),0.5)
        leaf5.rotation.z = Math.PI - 1
        flowerLeafs.push(leaf5)
        const leaf6 = this.drawLeaf(new THREE.Vector3(0.25,-0.45,0),0.5)
        leaf6.rotation.z = Math.PI + 1
        flowerLeafs.push(leaf6)
        const center = this.drawFlowerCenter(new THREE.Vector3(0,3.45,-0.15),0.5)
        center.add(...flowerLeafs)
        this.stalk.add(center)


        return this.stalk
    }

    drawLeaf(position,size) {
        const leafGeometry = new THREE.CircleGeometry(size, 32, 0, 4);
        const leafMaterial = new THREE.MeshPhongMaterial({ color: "#ff0000" , side: THREE.DoubleSide    });
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        leaf.position.set(position.x,position.y,position.z)
        return leaf;
    }

    drawFlowerCenter(position,radius) {
        const centerGeometry = new THREE.CircleGeometry(radius, 32);
        const centerMaterial = new THREE.MeshPhongMaterial({ color: "#FFD700" ,side: THREE.DoubleSide});
        const center = new THREE.Mesh(centerGeometry, centerMaterial);
        center.rotation.y = Math.PI / 2
        center.position.set(position.x,position.y,position.z)
        return center;
    }
        
}

export { MyFlower }
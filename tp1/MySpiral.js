import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
import { MyUtils } from './MyUtils.js';

class MySpiral {
    constructor(app) {
            
            this.app = app
            this.samplesU = 30
            this.samplesV = 30    
            this.numberOfSamples = 100    
            this.builder = new MyNurbsBuilder(this.app)
            this.utils = new MyUtils(this.app)
    }

    create() {
        const segments = 100
        const radius = 0.1
        const numberOfLoops = 3
        const height = 0.1
        let points = []

        var angleStep = 2 * Math.PI / segments; // 2PI = 360º, logo vou dividir o circulo em 100 partes e desenha-las
        var heightStep = height / segments; // 0.1 = altura da mola , logo vou dividir a mola em 100 partes e desenha-las

        /*
            x ->  cos(t) * raio
            y ->  t * h
            z ->  sin(t) * raio
        */
        for (let i = 0; i < numberOfLoops * segments; i++) {
            const x = Math.cos(i * angleStep) * radius
            const y = i * heightStep
            const z = Math.sin(i * angleStep) * radius
            points.push(new THREE.Vector3(x, y, z))
        }

        const curve = new THREE.CatmullRomCurve3(points)
        const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(segments))
        const material = new THREE.LineBasicMaterial({ color: 0xdcdcdc })
        const line = new THREE.Line(geometry, material)
        line.position.set(-0.75,height-0.05,-0.75)
        return line
    }

        
}

export { MySpiral }
import * as THREE from 'three';

class MyUtils {
    constructor(app) {
            
            this.app = app
            this.numberOfSamples = 100
        }

        drawSemiCircunference(position, radius, numberOfSamples) {
            let points = []
            const inicialAngle = 0
            const finalAngle = Math.PI
    
            for (let i = 0; i <= numberOfSamples; i++) {
                const t = i / this.numberOfSamples
                const x = radius * Math.cos(inicialAngle + t * (finalAngle - inicialAngle))
                const y = radius * Math.sin(inicialAngle + t * (finalAngle - inicialAngle))
                points.push(new THREE.Vector3(x, y, 0))
            }
    
            let curve = new THREE.CatmullRomCurve3( points )
            let sampledPoints = curve.getPoints( this.numberOfSamples );
            this.curveGeometry = new THREE.BufferGeometry().setFromPoints( sampledPoints )
            this.lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } )
            this.lineObj = new THREE.Line( this.curveGeometry, this.lineMaterial )
            this.lineObj.position.set(position.x,position.y,position.z)
            return this.lineObj
    
        }
    
        drawQuarterCircunference(position, radius, numberOfSamples,reverse) {
            let points = []
            const inicialAngle = 0
            const finalAngle = Math.PI / 2
    
            for (let i = 0; i <= numberOfSamples; i++) {
                const t = i / this.numberOfSamples
                if (reverse === true) {
                    const x = radius * Math.cos(inicialAngle + t * (finalAngle - inicialAngle))
                    const y = radius * Math.sin(inicialAngle + t * (finalAngle - inicialAngle))
                    points.push(new THREE.Vector3(x, y, 0))
                }
                else {
                    const x = radius * Math.cos(finalAngle - t * (inicialAngle - finalAngle))
                    const y = radius * Math.sin(finalAngle - t * (inicialAngle - finalAngle))
                    points.push(new THREE.Vector3(x, y, 0))
                }
            }
    
            let curve = new THREE.CatmullRomCurve3( points )
            let sampledPoints = curve.getPoints( this.numberOfSamples );
            this.curveGeometry = new THREE.BufferGeometry().setFromPoints( sampledPoints )
            this.lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } )
            this.lineObj = new THREE.Line( this.curveGeometry, this.lineMaterial )
            this.lineObj.position.set(position.x,position.y,position.z)
            return this.lineObj
        }
}

export { MyUtils }
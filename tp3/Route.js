import * as THREE from 'three';

class Route {
    constructor() {
        this.keyRoutes = []

        this.rotationRoutes = []

        this.buildRoutes();
    }

    buildRoutes() {
        const routePoints1 = [
            new THREE.Vector3(8, 2, 0), // 1
            new THREE.Vector3(12, 2, 25), // 2
            new THREE.Vector3(12, 2, 50), // 3
            new THREE.Vector3(12, 2, 75), // 4
            new THREE.Vector3(4, 2, 105), // 5
            new THREE.Vector3(-20, 2, 115), // 6
            new THREE.Vector3(-50, 2, 115), // 7
            new THREE.Vector3(-80, 2, 115), // 7
            new THREE.Vector3(-100, 2, 105), // 8
            new THREE.Vector3(-110, 2, 85), // 9
            new THREE.Vector3(-110, 2, 50), // 10
            new THREE.Vector3(-80, 2, 35), // 11
            new THREE.Vector3(-55, 2, 20), // 12
            new THREE.Vector3(-50, 2, 0), // 13
            new THREE.Vector3(-55, 2, -20), // 14
            new THREE.Vector3(-65, 2, -30), // 15
            new THREE.Vector3(-95, 2, -40), // 16
            new THREE.Vector3(-110, 2, -50), // 17
            new THREE.Vector3(-110, 2, -85), // 18
            new THREE.Vector3(-100, 2, -105), // 19
            new THREE.Vector3(-60, 2, -115), // 20
            new THREE.Vector3(-20, 2, -115), // 20
            new THREE.Vector3(8, 2, -100), // 21
            new THREE.Vector3(12, 2, -75), // 22
            new THREE.Vector3(12, 2, -50), // 23
            new THREE.Vector3(12, 2, -25), // 24
            new THREE.Vector3(8, 2, 0), // 25
            
        ];

        this.keyRoutes.push(routePoints1);

        const yAxis = new THREE.Vector3(0, 1, 0)
        /*
        const q1 = new THREE.Quaternion().setFromAxisAngle(yAxis, 0)
        const q2 = new THREE.Quaternion().setFromAxisAngle(yAxis, 0) // this is the starting point
        const q3 = new THREE.Quaternion().setFromAxisAngle(yAxis, 0)
        const q4 = new THREE.Quaternion().setFromAxisAngle(yAxis, 0)
        const q5 = new THREE.Quaternion().setFromAxisAngle(yAxis, -20)
        const q6 = new THREE.Quaternion().setFromAxisAngle(yAxis, -20)
        const q7 = new THREE.Quaternion().setFromAxisAngle(yAxis, -80)
        const q8 = new THREE.Quaternion().setFromAxisAngle(yAxis, -80) 
        const q9 = new THREE.Quaternion().setFromAxisAngle(yAxis, -100)
        const q10 = new THREE.Quaternion().setFromAxisAngle(yAxis, 174)
        const q11 = new THREE.Quaternion().setFromAxisAngle(yAxis, 222)
        const q12 = new THREE.Quaternion().setFromAxisAngle(yAxis, 240)
        const q13 = new THREE.Quaternion().setFromAxisAngle(yAxis, 250)
        const q14 = new THREE.Quaternion().setFromAxisAngle(yAxis, 222)
        const q15 = new THREE.Quaternion().setFromAxisAngle(yAxis, 214)
        const q16 = new THREE.Quaternion().setFromAxisAngle(yAxis, 196)
        const q17 = new THREE.Quaternion().setFromAxisAngle(yAxis, 196)
        const q18 = new THREE.Quaternion().setFromAxisAngle(yAxis, 177)
        const q19 = new THREE.Quaternion().setFromAxisAngle(yAxis, 154)
        const q20 = new THREE.Quaternion().setFromAxisAngle(yAxis, 130)
        const q21 = new THREE.Quaternion().setFromAxisAngle(yAxis, 127)
        const q22 = new THREE.Quaternion().setFromAxisAngle(yAxis, 100)
        const q23 = new THREE.Quaternion().setFromAxisAngle(yAxis, 129)
        const q24 = new THREE.Quaternion().setFromAxisAngle(yAxis, 131)
        const q25 = new THREE.Quaternion().setFromAxisAngle(yAxis, 131)
        const q26 = new THREE.Quaternion().setFromAxisAngle(yAxis, 204)
        const q27 = new THREE.Quaternion().setFromAxisAngle(yAxis, 242)
        const q28 = new THREE.Quaternion().setFromAxisAngle(yAxis, 270)
        const q29 = new THREE.Quaternion().setFromAxisAngle(yAxis, 275)
        const q30 = new THREE.Quaternion().setFromAxisAngle(yAxis, 295)
        const q31 = new THREE.Quaternion().setFromAxisAngle(yAxis, 0)
        const q32 = new THREE.Quaternion().setFromAxisAngle(yAxis, 0)
        const q33 = new THREE.Quaternion().setFromAxisAngle(yAxis, 0)
        const q34 = new THREE.Quaternion().setFromAxisAngle(yAxis, 0)
        const q35 = new THREE.Quaternion().setFromAxisAngle(yAxis, 0)
        

        const rotationY1 = []
        rotationY1.push(q1)
        rotationY1.push(q2)
        rotationY1.push(q3)
        rotationY1.push(q4)
        rotationY1.push(q5)
        rotationY1.push(q6)
        rotationY1.push(q7)
        rotationY1.push(q8)
        rotationY1.push(q9)
        rotationY1.push(q10)
        rotationY1.push(q11)
        rotationY1.push(q12)
        rotationY1.push(q13)
        rotationY1.push(q14)
        rotationY1.push(q15)
        rotationY1.push(q16)
        rotationY1.push(q17)
        rotationY1.push(q18)
        rotationY1.push(q19)
        rotationY1.push(q20)
        rotationY1.push(q21)
        rotationY1.push(q22)
        rotationY1.push(q23)
        rotationY1.push(q24)
        rotationY1.push(q25)
        rotationY1.push(q26)
        rotationY1.push(q27)
        rotationY1.push(q28)
        rotationY1.push(q29)
        rotationY1.push(q30)
        rotationY1.push(q31)
        rotationY1.push(q32)
        rotationY1.push(q33)
        rotationY1.push(q34)
        rotationY1.push(q35)

        /*
        const rotationY2 = []
        rotationY2.push(q1)
        rotationY2.push(q2)
        rotationY2.push(q3)
        rotationY2.push(q4)
        rotationY2.push(q5)
        rotationY2.push(q6)
        rotationY2.push(q7)
        rotationY2.push(q8)
        rotationY2.push(q9)
        

        */

        const rotationY1 = [];
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis, 0)); // 0
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis,0)); // 1
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis, 0)); // 2
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis, 0)); // 3
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis, -Math.PI / 4)); // 4
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis, -Math.PI / 2)); // 5
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis, -Math.PI / 2)); // 5
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis, -2 * Math.PI / 3)); // 6
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis, -5 * Math.PI / 6)); // 7
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis, -Math.PI)); // 8
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis, 5 * Math.PI / 6)); // 9
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis, 2 * Math.PI / 3)); // 10
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI)); // 11
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI )); // 12
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis, - 2 * Math.PI / 3)); // 13
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis, - 2 * Math.PI / 3)); // 14
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis, -2 * Math.PI / 3 )); // 15
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis,  Math.PI )); // 16
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI)); // 17
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI / 2)); // 18
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI / 2)); // 29
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI / 2)); // 29
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis,  Math.PI/4)); // 20
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis, 0)); // 21
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis, 0)); // 22
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis, 0)); // 23
        rotationY1.push(new THREE.Quaternion().setFromAxisAngle(yAxis,0)); // 24

        this.rotationRoutes.push(rotationY1)

        //this.rotationRoutes.push(rotationY2)
    }
} 

export { Route };
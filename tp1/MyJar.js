import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
import { MyUtils } from './MyUtils.js';

class MyJar {
    constructor(app) {
            
            this.app = app
            this.jarMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 90, side: THREE.DoubleSide });
            this.samplesU = 30
            this.samplesV = 30        
            this.builder = new MyNurbsBuilder(this.app)
            this.utils = new MyUtils(this.app)
            this.leftJarMesh = null
            this.rightJarMesh = null
        }
    
    create(tampoMesh) {
        // declare local variables
        let controlPoints;
        let surfaceData;
        let mesh;
        let orderU = 2
        let orderV = 3
        // build jar #1
        controlPoints =
        [   
        // U = 0
            [ // V = 0..3;
                [-1.0, -2.0, 0.0, 1 ],
                [-1.0,  0.0, 0.0, 1 ],
                [-0.25, 1.0, 0.0, 1 ],
                [-0.5,  2.0, 0.0, 1 ]
            ],

        // U = 1
            [ // V = 0..3;
                [ 0.0, -2.0, 2.0, 1 ],
                [ 0.0, 0.0, 2.0, 1 ],
                [ 0.0, 1.0, 0.5, 1 ],
                [ 0.0, 2.0, 1.0, 1 ]                                                
            ],
        // U = 2
            [ // V = 0..3;
                [ 1.0, -2.0, 0.0, 1 ],
                [ 1.0, 0.0, 0.0, 1 ],
                [ 0.25, 1.0, 0.0, 1 ],
                [ 0.5, 2.0, 0.0, 1 ]
            ],
        ]   

        surfaceData = this.builder.build(controlPoints,
                orderU, orderV, this.samplesU,
                 this.samplesV, this.jarMaterial)  

        this.leftJarMesh = new THREE.Mesh( surfaceData, this.jarMaterial );
        this.rightJarMesh = new THREE.Mesh( surfaceData, this.jarMaterial );
        this.leftJarMesh.rotation.x = 0
        this.leftJarMesh.scale.set( 0.14,0.14,0.14)
        this.leftJarMesh.position.set( -0.7,0.3,0.7)
        this.leftJarMesh.add(this.rightJarMesh)
        this.rightJarMesh.scale.set( 1,1,-1)

        tampoMesh.add(this.leftJarMesh)

        return this.leftJarMesh
    }

        
}

export { MyJar }
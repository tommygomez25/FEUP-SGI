import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
import { MyUtils } from './MyUtils.js';

class MyJornal {
    constructor(app) {
            
            this.app = app
            this.samplesU = 30
            this.samplesV = 30    
            this.numberOfSamples = 100    
            this.builder = new MyNurbsBuilder(this.app)
            this.utils = new MyUtils(this.app)

            this.jornalTexture = new THREE.TextureLoader().load( 'textures/jornal.jpg' );
            this.jornalTexture.wrapS = THREE.RepeatWrapping;
            this.jornalTexture.wrapT = THREE.RepeatWrapping;
            this.jornalMaterial = new THREE.MeshBasicMaterial({ map: this.jornalTexture, side: THREE.DoubleSide });
    }

    create() {
        // declare local variables
        let controlPoints;
        let surfaceData;
        let mesh;
        let orderU = 2
        let orderV = 1
        // build nurb #1
        controlPoints =

        [   // U = 0

        [ // V = 0..1;

            [ -0.2, -1.5, 0.0, 1 ],

            [ -0.2,  1.5, 0.0, 1 ]

        ],

    // U = 1

        [ // V = 0..1

            [ 0, -1.5, 4.0, 1 ],

            [ 0,  1.5, 4.0, 1 ]

        ],

    // U = 2

        [ // V = 0..1

            [ 0.2, -1.5, 0.0, 1 ],

            [ 0.2,  1.5, 0.0, 1 ]

            ]

        ]
        let planeSizeU = 0.3;
        let planeSizeV = 0.2;
        let planeUVRate = planeSizeV / planeSizeU;
        let jornalTextureUVRate = 728 / 494; // image dimensions
        let jornalTextureRepeatU = 1;
        let jornalTextureRepeatV =jornalTextureRepeatU * planeUVRate * jornalTextureUVRate;
        this.jornalTexture.repeat.set(jornalTextureRepeatU, jornalTextureRepeatV );
        this.jornalTexture.rotation = -Math.PI / 2;

        surfaceData = this.builder.build(controlPoints,
                orderU, orderV, 100,
                 100, this.jornalMaterial)  

        mesh = new THREE.Mesh( surfaceData, this.jornalMaterial );
        mesh.rotation.x = 0
        mesh.rotation.y = 3*Math.PI/4
        mesh.rotation.z = Math.PI/2
        mesh.scale.set( 0.2,0.2,0.2 )
        mesh.position.set( 0.6,0.1,0.9 )

        return mesh
    }

        
}

export { MyJornal }
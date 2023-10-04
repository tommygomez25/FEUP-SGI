import * as THREE from 'three';

import { MyAxis } from './MyAxis.js';

import { MyNurbsBuilder } from './MyNurbsBuilder.js';



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


        const map =

            new THREE.TextureLoader().load( 'textures/uv_grid_opengl.jpg' );

        map.wrapS = map.wrapT = THREE.RepeatWrapping;

        map.anisotropy = 16;

        map.colorSpace = THREE.SRGBColorSpace;

        this.material = new THREE.MeshLambertMaterial( { map: map,

                        side: THREE.DoubleSide,

                        transparent: true, opacity: 0.90 } );


        this.builder = new MyNurbsBuilder()


        this.meshes = []


        this.samplesU = 8       // maximum defined in MyGuiInterface

        this.samplesV = 8         // maximum defined in MyGuiInterface


        this.init()


        this.createNurbsSurfaces()  

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


        // add a point light on top of the model

        const pointLight = new THREE.PointLight( 0xffffff, 1000, 0 );

        pointLight.position.set( 0, 20, 20 );

        this.app.scene.add( pointLight );


        // add a point light helper for the previous point light

        const sphereSize = 0.5;

        const pointLightHelper =

                   new THREE.PointLightHelper( pointLight, sphereSize );

        this.app.scene.add( pointLightHelper );


        // add an ambient light

        const ambientLight = new THREE.AmbientLight( 0x555555 );

        this.app.scene.add( ambientLight );

    }


    /**

     * removes (if existing) and recreates the nurbs surfaces

     */

    createNurbsSurfaces() {  


        // are there any meshes to remove?

        if (this.meshes !== null) {

            // traverse mesh array

            for (let i=0; i<this.meshes.length; i++) {

                // remove all meshes from the scene

                this.app.scene.remove(this.meshes[i])

            }

            this.meshes = [] // empty the array  

        }

     

        // declare local variables

        let controlPoints;

        let surfaceData;

        let mesh;

        let orderU = 1

        let orderV = 1


        // build nurb #1

        controlPoints =

            [   // U = 0

                [ // V = 0..1;

                    [-2.0, -2.0, 0.0, 1 ],

                    [-2.0,  2.0, 0.0, 1 ]

                ],

                // U = 1

                [ // V = 0..1

                    [ 2.0, -2.0, 0.0, 1],

                    [ 2.0,  2.0, 0.0, 1 ]                                                

                ]

            ]

       

        surfaceData = this.builder.build(controlPoints,

                      orderU, orderV, this.samplesU,

                      this.samplesV, this.material)  

        mesh = new THREE.Mesh( surfaceData, this.material );

        mesh.rotation.x = 0

        mesh.rotation.y = 0

        mesh.rotation.z = 0

        mesh.scale.set( 1,1,1 )

        mesh.position.set( -4,3,0 )

        this.app.scene.add( mesh )

        this.meshes.push (mesh)


        // declare local variables

        let controlPoints1;

        let surfaceData1;

        let mesh1;

        let orderU1 = 2

        let orderV1 = 1


        // build nurb #2

        controlPoints1 =

            [   // U = 0

                [ // V = 0..1;

                    [-1.5, -1.5, 0.0, 1 ],

                    [-1.5,  1.5, 0.0, 1  ]

                ],

                // U = 1

                [ // V = 0..1

                    [ 0, -1.5, 3.0, 1 ],

                    [ 0,  1.5, 3.0, 1 ]                                                

                ],

                // U = 2
                    
                    [ // V = 0..1
    
                        [ 1.5, -1.5, 0.0, 1 ],
    
                        [ 1.5,  1.5, 0.0, 10 ]                                                
    
                    ]

            ]

       

        surfaceData1 = this.builder.build(controlPoints1,

                      orderU1, orderV1, this.samplesU,

                      this.samplesV, this.material)  

        mesh1 = new THREE.Mesh( surfaceData1, this.material );

        mesh1.rotation.x = 0

        mesh1.rotation.y = 0

        mesh1.rotation.z = 0

        mesh1.scale.set( 1,1,1 )

        mesh1.position.set( 4,3,0 )

        this.app.scene.add( mesh1 )

        this.meshes.push (mesh1)


        // declare local variables

        let controlPoints2;

        let surfaceData2;

        let mesh2;

        let orderU2 = 2

        let orderV2 = 3


        // build nurb #2

        controlPoints2 =

        [   // U = 0

        [ // V = 0..3;

            [ -1.5, -1.5, 0.0, 1 ],

            [ -2.0, -2.0, 2.0, 1 ],

            [ -2.0,  2.0, 2.0, 1 ],

            [ -1.5,  1.5, 0.0, 1 ]

        ],

    // U = 1

        [ // V = 0..3

            [ 0.0,  0.0, 3.0, 1 ],

            [ 0.0, -2.0, 3.0, 1 ],

            [ 0.0,  2.0, 3.0, 1 ],

            [ 0.0,  0.0, 3.0, 1 ]        

        ],

    // U = 2

        [ // V = 0..3

            [ 1.5, -1.5, 0.0, 1 ],

            [ 2.0, -2.0, 2.0, 1 ],

            [ 2.0,  2.0, 2.0, 1 ],

            [ 1.5,  1.5, 0.0, 1 ]

        ]

 ]

       

        surfaceData2 = this.builder.build(controlPoints2,

                      orderU2, orderV2, this.samplesU,

                      this.samplesV, this.material)  

        mesh2 = new THREE.Mesh( surfaceData2, this.material );

        mesh2.rotation.x = 0

        mesh2.rotation.y = 0

        mesh2.rotation.z = 0

        mesh2.scale.set( 1,1,1 )

        mesh2.position.set( -4,-3,0 )

        this.app.scene.add( mesh2 )

        this.meshes.push (mesh2)


        // declare local variables

        let controlPoints3;

        let surfaceData3;

        let mesh3;

        let orderU3 = 3

        let orderV3 = 2


        // build nurb #3

        controlPoints3 =

        [   // U = 0

        [ // V = 0..2;
    
            [ -2.0, -2.0, 1.0, 1 ],
    
            [  0, -2.0, 0, 1 ],
    
            [ 2.0, -2.0, -1.0, 1 ]
    
        ],
    
    // U = 1
    
        [ // V = 0..2
    
            [  -2.0, -1.0, -2.0, 1 ],
    
            [ 0, -1.0, -1.0, 1  ],
    
            [ 2.0, -1.0, 2.0, 1 ]
    
        ],
    
    // U = 2
    
        [ // V = 0..2
    
            [ -2.0, 1.0, 5.0, 1 ],
    
            [  0, 1.0, 1.5, 1 ],
    
            [ 2.0, 1.0, -5.0, 1 ]
    
        ],
    
    // U = 3
    
        [ // V = 0..2
    
            [ -2.0, 2.0, -1.0, 1 ],
    
            [ 0, 2.0, 0, 1  ],
    
            [  2.0, 2.0, 1.0, 1 ]
    
        ]    
    
            ]

       

        surfaceData3 = this.builder.build(controlPoints3,

                      orderU3, orderV3, this.samplesU,

                      this.samplesV, this.material)  

        mesh3 = new THREE.Mesh( surfaceData3, this.material );

        mesh3.rotation.x = 0

        mesh3.rotation.y = 0

        mesh3.rotation.z = 0

        mesh3.scale.set( 1,1,1 )

        mesh3.position.set( 4,-3,0 )

        this.app.scene.add( mesh3 )

        this.meshes.push (mesh3)

   
        }
    /**

     * updates the contents

     * this method is called from the render method of the app

     *

     */

    update() {

       

    }

    rebuildNurbsSamplesU() {
        
        this.samplesU = value
        this.createNurbsSurfaces()
    }

    rebuildNurbsSamplesV() {
        
        this.samplesV = value
        this.createNurbsSurfaces()
    }


}


export { MyContents };
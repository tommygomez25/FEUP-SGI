import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';


class HUD {
    constructor(app, camera, width, height, renderer,text,x,y,z,rx,ry,rz,size,color) {
        this.app = app;
        this.camera = camera;
        this.width = width;
        this.height = height;
        this.renderer = renderer;
        this.text = text;
        this.x = x;
        this.y = y;
        this.z = z;
        this.rx = rx;
        this.ry = ry;
        this.rz = rz;
        this.size = size;
        this.color = color;

        // Create a new camera for the HUD
        this.hudCamera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 1, 1000);
        this.hudCamera.position.z = 10;

        this.hudTextMesh = null;
        this.textGeometry = null;

        this.onMeshReadyCallback = null;

        // Initialize HUD elements
        this.init(this.text);


    }

    init(text) {
        var loader = new FontLoader();
        var self = this; // Store reference to the current context

        loader.load('./fonts/helvetiker_regular.typeface.json', function (font) {
            var textGeometry = new TextGeometry(text, {
                font: font,
                size: self.size,
                height: 2,
                curveSegments: 12,
                bevelThickness: 0.1,
                bevelSize: 0.1,
                bevelEnabled: true
        });

        var textMaterial = new THREE.MeshPhongMaterial(
                { color: self.color, specular: 0xffffff }
        );

        self.textGeometry = textGeometry;

        var mesh = new THREE.Mesh(textGeometry, textMaterial);
        mesh.rotation.x = self.rx;
        mesh.rotation.y = self.ry;
        mesh.rotation.z = self.rz;
        mesh.position.set(self.x, self.y, self.z); // Move text to the center of the screen

        // Use 'self' to refer to the correct context
        
        self.app.scene.add(mesh);
        self.hudTextMesh = mesh;

        if (self.onMeshReadyCallback) {
            self.onMeshReadyCallback(mesh);
        }

        });
    }

    delete() {
        this.app.scene.remove(this.hudTextMesh);
    }

    /**
     * 
     * @param {*} onMeshReadyCallback Callback function that will be called when the mesh is ready
     */
    initMesh(onMeshReadyCallback) {
        this.onMeshReadyCallback = onMeshReadyCallback;
    }

}


export { HUD } 
import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

class HUD {
    constructor(app, camera, width, height, renderer) {
        this.app = app;
        this.camera = camera;
        this.width = width;
        this.height = height;
        this.renderer = renderer;

        // Create a new camera for the HUD
        this.hudCamera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 1, 1000);
        this.hudCamera.position.z = 10;

        this.hudTextMesh = null;

        // Initialize HUD elements
        this.init("Have a great race!");
    }

    init(text) {
        var loader = new FontLoader();
        var self = this; // Store reference to the current context

        loader.load('./fonts/helvetiker_regular.typeface.json', function (font) {
            var textGeometry = new TextGeometry(text, {
                font: font,
                size: 20,
                height: 2,
                curveSegments: 12,
                bevelThickness: 1,
                bevelSize: 1,
                bevelEnabled: true
            });

            var textMaterial = new THREE.MeshPhongMaterial(
                { color: 0x00ff00, specular: 0xffffff }
            );

            var mesh = new THREE.Mesh(textGeometry, textMaterial);
            mesh.rotation.y = Math.PI; // Rotate the text by 180 degrees
            mesh.position.set(75, 50, 150); // Move text to the center of the screen

            // Use 'self' to refer to the correct context
            self.app.scene.add(mesh);
            self.hudTextMesh = mesh;
        });
    }

    delete() {
        this.app.scene.remove(this.hudTextMesh);
    }
}


export { HUD } 
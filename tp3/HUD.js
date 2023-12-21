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

        // Initialize HUD elements
        this.initHUD();
    }

    initHUD() {
        var loader = new FontLoader();
        var self = this; // Store reference to the current context

        loader.load('./fonts/helvetiker_regular.typeface.json', function (font) {
            var textGeometry = new TextGeometry("Select a car", {
                font: font,
                size: 20,
                height: 10,
                curveSegments: 12,
                bevelThickness: 1,
                bevelSize: 1,
                bevelEnabled: true
            });

            var textMaterial = new THREE.MeshPhongMaterial(
                { color: 0xff0000, specular: 0xffffff }
            );

            var mesh = new THREE.Mesh(textGeometry, textMaterial);
            mesh.rotation.y = Math.PI; // Rotate the text by 180 degrees

            // Use 'self' to refer to the correct context
            self.app.scene.add(mesh);
            self.hudTextMesh = mesh;
        });
    }
    

    update(speed) {
        // Update the HUD text with the car speed
        if (this.hudTextMesh) {
            this.hudTextMesh.geometry = new TextGeometry("Speed: " + speed, {
                // Update the text with the car speed, rounded to two decimal places
                font: this.hudTextMesh.geometry.parameters.font,
                size: 20,
                height: 10,
                curveSegments: 12,
                bevelThickness: 1,
                bevelSize: 1,
                bevelEnabled: true
            });

            this.app.scene.add(this.hudTextMesh);
        }

        // Your other update logic goes here

        // Call the next frame
        requestAnimationFrame(() => this.update());
    }
}


// Example usage:

// Create a Three.js scene and camera
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.z = 5;

// Create a WebGLRenderer
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// Create a HUD instance
// const hud = new HUD(scene, camera, window.innerWidth, window.innerHeight);
// hud.renderer = renderer; // Set the renderer property for HUD


// animate();


export { HUD } 
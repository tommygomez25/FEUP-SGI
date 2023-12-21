import * as THREE from 'three';
import { Shader } from './Shader.js';

class PowerUp {
    constructor(app, x, y, z, radius, widthSegments, heightSegments, type) {
        this.app = app;
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = radius;
        this.widthSegments = widthSegments;
        this.heightSegments = heightSegments;
        this.type = type;

        if (this.type === "Type1") {
            this.powerUpTexture = new THREE.TextureLoader().load('textures/power-base.jpg');
            this.powerUpDisplacementMap = new THREE.TextureLoader().load('textures/power-height.png');
            this.powerUpNormalMap = new THREE.TextureLoader().load('textures/power-normal.jpg');
            this.powerUpAOMap = new THREE.TextureLoader().load('textures/power-ao.jpg');
            this.powerUpRoughnessMap = new THREE.TextureLoader().load('textures/power-roughness.jpg');
        }
        else if (this.type === "Type2") {
            this.powerUpTexture = new THREE.TextureLoader().load('textures/power-2-base.jpg');
            this.powerUpDisplacementMap = new THREE.TextureLoader().load('textures/power-2-height.png');
            this.powerUpNormalMap = new THREE.TextureLoader().load('textures/power-2-normal.jpg');
            this.powerUpAOMap = new THREE.TextureLoader().load('textures/power-2-ao.jpg');
            this.powerUpRoughnessMap = new THREE.TextureLoader().load('textures/power-2-roughness.jpg');
        }

        this.mesh = null;

        this.animationTime = 0;

        this.id = Math.random() * 1000000;

        this.shaders = [];

        this.shaders.push(new Shader(this.app, "Power Up Animation", "Create volumetry with time", "shaders/powerUp.vert", "shaders/powerUp.frag", 
        {               
        uSampler: {type: 'sampler2D', value: this.powerUpTexture },
        normScale: {type: 'f', value: 0.05 },
        displacement: {type: 'f', value: 1.0 },
        normalizationFactor: {type: 'f', value: 1 },
        blendScale: {type: 'f', value: 1.0 },
        timeFactor: {type: 'f', value: 0.0 },
        })
        );


        this.createPowerUp();
    }

    async createPowerUp() {


        const geometry = new THREE.SphereGeometry(this.radius, this.widthSegments, this.heightSegments);
        const material = new THREE.MeshStandardMaterial({
            map: this.powerUpTexture,
            displacementMap: this.powerUpDisplacementMap,
            displacementScale: 0.1,
            normalMap: this.powerUpNormalMap,
            normalScale: new THREE.Vector2(1, 1),
            roughnessMap: this.powerUpRoughnessMap,
            roughness: 1,
            aoMap: this.powerUpAOMap,
            aoMapIntensity: 1,
        })
        this.mesh= new THREE.Mesh(geometry, material);

        this.boundingBox = new THREE.Box3();
        this.boundingBoxMesh = new THREE.Mesh(new THREE.SphereGeometry(this.radius, this.widthSegments, this.heightSegments), new THREE.MeshBasicMaterial());
        this.boundingBoxMesh.geometry.computeBoundingBox();
        this.boundingBoxMesh.visible = false;

        this.mesh.position.set(this.x, this.y, this.z);

        this.mesh.add(this.boundingBoxMesh);

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        await this.waitForShaders();
        
        this.mesh.material = this.shaders[0].material;
        this.mesh.material.needsUpdate = true;

    }

    update(deltaTime) {

        this.boundingBox.copy(this.boundingBoxMesh.geometry.boundingBox).applyMatrix4(this.boundingBoxMesh.matrixWorld);

        this.animationTime += deltaTime;

        const amplitude = 1;
        const frequency = 5;

        const verticalOffset = amplitude * Math.sin(this.animationTime * frequency);
        this.mesh.position.y = this.y + verticalOffset;

        let t = this.app.clock.getElapsedTime();
        if (this.shaders[0] !== undefined && this.shaders[0] !== null) {
            if (this.shaders[0].hasUniform('timeFactor')) {
                this.shaders[0].updateUniformsValue('timeFactor', t);
            }
        }
    }

    applyEffect(car) {
        if (this.type === "Type1") { // speed boost
            car.applySpeedBoost(2,5);
        }
        else if (this.type === "Type2") { // redução do tempo total de uma parcela a definir ??
            //car.applyTimeReduction();
        }
    }
    waitForShaders() {
        return new Promise((resolve) => {
            const checkShaders = () => {
                const allShadersReady = this.shaders.every((shader) => shader.ready === true);
    
                if (allShadersReady) {
                    resolve();
                } else {
                    setTimeout(checkShaders, 100);
                }
            };
    
            checkShaders();
        });
    }

}

export { PowerUp };
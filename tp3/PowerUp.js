import * as THREE from 'three';

class PowerUp {
    constructor(app, x, y, z, radius, widthSegments, heightSegments) {
        this.app = app;
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = radius;
        this.widthSegments = widthSegments;
        this.heightSegments = heightSegments;

        this.powerUpTexture = new THREE.TextureLoader().load('textures/power-base.jpg');
        this.powerUpDisplacementMap = new THREE.TextureLoader().load('textures/power-height.png');
        this.powerUpNormalMap = new THREE.TextureLoader().load('textures/power-normal.jpg');
        this.powerUpAOMap = new THREE.TextureLoader().load('textures/power-ao.jpg');
        this.powerUpRoughnessMap = new THREE.TextureLoader().load('textures/power-roughness.jpg');

        this.powerUpMesh = null;

        this.animationTime = 0;

        this.createPowerUp();
    }

    createPowerUp() {
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
        this.powerUpMesh= new THREE.Mesh(geometry, material);

        this.powerUpMesh.position.set(this.x, this.y, this.z);

        this.powerUpMesh.castShadow = true;
        this.powerUpMesh.receiveShadow = true;

    }

    update(deltaTime) {
        this.animationTime += deltaTime;

        const amplitude = 1;
        const frequency = 5;

        const verticalOffset = amplitude * Math.sin(this.animationTime * frequency);
        this.powerUpMesh.position.y = this.y + verticalOffset;
    }
}

export { PowerUp };
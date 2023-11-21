import * as THREE from 'three';

class Obstacle {
    constructor(app, x, y, z, radius, widthSegments, heightSegments) {
        this.app = app;
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = radius;
        this.widthSegments = widthSegments;
        this.heightSegments = heightSegments;

        this.obstacleTexture = new THREE.TextureLoader().load('textures/lava-base.jpg');
        this.obstacleDisplacementMap = new THREE.TextureLoader().load('textures/lava-height.png');
        this.obstacleNormalMap = new THREE.TextureLoader().load('textures/lava-normal.jpg');
        this.obstacleAOMap = new THREE.TextureLoader().load('textures/lava-ao.jpg');
        this.obstacleRoughnessMap = new THREE.TextureLoader().load('textures/lava-roughness.jpg');
    

        this.obstacleMesh = null;

        this.animationTime = 0;

        this.createObstacle();
    }

    createObstacle() {
        const geometry = new THREE.SphereGeometry(this.radius, this.widthSegments, this.heightSegments);
        const material = new THREE.MeshStandardMaterial({
            map: this.obstacleTexture,
            displacementMap: this.obstacleDisplacementMap,
            displacementScale: 0.2,
            normalMap: this.obstacleNormalMap,
            normalScale: new THREE.Vector2(1, 1),
            roughnessMap: this.obstacleRoughnessMap,
            roughness: 0.4,
            aoMap: this.obstacleAOMap,
            aoMapIntensity: 1,
        });
        this.obstacleMesh = new THREE.Mesh(geometry, material);

        this.obstacleMesh.position.set(this.x, this.y, this.z);

        this.obstacleMesh.castShadow = true;
        this.obstacleMesh.receiveShadow = true;
    }

    update(deltaTime) {
        this.animationTime += deltaTime;

        const amplitude = 1;
        const frequency = 5;

        const verticalOffset = amplitude * Math.sin(this.animationTime * frequency);
        this.obstacleMesh.position.y = this.y + verticalOffset;
    }
}

export { Obstacle };
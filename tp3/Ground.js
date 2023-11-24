import * as THREE from 'three';

class Ground {
    constructor(app, x, y, z, width, height) {
        this.app = app;
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;

        this.groundTexture = new THREE.TextureLoader().load('textures/ground-base.jpg');
        this.groundDisplacementMap = new THREE.TextureLoader().load('textures/ground-height.png');
        this.groundNormalMap = new THREE.TextureLoader().load('textures/ground-normal.jpg');
        this.groundAOMap = new THREE.TextureLoader().load('textures/ground-ao.jpg');
        this.groundRoughnessMap = new THREE.TextureLoader().load('textures/ground-roughness.jpg');

        this.groundTexture.wrapS = this.groundTexture.wrapT = THREE.RepeatWrapping;
        this.groundTexture.repeat.set( 5,5);
        this.groundTexture.needsUpdate = true;

        this.groundDisplacementMap.wrapS = this.groundDisplacementMap.wrapT = THREE.RepeatWrapping;
        this.groundDisplacementMap.repeat.set( 5,5);
        this.groundDisplacementMap.needsUpdate = true;

        this.groundNormalMap.wrapS = this.groundNormalMap.wrapT = THREE.RepeatWrapping;
        this.groundNormalMap.repeat.set( 5,5);
        this.groundNormalMap.needsUpdate = true;

        this.groundAOMap.wrapS = this.groundAOMap.wrapT = THREE.RepeatWrapping;
        this.groundAOMap.repeat.set( 5,5);
        this.groundAOMap.needsUpdate = true;

        this.groundMesh = null;

        this.createGround();
    }

    createGround() {
        const geometry = new THREE.PlaneGeometry(this.width, this.height);
        const material = new THREE.MeshStandardMaterial({
            map: this.groundTexture,
            displacementMap: this.groundDisplacementMap,
            displacementScale: 0.1,
            normalMap: this.groundNormalMap,
            normalScale: new THREE.Vector2(1, 1),
            roughnessMap: this.groundRoughnessMap,
            roughness: 1,
            aoMap: this.groundAOMap,
            aoMapIntensity: 1,
        })
        this.groundMesh = new THREE.Mesh(geometry, material);

        this.groundMesh.position.set(this.x, this.y, this.z);
        this.groundMesh.rotation.x = -Math.PI / 2;

        this.groundMesh.receiveShadow = true;
    }
}

export { Ground };
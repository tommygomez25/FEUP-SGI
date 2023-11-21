import * as THREE from 'three';

class Ground {
    constructor(app, x, y, z, width, height) {
        this.app = app;
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;

        this.quartzTexture = new THREE.TextureLoader().load('textures/quartz-base.jpg');
        this.quartzDisplacementMap = new THREE.TextureLoader().load('textures/quartz-height.jpg');
        this.quartzNormalMap = new THREE.TextureLoader().load('textures/quartz-normal.jpg');
        this.quartzAOMap = new THREE.TextureLoader().load('textures/quartz-ao.jpg');
        this.quartzRoughnessMap = new THREE.TextureLoader().load('textures/quartz-roughness.jpg');

        this.quartzTexture.wrapS = this.quartzTexture.wrapT = THREE.RepeatWrapping;
        this.quartzTexture.repeat.set( 5,5);
        this.quartzTexture.needsUpdate = true;

        this.quartzDisplacementMap.wrapS = this.quartzDisplacementMap.wrapT = THREE.RepeatWrapping;
        this.quartzDisplacementMap.repeat.set( 5,5);
        this.quartzDisplacementMap.needsUpdate = true;

        this.quartzNormalMap.wrapS = this.quartzNormalMap.wrapT = THREE.RepeatWrapping;
        this.quartzNormalMap.repeat.set( 5,5);
        this.quartzNormalMap.needsUpdate = true;

        this.quartzAOMap.wrapS = this.quartzAOMap.wrapT = THREE.RepeatWrapping;
        this.quartzAOMap.repeat.set( 5,5);
        this.quartzAOMap.needsUpdate = true;

        this.groundMesh = null;

        this.createGround();
    }

    createGround() {
        const geometry = new THREE.PlaneGeometry(this.width, this.height);
        const material = new THREE.MeshStandardMaterial({
            map: this.quartzTexture,
            displacementMap: this.quartzDisplacementMap,
            displacementScale: 0.1,
            normalMap: this.quartzNormalMap,
            normalScale: new THREE.Vector2(1, 1),
            roughnessMap: this.quartzRoughnessMap,
            roughness: 1,
            aoMap: this.quartzAOMap,
            aoMapIntensity: 1,
        })
        this.groundMesh = new THREE.Mesh(geometry, material);

        this.groundMesh.position.set(this.x, this.y, this.z);
        this.groundMesh.rotation.x = -Math.PI / 2;

        this.groundMesh.receiveShadow = true;
    }
}

export { Ground };
import * as THREE from 'three';

class MyTable {
    constructor(app) {
        this.app = app;
        this.mesh = null;

        this.tampoTexture = new THREE.TextureLoader().load('textures/wood.jpg');
        this.tampoTexture.wrapS = THREE.RepeatWrapping;
        this.tampoTexture.wrapT = THREE.RepeatWrapping;
        this.tampoPlaneMaterial = new THREE.MeshStandardMaterial({ map: this.tampoTexture, roughness: 0.1, side: THREE.DoubleSide });
    }

    create() {
        let planeSizeU = 10;
        let planeSizeV = 7;
        let planeUVRate = planeSizeV / planeSizeU;
        let tampoTextureUVRate = 350 / 268; // dimensões da imagem
        let tampoTextureRepeatU = 1;
        let tampoTextureRepeatV = tampoTextureRepeatU * planeUVRate * tampoTextureUVRate;
        this.tampoTexture.repeat.set(tampoTextureRepeatU, tampoTextureRepeatV);
        this.tampoTexture.rotation = 0;
        this.tampoTexture.offset = new THREE.Vector2(0, 0);

        let tampo = new THREE.BoxGeometry(2.5, 0.1, 2.5);
        this.tampoMesh = new THREE.Mesh(tampo, this.tampoPlaneMaterial);
        this.tampoMesh.position.y = 1;

        this.addLegs(this.tampoMesh, 1);

        return this.tampoMesh;
    }

    addLegs(tampoMesh, legHeight) {
        const legRadius = 0.08; // Raio do cilindro
        const legSegments = 32; // Número de segmentos do cilindro

        const legPositions = [
            { x: tampoMesh.geometry.parameters.width / 2 - legRadius, z: tampoMesh.geometry.parameters.depth / 2 - legRadius },
            { x: -tampoMesh.geometry.parameters.width / 2 + legRadius, z: tampoMesh.geometry.parameters.depth / 2 - legRadius },
            { x: tampoMesh.geometry.parameters.width / 2 - legRadius, z: -tampoMesh.geometry.parameters.depth / 2 + legRadius },
            { x: -tampoMesh.geometry.parameters.width / 2 + legRadius, z: -tampoMesh.geometry.parameters.depth / 2 + legRadius },
        ];

        legPositions.forEach(position => {
            const leg = this.addLeg(legRadius, legHeight, legSegments); // Criação da perna como um cilindro
            leg.position.set(position.x, -legHeight / 2, position.z);
            tampoMesh.add(leg);
        });
    }

    addLeg(radius, height, segments) {
        const legGeometry = new THREE.CylinderGeometry(radius, radius, height, segments);
        const legMesh = new THREE.Mesh(legGeometry, this.tampoPlaneMaterial);
        return legMesh;
    }
}

export { MyTable}
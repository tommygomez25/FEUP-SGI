import * as THREE from 'three';

class MyChair {
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
        let tampoTextureUVRate = 350 / 268; // image dimensions
        let tampoTextureRepeatU = 1;
        let tampoTextureRepeatV =tampoTextureRepeatU * planeUVRate * tampoTextureUVRate;
        this.tampoTexture.repeat.set(tampoTextureRepeatU, tampoTextureRepeatV );
        this.tampoTexture.rotation = 0;
        this.tampoTexture.offset = new THREE.Vector2(0,0);

        let tampoChair = new THREE.BoxGeometry(0.75, 0.1, 0.75);
        this.tampoChairMesh = new THREE.Mesh( tampoChair, this.tampoPlaneMaterial);
        this.tampoChairMesh.position.y = 0.8;
        this.tampoChairMesh.position.x = 1.5;

        this.addLegs(this.tampoChairMesh,0.8);

        const otherTampoChair = new THREE.BoxGeometry(0.75, 0.1, 0.75);
        this.otherTampoChairMesh = new THREE.Mesh( otherTampoChair, this.tampoPlaneMaterial);
        this.otherTampoChairMesh.rotation.z = Math.PI / 2;
        this.otherTampoChairMesh.position.x += this.tampoChairMesh.geometry.parameters.width / 2 - this.otherTampoChairMesh.geometry.parameters.height / 2
        this.otherTampoChairMesh.position.y += this.tampoChairMesh.geometry.parameters.width / 2
        this.tampoChairMesh.add( this.otherTampoChairMesh);

        this.tampoChairMesh.receiveShadow = true;
        this.tampoChairMesh.castShadow = true;
        this.otherTampoChairMesh.receiveShadow = true;
        this.otherTampoChairMesh.castShadow = true;

        return this.tampoChairMesh;

    }

    addLegs(tampoMesh, legHeight) {
        const legRadius = 0.05; // Raio do cilindro
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

export { MyChair }
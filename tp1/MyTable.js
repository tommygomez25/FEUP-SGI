import * as THREE from 'three';

class MyTable {
    constructor(app) {
        this.app = app;
        this.init();    
    }

    init(){
        this.createTable();
    }
    createTable() {
        let tampo = new THREE.BoxGeometry(2.5, 0.1, 2.5);
        let tampoMaterial = new THREE.MeshPhongMaterial({ color: "#d2b48c",specular: "#000000", emissive: "#000000", shininess: 90 });
        this.tampoMesh = new THREE.Mesh( tampo, tampoMaterial);
        this.tampoMesh.position.y = 1;
        this.app.scene.add( this.tampoMesh);

        this.addLegs(this.tampoMesh);
    }

    addLegs(tampoMesh) {
        const legHeight = -1.0;
        const legWidth = 0.1;
        
        const legPositions = [
            { x: tampoMesh.geometry.parameters.width / 2 - legWidth / 2, z: tampoMesh.geometry.parameters.depth / 2 - legWidth / 2 },
            { x: -tampoMesh.geometry.parameters.width / 2 + legWidth / 2, z: tampoMesh.geometry.parameters.depth / 2 - legWidth / 2 },
            { x: tampoMesh.geometry.parameters.width / 2 - legWidth / 2, z: -tampoMesh.geometry.parameters.depth / 2 + legWidth / 2 },
            { x: -tampoMesh.geometry.parameters.width / 2 + legWidth / 2, z: -tampoMesh.geometry.parameters.depth / 2 + legWidth / 2 },
        ];
    
        
        legPositions.forEach(position => {
            const leg = this.addLeg(legWidth, legHeight, legWidth);
            leg.position.set(position.x, legHeight / 2, position.z);
            tampoMesh.add(leg);
        });
    }

    addLeg(width, height, depth) {
        const legGeometry = new THREE.BoxGeometry(width, height, depth);
        const legMaterial = new THREE.MeshPhongMaterial({ color: "#d2b48c", specular: "#000000", emissive: "#000000", shininess: 90 });
        const legMesh = new THREE.Mesh(legGeometry, legMaterial);
        return legMesh;
    }
}

export { MyTable };
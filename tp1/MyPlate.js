import * as THREE from 'three';

class MyPlate {
    constructor(app) {

        this.app = app
    }

    create(tampoMesh) {
        const plateGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 32); // Raio superior, raio inferior, altura e segmentos
        const plateMaterial = new THREE.MeshPhongMaterial({ color: "#d3d3d3", specular: "#000000", emissive: "#000000", shininess: 90 }); 
        this.plate = new THREE.Mesh(plateGeometry, plateMaterial);
        this.plate.position.y = tampoMesh.position.y + tampoMesh.geometry.parameters.height / 2 + this.plate.geometry.parameters.height / 2;
        
        return this.plate;
    }
}

export { MyPlate }
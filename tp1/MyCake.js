import * as THREE from 'three';

class MyCake {
    constructor(app) {

        this.app = app

        this.cakeTexture = new THREE.TextureLoader().load( 'textures/cake.jpg' );
        this.cakeTexture.wrapS = THREE.RepeatWrapping;
        this.cakeTexture.wrapT = THREE.RepeatWrapping;
        this.cakePlaneMaterial = new THREE.MeshPhongMaterial({ map: this.cakeTexture, specular: "#000000", emissive: "#000000", shininess: 10, side: THREE.DoubleSide });

    }

    create(plate) {
        let planeSizeU = 3;
        let planeSizeV = 2;
        let planeUVRate = planeSizeV / planeSizeU;
        let cakeUVRate = 350/233; // image dimensions
        let cakeRepeatU =4
        let cakeRepeatV =cakeRepeatU * planeUVRate * cakeUVRate;
        this.cakeTexture.repeat.set(cakeRepeatU, cakeRepeatV );
        this.cakeTexture.rotation = 0;
        this.cakeTexture.offset = new THREE.Vector2(0,0);

        const cakeGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.1, 32, 1, false, 0, 1/(2 * Math.PI/32)); // Raio superior, raio inferior, altura, segmentos, stacks, openEnded, abertura inicial e ângulo thetaLength
        this.cake = new THREE.Mesh( cakeGeometry,this.cakePlaneMaterial)
        this.cake.position.y = plate.position.y + plate.geometry.parameters.height / 2 + this.cake.geometry.parameters.height / 2;

        const candleGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 32);
        const candleMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", specular: "#ffffff", emissive: "#ffffff", shininess: 90 });
        this.candle = new THREE.Mesh(candleGeometry, candleMaterial);
        this.candle.position.y = this.cake.geometry.parameters.height;
        this.cake.add(this.candle);

        const flameGeometry = new THREE.ConeGeometry(0.01, 0.07, 32);
        const flameMaterial = new THREE.MeshPhongMaterial({ color: "#F1C40F" }); 
        this.flame = new THREE.Mesh(flameGeometry, flameMaterial);
        this.flame.position.y = this.candle.geometry.parameters.height;
        this.candle.add(this.flame);

        return this.cake;
    }
}

export { MyCake }
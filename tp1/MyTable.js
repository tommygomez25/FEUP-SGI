import * as THREE from 'three';

class MyTable {
    constructor(app) {
        this.app = app;
        this.init();
    }
    
    init(){
        this.tampoTexture = new THREE.TextureLoader().load( 'textures/wood.jpg' );
        this.tampoTexture.wrapS = THREE.RepeatWrapping;
        this.tampoTexture.wrapT = THREE.RepeatWrapping;
        this.tampoPlaneMaterial = new THREE.MeshStandardMaterial({ map: this.tampoTexture, roughness: 0.1, side: THREE.DoubleSide });
    
        this.cakeTexture = new THREE.TextureLoader().load( 'textures/cake.jpg' );
        this.cakeTexture.wrapS = THREE.RepeatWrapping;
        this.cakeTexture.wrapT = THREE.RepeatWrapping;
        this.cakePlaneMaterial = new THREE.MeshPhongMaterial({ map: this.cakeTexture, specular: "#000000", emissive: "#000000", shininess: 10, side: THREE.DoubleSide });

        this.createTable();
        this.createPlate();
        this.createCake();
        this.createChair();
        this.drawSpiral();
    }
    createTable() {
        let tampo = new THREE.BoxGeometry(2.5, 0.1, 2.5);
        let tampoMaterial = new THREE.MeshPhongMaterial({ color: "#A56627",specular: "#A56627", emissive: "#000444", shininess: 30 });
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

    createPlate() {
        const plateGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 32); // Raio superior, raio inferior, altura e segmentos
        const plateMaterial = new THREE.MeshPhongMaterial({ color: "#d3d3d3", specular: "#000000", emissive: "#000000", shininess: 90 }); 
        this.plate = new THREE.Mesh(plateGeometry, plateMaterial);
        this.plate.position.y = this.tampoMesh.position.y + this.tampoMesh.geometry.parameters.height / 2 + this.plate.geometry.parameters.height / 2;
        
        this.app.scene.add(this.plate);       
    }

    createCake() {
        let planeSizeU = 3;
        let planeSizeV = 2;
        let planeUVRate = planeSizeV / planeSizeU;
        let cakeUVRate = 350/233; // image dimensions
        let cakeRepeatU = 4;
        let cakeRepeatV = cakeRepeatU * planeUVRate * cakeUVRate;
        //debugger
        this.cakeTexture.repeat.set(cakeRepeatU, cakeRepeatV );
        this.cakeTexture.rotation = 0;
        this.cakeTexture.offset = new THREE.Vector2(0,0);

        const cakeGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.1, 32, 1, false, 0, 1/(2 * Math.PI/32)); // Raio superior, raio inferior, altura, segmentos, stacks, openEnded, abertura inicial e ângulo thetaLength
        this.cake = new THREE.Mesh( cakeGeometry,this.cakePlaneMaterial)
        this.cake.position.y = this.plate.position.y + this.plate.geometry.parameters.height / 2 + this.cake.geometry.parameters.height / 2;

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

        this.app.scene.add(this.cake);
    }

    createChair() {
        let planeSizeU = 10;
        let planeSizeV = 7;
        let planeUVRate = planeSizeV / planeSizeU;
        let tampoTextureUVRate = 350 / 268; // image dimensions
        let tampoTextureRepeatU = 1;
        let tampoTextureRepeatV = tampoTextureRepeatU * planeUVRate * tampoTextureUVRate;
        this.tampoTexture.repeat.set(tampoTextureRepeatU, tampoTextureRepeatV );
        this.tampoTexture.rotation = 0;
        this.tampoTexture.offset = new THREE.Vector2(0,0);

        let tampoChair = new THREE.BoxGeometry(0.75, 0.1, 0.75);
        this.tampoChairMesh = new THREE.Mesh( tampoChair, this.tampoPlaneMaterial);
        this.tampoChairMesh.position.y = 0.8;
        this.tampoChairMesh.position.x = 1.5;

        this.app.scene.add( this.tampoChairMesh);

        this.addLegs(this.tampoChairMesh,0.8);

        const otherTampoChair = new THREE.BoxGeometry(0.75, 0.1, 0.75);
        this.otherTampoChairMesh = new THREE.Mesh( otherTampoChair, this.tampoPlaneMaterial);
        this.otherTampoChairMesh.rotation.z = Math.PI / 2;
        this.otherTampoChairMesh.position.x += this.tampoChairMesh.geometry.parameters.width / 2 - this.otherTampoChairMesh.geometry.parameters.height / 2
        this.otherTampoChairMesh.position.y += this.tampoChairMesh.geometry.parameters.width / 2
        this.tampoChairMesh.add( this.otherTampoChairMesh);
    }

    drawSpiral() {
        const segments = 100
        const radius = 0.1
        const numberOfLoops = 3
        const height = 0.1
        let points = []

        var angleStep = 2 * Math.PI / segments; // 2PI = 360º, logo vou dividir o circulo em 100 partes e desenha-las
        var heightStep = height / segments; // 0.1 = altura da mola , logo vou dividir a mola em 100 partes e desenha-las

        /*
            x ->  cos(t) * raio
            y ->  t * h
            z ->  sin(t) * raio
        */
        for (let i = 0; i < numberOfLoops * segments; i++) {
            const x = Math.cos(i * angleStep) * radius
            const y = i * heightStep
            const z = Math.sin(i * angleStep) * radius
            points.push(new THREE.Vector3(x, y, z))
        }

        const curve = new THREE.CatmullRomCurve3(points)
        const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(segments))
        const material = new THREE.LineBasicMaterial({ color: 0xdcdcdc })
        const line = new THREE.Line(geometry, material)
        line.position.set(-0.75,this.tampoMesh.position.y + height ,-0.75)
        //line.rotation.x = Math.PI / 2
        this.app.scene.add(line)
    }
}

export { MyTable };
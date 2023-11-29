import * as THREE from 'three';

class Car {
    constructor(app, x, y, z, chaseCamera, name, color, layer, styling) {
        this.app = app;
        this.x = x;
        this.y = y;
        this.z = z;
        this.name = name;
        this.color= color;
        this.layer = layer;
        this.styling = styling;

        this.carBox = new THREE.Object3D();

        this.maxVelocity = 50;
        this.actualVelocity = 0;

        this.steeringAngle = 0;
        this.maxSteeringAngle = Math.PI / 4;
        this.angularSpeed = 0.01;

        this.wheelRotationSpeed = 0.01;

        this.keysPressed = [];

        this.chaseCamera = chaseCamera;

        this.wheelTexture = new THREE.TextureLoader().load('textures/lava-base.jpg');

        this.createCar();

        this.setupKeyControls();
    }

    createCar() {
        this.createCarBody();
        this.createCarFrontWheels();
        this.createCarBackWheels();

        this.carBox.position.set(this.x, this.y, this.z);
        this.carBox.scale.set(5, 5, 5);
        this.carBox.castShadow = true;
        this.carBox.receiveShadow = true;   
        
        this.app.scene.add(this.carBox);
    }

    createCarBody() {
        this.carBodyMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 0.8, 2.5),
            new THREE.MeshStandardMaterial({
                color: this.color,
                roughness: 0.5,
                metalness: 0.5
            })
        );

        // Add car roof
        const carRoofGeometry = new THREE.BoxGeometry(1.5, 0.2, 2.5);
        const carRoofMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const carRoofMesh = new THREE.Mesh(carRoofGeometry, carRoofMaterial);
        carRoofMesh.position.set(0, 1, 0);
        this.carBodyMesh.add(carRoofMesh);

        // Add headlights
        const headlightGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const headlightMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const headlightLeft = new THREE.Mesh(headlightGeometry, headlightMaterial);
        const headlightRight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        headlightLeft.position.set(0.6, 0.2, 1.25);
        headlightRight.position.set(-0.6, 0.2, 1.25);
        this.carBodyMesh.add(headlightLeft);
        this.carBodyMesh.add(headlightRight);

        // Add taillights
        const taillightGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const taillightMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const taillightLeft = new THREE.Mesh(taillightGeometry, taillightMaterial);
        const taillightRight = new THREE.Mesh(taillightGeometry, taillightMaterial);
        taillightLeft.position.set(0.6, 0.2, -1.25);
        taillightRight.position.set(-0.6, 0.2, -1.25);
        this.carBodyMesh.add(taillightLeft);
        this.carBodyMesh.add(taillightRight);

        // Add windows
        const windowGeometry = new THREE.BoxGeometry(1.4, 1.6, 2.4);
        const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, transparent: true, opacity: 0.5 });
        const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
        windowMesh.position.set(0, 0.2, 0);
        this.carBodyMesh.add(windowMesh);

        // Add spoiler
        const spoilerGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.5);
        const spoilerMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const spoilerMesh = new THREE.Mesh(spoilerGeometry, spoilerMaterial);
        spoilerMesh.position.set(0, 1.45, -1.25);
        this.carBodyMesh.add(spoilerMesh);

        // Add spoiler support
        const supportGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);
        const supportMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const supportMesh1 = new THREE.Mesh(supportGeometry, supportMaterial);
        const supportMesh2 = new THREE.Mesh(supportGeometry, supportMaterial);
        supportMesh1.position.set(0.6, 1.2, -1.25);
        supportMesh2.position.set(-0.6, 1.2, -1.25);
        this.carBodyMesh.add(supportMesh1);
        this.carBodyMesh.add(supportMesh2);

        this.carBodyMesh.position.set(0, 0, 1);
        this.carBodyMesh.castShadow = true;
        this.carBodyMesh.receiveShadow = true;

        this.carBodyMesh.name = this.name;
        this.carBodyMesh.layers.enable(this.layer);

        this.carBox.add(this.carBodyMesh);
    }

    createCarFrontWheels() {
        

        var carFrontWheelLeftGeometry = new THREE.CylinderGeometry(0.33, 0.33, 0.2);
        carFrontWheelLeftGeometry.rotateZ(Math.PI / 2)

        this.carFrontWheelLeft = new THREE.Mesh(
            carFrontWheelLeftGeometry,
            new THREE.MeshStandardMaterial({
                //color: 0x000000,
                //roughness: 0.5,
                //metalness: 0.5,
                map: this.wheelTexture
            })
        );

        this.carFrontWheelLeft.position.set(1, 0, 1);
        this.carFrontWheelLeft.rotation.order = "YXZ";

        var carFrontWheelRightGeometry = new THREE.CylinderGeometry(0.33, 0.33, 0.2);
        carFrontWheelRightGeometry.rotateZ(Math.PI / 2);

        this.carFrontWheelRight = new THREE.Mesh(
            carFrontWheelRightGeometry,
            new THREE.MeshStandardMaterial({
                //color: 0x000000,
                //roughness: 0.5,
                //metalness: 0.5
                map: this.wheelTexture
            })
        );

        this.carFrontWheelRight.position.set(-1, 0, 1);
        this.carFrontWheelRight.rotation.order = "YXZ";
        
        this.carBodyMesh.add(this.carFrontWheelRight);
        this.carBodyMesh.add(this.carFrontWheelLeft);

    }

    createCarBackWheels() {

        var carBackWheelLeftGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.33);
        carBackWheelLeftGeometry.rotateZ(Math.PI / 2);

        this.carBackWheelLeft = new THREE.Mesh(
            carBackWheelLeftGeometry,
            new THREE.MeshStandardMaterial({
                //color: 0x000000,
                //roughness: 0.5,
                //metalness: 0.5
                map: this.wheelTexture
            })
        );

        this.carBackWheelLeft.position.set(1, 0, -1);

        var carBackWheelRightGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.33);
        carBackWheelRightGeometry.rotateZ(Math.PI / 2);

        this.carBackWheelRight = new THREE.Mesh(
            carBackWheelRightGeometry,
            new THREE.MeshStandardMaterial({
                //color: 0x000000,
                //roughness: 0.5,
                //metalness: 0.5
                map: this.wheelTexture
            })
        );

        this.carBackWheelRight.position.set(-1, 0, -1);
        
        this.carBodyMesh.add(this.carBackWheelRight);
        this.carBodyMesh.add(this.carBackWheelLeft);

    }

    setupKeyControls() {

        document.addEventListener('keydown', (event) => {
            this.keysPressed[event.key] = true;
        });

        document.addEventListener('keyup', (event) => {
            this.keysPressed[event.key] = false;
        });
        
    }

    
    update(deltaTime) {
        
        if (this.keysPressed["a"] == true) {
            this.steeringAngle += this.angularSpeed
            this.steeringAngle = Math.min(this.steeringAngle, this.maxSteeringAngle);
            this.carBox.rotation.y += this.steeringAngle * this.actualVelocity * 0.01
        }

        else if (this.keysPressed["d"] == true) {
            this.steeringAngle -= this.angularSpeed
            this.steeringAngle = Math.max(this.steeringAngle, -this.maxSteeringAngle);
            this.carBox.rotation.y += this.steeringAngle * this.actualVelocity * 0.01
        } 

        else {
            this.steeringAngle = 0;
        }

        this.carFrontWheelLeft.rotation.y = this.steeringAngle;
        this.carFrontWheelRight.rotation.y = this.steeringAngle;
        
        // ---------------------- // 


        if (!this.keysPressed["w"] && !this.keysPressed["s"]) {
            const dampingFactor = 1;
            if (this.actualVelocity > 0 ) { this.actualVelocity -= dampingFactor; }
            if (this.actualVelocity < 0 ) { this.actualVelocity += dampingFactor; }
            this.moveForward(this.actualVelocity, deltaTime);
        }

        if (this.keysPressed["s"] == true) {
            this.actualVelocity -= 1
            if (this.actualVelocity < 0) {this.moveForward(this.actualVelocity, deltaTime); }
        }

        if (this.keysPressed["w"] == true) {
            this.actualVelocity += 1
            if (this.actualVelocity > 0 ) {this.moveForward(this.actualVelocity, deltaTime)}
        }

        if (this.actualVelocity > this.maxVelocity) {
            this.actualVelocity = this.maxVelocity;
        }

        if (this.actualVelocity < -this.maxVelocity) {
            this.actualVelocity = -this.maxVelocity;
        }

        if (this.actualVelocity == 0) {
            this.carFrontWheelLeft.rotation.x = 0;
            this.carFrontWheelRight.rotation.x = 0;
            this.carBackWheelLeft.rotation.x = 0;
            this.carBackWheelRight.rotation.x = 0;
        }
        else {            
            this.carFrontWheelLeft.rotation.x += this.wheelRotationSpeed * this.actualVelocity
            this.carFrontWheelRight.rotation.x += this.wheelRotationSpeed * this.actualVelocity
            this.carBackWheelLeft.rotation.x += this.wheelRotationSpeed * this.actualVelocity
            this.carBackWheelRight.rotation.x += this.wheelRotationSpeed * this.actualVelocity   
        }
        

    }

    moveForward(speed, deltaTime) {
        var delta_x = speed * deltaTime * Math.sin(this.carBox.rotation.y);
        var delta_z = speed * deltaTime * Math.cos(this.carBox.rotation.y);

        this.carBox.position.x += delta_x;
        this.carBox.position.z += delta_z;

        //this.chaseCamera.position.copy(this.carBox.position);
        //this.chaseCamera.lookAt(this.carBox.position);

    }

    applySpeedBoost(boost, duration) {
        this.maxVelocity = this.maxVelocity * boost;
        setTimeout(() => {
            this.maxVelocity = this.maxVelocity / boost;
        }, duration * 1000);
    }
}

export { Car };
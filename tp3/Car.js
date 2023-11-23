import * as THREE from 'three';

class Car {
    constructor(app, x, y, z, chaseCamera) {
        this.app = app;
        this.x = x;
        this.y = y;
        this.z = z;

        this.carBox = new THREE.Object3D();

        this.maxVelocity = 50;
        this.actualVelocity = 0;

        this.steeringAngle = 0;
        this.maxSteeringAngle = Math.PI / 4;
        this.angularSpeed = 0.01;

        this.wheelRotationSpeed = 0.5;

        this.keysPressed = [];

        this.chaseCamera = chaseCamera;

        this.wheelTexture = new THREE.TextureLoader().load('textures/road-base.jpg');

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
            new THREE.BoxGeometry(1, 1, 2),
            new THREE.MeshStandardMaterial({
                color: 0x0000ff,
                roughness: 0.5,
                metalness: 0.5
            })
        );

        this.carBodyMesh.position.set(0, 0, 1);
        this.carBodyMesh.castShadow = true;
        this.carBodyMesh.receiveShadow = true;
        
        this.carBox.add(this.carBodyMesh);

    }

    createCarFrontWheels() {

        var carFrontWheelLeftGeometry = new THREE.CylinderGeometry(0.33, 0.33, 0.2);
        carFrontWheelLeftGeometry.rotateZ(Math.PI / 2)

        this.carFrontWheelLeft = new THREE.Mesh(
            carFrontWheelLeftGeometry,
            new THREE.MeshStandardMaterial({
                color: 0x000000,
                roughness: 0.5,
                metalness: 0.5,
            })
        );

        this.carFrontWheelLeft.position.set(1, 0, 1);

        var carFrontWheelRightGeometry = new THREE.CylinderGeometry(0.33, 0.33, 0.2);
        carFrontWheelRightGeometry.rotateZ(Math.PI / 2);

        this.carFrontWheelRight = new THREE.Mesh(
            carFrontWheelRightGeometry,
            new THREE.MeshStandardMaterial({
                color: 0x000000,
                roughness: 0.5,
                metalness: 0.5
            })
        );

        this.carFrontWheelRight.position.set(-1, 0, 1);
        
        this.carBodyMesh.add(this.carFrontWheelRight);
        this.carBodyMesh.add(this.carFrontWheelLeft);

    }

    createCarBackWheels() {

        var carBackWheelLeftGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.33);
        carBackWheelLeftGeometry.rotateZ(Math.PI / 2);

        this.carBackWheelLeft = new THREE.Mesh(
            carBackWheelLeftGeometry,
            new THREE.MeshStandardMaterial({
                color: 0x000000,
                roughness: 0.5,
                metalness: 0.5
            })
        );

        this.carBackWheelLeft.position.set(1, 0, -1);

        var carBackWheelRightGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.33);
        carBackWheelRightGeometry.rotateZ(Math.PI / 2);

        this.carBackWheelRight = new THREE.Mesh(
            carBackWheelRightGeometry,
            new THREE.MeshStandardMaterial({
                color: 0x000000,
                roughness: 0.5,
                metalness: 0.5
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
        
        this.carFrontWheelLeft.rotation.x += this.wheelRotationSpeed * this.actualVelocity
        this.carFrontWheelRight.rotation.x += this.wheelRotationSpeed * this.actualVelocity
        this.carBackWheelLeft.rotation.x += this.wheelRotationSpeed * this.actualVelocity
        this.carBackWheelRight.rotation.x += this.wheelRotationSpeed * this.actualVelocity
        

    }

    moveForward(speed, deltaTime) {
        var delta_x = speed * deltaTime * Math.sin(this.carBox.rotation.y);
        var delta_z = speed * deltaTime * Math.cos(this.carBox.rotation.y);

        this.carBox.position.x += delta_x;
        this.carBox.position.z += delta_z;

        this.chaseCamera.position.copy(this.carBox.position);
        this.chaseCamera.lookAt(this.carBox.position);

    }

    applySpeedBoost(boost, duration) {
        this.maxVelocity = this.maxVelocity * boost;
        setTimeout(() => {
            this.maxVelocity = this.maxVelocity / boost;
        }, duration * 1000);
    }
}

export { Car };
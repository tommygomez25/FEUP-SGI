import * as THREE from 'three';

class Car {
    constructor(app, x, y, z, chaseCamera) {
        this.app = app;
        this.x = x;
        this.y = y;
        this.z = z;

        this.carMesh = new THREE.Group();
        this.carPivot = new THREE.Object3D();

        this.xSpeed = 1;
        this.ySpeed = 0.001;

        this.maxVelocity = 0.5;
        this.actualVelocity = 0;

        this.steeringAngle = 0;
        this.maxSteeringAngle = Math.PI / 4;

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
        this.carMesh.position.set(this.x, this.y, this.z);
        this.carMesh.rotation.y = Math.PI / 2;
        this.carMesh.scale.set(5,5,5);

        this.app.scene.add(this.carMesh);
    }

    createCarBody() {
        this.carBody = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 2),
            new THREE.MeshStandardMaterial({
                color: 0x0000ff,
                roughness: 0.5,
                metalness: 0.5
            })
        );

        this.carBody.position.set(0, 0, 0);
        this.carBody.castShadow = true;
        this.carBody.receiveShadow = true;

        this.carMesh.add(this.carBody);
    }

    createCarFrontWheels() {
        this.carFrontWheels = new THREE.Group();

        var carFrontWheelLeftGeometry = new THREE.CylinderGeometry(0.33, 0.33, 0.2);
        carFrontWheelLeftGeometry.rotateZ(Math.PI / 2)

        this.carFrontWheelLeft = new THREE.Mesh(
            carFrontWheelLeftGeometry,
            new THREE.MeshStandardMaterial({
                roughness: 0.5,
                metalness: 0.5,
                map: this.wheelTexture
            })
        );

        this.carFrontWheelLeft.position.set(-1, 0, -1);

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

        this.carFrontWheelRight.position.set(1, 0, -1);

        this.carFrontWheels.add(this.carFrontWheelLeft);
        this.carFrontWheels.add(this.carFrontWheelRight);

        this.carFrontWheels.position.set(0, 0, 0);
        this.carFrontWheels.castShadow = true;
        this.carFrontWheels.receiveShadow = true;
        this.carMesh.add(this.carFrontWheels); 

        this.carMesh.castShadow = true;
        this.carMesh.receiveShadow = true;
    }

    createCarBackWheels() {
        this.carBackWheels = new THREE.Group();

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

        this.carBackWheelLeft.position.set(-1, 0, 1);

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

        this.carBackWheelRight.position.set(1, 0, 1);

        this.carBackWheels.add(this.carBackWheelLeft);
        this.carBackWheels.add(this.carBackWheelRight);

        this.carBackWheels.position.set(0, 0, 0);
        this.carBackWheels.castShadow = true;
        this.carBackWheels.receiveShadow = true;
        this.carMesh.add(this.carBackWheels); 

    }

    setupKeyControls() {

        document.addEventListener('keydown', (event) => {
            this.keysPressed[event.key] = true;
        });

        document.addEventListener('keyup', (event) => {
            this.keysPressed[event.key] = false;
        });
        
    }

    executeMovement() {
        if (this.keysPressed["a"] == true) {
            this.steeringAngle = Math.max(this.steeringAngle - this.ySpeed, -this.maxSteeringAngle);
        }

        else if (this.keysPressed["d"] == true) {
            this.steeringAngle = Math.min(this.steeringAngle + this.ySpeed, this.maxSteeringAngle);
        } 

        else {
            this.steeringAngle = 0;
        }

        this.carFrontWheels.rotation.y = this.steeringAngle;
        this.carMesh.rotation.y -= this.steeringAngle;

        if (!this.keysPressed["w"] && !this.keysPressed["s"]) {
            const dampingFactor = 0.005;
            this.actualVelocity -= dampingFactor;
        }

        if (this.keysPressed["s"] == true) {

            this.carMesh.position.x += this.xSpeed * Math.sin(this.carMesh.rotation.y);
            this.carMesh.position.z += this.xSpeed * Math.cos(this.carMesh.rotation.y);
            this.actualVelocity-= 0.01

            this.chaseCamera.position.copy(this.carMesh.position);
            this.chaseCamera.position.y += 10;
            this.chaseCamera.position.x += 10; 
            this.chaseCamera.lookAt(this.carMesh.position);
        }

        if (this.keysPressed["w"] == true) {
            this.carMesh.position.x -= this.xSpeed * Math.sin(this.carMesh.rotation.y);
            this.carMesh.position.z -= this.xSpeed * Math.cos(this.carMesh.rotation.y);
            this.actualVelocity+= 0.01

            this.chaseCamera.position.copy(this.carMesh.position);
            this.chaseCamera.position.y += 10;
            this.chaseCamera.position.x += 10;
            this.chaseCamera.lookAt(this.carMesh.position);
        }

        this.actualVelocity = Math.max(0, Math.min(this.actualVelocity, this.maxVelocity));

        this.carFrontWheelLeft.rotation.x += this.wheelRotationSpeed * this.actualVelocity
        this.carFrontWheelRight.rotation.x += this.wheelRotationSpeed * this.actualVelocity
        this.carBackWheelLeft.rotation.x += this.wheelRotationSpeed * this.actualVelocity
        this.carBackWheelRight.rotation.x += this.wheelRotationSpeed * this.actualVelocity

    }
}

export { Car };
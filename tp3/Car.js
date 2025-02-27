import * as THREE from 'three';
import { Animation } from './Animation.js';

class Car {
    constructor(app, x, y, z, chaseCamera, name, color, layer, styling, routePoints = null, rotationPoints = null) {
        this.app = app;
        this.x = x;
        this.y = y;
        this.z = z;
        this.name = name;
        this.color= color;
        this.layer = layer;
        this.styling = styling;
        this.withBoost = false;
        
        this.carBox = new THREE.Object3D();
        this.carBounding = new THREE.Box3();
        this.carBoundingMesh = new THREE.Mesh( new THREE.SphereGeometry( 1, 32, 32 ), new THREE.MeshBasicMaterial( {color: 0xffff00} ) );
        this.carBoundingMesh.geometry.computeBoundingBox();
        this.carBoundingMesh.visible = false;

        this.carBox.add(this.carBoundingMesh);
        

        this.maxVelocity = 60;
        this.actualVelocity = 0;

        this.steeringAngle = 0;
        this.maxSteeringAngle = Math.PI / 4;
        this.angularSpeed = 0.005;

        this.wheelRotationSpeed = 0.01;

        this.keysPressed = [];

        this.chaseCamera = chaseCamera;

        this.wheelTexture = styling == false ? new THREE.TextureLoader().load('textures/lava-base.jpg') : new THREE.TextureLoader().load('textures/marble.png');

        this.routePoints = routePoints;
        this.rotationPoints = rotationPoints;

        this.difficulty = null;

        this.halvedSpeed = false;

        this.withEffect = false;
        this.effectTimer = null;

        this.prevCarPosition = new THREE.Vector3();

        this.laps = 0;

        this.createCar();

        this.setupKeyControls();
    }

    createAnimation() {
        if (this.routePoints != null && this.rotationPoints != null) {
            if (this.difficulty === "EASY") {
                this.animation = new Animation(this.app, this.routePoints , this.rotationPoints, 15, this.carBox);
            }
            else if (this.difficulty === "HARD") {
                this.animation = new Animation(this.app, this.routePoints , this.rotationPoints, 10, this.carBox);
            }
        }
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

        this.createCarRoof();
        this.createCarLights();
        this.createCarWindows();
        this.createCarSpoiler();

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
                //metalness: 0.5,x
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

    createCarRoof() {
        const carRoofGeometry = new THREE.BoxGeometry(1.5, 0.2, 2.5);
        const carRoofMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const carRoofMesh = new THREE.Mesh(carRoofGeometry, carRoofMaterial);
        carRoofMesh.position.set(0, 1, 0);
        this.carBodyMesh.add(carRoofMesh);
    }

    createCarLights() {
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
    }

    createCarWindows() {
        // Add windows
        const windowGeometry = new THREE.BoxGeometry(1.4, 1.6, 2.4);
        const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, transparent: true, opacity: 0.5 });
        const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
        windowMesh.position.set(0, 0.2, 0);
        this.carBodyMesh.add(windowMesh);
    }

    createCarSpoiler() {
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

        this.carBounding.copy(this.carBoundingMesh.geometry.boundingBox).applyMatrix4(this.carBoundingMesh.matrixWorld); // needed to update bounding box that will be used for collision detection

        const accelerationFactor = 1;
        const decelerationFactor = 1;

        if (this.notInTrack) {
            if (!this.halvedSpeed) {
                this.maxVelocity /= 2;
                this.halvedSpeed = true;
            }
        } else {
            // If the car is back on track, reset its speed
            if (this.halvedSpeed) {
                this.maxVelocity *= 2;
                this.halvedSpeed = false;
            }
        }


        if (this.routePoints === null && this.rotationPoints === null) { // player car
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
    

            if (!this.keysPressed["w"] && !this.keysPressed["s"] && this.actualVelocity != 0) {
                const dampingFactor = 1;
                if (this.actualVelocity > 0) this.actualVelocity -= dampingFactor;
                else if (this.actualVelocity < 0) this.actualVelocity += dampingFactor;
                this.moveForward(this.actualVelocity, deltaTime);
            }
    
            if (this.keysPressed["s"]) {
                this.actualVelocity -= decelerationFactor;
                this.moveForward(this.actualVelocity, deltaTime);
            }
    
            if (this.keysPressed["w"]) {
                this.actualVelocity += accelerationFactor;
                this.moveForward(this.actualVelocity, deltaTime);
            }
    
            if (this.actualVelocity > this.maxVelocity) {
                this.actualVelocity = this.maxVelocity;
            }
    
            if (this.actualVelocity < -this.maxVelocity) {
                this.actualVelocity = -this.maxVelocity;
            }

            //console.log("velocity: " + this.actualVelocity)
            //console.log("max vle:" + this.maxVelocity)
    
            if(Math.abs(this.actualVelocity) < 0.08)
                this.actualVelocity = 0;

            this.carFrontWheelLeft.rotation.x += this.wheelRotationSpeed * this.actualVelocity
            this.carFrontWheelRight.rotation.x += this.wheelRotationSpeed * this.actualVelocity
            this.carBackWheelLeft.rotation.x += this.wheelRotationSpeed * this.actualVelocity
            this.carBackWheelRight.rotation.x += this.wheelRotationSpeed * this.actualVelocity   

        }
        else if (this.routePoints !== null && this.rotationPoints !== null) { // bot car

            if (this.animation !== undefined) {
                this.animation.update();
            }

            //console.log("rotation: " + this.carBox.rotation.y)
        }
    }

    pauseAnimation() {
        this.animation.pauseAnimation();
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
        // velocity of car stays at maxVelocity * boost for duration seconds

        this.maxVelocity = this.maxVelocity * boost;

        this.withBoost = true;

        this.app.contents.game.startCountdown(duration);

        setTimeout(() => {
            this.maxVelocity = this.maxVelocity / boost;
            this.withBoost = false;
        }, duration * 1000);

    }

    applyTimeEffect(time) {
        // time to complete a lap is reduced by time seconds
        
        if (this.withEffect) {
            console.log("It was with effect already")
            return;
        }
        else {
            if (this.app.contents.game.elapsedTime + time < 0) {
                this.app.contents.game.elapsedTime = 0;
            }
            else {
                this.app.contents.game.elapsedTime += time;
            }
        }

    }

    checkCollisions() {
        this.notInTrack = this.outsideTrack();

        this.objectCollision();

        this.lapCollision();

    }

    outsideTrack() {
        const raycaster = new THREE.Raycaster();
        const carPosition = this.carBox.position.clone();

        carPosition.y += 1;

        raycaster.set(carPosition, new THREE.Vector3(0, -1, 0));

        const meshes = []
        
        const trackMesh = this.app.contents.game.reader.getTrack().trackMesh

        meshes.push(trackMesh)

        const intersections = raycaster.intersectObjects(meshes)

        return intersections.length === 0;

    }

    objectCollision() {
        const carBoundingBox = this.carBounding;

        const objects = this.app.contents.game.reader.objects;

        for (const objectId in objects) {
            if (objects.hasOwnProperty(objectId)) {
                var object = objects[objectId];
            }
            
            if (carBoundingBox.intersectsBox(object.boundingBox)) {
                console.log("collision with object")
                console.log("boost? " + this.withBoost)
                if (!this.withBoost && !this.withEffect) {
                    console.log("WITH EFFECT: " + this.withEffect)
                    console.log("APPLY EFFECT")
                    object.applyEffect(this);
                    this.withEffect = true;

                    this.effectTimer = setTimeout(() => {
                        this.withEffect = false;
                        console.log("Effect timer expired. Resetting withEffect to false.");
                    }, 5000);
                }    
                return true;
            }
           
        }

        return false;
    }

    lapCollision() {
        const carPosition = this.carBox.position.clone();

        // Check if the car has crossed the finish line
        if (
            this.routePoints === null &&
            this.rotationPoints === null &&
            carPosition.z > -0.9 &&
            carPosition.z < 1 &&
            carPosition.x > 0 &&
            carPosition.x < 30
        ) {

            if (this.prevCarPosition.z < -1 ) {
                if(this.laps < 3) {this.laps += 1;
                console.log("Lap completed. Total laps: " + this.laps);
                }
            }
        }



        if (this.routePoints !== null && this.rotationPoints !== null) { // bot car
            if (this.animation !== undefined) {
                if (this.animation.checkLap()) {
                    this.laps += 1;
                    console.log("Lap completed. Total laps: " + this.laps);
                    
                }
            }
        }

        this.prevCarPosition.copy(carPosition);
        }
}


export { Car };
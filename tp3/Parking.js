import * as THREE from 'three';

class Parking {
    constructor(app, x, y, z, numRows, spaceWidth, spaceLength, spaceDelimiterWidth, spaceDelimiterLength) {
        this.app = app;

        this.mesh = null;

        this.x = x;
        this.y = y;
        this.z = z;

        this.numRows = numRows;

        this.spaceWidth = spaceWidth;
        this.spaceLength = spaceLength;

        this.spaceDelimiterWidth = spaceDelimiterWidth;
        this.spaceDelimiterLength = spaceDelimiterLength;

        this.parkingSpaces = [];
        this.parkingDelimiters = [];

        this.parking = new THREE.Group();
        this.createParkingLot();

        this.parking.rotation.y = Math.PI / 2;
        
        this.app.scene.add(this.parking);
    }

    createParkingLot() {

        const initialParkingDelimPos = new THREE.Vector3(this.x, this.y, this.z);
        const initialParkingSpacePos = new THREE.Vector3(this.x, this.y, this.z + this.spaceDelimiterLength/2 + this.spaceLength/2);

        for (let i = 0; i < this.numRows; i++) {
            const parkingDelim = new ParkingDelimiter(
                this.app,
                initialParkingDelimPos,
                this.spaceDelimiterWidth,
                this.spaceDelimiterLength
            );

            const parkingSpace = new ParkingSpace(
                this.app,
                initialParkingSpacePos,
                this.spaceWidth,
                this.spaceLength
            );

            this.parkingSpaces.push(parkingSpace);
            this.parkingDelimiters.push(parkingDelim);

            this.parking.add(parkingSpace.mesh);
            this.parking.add(parkingDelim.mesh);

            // Ajuste da posição para o próximo espaço e delimitador
            initialParkingSpacePos.z += this.spaceLength + this.spaceDelimiterLength;
            initialParkingDelimPos.z += this.spaceLength + this.spaceDelimiterLength;
        }

        const parkingDelim = new ParkingDelimiter(
            this.app,
            initialParkingDelimPos,
            this.spaceDelimiterWidth,
            this.spaceDelimiterLength
        );
        this.parkingDelimiters.push(parkingDelim); 
        this.parking.add(parkingDelim.mesh);
    }
}

class ParkingSpace {
    constructor(app, initialParkingSpacePos, spaceWidth, spaceLength) {
        this.app = app;

        this.mesh = null;

        this.initialParkingSpacePos = initialParkingSpacePos;

        this.spaceWidth = spaceWidth;
        this.spaceLength = spaceLength;

        this.texture = new THREE.TextureLoader().load('textures/quartz-base.jpg');
        this.displacementMap = new THREE.TextureLoader().load('textures/quartz-height.jpg');
        this.normalMap = new THREE.TextureLoader().load('textures/quartz-normal.jpg');
        this.aoMap = new THREE.TextureLoader().load('textures/quartz-ao.jpg');
        this.roughnessMap = new THREE.TextureLoader().load('textures/quartz-roughness.jpg');

        this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
        this.texture.repeat.set(3, 1);

        this.createParkingSpace();
    }

    createParkingSpace() {
        const geometry = new THREE.PlaneGeometry(this.spaceWidth, this.spaceLength);
        const material = new THREE.MeshStandardMaterial({
            map: this.texture,
            displacementMap: this.displacementMap,
            displacementScale: 0.5,
            normalMap: this.normalMap,
            normalScale: new THREE.Vector2(1, 1),
            roughnessMap: this.roughnessMap,
            roughness: 0.4,
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(this.initialParkingSpacePos.x, this.initialParkingSpacePos.y, this.initialParkingSpacePos.z);

        this.mesh.rotation.x = -Math.PI / 2;
    }
}

class ParkingDelimiter {
    constructor(app, initialParkingDelimPos, spaceDelimiterWidth, spaceDelimiterLength) {
        this.app = app;

        this.mesh = null;

        this.initialParkingDelimPos = initialParkingDelimPos;

        this.spaceDelimiterWidth = spaceDelimiterWidth;
        this.spaceDelimiterLength = spaceDelimiterLength;

        this.texture = new THREE.TextureLoader().load('textures/park-base.jpg');

        this.createParkingDelimiter();
    }

    createParkingDelimiter() {
        const geometry = new THREE.PlaneGeometry(this.spaceDelimiterWidth, this.spaceDelimiterLength);
        const material = new THREE.MeshStandardMaterial({
            map: this.texture,
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(this.initialParkingDelimPos.x, this.initialParkingDelimPos.y, this.initialParkingDelimPos.z);

        this.mesh.rotation.x = -Math.PI / 2;
        
    }
}

export default Parking;

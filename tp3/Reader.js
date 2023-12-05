import * as THREE from 'three';
import { Route } from './Route.js';
import { Obstacle } from './Obstacle.js';
import { PowerUp } from './PowerUp.js';
import { Track } from './Track.js';
import { Ground } from './Ground.js';

class Reader {
    constructor(app) {
        this.app = app;
        this.reader = new THREE.Group();

        this.objects = []

        this.routes = []

        this.instantiateTrack();
    }

    instantiateTrack() {

        this.track = new Track(this.app, 0,0,0);
        this.reader.add(this.track.trackMesh);

        this.routes = new Route()

        this.route = this.routes.keyRoutes[0];
        this.rotationRoute = this.routes.rotationRoutes[0];


        //const geometry = new THREE.BufferGeometry().setFromPoints(this.route1.routePoints);
        //const material = new THREE.LineBasicMaterial({color: 0xff0000});
        //const line = new THREE.Line(geometry, material);
        //this.app.scene.add(line);

        this.ground = new Ground(this.app, 0, -2.1, 0, 350, 350);
        this.reader.add(this.ground.groundMesh);

        this.obstaclePoints = [
            new THREE.Vector3(14, 5, 50),
            new THREE.Vector3(-50, 5,120),
            new THREE.Vector3(-35, 5, 25),
            new THREE.Vector3(-105, 5, -75),
        ]

        this.createObject(Obstacle, 3, this.obstaclePoints);

        this.powerUpPoints = [
            new THREE.Vector3(30, 5, 50),
            new THREE.Vector3(-80, 5, 130),
            new THREE.Vector3(-45, 5, 25),	
            new THREE.Vector3(30, 5, -75),
        ]

        this.createObject(PowerUp, 3, this.powerUpPoints);
        
        this.reader.position.set(0,0,0);
        this.app.scene.add(this.reader);
    }   

    createObject(objectType, count, pointsArray) {

        var i = 0;
        while ( i < count) {
            const randomIndex = Math.floor(Math.random() * pointsArray.length);
            const randomPoint = pointsArray[randomIndex];
            const randomType = Math.random() < 0.5 ? "Type1" : "Type2";
            const object = new objectType(this.app, randomPoint.x,randomPoint.y, randomPoint.z, 3,32,16, randomType);
            if (this.objects[object.id] === undefined) {
                this.objects[object.id] = object;
                this.reader.add(object.mesh);
                i++;
            }
            else {
                continue;
            }
        }
    }

    
}

export { Reader };
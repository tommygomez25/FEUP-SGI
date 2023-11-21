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

        this.instantiateTrack();
    }

    instantiateTrack() {

        this.track = new Track(this.app, 0,0,0);
        this.reader.add(this.track.trackMesh);

        const routePoints = [
            new THREE.Vector3(0, 0, 8), // 1
            new THREE.Vector3(-80, 0, 8), // 2
            new THREE.Vector3(-95, 0, 6), // 3
            new THREE.Vector3(-100, 0, 3), // 4
            new THREE.Vector3(-110, 0, -15), // 5
            new THREE.Vector3(-115, 0, -25), // 6
            new THREE.Vector3(-113, 0, -75), // 7
            new THREE.Vector3(-105, 0, -100), // 8
            new THREE.Vector3(-95, 0, -107), // 9
            new THREE.Vector3(-85, 0, -110), // 10
            new THREE.Vector3(-75, 0, -110), // 11
            new THREE.Vector3(-60, 0, -110), // 12
            new THREE.Vector3(-50, 0, -105), // 13
            new THREE.Vector3(-45, 0, -90), // 14
            new THREE.Vector3(-35, 0, -50), // 15
            new THREE.Vector3(-25, 0, -45), // 16
            new THREE.Vector3(-5, 0, -40), // 17
            new THREE.Vector3(5, 0, -40), // 18
            new THREE.Vector3(25, 0, -45), // 19
            new THREE.Vector3(35, 0, -55), // 20
            new THREE.Vector3(37, 0, -60), // 21
            new THREE.Vector3(45, 0, -95), // 22
            new THREE.Vector3(48, 0, -102), // 23
            new THREE.Vector3(75, 0, -110), // 24
            new THREE.Vector3(80, 0, -110), // 25
            new THREE.Vector3(105, 0, -100), // 26
            new THREE.Vector3(115, 0, -75), // 27
            new THREE.Vector3(115, 0, -25), // 28
            new THREE.Vector3(105, 0, 0), // 29
            new THREE.Vector3(95, 0, 6), // 30
            new THREE.Vector3(80, 0, 8), // 31
            new THREE.Vector3(0, 0, 8), // 32
        ];

        this.route1 = new Route(routePoints);
        const geometry = new THREE.BufferGeometry().setFromPoints(this.route1.routePoints);
        const material = new THREE.LineBasicMaterial({color: 0xff0000});
        const line = new THREE.Line(geometry, material);
        this.app.scene.add(line);

        this.ground = new Ground(this.app, 0, -2.1, 0, 350, 350);
        this.reader.add(this.ground.groundMesh);

        this.obstacles = [];

        const obstaclePoints = [
            new THREE.Vector3(-100, 5, 3),
            new THREE.Vector3(25, 5, -45),
            new THREE.Vector3(80, 5, 8),
        ]

        for (var i = 0; i < obstaclePoints.length; i++) {
            this.obstacles[i] = new Obstacle(this.app, obstaclePoints[i].x, obstaclePoints[i].y, obstaclePoints[i].z, 3,32,16);
            this.reader.add(this.obstacles[i].obstacleMesh);
        }  

        this.powerUps = [];

        const powerUpPoints = [
            new THREE.Vector3(-95, 5, 6),
            new THREE.Vector3(5, 5, -40),
            new THREE.Vector3(105, 5, 0),
        ]

        for (var i = 0; i < powerUpPoints.length; i++) {
            this.powerUps[i] = new PowerUp(this.app, powerUpPoints[i].x, powerUpPoints[i].y, powerUpPoints[i].z, 3,32,16);
            this.reader.add(this.powerUps[i].powerUpMesh);
        }
        
        this.reader.position.set(0,0,0);
        this.app.scene.add(this.reader);
    }

    
}

export { Reader };
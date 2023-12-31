import * as THREE from 'three';
import { Car } from './Car.js';
import Parking from './Parking.js';
import { Picking } from './Picking.js';
import { PowerUp } from './PowerUp.js';
import { HUD } from './HUD.js';
import { Firework } from './Firework.js';
import { Reader } from './Reader.js';

class Game {
    constructor(app) {
        this.app = app;

        this.state = "initial";

        this.myCars = [];
        this.otherCars = [];
        this.pickingPowerUps = [];
        this.HUD = null;
        this.reader = null;

        this.picking = new Picking(this.app);

        this.app.pickingOwnCar = true;
        this.app.pickingOtherCar = false;

        this.fireworks = []

        this.selectedCar = undefined;
        this.selectedBotCar = undefined;
        
        this.selectedDifficulty = undefined;

        this.elapsedTime = 0;

        this.numbersMeshes = [];
        this.stateMeshes = [];
        
        this.createNumberMeshes();
        this.createStateMeshes();

        this.setup();

        document.addEventListener('keydown', (event) => this.handleKeyDown(event), false);
    }

    startGame() {

        this.app.scene.remove(this.difficultyBox);
        this.app.scene.remove(this.startGameBox);
        this.app.scene.remove(this.myCarSelectedHUDName.hudTextMesh);
        this.app.scene.remove(this.selectedBotCarHudName.hudTextMesh);
        this.app.scene.remove(this.difficultyEasyHUD.hudTextMesh);
        this.app.scene.remove(this.difficultyHardHUD.hudTextMesh);
        this.app.scene.remove(this.startGameHUD.hudTextMesh);
        this.app.scene.remove(this.myCarSelectedHUD.hudTextMesh);
        this.app.scene.remove(this.otherCarSelectedHUD.hudTextMesh);
        this.app.scene.remove(this.myCarSelectedHUD);
        this.app.scene.remove(this.otherCarSelectedHUD);
        this.app.scene.remove(this.difficultyEasyHUD);
        this.app.scene.remove(this.difficultyHardHUD);
        this.app.scene.remove(this.startGameHUD);


        this.app.scene.remove(this.parking1.parking);
        this.app.scene.remove(this.parking2.parking);

        for (const carName in this.myCars) {
            const car = this.myCars[carName];
            if (car !== this.selectedCar) {
                this.app.scene.remove(car.carBox);
            }
        }

        this.selectedCar.carBox.position.set(21, 2, 0.2);

    
        for (const carName in this.otherCars) {
            const car = this.otherCars[carName];
            if (car !== this.selectedBotCar) {
                this.app.scene.remove(car.carBox);
            }
        }

        
        this.selectedBotCar.carBox.position.set(7, 2, 0);

        this.selectedBotCar.difficulty = this.selectedDifficulty;

        this.selectedBotCar.createAnimation();

        this.elapsedTimeHUD = new HUD(this.app, this.app.activeCamera, window.innerWidth, window.innerHeight, this.app.renderer, "Elapsed Time: ", 140, 0 ,-25,Math.PI/2,Math.PI,0, 5, 0xffffff);
        this.elapsedTimeHUDNameDigits = [];

        this.lapsHUD = new HUD(this.app, this.app.activeCamera, window.innerWidth, window.innerHeight, this.app.renderer, "Laps: ", 140, 0 ,0,Math.PI/2,Math.PI,0, 5, 0xffffff);
        this.lapsHUDNameDigits = [];

        this.maxVelocityHUD = new HUD(this.app, this.app.activeCamera, window.innerWidth, window.innerHeight, this.app.renderer, "Max Velocity: ", 140, 0 ,25,Math.PI/2,Math.PI,0, 5, 0xffffff);
        //this.maxVelocityHUDName = new HUD(this.app, this.app.activeCamera, window.innerWidth, window.innerHeight, this.app.renderer, String(this.selectedCar.maxVelocity), 90, 0 ,25,Math.PI/2,Math.PI,0, 5, 0xffffff);
        this.maxVelocityHUDNameDigits = [];
        // TODO: ADD HUD FOR TIME TO LOSE POWERUP

        this.gameStateHUD = new HUD(this.app, this.app.activeCamera, window.innerWidth, window.innerHeight, this.app.renderer, "Game State: ", 140, 0 ,50,Math.PI/2,Math.PI,0, 5, 0xffffff);
        this.gameStateHUDName = null;

        this.remainEffectHUD = new HUD(this.app, this.app.activeCamera, window.innerWidth, window.innerHeight, this.app.renderer, "Time of effect: ", 140, 0 ,-50,Math.PI/2,Math.PI,0, 5, 0xffffff);
        this.countdownHUDNameDigits = [];

        this.state = "playing";

    }

    setup() {

        this.gameNameHUD = new HUD(this.app, this.app.activeCamera, window.innerWidth, window.innerHeight, this.app.renderer, "SuperMarket Speedway", 150,50,130,0,Math.PI,0, 20, 0xffff00);
        this.name1HUD = new HUD(this.app, this.app.activeCamera, window.innerWidth, window.innerHeight, this.app.renderer, "Tomas Gomes - up202004393", 140, 0 ,-160,Math.PI/2,Math.PI,0, 5, 0xffffff);
        this.name2HUD = new HUD(this.app, this.app.activeCamera, window.innerWidth, window.innerHeight, this.app.renderer, "Francisco Serra - up202007723",140,0,-150,Math.PI/2,Math.PI,0, 5, 0xffffff);
        
        this.myCarSelectedHUD = new HUD(this.app, this.app.activeCamera, window.innerWidth, window.innerHeight, this.app.renderer, "Selected car: ", 140, 0 ,-100,Math.PI/2,Math.PI,0, 5, 0xffffff);

        this.otherCarSelectedHUD = new HUD(this.app, this.app.activeCamera, window.innerWidth, window.innerHeight, this.app.renderer, "AI Selected car: ", 140, 0 ,-25,Math.PI/2,Math.PI,0, 5, 0xffffff);

        this.difficultyEasyHUD = new HUD(this.app, this.app.activeCamera, window.innerWidth, window.innerHeight, this.app.renderer, "EASY", 110, 0 ,-120,Math.PI/2,Math.PI,0, 5, 0xffffff);
        this.difficultyBox = new THREE.Mesh(new THREE.BoxGeometry(30, 5, 5), new THREE.MeshBasicMaterial({ visible:false }));
        this.difficultyBox.name = "EASY"
        this.difficultyBox.layers.enable(1);
        this.difficultyBox.position.set(100, -3, -117.5);
        this.app.scene.add(this.difficultyBox);

        this.difficultyHardHUD = new HUD(this.app, this.app.activeCamera, window.innerWidth, window.innerHeight, this.app.renderer, "HARD", 110, 0 ,-130,Math.PI/2,Math.PI,0, 5, 0xffffff);
        this.difficultyBox = new THREE.Mesh(new THREE.BoxGeometry(30, 5, 5), new THREE.MeshBasicMaterial({ visible:false }));
        this.difficultyBox.name = "HARD"
        this.difficultyBox.layers.enable(1);
        this.difficultyBox.position.set(100, -3, -127.5);
        this.app.scene.add(this.difficultyBox);

        this.startGameHUD = new HUD(this.app, this.app.activeCamera, window.innerWidth, window.innerHeight, this.app.renderer, "START GAME", 150, 0 ,100,Math.PI/2,Math.PI,0, 15, 0xffffff);
        this.startGameBox = new THREE.Mesh(new THREE.BoxGeometry(150, 5, 30), new THREE.MeshBasicMaterial({ visible:false }));
        this.startGameBox.name = "START GAME"
        this.startGameBox.layers.enable(1);
        this.startGameBox.position.set(90, -3, 110);
        this.app.scene.add(this.startGameBox);

        
        this.reader = new Reader(this.app);

        this.parking1 = new Parking(this.app, 75, 0.1, 60, 3, 30, 15, 30, 5);
        this.parking2 = new Parking(this.app, 0, 0.1, 60, 3, 30, 15, 30, 5);
        this.parking3 = new Parking(this.app, -75, 0.1, 60, 3, 30, 15, 30, 5);

        this.createMyCars();
        this.createOtherCars();
        this.createPickingPowerUps();

    }

    createMyCars() {
        const carNames = ["Car 1", "Car 2", "Car 3"];
        const colors = [0xff0000, 0xff00ff, 0x0000ff];
        for (var i = 0; i < 3; i++) {
            var car = new Car(this.app, this.parking1.parkingSpaces[i].mesh.position.z , 2, -this.parking1.parkingSpaces[i].mesh.position.x, this.app.cameras['Perspective'], carNames[i],colors[i], 1, true);
            console.log(car)
            this.myCars[carNames[i]] = car;
        }
    }
    
    createOtherCars() {
        const carNames = ["AI Car 1", "AI Car 2", "AI Car 3"];
        const colors = [0x000000, 0xffff00, 0xffa500];
        for (var i = 0; i < 3; i++) {
            var car = new Car(this.app, 
                this.parking2.parkingSpaces[i].mesh.position.z , 
                2,
                -this.parking2.parkingSpaces[i].mesh.position.x, 
                this.app.cameras['Perspective'],
                carNames[i],colors[i], 
                1,
                false,
                this.reader.route,
                this.reader.rotationRoute ); // TODO: CAHNGE ROUTES ACCORDING TO PARKING
            
            this.otherCars[carNames[i]] = car;
        }
    }

    createPickingPowerUps() {
        const powerUpNames = ["powerUp1", "powerUp2", "powerUp3"];
        const types = ["Type1", "Type2"]
        for (var i = 0; i < 3; i++) {
            const randomType = Math.random() < 0.5 ? "Type1" : "Type2";
            var powerUp = new PowerUp(this.app, this.parking3.parkingSpaces[i].mesh.position.z , 4, -this.parking3.parkingSpaces[i].mesh.position.x, 3, 32, 16, randomType);
            this.pickingPowerUps[powerUpNames[i]] = powerUp;
            this.app.scene.add(powerUp.mesh);
            powerUp.mesh.layers.enable(3)
        }
    }

    update(deltaTime) {

        for (var object in this.reader.objects) {
            this.reader.objects[object].update(deltaTime);
        }
        
        if (this.state === "initial") {
                if (this.selectedCar !== undefined) {
                    if (this.newCarSelected("my")) {
                        if (this.myCarSelectedHUDName !== undefined) {this.myCarSelectedHUDName.delete();}

                        this.myCarSelectedHUDName = new HUD(this.app, this.app.activeCamera, window.innerWidth, window.innerHeight, this.app.renderer, this.selectedCar.name, 90, 0 ,-100,Math.PI/2,Math.PI,0, 5, 0xffffff);
                    }
                }
                    
                    
                if (this.selectedBotCar !== undefined) {
                    if (this.newCarSelected("bot")) {
                        if (this.selectedBotCarHudName !== undefined) {this.selectedBotCarHudName.delete();}

                        this.selectedBotCarHudName = new HUD(this.app, this.app.activeCamera, window.innerWidth, window.innerHeight, this.app.renderer, this.selectedBotCar.name, 90, 0 ,-25,Math.PI/2,Math.PI,0, 5, 0xffffff); 
                    }
                }  
                
                if (this.selectedDifficulty !== undefined) {
                    if (this.selectedDifficulty === "EASY") {
                        this.difficultyHardHUD.hudTextMesh.material.color.setHex(0xffffff);
                        this.difficultyEasyHUD.hudTextMesh.material.color.setHex(0x00ff00);
                    }
                    else {
                        this.difficultyEasyHUD.hudTextMesh.material.color.setHex(0xffffff);
                        this.difficultyHardHUD.hudTextMesh.material.color.setHex(0x00ff00);
                    }
                }
        }
        else if (this.state === "playing") {
            this.updatePlaying(deltaTime);
        }

        else if (this.state === "paused") {
            this.updatePaused(deltaTime);
        }
        else if (this.state === "end") {
            this.updateEnd(deltaTime);
        }
        
    }

    updatePlaying(deltaTime) {

        this.app.scene.remove(this.gameStateHUDName);
        this.gameStateHUDName = this.stateMeshes[0];
        this.gameStateHUDName.position.set(90, 0, 50);
        this.gameStateHUDName.rotation.set(Math.PI / 2, Math.PI, 0);
        this.app.scene.add(this.gameStateHUDName);

        this.elapsedTime += deltaTime;

        this.updateElapsedTimeHUD(deltaTime);

        this.updateLapsHUD(deltaTime);

        this.updateMaxVelocityHUD(deltaTime);


        //this.maxVelocityHUDName.delete();
        //this.maxVelocityHUDName = new HUD(this.app, this.app.activeCamera, window.innerWidth, window.innerHeight, this.app.renderer, String(Math.floor(this.selectedCar.maxVelocity)), 90, 0 ,25,Math.PI/2,Math.PI,0, 5, 0xffffff);

        // update only the selected car
        if (this.selectedCar !== undefined) {
            this.selectedCar.update(deltaTime); 
            this.selectedCar.checkCollisions();

        }

        if (this.selectedBotCar !== undefined) {
            this.selectedBotCar.update(deltaTime);
            this.selectedBotCar.lapCollision();
            this.selectedBotCar.animation.resumeAnimation();
        }

        if (this.selectedCar.laps === 3 || this.selectedBotCar.laps === 3) {
            if (this.selectedCar.laps === 3) {
                this.winner = this.selectedCar;
            }
            else {
                this.winner = this.selectedBotCar;
            }
            this.winnerHUD = new HUD(this.app, this.app.activeCamera, window.innerWidth, window.innerHeight, this.app.renderer, this.winner.name + " won!", 0, 0 ,0,Math.PI/2,Math.PI,0, 15, 0xffffff);
            this.endGame();
        }
    }

    updatePaused(deltaTime) {
        this.selectedBotCar.pauseAnimation();
        this.selectedBotCar.update(deltaTime);
        this.app.scene.remove(this.gameStateHUDName);

        this.cancelCountdown();

        this.gameStateHUDName = this.stateMeshes[1];
        this.gameStateHUDName.position.set(90, 0, 50);
        this.gameStateHUDName.rotation.set(Math.PI / 2, Math.PI, 0);
        this.app.scene.add(this.gameStateHUDName);
    }

    newCarSelected(type) {
        if (type === "my") {
            if (this.myCarSelectedHUDName === undefined) {return true;}

            return this.selectedCar.name !== this.myCarSelectedHUDName.text;
        }
        else if (type === "bot") {
            if (this.selectedBotCarHudName === undefined) {return true;}

            return this.selectedBotCar.name !== this.selectedBotCarHudName.text;
        }

    }

    createStateMeshes() {
        const playingGeometry = new HUD(this.app, this.app.activeCamera, window.innerWidth, window.innerHeight, this.app.renderer, "Playing", 0, -10, 0, Math.PI / 2, Math.PI, 0, 5, 0xffffff);
        const pausedGeometry = new HUD(this.app, this.app.activeCamera, window.innerWidth, window.innerHeight, this.app.renderer, "Paused", 0, -10, 0, Math.PI / 2, Math.PI, 0, 5, 0xffffff);

        playingGeometry.initMesh((mesh) => {
            this.playingStateMesh = mesh;
            this.stateMeshes.push(mesh);
        });

        pausedGeometry.initMesh((mesh) => {
            this.pausedStateMesh = mesh;
            this.stateMeshes.push(mesh);
        });
    }

    createNumberMeshes() {
        for (let i = 0; i < 10; i++) {
            const numberHUD = new HUD(this.app, this.app.activeCamera, window.innerWidth, window.innerHeight, this.app.renderer, String(i), 0, -10,0,Math.PI/2,Math.PI,0, 5, 0xffffff);
            
            numberHUD.initMesh((mesh) => {
                this.numbersMeshes.push(mesh);
            });
        }
    }

    getDigits(text) {
        const elapsedTimeString = {
            meshes: [],
        };
    
        const elapsedTimeSeconds = Math.floor(text);
        const unitsDigit = elapsedTimeSeconds % 10;
        const tensDigit = Math.floor(elapsedTimeSeconds / 10);
    
        // Use the pre-defined geometries for units and tens digits
        elapsedTimeString.meshes.push(this.numbersMeshes[tensDigit]);
        elapsedTimeString.meshes.push(this.numbersMeshes[unitsDigit]);
    

        return elapsedTimeString;
    }

    updateElapsedTimeHUD() {

        for (let i = 0; i < this.elapsedTimeHUDNameDigits.length; i++) {
            this.app.scene.remove(this.elapsedTimeHUDNameDigits[i]);
        }

        const elapsedTimeString = this.getDigits(this.elapsedTime);
        
        const nDigits = elapsedTimeString.meshes.length;

        for (let i = 0; i < nDigits; i++) {
            var elapsedTimeHUDName = elapsedTimeString.meshes[i].clone();
            elapsedTimeHUDName.position.set(90 - 5 * i, 0, -25);
            elapsedTimeHUDName.rotation.set(Math.PI / 2, Math.PI, 0);
            this.app.scene.add(elapsedTimeHUDName);
            this.elapsedTimeHUDNameDigits.push(elapsedTimeHUDName);
        }
    }

    updateLapsHUD() {
            
        for (let i = 0; i < this.lapsHUDNameDigits.length; i++) {
            this.app.scene.remove(this.lapsHUDNameDigits[i]);
        }

        const lapsString = this.getDigits(this.selectedCar.laps);

        const nDigitsLaps = lapsString.meshes.length;

        for (let i = 0; i < nDigitsLaps; i++) {
            var lapsHUDName = lapsString.meshes[i].clone();
            lapsHUDName.position.set(90 - 5 * i, 0, 0);
            lapsHUDName.rotation.set(Math.PI / 2, Math.PI, 0);
            this.app.scene.add(lapsHUDName);
            this.lapsHUDNameDigits.push(lapsHUDName);
        }
    }

    updateMaxVelocityHUD() {

        for (let i = 0; i < this.maxVelocityHUDNameDigits.length; i++) {
            this.app.scene.remove(this.maxVelocityHUDNameDigits[i]);
        }

        const maxVelocityString = this.getDigits(this.selectedCar.maxVelocity);

        const nDigitsMaxVelocity = maxVelocityString.meshes.length;

        for (let i = 0; i < nDigitsMaxVelocity; i++) {
            var maxVelocityHUDName = maxVelocityString.meshes[i];
            maxVelocityHUDName.position.set(90 - 5 * i, 0, 25);
            maxVelocityHUDName.rotation.set(Math.PI / 2, Math.PI, 0);
            this.app.scene.add(maxVelocityHUDName);
            this.maxVelocityHUDNameDigits.push(maxVelocityHUDName);
        }
    }

    updateCountdownHUD() {
        for (let i = 0; i < this.countdownHUDNameDigits.length; i++) {
            this.app.scene.remove(this.countdownHUDNameDigits[i]);
        }

        const countdownString = this.getDigits(this.countdownTime);

        const nDigitsCountdown = countdownString.meshes.length;

        for (let i = 0; i < nDigitsCountdown; i++) {
            var countdownHUDName = countdownString.meshes[i].clone();
            countdownHUDName.position.set(90 - 5 * i, 0, -50);
            countdownHUDName.rotation.set(Math.PI / 2, Math.PI, 0);
            this.app.scene.add(countdownHUDName);
            this.countdownHUDNameDigits.push(countdownHUDName);
        }
    }

    updateEnd() {

        for (let i = 0; i < this.elapsedTimeHUDNameDigits.length; i++) {
            this.app.scene.remove(this.elapsedTimeHUDNameDigits[i]);
        }
        for (let i = 0; i < this.lapsHUDNameDigits.length; i++) {
            this.app.scene.remove(this.lapsHUDNameDigits[i]);
        }
        for (let i = 0; i < this.maxVelocityHUDNameDigits.length; i++) {
            this.app.scene.remove(this.maxVelocityHUDNameDigits[i]);
        }
        for (let i = 0; i < this.countdownHUDNameDigits.length; i++) {
            this.app.scene.remove(this.countdownHUDNameDigits[i]);
        }
        this.app.scene.remove(this.elapsedTimeHUD.hudTextMesh);
        this.app.scene.remove(this.lapsHUD.hudTextMesh);
        this.app.scene.remove(this.maxVelocityHUD.hudTextMesh);
        this.app.scene.remove(this.remainEffectHUD.hudTextMesh);
        this.app.scene.remove(this.gameStateHUDName);
        this.app.scene.remove(this.gameStateHUD.hudTextMesh);

        // difficulty used display
        if (this.selectedBotCar.difficulty === "EASY") {
            this.app.scene.add(this.difficultyEasyHUD.hudTextMesh);
        }
        else {
            this.app.scene.add(this.difficultyHardHUD.hudTextMesh);
        }

        // cars used display
        this.app.scene.add(this.myCarSelectedHUD.hudTextMesh);
        this.app.scene.add(this.myCarSelectedHUDName.hudTextMesh);
        this.app.scene.add(this.otherCarSelectedHUD.hudTextMesh);
        this.app.scene.add(this.selectedBotCarHudName.hudTextMesh);

        // time elapsed display already there

        // time elapsed bot car display

        // winner display
        
        // firework
        
        if(Math.random()  < 0.05 ) {
            this.fireworks.push(new Firework(this.app, this))
            console.log("firework added")
        }

        // for each fireworks 
        for( let i = 0; i < this.fireworks.length; i++ ) {
            // is firework finished?
            if (this.fireworks[i].done) {
                // remove firework 
                this.fireworks.splice(i,1) 
                console.log("firework removed")
                continue 
            }
            // otherwise upsdate  firework
            this.fireworks[i].update()
        }

       



    }


    handleKeyDown(event) {
        switch (event.key) {
            case 'Escape':
                this.endGame();
                break;
            case ' ':
                this.togglePause();
                break;
        }
    }

    endGame() {
        this.state = "end";
    }

    togglePause() {
        if (this.state === "playing") {
            this.state = "paused";
        }
        else if (this.state === "paused") {
            this.state = "playing";
        }
    }

    startCountdown(duration) {
        console.log("Starting countdown of " + duration + " seconds");
        this.countdownTime = duration;

        this.countdownTimer = setInterval(() => {
            if (this.countdownTime === 0) {
                this.endCountdown();
            } else {
                this.countdownTime--;
                this.updateCountdownHUD();
            }
        }, 1000);
    }

    endCountdown() {
        console.log("Countdown ended");
        clearInterval(this.countdownTimer);
    }

    cancelCountdown() {
        if (this.countdownTimer !== null) {
            clearInterval(this.countdownTimer);
            this.countdownTimer = null;
            this.countdownTime = 0;
        }
    }

}

export { Game }
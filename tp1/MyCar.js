import * as THREE from 'three';
import { MyUtils } from './MyUtils.js';

class MyCar {
    constructor(app) {
        
        this.app = app
        this.numberOfSamples = 100
        this.utils = new MyUtils(app)
        this.boardTexture = new THREE.TextureLoader().load( 'textures/board.jpg' );
        this.boardTexture.wrapS = THREE.RepeatWrapping;
        this.boardTexture.wrapT = THREE.RepeatWrapping;
        this.boardMaterial = new THREE.MeshPhongMaterial({ map: this.boardTexture, specular: "#000000", emissive: "#000000", shininess: 10, side: THREE.DoubleSide });
    }
    
    create() {
        this.board = new THREE.BoxGeometry( 6,3,0.1);
        this.boardMesh = new THREE.Mesh( this.board, this.boardMaterial );
        this.boardMesh.position.y = 2.5;
        this.boardMesh.position.x = 0;
        this.boardMesh.position.z = 0;
        
        
        this.carSize = 5
        const rearWheel= this.utils.drawSemiCircunference(new THREE.Vector3(-3/this.carSize,-this.boardMesh.geometry.parameters.height/4,this.boardMesh.position.z + 0.1), 3/this.carSize, 100)
        const frontWheel = this.utils.drawSemiCircunference(new THREE.Vector3(7/this.carSize,-this.boardMesh.geometry.parameters.height/4,this.boardMesh.position.z + 0.1), 3/this.carSize, 100)
        const body1= this.utils.drawQuarterCircunference(new THREE.Vector3(2/this.carSize,-this.boardMesh.geometry.parameters.height/4,this.boardMesh.position.z + 0.1), 8/this.carSize, 100,false)
        const body2= this.utils.drawQuarterCircunference(new THREE.Vector3(2/this.carSize,4/this.carSize -this.boardMesh.geometry.parameters.height/4,this.boardMesh.position.z + 0.1), 4/this.carSize, 100,true)
        const body3 = this.utils.drawQuarterCircunference(new THREE.Vector3(6/this.carSize,-this.boardMesh.geometry.parameters.height/4,this.boardMesh.position.z + 0.1), 4/this.carSize, 100,true)
        
        this.boardMesh.add(rearWheel)
        this.boardMesh.add(frontWheel)
        this.boardMesh.add(body1)
        this.boardMesh.add(body2)
        this.boardMesh.add(body3)
        
        this.boardMesh.rotation.y = -Math.PI / 2;
        this.boardMesh.position.x = 4.9
        
        return this.boardMesh;
    }


}

export { MyCar }
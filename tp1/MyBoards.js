import * as THREE from 'three';

class MyBoards {
    constructor(app) {

        this.app = app

    }

    create(texture,material, planeSizeU,planeSizeV, imageUVRate, repeatU, x,y,z,rx,ry,rz,rotation,width,height) {
        let planeUVRate = planeSizeV / planeSizeU;
        let repeatV =repeatU * planeUVRate * imageUVRate;
        texture.repeat.set(repeatU, repeatV );
        texture.rotation = rotation;
        texture.offset = new THREE.Vector2(0,0);

        let board = new THREE.PlaneGeometry( width, height );
        this.boardMesh = new THREE.Mesh( board, material );
        this.boardMesh.position.y = y;
        this.boardMesh.position.x = x;
        this.boardMesh.position.z = z;
        this.boardMesh.rotation.x = rx;
        this.boardMesh.rotation.y = ry;
        this.boardMesh.rotation.z = rz;
        
        return this.boardMesh;

    }
}

export { MyBoards }
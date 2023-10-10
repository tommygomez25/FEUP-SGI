import * as THREE from 'three';

class MyWall {
    constructor(app) {
        this.app = app;
        this.init();
    }
    
    init(){
        this.wallMeshes = []
        this.wallTexture = new THREE.TextureLoader().load( 'textures/wall.jpg' );
        this.wallTexture.wrapS = THREE.RepeatWrapping;
        this.wallTexture.wrapT = THREE.RepeatWrapping;
        this.wallPlaneMaterial = new THREE.MeshStandardMaterial({ map: this.wallTexture, emissive: "#000000", side: THREE.DoubleSide });

        this.tomasTexture = new THREE.TextureLoader().load( 'textures/tomas.jpg' );
        this.tomasTexture.wrapS = THREE.RepeatWrapping;
        this.tomasTexture.wrapT = THREE.RepeatWrapping;
        this.tomasPlaneMaterial = new THREE.MeshPhongMaterial({ map: this.tomasTexture, specular: "#dcdcdc", emissive: "#000000", shininess: 10, side: THREE.DoubleSide });

        this.franciscoTexture = new THREE.TextureLoader().load( 'textures/francisco.jpg' );
        this.franciscoTexture.wrapS = THREE.RepeatWrapping;
        this.franciscoTexture.wrapT = THREE.RepeatWrapping;
        this.franciscoPlaneMaterial = new THREE.MeshPhongMaterial({ map: this.franciscoTexture, specular: "#dcdcdc", emissive: "#000000", shininess: 10, side: THREE.DoubleSide });

        this.boardTexture = new THREE.TextureLoader().load( 'textures/board.jpg' );
        this.boardTexture.wrapS = THREE.RepeatWrapping;
        this.boardTexture.wrapT = THREE.RepeatWrapping;
        this.boardMaterial = new THREE.MeshPhongMaterial({ map: this.boardTexture, specular: "#000000", emissive: "#000000", shininess: 10, side: THREE.DoubleSide });

        this.viewTexture = new THREE.TextureLoader().load( 'textures/view.jpg' );
        this.viewTexture.wrapS = THREE.RepeatWrapping;
        this.viewTexture.wrapT = THREE.RepeatWrapping;
        this.viewPlaneMaterial = new THREE.MeshPhongMaterial({ map: this.viewTexture, specular: "#dcdcdc", emissive: "#000000", shininess: 10, side: THREE.DoubleSide });

        this.createWalls();
        this.addBoards();
        this.drawCar();
    }

    createWalls() {
        // create floor
        let plane = new THREE.PlaneGeometry( 10, 10 );
        let floorMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff",specular: "#000000", emissive: "#000000", shininess: 90, side: THREE.DoubleSide });
        this.planeMesh = new THREE.Mesh( plane, floorMaterial );
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        this.app.scene.add( this.planeMesh );

        this.addWall(-5,2.5,0,0,Math.PI/2,0)
        this.addWall(0,2.5,5,0,0,0)
        this.addWall(0,2.5,-5,0,0,0)
        this.addWall(5,2.5,0,0,Math.PI/2,0)
    }

    addWall(x,y,z,rx,ry,rz) {
        let wall = new THREE.PlaneGeometry( 10, 5 );
        this.wallMesh = new THREE.Mesh( wall, this.wallPlaneMaterial );
        this.wallMesh.position.x = x;
        this.wallMesh.position.y = y;
        this.wallMesh.position.z = z;
        this.wallMesh.rotation.x = rx;
        this.wallMesh.rotation.y = ry;
        this.wallMesh.rotation.z = rz;
        this.app.scene.add( this.wallMesh );
        this.wallMeshes.push(this.wallMesh);
    }

    addBoards() {
        let planeSizeU = 10;
        let planeSizeV = 10;
        let planeUVRate = planeSizeV / planeSizeU;
        let tomasUVRate = 800 / 800; // image dimensions
        let tomasRepeatU = 1;
        let tomasRepeatV =tomasRepeatU * planeUVRate * tomasUVRate;
        this.tomasTexture.repeat.set(tomasRepeatU, tomasRepeatV );
        this.tomasTexture.rotation = 0;
        this.tomasTexture.offset = new THREE.Vector2(0,0);
    
        let board_tomas = new THREE.PlaneGeometry( 3, 3 );
        this.board_tomasMesh = new THREE.Mesh( board_tomas, this.tomasPlaneMaterial );
        this.board_tomasMesh.rotation.y = Math.PI / 2;
        this.board_tomasMesh.position.y = 2.5;
        this.board_tomasMesh.position.x = this.wallMeshes[0].position.x + 0.01;
        this.board_tomasMesh.position.z = 2.5;
        this.app.scene.add( this.board_tomasMesh );
    
        let franciscoUVRate = 800 / 800; // image dimensions
        let franciscoRepeatU = 1;
        let franciscoRepeatV =franciscoRepeatU * planeUVRate * franciscoUVRate;
        this.franciscoTexture.repeat.set(franciscoRepeatU, franciscoRepeatV );
        this.franciscoTexture.rotation = 0;
        this.franciscoTexture.offset = new THREE.Vector2(0,0);
    
        let board_francisco = new THREE.PlaneGeometry( 3, 3 );
        this.board_franciscoMesh = new THREE.Mesh( board_francisco, this.franciscoPlaneMaterial );
        this.board_franciscoMesh.rotation.y = Math.PI / 2;
        this.board_franciscoMesh.position.y = 2.5;
        this.board_franciscoMesh.position.x = this.wallMeshes[0].position.x + 0.01;
        this.board_franciscoMesh.position.z = -2.5;
        this.app.scene.add( this.board_franciscoMesh );
    
        let viewUVRate = 800 / 800; // image dimensions
        let viewRepeatU = 1;
        let viewRepeatV =viewRepeatU * planeUVRate * viewUVRate;
        this.viewTexture.repeat.set(viewRepeatU, viewRepeatV );
        this.viewTexture.rotation = 0;
        this.viewTexture.offset = new THREE.Vector2(0,0);
        
        let board_view = new THREE.PlaneGeometry( 3, 3 );
        this.board_viewMesh = new THREE.Mesh( board_view, this.viewPlaneMaterial );
        this.board_viewMesh.position.y = 2.5;
        this.board_viewMesh.position.x =0
        this.board_viewMesh.position.z = this.wallMeshes[2].position.z + 0.01;
        this.app.scene.add( this.board_viewMesh );
    }

    drawCar() {
        this.board = new THREE.BoxGeometry( 6,3,0.1);
        this.boardMesh = new THREE.Mesh( this.board, this.boardMaterial );
        this.boardMesh.position.y = 2.5;
        this.boardMesh.position.x = 0;
        this.boardMesh.position.z = 0;
        this.app.scene.add( this.boardMesh );
        
        this.carSize = 5
        const rearWheel= this.drawSemiCircunference(new THREE.Vector3(-3/this.carSize,-this.boardMesh.geometry.parameters.height/4,this.boardMesh.position.z + 0.1), 3/this.carSize, 100)
        const frontWheel = this.drawSemiCircunference(new THREE.Vector3(7/this.carSize,-this.boardMesh.geometry.parameters.height/4,this.boardMesh.position.z + 0.1), 3/this.carSize, 100)
        const body1 = this.drawQuarterCircunference(new THREE.Vector3(2/this.carSize,-this.boardMesh.geometry.parameters.height/4,this.boardMesh.position.z + 0.1), 8/this.carSize, 100,false)
        const body2 = this.drawQuarterCircunference(new THREE.Vector3(2/this.carSize,4/this.carSize -this.boardMesh.geometry.parameters.height/4,this.boardMesh.position.z + 0.1), 4/this.carSize, 100,true)
        const body3 = this.drawQuarterCircunference(new THREE.Vector3(6/this.carSize,-this.boardMesh.geometry.parameters.height/4,this.boardMesh.position.z + 0.1), 4/this.carSize, 100,true)
        
        this.boardMesh.add(rearWheel)
        this.boardMesh.add(frontWheel)
        this.boardMesh.add(body1)
        this.boardMesh.add(body2)
        this.boardMesh.add(body3)
        
        this.boardMesh.rotation.y = -Math.PI / 2;
        this.boardMesh.position.x = 4.9
        this.app.scene.add(this.boardMesh)
    }

    drawSemiCircunference(position, radius, numberOfSamples) {
        let points = []
        const inicialAngle = 0
        const finalAngle = Math.PI

        for (let i = 0; i <= numberOfSamples; i++) {
            const t = i / this.numberOfSamples
            const x = radius * Math.cos(inicialAngle + t * (finalAngle - inicialAngle))
            const y = radius * Math.sin(inicialAngle + t * (finalAngle - inicialAngle))
            points.push(new THREE.Vector3(x, y, 0))
        }

        let curve = new THREE.CatmullRomCurve3( points )
        let sampledPoints = curve.getPoints( this.numberOfSamples );
        this.curveGeometry = new THREE.BufferGeometry().setFromPoints( sampledPoints )
        this.lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } )
        this.lineObj = new THREE.Line( this.curveGeometry, this.lineMaterial )
        this.lineObj.position.set(position.x,position.y,position.z)
        this.app.scene.add( this.lineObj );
        return this.lineObj
    }

    drawQuarterCircunference(position, radius, numberOfSamples,reverse) {
        let points = []
        const inicialAngle = 0
        const finalAngle = Math.PI / 2

        for (let i = 0; i <= numberOfSamples; i++) {
            const t = i / this.numberOfSamples
            if (reverse === true) {
                const x = radius * Math.cos(inicialAngle + t * (finalAngle - inicialAngle))
                const y = radius * Math.sin(inicialAngle + t * (finalAngle - inicialAngle))
                points.push(new THREE.Vector3(x, y, 0))
            }
            else {
                const x = radius * Math.cos(finalAngle - t * (inicialAngle - finalAngle))
                const y = radius * Math.sin(finalAngle - t * (inicialAngle - finalAngle))
                points.push(new THREE.Vector3(x, y, 0))
            }
        }

        let curve = new THREE.CatmullRomCurve3( points )
        let sampledPoints = curve.getPoints( this.numberOfSamples );
        this.curveGeometry = new THREE.BufferGeometry().setFromPoints( sampledPoints )
        this.lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } )
        this.lineObj = new THREE.Line( this.curveGeometry, this.lineMaterial )
        this.lineObj.position.set(position.x,position.y,position.z)
        this.app.scene.add( this.lineObj );
        return this.lineObj
    }
}
export { MyWall };
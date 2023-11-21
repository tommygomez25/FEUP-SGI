import * as THREE from 'three';

class Track {
    constructor(app, x , y , z) {
        this.app = app

        this.trackMesh = null

        this.shapeLength = 1
        this.shapeWidth = 30

        this.x = x
        this.y = y
        this.z = z

        this.controlPoints = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(-100, 0, 0),
            new THREE.Vector3(-100, 0, -100),
            new THREE.Vector3(-50, 0, -100),
            new THREE.Vector3(-50, 0, -50),
            new THREE.Vector3(0, 0, -25),
            new THREE.Vector3(50, 0, -50),
            new THREE.Vector3(50, 0, -100),
            new THREE.Vector3(100, 0, -100),
            new THREE.Vector3(100, 0, 0),
            new THREE.Vector3(0, 0, 0),
          ];

        this.trackCurve = new THREE.CatmullRomCurve3(this.controlPoints);

        this.shape = new THREE.Shape();
        this.shape.moveTo(0, 0);
        this.shape.lineTo(0, this.shapeWidth);	
        this.shape.lineTo(this.shapeLength, this.shapeWidth);
        this.shape.lineTo(this.shapeLength, 0);
        this.shape.lineTo(0, 0);

        this.trackTexture = new THREE.TextureLoader().load('textures/road-base.jpg');
        this.trackDisplacementMap = new THREE.TextureLoader().load('textures/road-height.png');
        this.trackNormalMap = new THREE.TextureLoader().load('textures/road-normal.jpg');
        this.trackAOMap = new THREE.TextureLoader().load('textures/road-ao.jpg');
        this.trackRoughnessMap = new THREE.TextureLoader().load('textures/road-roughness.jpg');
        
        // since ExtrudeGeometry auto-generate UV coordinates outside (0.0, 1.0) range...
        this.trackTexture.wrapS = this.trackTexture.wrapT = THREE.RepeatWrapping;
        this.trackTexture.offset.set( 0, 0.5);
        this.trackTexture.repeat.set(0.1, 0.1);
        this.trackTexture.needsUpdate = true;

        this.trackDisplacementMap.wrapS = this.trackDisplacementMap.wrapT = THREE.RepeatWrapping;
        this.trackDisplacementMap.offset.set( 0, 0.5 );
        this.trackDisplacementMap.repeat.set( 0.1, 0.1);
        this.trackDisplacementMap.needsUpdate = true;

        this.trackNormalMap.wrapS = this.trackNormalMap.wrapT = THREE.RepeatWrapping;
        this.trackNormalMap.offset.set( 0, 0.5 );
        this.trackNormalMap.repeat.set( 0.1, 0.1);
        this.trackNormalMap.needsUpdate = true;

        this.trackAOMap.wrapS = this.trackAOMap.wrapT = THREE.RepeatWrapping;
        this.trackAOMap.offset.set( 0, 0.5 );
        this.trackAOMap.repeat.set( 0.1, 0.1);
        this.trackAOMap.needsUpdate = true;

        this.trackRoughnessMap.wrapS = this.trackRoughnessMap.wrapT = THREE.RepeatWrapping;
        this.trackRoughnessMap.offset.set( 0, 0.5 );
        this.trackRoughnessMap.repeat.set( 0.1, 0.1);
        this.trackRoughnessMap.needsUpdate = true;


        this.createTrack();
    }

    createTrack() {

        const extrudeSettings = {
            steps:300,
            bevelEnabled: false,
            extrudePath: this.trackCurve,
        }

        const trackGeometry = new THREE.ExtrudeGeometry(this.shape, extrudeSettings);
        const trackMaterial = new THREE.MeshStandardMaterial({
            map: this.trackTexture,
            displacementMap: this.trackDisplacementMap,
            displacementScale: 0.1,
            normalMap: this.trackNormalMap,
            normalScale: new THREE.Vector2(1, 1),
            roughnessMap: this.trackRoughnessMap,
            roughness: 1,
            aoMap: this.trackAOMap,
            aoMapIntensity: 1,
        });
        this.trackMesh = new THREE.Mesh(trackGeometry, trackMaterial);

        this.trackMesh.position.set(this.x, this.y, this.z)

        this.trackMesh.castShadow = true;
        this.trackMesh.receiveShadow = true;
    }
}

export { Track };
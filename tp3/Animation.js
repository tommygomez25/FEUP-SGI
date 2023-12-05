import * as THREE from 'three';

class Animation {
    constructor(app, keyPoints,rotationPoints, animationMaxDuration, mesh) {
        this.app = app;

        this.keyPoints = keyPoints;

        this.rotationPoints = rotationPoints;

        this.mixerTime = 0;
        
        this.mixerPause = false;
        
        this.enableAnimationPosition = true;
        
        this.animationMaxDuration = animationMaxDuration;

        this.mesh = mesh;
        
        this.clock = new THREE.Clock();

        this.init();
    }

    init() {
        this.debugKeyFrames();

        const numKeyFrames = this.keyPoints.length;
        const times = Array.from({length: numKeyFrames}, (_, index) => index * this.animationMaxDuration / (numKeyFrames - 1));

        const values = [];
        for (let i = 0; i < numKeyFrames; i++) {
            values.push(...this.keyPoints[i]);
        }

        const positionKF = new THREE.VectorKeyframeTrack('.position', times,
        values,
        THREE.InterpolateSmooth);

        const numKeyFramesRotation = this.rotationPoints.length;
        const timesRotation = Array.from({length: numKeyFramesRotation}, (_, index) => index * this.animationMaxDuration / (numKeyFramesRotation - 1));

        // TODO : ROTATION KEYFRAMES    
        const rotationValues = [];
        for (let i = 0; i < numKeyFramesRotation; i++) {
            rotationValues.push(this.rotationPoints[i].x);
            rotationValues.push(this.rotationPoints[i].y);
            rotationValues.push(this.rotationPoints[i].z);
            rotationValues.push(this.rotationPoints[i].w);
        }

        const rotationKF = new THREE.QuaternionKeyframeTrack('.quaternion', timesRotation, rotationValues);


        const positionClip = new THREE.AnimationClip('positionAnimation', this.animationMaxDuration, [positionKF]);
        const rotationClip = new THREE.AnimationClip('rotationAnimation', this.animationMaxDuration, [rotationKF]);
        
        this.mixer = new THREE.AnimationMixer(this.mesh);

        // mixer.setLoop(THREE.LoopOnce) // THREE.LoopRepeat (default), THREE.LoopOnce, THREE.LoopPingPong
        // mixer.startAt(0) // 0 (default)
        // mixer.clampWhenFinished = true // false (default)


        const positionAction = this.mixer.clipAction(positionClip);
        const rotationAction = this.mixer.clipAction(rotationClip);

        positionAction.play();
        rotationAction.play();
    }

    setMixerTime() {
        this.mixer.setTime(this.mixerTime);
    }

    debugKeyFrames() {
        let spline = new THREE.CatmullRomCurve3([...this.keyPoints]);
        
        for (let i = 0; i < this.keyPoints.length; i++) {
            const geometry = new THREE.SphereGeometry(1,32,32);
            const material = new THREE.MeshBasicMaterial({color: 0x0000ff});
            const sphere = new THREE.Mesh(geometry, material);
            sphere.scale.set(1,1,1);
            sphere.position.set(...this.keyPoints[i]);

            this.app.scene.add(sphere);
        }

        const tubeGeometry = new THREE.TubeGeometry(spline, 100, 0.05, 10, false);
        const tubeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
        const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);

        this.app.scene.add(tubeMesh);
    }

    checkAnimationStateIsPause() {
        if (this.mixerPause) {
            this.mixer.timeScale = 0;
        } else {
            this.mixer.timeScale = 1;
        }
    }

    checkTracksEnabled() {
        const actions = this.mixer._actions;

        for (let i = 0; i < actions.length; i++) {
            const track = actions[i]._clip.tracks[0];

            if (track.name === ".position" && this.enableAnimationPosition === false) {
                actions[i].stop();
            }
            else {
                if (!actions[i].isRunning()) {
                    actions[i].play();
                }
            }
        }
    }

    update() {
        const delta = this.clock.getDelta();
        this.mixer.update(delta);

        this.checkAnimationStateIsPause();
        this.checkTracksEnabled();
    }
} 

export { Animation };
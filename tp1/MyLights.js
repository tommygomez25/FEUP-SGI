import * as THREE from 'three';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

class MyLights {
    constructor(app) {
        this.app = app;
    }

    createSpotlights() {
        this.spotLight = new THREE.SpotLight( 0xffffff, 15 );
        this.spotLight.position.set(0,5,0);
        this.spotLight.angle = Math.PI/20;
        this.spotLight.penumbra = 0
        this.spotLight.decay = 0
        this.spotLight.distance = 5
        this.spotLight.intensity = 5
        this.spotLight.castShadow = true;

        this.spotLightTarget = new THREE.Object3D()
        this.spotLightTarget.position.set(0,1,0)
        this.app.scene.add(this.spotLightTarget)

        this.spotLight.target = this.spotLightTarget
        this.app.scene.add(this.spotLight)

        this.spotLight2 = new THREE.SpotLight( 0xffffff, 15 );
        this.spotLight2.position.set(-2.5,5,2.5);
        this.spotLight2.angle = Math.PI/10;
        this.spotLight2.penumbra = 1
        this.spotLight2.decay = 0
        this.spotLight2.distance = 10
        this.spotLight2.intensity = 1.2
        this.spotLight2.castShadow = true;

        this.spotLightTarget2 = new THREE.Object3D()
        this.spotLightTarget2.position.set(-4.9,2.8,2.5)
        this.app.scene.add(this.spotLightTarget2)

        this.spotLight2.target = this.spotLightTarget2
        this.app.scene.add(this.spotLight2)

        this.spotLight3 = new THREE.SpotLight( 0xffffff, 15 );
        this.spotLight3.position.set(-2.5,5,-2.5);
        this.spotLight3.angle = Math.PI/10;
        this.spotLight3.penumbra = 1
        this.spotLight3.decay = 0
        this.spotLight3.distance = 10
        this.spotLight3.intensity = 1.2
        this.spotLight3.castShadow = true;

        this.spotLightTarget3 = new THREE.Object3D()
        this.spotLightTarget3.position.set(-4.9,2.8,-2.5)
        this.app.scene.add(this.spotLightTarget3)

        this.spotLight3.target = this.spotLightTarget3

        return [this.spotLight, this.spotLight2, this.spotLight3];
    }

    createRectAreaLight() {
        this.rectLight = new THREE.RectAreaLight( 0xdcdcdc, 20,  3, 3 );
        this.rectLight.position.set( 0, 2.5, -5.1 );
        this.rectLight.lookAt( 0, 2.5, 0 );
        this.app.scene.add( this.rectLight );

        this.RectAreaLightHelper = new RectAreaLightHelper( this.rectLight );
        this.app.scene.add( this.RectAreaLightHelper );

        return this.rectLight;
    }


    createPointLight() {
        this.pointLight = new THREE.PointLight( 0xffffff, 50, 0 );
        this.pointLight.position.set( 0, 10, 0 );
        this.app.scene.add( this.pointLight );

        this.pointLightHelper = new THREE.PointLightHelper( this.pointLight, 0.5 );
        this.app.scene.add( this.pointLightHelper );

        return this.pointLight;
    }

    createAmbientLight() {
        this.ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( this.ambientLight );

        return this.ambientLight;
    }
}

export { MyLights };
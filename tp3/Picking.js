import * as THREE from 'three';

class Picking {
    constructor(app) {
        this.app = app;

        this.raycaster = new THREE.Raycaster()
        this.raycaster.near = 1
        this.raycaster.far = 200

        this.pointer = new THREE.Vector2()
        this.intersectedObj = null
        this.pickingColor = "0x00ff00"

        this.availableLayers = ['none', 1, 2, 3]
        this.selectedLayer = this.availableLayers[1]

        this.updateSelectedLayer()

        this.notPickableObjIds = [] // TODO

        document.addEventListener(
            "pointermove",
            // "mousemove",
            // "pointerdown",
            this.onPointerMove.bind(this)
        );

        document.addEventListener(
            "pointerdown",
            this.onPointerDown.bind(this)
        )
    }

    /*
    *
    * Only object from selected layer will be eligible for selection
    * when 'none' is selected no layer is active, so all objects can be selected
    */
    updateSelectedLayer() {
        this.raycaster.layers.enableAll()
        console.log("Selected layer: " + this.selectedLayer)
        if (this.selectedLayer !== 'none') {
            const selectedIndex = this.availableLayers[parseInt(this.selectedLayer)]
            this.raycaster.layers.set(selectedIndex)
            console.log("Selected layer: " + selectedIndex)
        }
    }

        /*
    * Update the color of selected object
    *
    */
        updatePickingColor(value) {
            this.pickingColor = value.replace('#', '0x');
        }


            /*
    * Change the color of the first intersected object
    *
    */
    changeColorOfFirstPickedObj(obj) {
        if (this.lastPickedObj != obj) {
            if (this.lastPickedObj)
                this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
            this.lastPickedObj = obj;
            this.lastPickedObj.currentHex = this.lastPickedObj.material.color.getHex();
            this.lastPickedObj.material.color.setHex(this.pickingColor);
        }
    }

    
    /*
     * Restore the original color of the intersected object
     *
     */
    restoreColorOfFirstPickedObj() {
        if (this.lastPickedObj)
            this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
        this.lastPickedObj = null;
    }


    
    /*
    * Helper to visualize the intersected object
    *
    */
    pickingHelper(intersects) {
        if (intersects.length > 0) {
            const obj = intersects[0].object
            if (this.notPickableObjIds.includes(obj.name)) {
                this.restoreColorOfFirstPickedObj()
                console.log("Object cannot be picked !")
            }
            else{
                this.changeColorOfFirstPickedObj(obj)
                //this.applyPickedObject(obj)
            }
                
        } else {
            this.restoreColorOfFirstPickedObj()
        }
    }


    /**
     * Print to console information about the intersected objects
     */
    transverseRaycastProperties(intersects) {
        for (var i = 0; i < intersects.length; i++) {

            console.log(intersects[i]);

            /*
            An intersection has the following properties :
                - object : intersected object (THREE.Mesh)
                - distance : distance from camera to intersection (number)
                - face : intersected face (THREE.Face3)
                - faceIndex : intersected face index (number)
                - point : intersection point (THREE.Vector3)
                - uv : intersection point in the object's UV coordinates (THREE.Vector2)
            */
        }
    }


    onPointerMove(event) {

        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components

        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        //console.log("Position x: " + this.pointer.x + " y: " + this.pointer.y);

        //2. set the picking ray from the camera position and mouse coordinates
        this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());

        //3. compute intersections
        var intersects = this.raycaster.intersectObjects(this.app.scene.children);

        this.pickingHelper(intersects)

        this.transverseRaycastProperties(intersects)
    }

    onPointerDown(event) {
        if (event.button === 0) {
            this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());
            var intersects = this.raycaster.intersectObjects(this.app.scene.children);

            if (intersects.length > 0 ) {
                const obj = intersects[0].object
                this.applyPickedObject(obj)
            }
        }
    }

    applyPickedObject(obj) {
        if (this.app.pickingOwnCar === true) {
            // move the father of the obj to 0,0,0
            obj.parent.position.set(21, 2, 0)
            // find the car name in the app.contents.mycars
            const carName = obj.name
            const car = this.app.contents.myCars[carName]
            console.log(car)
            this.app.contents.selectedCar = car
            this.app.pickingOwnCar = false
            this.app.pickingOtherCar = true
            this.selectedLayer = 2
            this.updateSelectedLayer()
        }   

        else if (this.app.pickingOtherCar === true) {

            obj.parent.position.set(7, 2, 0)

            const carName = obj.name
            const car = this.app.contents.otherCars[carName]

            this.app.contents.selectedBotCar = car

            this.app.pickingOtherCar = false
            this.selectedLayer = 3
            this.updateSelectedLayer()
        }

    }



    
    
}

export { Picking };
import * as THREE from 'three'

class Firework {

    constructor(app, scene, vertices) {
        this.app = app
        this.scene = scene

        this.done     = false 
        this.dest     = [] 
        
        this.vertices = null
        this.colors   = null
        this.geometry = null
        this.points   = null

        this.exploding = false;
        this.vertices = []
        
        this.material = new THREE.PointsMaterial({
            size: 0.8,
            color: 0xffffff,
            opacity: 1,
            vertexColors: true,
            transparent: true,
            depthTest: false,
        })
        
        this.height = 100
        this.speed = 60

        this.explosionRadius = 1;
        this.maxRadius = 5;

        this.phis = [];
        this.thetas = [];

        this.gravity = new THREE.Vector3(0, -9.8, 0)

        this.createVertices();

        this.launch() 

    }

    createVertices() {
        // create random vertices in y = 0, -5 < x < 5, -5 < z < 5
        for( let i = 0; i < 100; i++ ) {
            this.vertices.push( THREE.MathUtils.randFloat( -200, 200 ) )
            this.vertices.push( 0 )
            this.vertices.push( THREE.MathUtils.randFloat( -200, 200 ) )
        }
    }

    /**
     * compute particle launch
     */

    launch() {
        let color = new THREE.Color()
        color.setHSL( THREE.MathUtils.randFloat( 0.1, 0.9 ), 1, 0.9 )
        let colors = [ color.r, color.g, color.b ]

        let randomIndex = THREE.MathUtils.randInt( 0, this.vertices.length - 1 )
        let vertices = this.vertices.slice( randomIndex, randomIndex + 3 ) // initial position of the particle

        let x = vertices[0]
        let y = THREE.MathUtils.randFloat( this.height * 0.9, this.height * 1.1)
        let z = vertices[2]
        this.dest.push( x, y, z ) // destination of the particle
        
        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(vertices), 3 ) );
        this.geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array(colors), 3 ) );
        this.points = new THREE.Points( this.geometry, this.material )
        this.points.castShadow = true;
        this.points.receiveShadow = true;
        this.app.scene.add( this.points )  
        console.log("firework launched")
    }

   
    /**
     * compute explosion
     * @param {*} vector 
     */
    // ...

    explode(origin, n) {
    
        const explosionVertices = [];
        const explosionColors = [];
        
        this.explosionOrigin = origin;

        for (let i = 0; i < n; i++) {
            
            var phi = Math.random() * Math.PI;
            var theta = Math.random() * 2 * Math.PI;

            const x = this.explosionRadius * Math.sin(phi) * Math.cos(theta);
            const y = this.explosionRadius * Math.cos(phi);
            const z = this.explosionRadius * Math.sin(phi) * Math.sin(theta);

            this.phis.push(phi);
            this.thetas.push(theta);

            explosionVertices.push(x + origin[0], y + origin[1], z + origin[2]);
            explosionColors.push(...origin);
        }

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(explosionVertices, 3));
        this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(explosionColors, 3));
    
        const explosionMaterial = new THREE.PointsMaterial({
            size: 0.8,
            vertexColors: true,
            opacity: 1,
            transparent: true,
            depthTest: false,
        });
    
        this.points = new THREE.Points(this.geometry, explosionMaterial);
        this.points.castShadow = true;
        this.points.receiveShadow = true;
        this.app.scene.add(this.points);
    
        console.log("firework exploded");
    }
    
    
    /**
     * cleanup
     */
    reset() {
        console.log("firework reseted")
        this.app.scene.remove( this.points )  
        this.dest     = [] 
        this.vertices = null
        this.colors   = null 
        this.geometry = null
        this.points   = null
    }

    /**
     * update firework
     * @returns 
     */
    update() {

        // do only if objects exist
        if( this.points && this.geometry )
        {
            let verticesAtribute = this.geometry.getAttribute( 'position' )
            let vertices = verticesAtribute.array
            let count = verticesAtribute.count

            if (!this.exploding) {
                // lerp particle positions 
                let j = 0
                for( let i = 0; i < vertices.length; i+=3 ) {
                    vertices[i  ] += ( this.dest[i  ] - vertices[i  ] ) / this.speed
                    vertices[i+1] += ( this.dest[i+1] - vertices[i+1] ) / this.speed
                    vertices[i+2] += ( this.dest[i+2] - vertices[i+2] ) / this.speed

                    // apply gravity
                    vertices[i+1] += 0.5 * this.gravity.y * (1 / this.speed) ** 2; // s = 0.5 * a * t^2
                }
                verticesAtribute.needsUpdate = true

                if( Math.ceil( vertices[1] ) > ( this.dest[1] * 0.95 ) ) {
                    // add n particles departing from the location at (vertices[0], vertices[1], vertices[2])
                    this.explode(vertices, 50) 
                    this.exploding = true
                    return
                }
            }
            
            // are there a lot of particles (aka already exploded)?
            else if (this.exploding) {
                // fade out exploded particles 

                this.explosionRadius += 0.5;

                let j = 0
                
                for (let i = 0; i < vertices.length; i += 3) {
    
                    // Expandir partículas usando o raio
                    
                    vertices[i] = this.explosionOrigin[0] + ((this.explosionRadius * Math.sin(this.phis[i]) * Math.cos(this.thetas[i])));
                    vertices[i + 1] = this.explosionOrigin[1] + ((this.explosionRadius * Math.cos(this.phis[i])));
                    vertices[i + 2] = this.explosionOrigin[2] + ((this.explosionRadius * Math.sin(this.phis[i]) * Math.sin(this.thetas[i])));
                    
                    // Apply gravity
                    vertices[i + 1] += 0.5 * this.gravity.y * (1 / this.speed) ** 2; // s = 0.5 * a * t^2
                }

                verticesAtribute.needsUpdate = true;

                this.material.opacity -= 0.03
                this.material.needsUpdate = true
            }
            
            // remove, reset and stop animating 
            if( this.material.opacity <= 0 )
            {   
                this.reset() 
                this.done = true 
                return 
            }
        }
    }
}

export { Firework }
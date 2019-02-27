import art from './toile.jpg'
import cadre from './cadre2.obj'
import OrbitControls from 'three-orbitcontrols'

let fpc = require('./fpc.js')

import floorColor from './floorTexture/WoodFlooring044_COL_2K.jpg'
import floorNormal from './floorTexture/WoodFlooring044_NRM_2K.jpg'
import floorDisplacement from './floorTexture/WoodFlooring044_DISP_2K.jpg'

import frameColor from './floorTexture/frame.jpg'

export default class App {

    constructor() {

        document.addEventListener('keydown', this.onKeyDown.bind(this))
        document.addEventListener('keyup', this.onKeyUp.bind(this))

        this.moveFwd = false
        this.moveBwd = false
        this.moveLeft = false
        this.moveRight = false

        this.heading = 0

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);
        this.camera.position.z = -5;
        this.camera.position.y = 2;
        this.camera.rotation.y = 0;
        this.camera.lookAt(new THREE.Vector3(0, 2, 0))

        this.loader = new THREE.OBJLoader()

        this.scene = new THREE.Scene();

        this.geometry = new THREE.PlaneBufferGeometry(1.2, 2.1)

        var texture = new THREE.TextureLoader().load(art);
        this.material = new THREE.MeshLambertMaterial({ map: texture });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotateX(Math.PI)
        this.mesh.rotateZ(Math.PI)
        this.mesh.position.z = -0.15
        //this.scene.add(this.mesh);

        this.wallGeometry = new THREE.PlaneBufferGeometry(20, 10)

        this.wallMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 1 });
        this.wall = new THREE.Mesh(this.wallGeometry, this.wallMaterial);
        this.wall.rotateX(Math.PI)
        this.wall.position.z = 0.05
        this.scene.add(this.wall);
        this.wall.receiveShadow = true;

        this.wallR = new THREE.Mesh(this.wallGeometry, this.wallMaterial);
        this.wallR.rotateY(Math.PI / 2)
        this.wallR.position.x = -6
        this.scene.add(this.wallR);
        this.wallR.receiveShadow = true;

        this.wallL = new THREE.Mesh(this.wallGeometry, this.wallMaterial);
        this.wallL.rotateY(-Math.PI / 2)
        this.wallL.position.x = 6
        this.scene.add(this.wallL);
        this.wallL.receiveShadow = true;

        this.wallB = new THREE.Mesh(this.wallGeometry, this.wallMaterial);
        this.wallB.position.z = -10
        this.scene.add(this.wallB);
        this.wallB.receiveShadow = true;

        this.floor = null
        this.createFloor()

        this.ambientlight = new THREE.AmbientLight(0xffffff, 0.1)
        this.scene.add(this.ambientlight)

        this.frame = ""

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);
        this.renderer.shadowMap.enabled = true;

        this.light = new THREE.PointLight(0xffffff, .5)
        this.light.position.set(0, 5, -4)
        this.scene.add(this.light)

        let spotlight = new THREE.SpotLight(0xffffff, 1, 10, 0.38, 1)
        spotlight.position.set(0, 5, -5)

        spotlight.castShadow = true;

        // additional shadow properties of interest
        spotlight.shadow.mapSize.width = 128;
        spotlight.shadow.mapSize.height = 128;
        spotlight.shadow.camera.near = 1;
        spotlight.shadow.camera.far = 1000;

        this.scene.add(spotlight)
        this.scene.add(spotlight.target)
        spotlight.target.position.y = 3

        // 


        //this.controls = new OrbitControls(this.camera, this.renderer.domElement)

        this.addFrame()

        this.frameAndPic = new THREE.Group()
        this.frameAndPic.add(this.mesh)
        this.scene.add(this.frameAndPic)

        this.frameAndPic.position.y = 3

        this.render()
    }

    onKeyDown(event) {
        switch (event.keyCode) {

            case 38: /*up*/
            case 87: /*W*/ this.moveFwd = true; break;

            case 37: /*left*/
            case 65: /*A*/ this.moveLeft = true; break;

            case 40: /*down*/
            case 83: /*S*/ this.moveBwd = true; break;

            case 39: /*right*/
            case 68: /*D*/ this.moveRight = true; break;

        }
    }

    onKeyUp(event) {
        switch (event.keyCode) {

            case 38: /*up*/
            case 87: /*W*/ this.moveFwd = false; break;

            case 37: /*left*/
            case 65: /*A*/ this.moveLeft = false; break;

            case 40: /*down*/
            case 83: /*S*/ this.moveBwd = false; break;

            case 39: /*right*/
            case 68: /*D*/ this.moveRight = false; break;

        }
    }

    createFloor() {
        var floorDiffuse = new THREE.TextureLoader().load(floorColor);
        floorDiffuse.wrapS = THREE.RepeatWrapping;
        floorDiffuse.wrapT = THREE.RepeatWrapping;
        floorDiffuse.repeat.set(10, 10);
        var floorNrm = new THREE.TextureLoader().load(floorNormal);
        floorNrm.wrapS = THREE.RepeatWrapping;
        floorNrm.wrapT = THREE.RepeatWrapping;
        floorNrm.repeat.set(10, 10);
        var floorDisp = new THREE.TextureLoader().load(floorDisplacement);
        floorDisp.wrapS = THREE.RepeatWrapping;
        floorDisp.wrapT = THREE.RepeatWrapping;
        floorDisp.repeat.set(10, 10);
        let floorGeo = new THREE.PlaneBufferGeometry(20, 20);
        let floorMat = new THREE.MeshPhongMaterial({
            map: floorDiffuse,
            displacementMap: floorDisp,
        });
        this.floor = new THREE.Mesh(floorGeo, floorMat)
        this.floor.position.z = -0.5
        this.floor.rotateX(-Math.PI / 2)
        this.scene.add(this.floor)
        this.floor.receiveShadow = true;
    }

    addFrame() {
        // load a resource
        this.loader.load(
            // resource URL
            cadre,
            // called when resource is loaded
            (object) => {
                let texture = new THREE.TextureLoader().load(frameColor);
                let material = new THREE.MeshLambertMaterial({
                    map: texture
                })
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(0.5, 0.5);
                object.children[0].material = material
                this.scene.add(object);
                object.scale.set(0.2, 0.15, 0.2)
                object.rotateY(Math.PI)
                this.frameAndPic.add(object)
            },
            // called when loading is in progresses
            (xhr) => {

                console.log((xhr.loaded / xhr.total * 100) + '% loaded');

            },
            // called when loading has errors
            (error) => {

                console.log('An error happened');

            }
        );
    }

    render() {
        requestAnimationFrame(this.render.bind(this));


        //this.mesh.rotation.x += 0.01;
        //this.mesh.rotation.y += 0.02;
        if (this.moveRight) {
            this.heading += 0.06
        }

        if (this.moveLeft) {
            this.heading -= 0.06
        }

        this.camera.rotation.y = this.heading

        if (this.moveFwd) {
            this.camera.position.z += Math.cos(this.heading) * 0.1
            this.camera.position.x -= Math.sin(this.heading) * 0.1
        }

        if (this.moveBwd) {
            this.camera.position.z -= Math.cos(this.heading) * 0.1
            this.camera.position.x += Math.sin(this.heading) * 0.1
        }

        this.renderer.render(this.scene, this.camera);
    }


}
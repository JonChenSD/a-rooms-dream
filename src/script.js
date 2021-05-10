import './style.css'
import {updateTextPosition, makeObjectText, updateAllPoemTextPositions, getObjectNumbers, removeObjectDiv} from './js/text/textManager.js'
import {setScene, ObjectManager, attatchObjectList, attatchObjectNumbers} from './js/objects/objectManager'
import * as THREE from 'three'
import * as TWEEN from 'tween.js'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { OBB } from 'three/examples/jsm/math/OBB.js';
import * as dat from 'dat.gui'
import { Vector3 } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
dat.GUI.toggleHide()


let camera, scene, renderer;
let group

let composer, effectFXAA, outlinePass;

let selectedObjects = [];

// Canvas
const canvas = document.querySelector('canvas.webgl')
const cssCanvas = document.getElementById("cssCanvas")
const cssGradient = document.getElementById("cssGradient")

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

// Button
const editRoom = document.getElementById("moveCamera")
const writePoem = document.getElementById("writePoem")
const addObject = document.getElementById("addObject")
const rotate = document.getElementById("rotate")
const deleteButton = document.getElementById("delete")
const about = document.getElementById("about")
const webglHTML = document.getElementById("about")
    //zoom
const zoomplus = document.getElementById("zoomplus")
const zoomminus = document.getElementById("zoomminus")
const plusstrokes = document.getElementsByClassName("plusstroke")
const minusstroke = document.getElementById("minusstroke")

// Instructions
const dragtoRotate = document.getElementById("dragtoRotate")
const dragtoMove = document.getElementById("dragtoMove")

// Modal
// Get the button that opens the modal
var modal = document.getElementById("aboutModal");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Button States
const editRoomState = 1;
let writePoemState = 1;

//objects
let objects = [];
const objectNumbers = []
getObjectNumbers(objectNumbers)
attatchObjectNumbers(objectNumbers)
const boundaryObjects = []

const couchhtml = document.getElementById("couch")
const planthtml = document.getElementById("plant")

//camera Params
const camParameters = {}
camParameters.left = 0
camParameters.right = 0
camParameters.top = 0
camParameters.bottom = 0
camParameters.near = 0
camParameters.far = 0

//Edge Effect 
const params = {
    edgeStrength: 3.0,
    edgeGlow: 0.0,
    edgeThickness: 1.0,
    pulsePeriod: 0,
    rotate: false,
    usePatternTexture: false
};

// Init gui




//Mouse,Raycaster
const mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster();

// Scene
scene = new THREE.Scene()

setScene(scene)

//group
group = new THREE.Group();
scene.add( group );

//loading manager
const objectManager = new ObjectManager()

const manager = new THREE.LoadingManager()

//Models
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader( manager)
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

manager.onStart = function ( url, itemsLoaded, itemsTotal ) {

	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

};

manager.onLoad = function ( ) {

	console.log( 'Loading complete!');

};

manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

	console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

};

manager.onError = function ( url ) {

	console.log( 'There was an error loading ' + url );

};

const jonBox = new THREE.Mesh(
    new THREE.BoxGeometry(.8, 2, 1),
    new THREE.MeshStandardMaterial({
        color: '#969696',
        metalness: 0,
        roughness: 0.5
    })
)
jonBox.visible = false
jonBox.position.set(0,0,0)
jonBox.name = 'jonBox'
jonBox.userData.number = 0
objectNumbers.push(jonBox.userData.number)
makeObjectText('jonbox')

jonBox.userData.bBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
jonBox.userData.bBox.setFromObject(jonBox);
objects.push(jonBox)

const jonBoxBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

jonBoxBBox.setFromObject(jonBox);

scene.add(jonBox)
//objects.push(jonBox)

//objectManager.MakeObject('plant')


const jon = new THREE.Group()
const jonSit = new THREE.Group()
const jonSleep = new THREE.Group()

gltfLoader.load(
    '/models/RoomObjects/Jon/jon3.gltf',
    (gltf) =>
    {
        // console.log(gltf.scene)

        const children = [...gltf.scene.children]
        for(const child of children)
        {
            //child.rotation.x = Math.PI * 0.5
            
            child.name = 'jon'
            child.position.set(0,0,0)
           jonSleep.add(child)
            
           
        }
        
    }
)
jonSleep.visible = false
jonSleep.position.set(0,0,0)
scene.add(jonSleep)

gltfLoader.load(
    '/models/RoomObjects/Jon/jon2.gltf',
    (gltf) =>
    {
        // console.log(gltf.scene)

        const children = [...gltf.scene.children]
        for(const child of children)
        {
            //child.rotation.x = Math.PI * 0.5
            
            child.name = 'jon'
            child.position.set(0,0,0)
           jonSit.add(child)
            
           
        }
        
    }
)
jonSit.visible = false
jonSit.position.set(0,0,0)
scene.add(jonSit)


gltfLoader.load(
    '/models/RoomObjects/Jon/jon1.gltf',
    (gltf) =>
    {
        // console.log(gltf.scene)

        const children = [...gltf.scene.children]
        for(const child of children)
        {
            //child.rotation.x = Math.PI * 0.5
            
            child.name = 'jon'
            child.position.set(0,0,0)
           
            
            jon.add( child )
        }
        
    }
)
jon.userData.bBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
           jon.userData.bBox.setFromObject(jon);
jon.position.set(0,0,0)
scene.add(jon)
            //objects.push(jon)

// gltfLoader.load(
//     '/models/RoomObjects/Bed/scene.gltf',
//     (gltf) =>
//     {
//         // console.log(gltf.scene)

//         const children = [...gltf.scene.children]
//         for(const child of children)
//         {
//             //child.rotation.x = Math.PI * 0.5
//             child.scale.set(.012,.012,.012)
//             child.name = 'bed'
//             child.position.set(-2.8,.5,4.5)
//             child.rotation.z = Math.PI * 0.5
            
           
//             child.userData.bBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
//             child.userData.bBox.setFromObject(child);
//             scene.add(child)
//             objects.push(child)
//         }
        
//     }
// )


gltfLoader.load(
    '/models/RoomObjects/Chair/Chair.gltf',
    (gltf) =>
    {
        // console.log(gltf.scene)

        const children = [...gltf.scene.children]
        for(const child of children)
        {
            //child.rotation.x = Math.PI * 0.5
            child.rotation.y = Math.PI * 0.25
            child.name = 'chair'
            child.position.set(1.6,0,-3.2)
            
            child.userData.number = objectNumbers[objectNumbers.length - 1] + 1 
            objectNumbers.push(child.userData.number)
            

            child.userData.bBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            child.userData.bBox.setFromObject(child);
            child.userData.isSittable = true
            scene.add(child)
            objects.push(child)
        }
        makeObjectText('chair')
    }
)


gltfLoader.load(
    '/models/RoomObjects/Table/Table3.gltf',
    (gltf) =>
    {
        // console.log(gltf.scene)

        const children = [...gltf.scene.children]
        for(const child of children)
        {
            //child.rotation.y = Math.PI
            //child.scale.set(.0064,.007,.0073)
            child.name = 'table'
            child.position.set(3,0,-4)
            child.userData.number = objectNumbers[objectNumbers.length - 1] + 1 
            objectNumbers.push(child.userData.number)
            
            

            child.userData.bBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            child.userData.bBox.setFromObject(child);
           
 
            // rotation.y * 57.2958
            //child.userData.obb.halfSize.copy( size ).multiplyScalar( 0.5 );
            //child.geometry.computeBoundingBox()
            scene.add(child)
            objects.push(child)
        }

        
        // mixer = new THREE.AnimationMixer(gltf.scene)
        // const action = mixer.clipAction(gltf.animations[2])

        // action.play()

        // console.log(gltf)

       // gltf.scene.scale.set(0.025,0.025,0.025)
        //scene.add(gltf.scene)
        
        //objects.push(gltf.scene)
        makeObjectText('table')
    }
)


gltfLoader.load(
    '/models/RoomObjects/Plant/Houseplant.gltf',
    (gltf) =>
    {
        // console.log(gltf.scene)

        const children = [...gltf.scene.children]
        for(const child of children)
        {
            //child.rotation.x = Math.PI * 0.5
            child.scale.set(.2,.2,.2)
            child.name = 'plant'
            child.position.set(-3.4,0,-1.4)
            child.userData.number = objectNumbers[objectNumbers.length - 1] + 1 
            objectNumbers.push(child.userData.number)

            

            child.userData.bBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            child.userData.bBox.setFromObject(child);
            //child.userData.obb.halfSize.copy( size ).multiplyScalar( 0.5 );
            //child.geometry.computeBoundingBox()
            scene.add(child)
            objects.push(child)
        }

        
        // mixer = new THREE.AnimationMixer(gltf.scene)
        // const action = mixer.clipAction(gltf.animations[2])

        // action.play()

        // console.log(gltf)

       // gltf.scene.scale.set(0.025,0.025,0.025)
        //scene.add(gltf.scene)
        
        //objects.push(gltf.scene)
        makeObjectText('plant')
    }
)


gltfLoader.load(
    '/models/RoomObjects/Sofa/Sofa2.gltf',
    (gltf) =>
    {
        // console.log(gltf.scene)

        
        const children = [...gltf.scene.children]
        for(const child of children)
        {
            //child.rotation.x = Math.PI
            //child.rotation.y = Math.PI
            //child.rotation.x = Math.PI * 0.5
          
            child.position.set(-2.75,0,-3.9)
            child.name = 'couch'
            child.userData.number = objectNumbers[objectNumbers.length - 1] + 1 
            objectNumbers.push(child.userData.number)


            

            child.userData.bBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            child.userData.bBox.setFromObject(child);
            child.userData.isSittable = true
            //child.position.set(10,0,0)
            //child.userData.obb.halfSize.copy( size ).multiplyScalar( 0.5 );
            //child.geometry.computeBoundingBox()
            
            
            scene.add(child)
            objects.push(child) 
        }
        makeObjectText('couch')
        
        // mixer = new THREE.AnimationMixer(gltf.scene)
        // const action = mixer.clipAction(gltf.animations[2])

        // action.play()

        // console.log(gltf)

       // gltf.scene.scale.set(0.025,0.025,0.025)
        //scene.add(gltf.scene)
        
        //objects.push(gltf.scene)
        
    }
)

gltfLoader.load(
    '/models/RoomObjects/Bed/Bed2.gltf',
    (gltf) =>
    {


        
        const children = [...gltf.scene.children]
        for(const child of children)
        {

            
            child.position.set(-2.2,0,4.6)
            child.name = 'bed'
            child.userData.number = objectNumbers[objectNumbers.length - 1] + 1 
            objectNumbers.push(child.userData.number)

            
            child.userData.bBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            child.userData.bBox.setFromObject(child);
            child.userData.isSittable = true

            
            scene.add(child)
            objects.push(child)

        }

        makeObjectText('bed')
    }
)


attatchObjectList(objects)





/**
 * Floor
 */
 const woodTexture = new THREE.TextureLoader().load( '/backgrounds/wood.png' );
 const woodMaterial = new THREE.MeshStandardMaterial( { map: woodTexture } );
const floorDim = [8,12]

const floor = new THREE.Mesh(
    new THREE.BoxGeometry(floorDim[0], .2, floorDim[1]),
    woodMaterial
    
)
//floor.rotateZ(Math.PI)
floor.position.set(0,-.2,0)
floor.receiveShadow = true
//floor.rotation.x = - Math.PI * 0.5
//objects.push(floor)
scene.add(floor)

/** walls
 * 
 */
 const wall = new THREE.Mesh(
    new THREE.BoxGeometry(8, 1.5, 6),
    new THREE.MeshStandardMaterial({
        color: '#969696',
        metalness: 0,
        roughness: 0.5
    })
)
wall.visible = false
wall.position.set(0,0,9)
wall.name = 'wall'
wall.userData.bBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
wall.userData.bBox.setFromObject(wall);
const wallBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

wallBBox.setFromObject(wall);

scene.add(wall)
//objects.push(wall)
boundaryObjects.push(wall)

 const wall2 = new THREE.Mesh(
    new THREE.BoxGeometry(14, 1.5, 28),
    new THREE.MeshStandardMaterial({
        color: '#969696',
        metalness: 0,
        roughness: 0.5
    })
)
wall2.visible = false
wall2.position.set(-11,0,0)
wall2.name = 'wall2'
wall2.userData.bBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
wall2.userData.bBox.setFromObject(wall2);
const wall2Box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

wall2Box.setFromObject(wall2)

scene.add(wall2)

//objects.push(wall2)
boundaryObjects.push(wall2)

const wall3 = new THREE.Mesh(
    new THREE.BoxGeometry(8, 1.5, 6),
    new THREE.MeshStandardMaterial({
        color: '#969696',
        metalness: 0,
        roughness: 0.5
    })
)
wall3.visible = false
wall3.position.set(0,0,-9)
wall3.name = 'wall3'
wall3.userData.bBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
wall3.userData.bBox.setFromObject(wall3);
const wall3BBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

wall3BBox.setFromObject(wall3);

scene.add(wall3)

//objects.push(wall3)
boundaryObjects.push(wall3)

 const wall4 = new THREE.Mesh(
    new THREE.BoxGeometry(14, 1.5, 28),
    new THREE.MeshStandardMaterial({
        color: '#969696',
        metalness: 0,
        roughness: 0.5
    })
)
wall4.visible = false
wall4.position.set(11,0,0)
wall4.name = 'wall4'
wall4.userData.bBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
wall4.userData.bBox.setFromObject(wall4);
const wall4Box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

wall4Box.setFromObject(wall4)

scene.add(wall4)

//objects.push(wall4)
boundaryObjects.push(wall4)

//Lines outline

// const material = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 5 } );

// const points = [];
// points.push( new THREE.Vector3( -.5, 0, 0 ) );
// points.push( new THREE.Vector3( .5, 0, 0 ) );
// points.push( new THREE.Vector3( 0, -.5, 0 ) );
// points.push( new THREE.Vector3( 0, .5, 0 ) );


// const geometry = new THREE.BufferGeometry().setFromPoints( points );

// const line = new THREE.Line( geometry, material );
// line.position.set(4.25,6.25,0)

const line1 = new THREE.BoxGeometry(1, .02, .02)
const line2 = new THREE.BoxGeometry(.02, 1, .02)
const lineMaterial = new THREE.MeshStandardMaterial({
    color: '#000000',
    metalness: 0,
    roughness: 0
})

//
//for loop to make X
//
//

for(let i = 0; i < 8; i++)
{
  
    var tempX = ((floorDim[0])/2) + .25
    var tempY = 5
    var tempZ = ((floorDim[1])/2) + .25
    if(i == 1)
    {
        tempX = -((floorDim[0])/2) - .25
        //tempY = ((floorDim[1])/2) + .25
    }
    else if (i == 2)
    {
        tempX = -((floorDim[0])/2) - .25
        tempY = 0
    }
    else if (i == 3)
    {
        tempX = ((floorDim[0])/2) + .25
        tempY = 0
    }
    else if (i == 4)
    {
        tempX = -((floorDim[0])/2) - .25
        tempY = 0
        tempZ = -((floorDim[1])/2) - .25
    }
    else if (i == 5)
    {
        tempX = ((floorDim[0])/2) + .25
        tempY = 0
        tempZ = -((floorDim[1])/2) - .25
    }
    else if (i == 6)
    {
        tempX = -((floorDim[0])/2) - .25
        tempY = 5
        tempZ = -((floorDim[1])/2) - .25
    }
    else if (i == 7)
    {
        tempX = ((floorDim[0])/2) + .25
        tempY = 5
        tempZ = -((floorDim[1])/2) - .25
    }
    
    
    const cross1 = new THREE.Mesh( line1, lineMaterial)
    cross1.rotation.x = - Math.PI * 0.5
    cross1.position.set(tempX,tempY,tempZ)

    const cross2 = new THREE.Mesh( line2, lineMaterial)
    cross2.rotation.x = - Math.PI * 0.5
    cross2.position.set(tempX,tempY,tempZ)
    
    const cross3 = new THREE.Mesh( line1, lineMaterial)
    cross3.position.set(tempX,tempY,tempZ)
    
    const cross4 = new THREE.Mesh( line2, lineMaterial)
    cross4.position.set(tempX,tempY,tempZ)

    scene.add(cross1)
    scene.add(cross2)
    scene.add(cross3)
    scene.add(cross4)

}



/**Lights
 * 
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
scene.add(ambientLight)
//ambientLight.intensity = 0.4

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
//directionalLight.intensity = .2
//scene.add( helper );
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 12, -4)
directionalLight.target.position.set( 0, 0, 0 );
directionalLight.lookAt(0,2,0)
scene.add(directionalLight)

// const hemisphereLight = new THREE.HemisphereLight(0x2a7bf5,0xff61f7,.2 )
// scene.add(hemisphereLight)


//On Click
function onClick( event ) {

    const draggableObjects = dragControls.getObjects();
    //console.log(draggableObjects)
	draggableObjects.length = 0;

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	raycaster.setFromCamera( mouse, camera );

    const intersections = raycaster.intersectObjects( objects, true );

    //checkIntersection()
    for(const object of objects)
    {
        //console.log(object)
    }

    if ( intersections.length > 0 ) {

        const object = intersections[ 0 ].object;

        if ( group.children.includes( object ) === true ) {

            object.material.emissive.set( 0x000000 );
            
            //scene.attach( object );

        } else {

            
            outlinePass.selectedObjects = selectedObjects
            console.log("outline pass", outlinePass)
            console.log("object after outlinepass", object)
            //group.attach( object );

        }

        dragControls.transformGroup = true;
        draggableObjects.push( group );

    }

    if ( group.children.length === 0 ) {

        dragControls.transformGroup = false;
        draggableObjects.push( ...objects );

    }
    //console.log(mouse)


}



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    // Update camera
    camParameters.left = sizes.width / - 2
    camParameters.right = sizes.width / 2
    camParameters.top = sizes.height / 2
    camParameters.bottom = sizes.height / - 2

    camera.left = camParameters.left
    camera.right = camParameters.right
    camera.top = camParameters.top
    camera.bottom = camParameters.bottom
    
    console.log(camParameters)
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Camera
 */
// Base camera
//camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)

camParameters.left = sizes.width / - 2
camParameters.right = sizes.width / 2
camParameters.top = sizes.height / 2
camParameters.bottom = sizes.height / - 2
camParameters.near = -10
camParameters.far = 100

gui.add(camParameters, 'left').min(-1000).max(1000).step(1).onFinishChange(updateCamera)

console.log(camParameters)

camera = new THREE.OrthographicCamera( 
    camParameters.left, 
    camParameters.right, 
    camParameters.top, 
    camParameters.bottom, 
    camParameters.near, 
    camParameters.far
    );



//Mobile test
if( /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    camera.zoom = 40
   }
else{
    camera.zoom = 50
}

camera.position.set(4, 2, 2)

// camera.rotation.x = -0.610865
// camera.rotation.y = -0.610865
// camera.rotation.z = 0.210865
//camera.rotation.y += 90*Math.PI/180

camera.lookAt(new Vector3(0 ,0 ,0 ))
camera.updateProjectionMatrix()
scene.add(camera)

function updateCamera(){
    camera = new THREE.OrthographicCamera( 
        camParameters.left, 
        camParameters.right, 
        camParameters.top, 
        camParameters.bottom, 
        camParameters.near, 
        camParameters.far
        );
}

// zoom controls
zoomplus.onclick = function() {
    
    console.log(camera.zoom)
    if(camera.zoom + 10 < 150){
        minusstroke.style.stroke = "#000000"
        camera.zoom = camera.zoom + 10
    }
    else{
        console.log("zoom max")
        plusstrokes[0].style.stroke = "#DCDCDC"
        plusstrokes[1].style.stroke = "#DCDCDC"
        camera.zoom = 150
    }
    camera.updateProjectionMatrix()
  }
  zoomminus.onclick = function() {

    console.log(camera.zoom)
    if(camera.zoom - 10 > 25){
        plusstrokes[0].style.stroke = "#000000"
        plusstrokes[1].style.stroke = "#000000"
        camera.zoom = camera.zoom - 10
    }
    else{
        minusstroke.style.stroke = "#DCDCDC"
        camera.zoom = 25
    }
    
    camera.updateProjectionMatrix()
  }
/**
 * 
 * EDITOR CONTROLS
 * 
 */
//Add Object

 //addObject.onclick = function(){addObjectFunc()}

 const dropdown = document.getElementById("dropdown")
const addObjectButton = document.getElementById("addObjectButton")
    addObjectButton.addEventListener("click", function() {
      this.classList.toggle("active");
      var content = document.getElementById("addObjectContent")
      console.log(content)
      if(content.style.maxHeight == '800px'){
        dropdown.style.transform = "rotate(-90deg)"
        content.style.maxHeight = '0px';
        addObject.style.width = '140px'
       
      }
      else{
          console.log("expand")
        dropdown.style.transform = "rotate(0deg)"
        content.style.maxHeight = '800px';
        addObject.style.width = '140px'
      }
     
       
      
    })


 function addObjectFunc(){
     objectManager.MakeObject('box')
 }

const deleteCSS = document.getElementsByClassName("deleteSVG")

deleteButton.onclick = function() {

    if(selectedObjects[0].name != "jonBox" && selectedObjects.length > 0){
        
        const objectName = selectedObjects[0].name
        const objectNumber = selectedObjects[0].userData.number
        for(var i = 0; i < objects.length; i++){
            if(objects[i].name == objectName && objects[i].userData.number == objectNumber){
                objects.splice(i, 1)
               
                console.log("after slice", objects)
                scene.remove(selectedObjects[0])
            }
            
        }
        removeObjectDiv(selectedObjects[0].name,selectedObjects[0].userData.number)
        console.log(objects)
        selectedObjects = []
        // for(var i = 0; i < deleteCSS.length; i++){
        //     deleteCSS[i].style.stroke = "#dadada"
        // }

    }
    

    console.log('delete')
}

//Rotate objects through control
rotate.onclick = function() {

        if(selectedObjects.length > 0)
        {
            //selectedObjects[0].rotation.y = selectedObjects[0].rotation.y + Math.PI * 0.25
            console.log(selectedObjects[0].name, selectedObjects[0].rotation.y)
            selectedObjects[0].rotation.y = selectedObjects[0].rotation.y + Math.PI * 0.125
            console.log(selectedObjects[0].name, selectedObjects[0].rotation.y)
            updateTextPosition(selectedObjects[0].name, selectedObjects[0].position.x, selectedObjects[0].position.z, selectedObjects[0].rotation.y)
            //selectedObjects[0].geometry.boundingBox.rotation.y = selectedObjects[0].rotation.y + Math.PI * 0.25
            if(checkObjectsCollisions(selectedObjects[0]))
            {
                // canvas.style.backgroundImage = "url('backgrounds/stripes.svg')"
            // webglHTML.style.backgroundColor = 'red'
            
            console.log('set emissive')
                selectedObjects[0].material.emissive.set(0xFF0000)
            }
            else
            {
                console.log(selectedObjects[0])
                console.log(objects)
                // console.log(checkObjectsCollisions(objects[0]))
                console.log(checkObjectsCollisions(objects[1]))
                // console.log(checkObjectsCollisions(objects[2]))
                // console.log(checkObjectsCollisions(objects[3]))
                console.log('reset')
                selectedObjects[0].material.emissive.set(0x7C7C7C)
            }
                
        }
            
    }


// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0, 0)
//controls.enableDamping = true
controls.autoRotate = true
controls.enablePan = false
controls.autoRotateSpeed = -2.0;
controls.enableZoom = true
controls.minZoom = 25
controls.maxZoom = 150

controls.update()

console.log("camera pos,rotation", camera.position, camera.rotation)


let controlUpdating = true

//flip controls

function flipControl(){
    if(controlUpdating == true)
    {
        controlUpdating = false
    }
    else
    {
        controlUpdating = true
    }
}

//controls.enableRotate = false
// controls.enablePan = false

//instatiate event listeners
document.addEventListener( 'click', onClick );
document.addEventListener( 'touchstart', onClick );
document.addEventListener( 'mousemove', onTouchMove );
document.addEventListener( 'touchmove', onTouchMove );




//move camera
let editingstate = false
let draggedonce = false
editRoom.onclick = function(){

    // gsap.to(ambientLight, { duration: 8, delay: 0, intensity:0.6 })
    // gsap.to(directionalLight, { duration: 8, delay: 0, intensity:0.4 })
    // cssCanvas.style.opacity = "0%"
    moveCamera()
    let objectnames = []
    
    updateAllPoemTextPositions(objects)
    if(draggedonce == false)
    {
        if(editingstate == false){
            dragtoMove.style.visibility = "visible"
            dragtoMove.style.opacity = "100%"
        }
        else if(editingstate == true){
            dragtoMove.style.visibility = "hidden"
            dragtoMove.style.opacity = "0%"
        }
    }
        
        

        editingstate = !editingstate
}



function moveCamera(){
    if(controlUpdating == true)
    {
        
        flipControl()
        controls.enabled = false

        controls.autoRotate = false
        controls.enableRotate = false
        controls.enableDamping = false
        
        dragtoRotate.style.visibility = "false"
        dragtoRotate.style.opacity = "0%"
        addObject.style.visibility = 'visible'
        addObject.style.opacity = '100%'
        rotate.style.visibility = 'visible'
        rotate.style.opacity = '100%'
        deleteButton.style.visibility = 'visible'
        deleteButton.style.opacity = '100%'
        writePoem.style.visibility = 'hidden'
        writePoem.style.opacity = '0%'
        editRoom.innerText = 'Done Editing'
        gsap.to(camera.position, { duration: 1, delay: 0, x:0, y:4, z:0 })
        gsap.to(camera.rotation, { duration: 1, delay: 0,  x: -Math.PI * .5, y: 0, z: 0, })
        setTimeout(function(){ 
            dragControls.activate(), 
            controls.enabled = true, 
            controls.enablePan = true
            }, 1100)
        // new TWEEN.Tween( camera.position ).to(
        //     {
        //         x: 0,
        //         y: 4,
        //         z: 0
        //     }, 1200 )
        //     .easing(TWEEN.Easing.Quadratic.InOut)
        //     .onComplete(TWEEN.removeAll())
        //     .start();

        // new TWEEN.Tween( camera.rotation ).to(
        //     {
        //         x: -Math.PI * .5,
        //         y: 0,
        //         z: 0,
        //     }, 1200 )
        //     .easing(TWEEN.Easing.Quadratic.InOut)
        //     .onComplete(dragControls.activate ())
        //     .start();   
        
        
        camera.updateProjectionMatrix()
        render()
    }
    else if(controlUpdating == false)
    {

        //remove rotate button
        rotate.style.visibility = 'hidden'
        rotate.style.opacity = '0%'
        deleteButton.style.visibility = 'hidden'
        deleteButton.style.opacity = '0%'


        if(touched == false){
            dragtoRotate.style.visibility = "true"
            dragtoRotate.style.opacity = "100%"
        }

        // console.log('back', controls.enabled)
        clearSelectedObjects()
        camera.updateProjectionMatrix()
        dragControls.deactivate()
        controls.enabled = false
        addObject.style.visibility = 'hidden'
        addObject.style.opacity = '0%'
        writePoem.style.visibility = 'visible'
        writePoem.style.opacity = '100%'
        editRoom.innerText = 'Edit Room'
        console.log(camera.position)
        gsap.to(camera.position, { duration: 1, delay: 0, x:4.006956933461609, y:1.9999999999999996, z:1.9860252096546862 })
        //gsap.fromTo(camera.position, { x:camera.position.x, y:camera.position.y, z:camera.position.z }, { duration: 1, delay: 0, x:0, y:4, z:4 })
        gsap.to(camera.rotation, { duration: 1, delay: 0,  x: -0.7889040953353846, y: 0.9577805608840386, z: 0.6890093356871152, })
        setTimeout(function(){ 
            flipControl(), 
            controls.target.set(0, 0, 0)
            controls.enabled = true, 
            controls.autoRotate = true, 
            controls.enableRotate = true,
            controls.enablePan = false
            
        }, 1000)
        
         // camera.position.set(4, 4, -4)
            //controls.target.set(0, 0, 0) },
     
        // camera.position.set(4, 4, -4)

        
        // camera.updateProjectionMatrix()
        // render()
    }
    
    console.log('clicked')
}

/**MODAL
 * 
 */

// When the user clicks on the button, open the modal
about.onclick = function() {
    modal.style.transition = '0.2s'
    modal.style.display = "block";
    modal.style.opacity = "100%"
  }
  
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
    modal.style.opacity = "0%"
  }
  
  // When the user clicks anywhere outside of the modal, close it


/**instructions
 * 
 */
let touched = false

canvas.addEventListener("touchstart", function() {
    dragtoRotate.style.visibility = "false"
    dragtoRotate.style.opacity = "0%"
    touched = true
    
});
canvas.onclick = function() {
    dragtoRotate.style.visibility = "false"
    dragtoRotate.style.opacity = "0%"
    touched = true
    
};
 window.addEventListener("touchstart", function() {
    dragtoRotate.style.visibility = "false"
    dragtoRotate.style.opacity = "0%"
    touched = true
    
});
window.onclick = function(event) {
    // dragtoRotate.style.visibility = "false"
    // dragtoRotate.style.opacity = "0%"
    if (event.target == modal) {
        modal.style.display = "none";
        modal.style.opacity = "0%"
    }
  },function() {
    
    console.log(objects)
}


/**
 * Write Poem
 * 
 */
 writePoem.onclick = function(){moveCanvas()}
 
 function moveCanvas(){
     if(writePoemState == 1)
     {
         
        writePoem.innerText = 'Back to Room'
        //moveHTMLElements()
        // editRoom.style.visibility = 'hidden'
        // editRoom.style.opacity = '0%'
        editRoom.style.left = 'calc(-100% + 15px)'

         //writePoem.style.visibility = "hidden"
        writePoem.style.right = 'calc(100% - (15px + 125px))'
        writePoem.style.transform = '(100%, 0)'

        console.log('moved canvas')
        cssGradient.style.transition = '.8s'
        cssGradient.style.left = '-100%'
        cssCanvas.style.transition = '.8s'
        cssCanvas.style.left = '-100%'
        canvas.style.transition = '.8s'
        canvas.style.left = '-100%'
        writePoemState = '2'
     }
     else if(writePoemState == 2)
     {
        writePoem.innerText = 'Write Poem'

        // editRoom.style.visibility = 'visible'
        // editRoom.style.opacity = '100%'
        editRoom.style.left = '15px'

         //writePoem.style.visibility = "hidden"
        writePoem.style.right = '15px'
        writePoem.style.transform = '(100%, 0)'
        console.log('moved canvas')
        cssGradient.style.transition = '.8s'
        cssGradient.style.left = '0'
        cssCanvas.style.transition = '.8s'
        cssCanvas.style.left = '0'
        canvas.style.transition = '.8s'
        canvas.style.left = '0'
        writePoemState = '1'
     }
   

 }
function moveHTMLElements(roomObject){
   if(roomObject.name == 'couch')
   {
        changeCSSforObject(couchhtml, roomObject.position.x, roomObject.position.z)
        //console.log('iscouch in moveHTMLELEMENTS')
   }
   if(roomObject.name == 'plant')
   {
        changeCSSforObject(planthtml, roomObject.position.x, roomObject.position.z)
        //console.log('isplant in moveHTMLELEMENTS')
   }
}


function changeCSSforObject(cssObject, xcoord, zcoord){
    const cssleft = (xcoord + 4)/ 8
    const csstop = (zcoord + 6)/ 12
    //console.log (cssleft, csstop)
    cssObject.style.left = String(cssleft * 100) + '%'
    cssObject.style.top = String(csstop * 100) + '%'
}



/**
 * Renderer
 */
renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setClearColor( 0xe7e7e7, 0 );
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 *  Postprocessing
 * 
 */
 composer = new EffectComposer( renderer );

 const renderPass = new RenderPass( scene, camera );
 
 composer.addPass( renderPass );

 outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
 outlinePass.edgeStrength = Number( 10 );
 outlinePass.edgeGlow = Number( 0);
 outlinePass.edgeThickness = Number( 1 );
 outlinePass.pulsePeriod = Number( 0 );
 outlinePass.visibleEdgeColor.set( "#ffffff" );
 outlinePass.hiddenEdgeColor.set( "#000000" );
 composer.addPass( outlinePass );



 effectFXAA = new ShaderPass( FXAAShader );
 effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
 composer.addPass( effectFXAA );

 

function outlineObject (object){
    outlinePass.object = object
}   

//On Click
function onTouchMove( event ) {

    
    var x, y;

    if ( event.changedTouches ) {

        x = event.changedTouches[ 0 ].pageX;
        y = event.changedTouches[ 0 ].pageY;

    } else {

        x = event.clientX;
        y = event.clientY;

    }

    mouse.x = ( x / window.innerWidth ) * 2 - 1;
    mouse.y = - ( y / window.innerHeight ) * 2 + 1;

    //checkIntersection();


}

function addSelectedObject( object ) {
    console.log(selectedObjects.length)
    if(selectedObjects.length < 1)
    {
        console.log('in the selected objects')
        //selectedObjects[0].material.emissive.set( 0x000000 )
        selectedObjects = [];
        selectedObjects.push( object );

        // if(selectedObjects[0].name != "jonBox"){
        //     console.log('change color')
        //     for(var i = 0; i < deleteCSS.length; i++){
        //         deleteCSS[i].style.stroke = "red"
        //     }
        // }
        // else{
        //     for(var i = 0; i < deleteCSS.length; i++){
        //         deleteCSS[i].style.stroke = "#dadada"
        //     }
        // }
        
    }
    else if(object != selectedObjects[0])
    {
        // if(selectedObjects[0].name = "jonBox"){
        //     console.log('change color')
        //     for(var i = 0; i < deleteCSS.length; i++){
        //         deleteCSS[i].style.stroke = "red"
        //     }
        // }
        // else{
            
        // }
    selectedObjects[0].material.emissive.set( 0x000000 )
    selectedObjects = [];
    selectedObjects.push( object );
    }
  
}

function clearSelectedObjects() {
   
    if(selectedObjects.length>0){
        selectedObjects[0].material.emissive.set( 0x000000 )
    selectedObjects = [];
    }
    
    
    
  
}


function checkIntersection() {


    
		raycaster.setFromCamera( mouse, camera );

		var intersects = raycaster.intersectObject( scene, true );

		if ( intersects.length > 0 ) {

			
            for(var i = 0; i < objects.length; i++)
            {
                var selectedObject = intersects[ 0 ].object;
                if(objects[i] == selectedObject)
                {
                    console.log('checked intersection success')
                    //addSelectedObject( selectedObject );
			        outlinePass.selectedObjects = selectedObjects;
                }
            }
            //console.log(outlinePass)
		} else {

			// outlinePass.selectedObjects = [];

		}

}

/** Collision
 * 
 * 
 */

//check wall collision - checks to see if a mesh is out of bounds
let jonPositionx = null
let jonPositiony = null
let jonPositionz = null

function checkObjectforSitting ( mesh ){

    for ( let i = 0, il = objects.length; i < il; i ++ ) {
        if(mesh.userData.bBox.intersectsBox(objects[i].userData.bBox))
        {
            if(mesh.name == 'jonBox' && objects[i].userData.isSittable == true)
            {
                jonPositionx = objects[i].position.x
                jonPositiony = objects[i].position.y
                jonPositionz = objects[i].position.z
                return objects[i]
            }
            
        }
       
    }

}
console.log(objects)
function checkObjectsCollisions ( mesh ){

    for ( let i = 0, il = objects.length; i < il; i ++ ) {
        if(mesh.userData.bBox.intersectsBox(objects[i].userData.bBox))
        {
        
            if(mesh.name !== objects[i].name)
            {

                //console.log(objects[i])
                return true
            }
            
        }
       
    }
    for ( let i = 0, il = boundaryObjects.length; i < il; i ++ ) {
        if(mesh.userData.bBox.intersectsBox(boundaryObjects[i].userData.bBox))
        {
            if(mesh.name !== boundaryObjects[i].name)
            {
                canvas.classList.add("striped")
                
                return true
            }
            
        }
       
    }
    return false

}

//drag controls
let tempPositionx = null
let tempPositiony = null
let tempPositionz = null

let objectSatOn

const dragControls = new DragControls( [ ... objects ], camera, renderer.domElement );
dragControls.deactivate ()
dragControls.addEventListener( 'drag', render );
dragControls.addEventListener( 'dragstart', function ( event ){
    addSelectedObject(event.object)
    draggedonce = true
    tempPositionx = event.object.position.x
    tempPositiony = event.object.position.y
    tempPositionz = event.object.position.z
    event.object.material.emissive.set( 0x7C7C7C );
})

dragControls.addEventListener('drag', (event) => {
   
    // console.log(objects)
    // console.log(event.object)
    // console.log(wallBBox.intersectsBox(wall2Box), wallBBox, wall2Box)
    // console.log(wall.userData.bBox.intersectsBox(wall2Box))
    setBBoxtoObject( event.object )
    console.log(checkObjectforSitting(event.object))

    if(checkObjectforSitting(event.object) == null)
    {
        updateJonPosition()
    }

    if(checkObjectsCollisions(event.object))
    {
        // canvas.style.backgroundImage = "url('backgrounds/stripes.svg')"
       // webglHTML.style.backgroundColor = 'red'
       if(checkObjectforSitting(event.object) != null)
       {
        if(checkObjectforSitting(event.object).name == 'bed'){
            const sittableObject = checkObjectforSitting(event.object)
            objectSatOn = checkObjectforSitting(event.object)
            jonSleep.visible = true
            jon.visible = false
            jonSit.visible = false
           
            
       
    
           jonSleep.rotation.y = sittableObject.rotation.y
           jon.position.setX(jonPositionx)
           jon.position.setZ(jonPositionz)
        }
        else{
            const sittableObject = checkObjectforSitting(event.object)
            objectSatOn = checkObjectforSitting(event.object)
            jonSit.visible = true
            jonSleep.visible = false
            jon.visible = false
           console.log('checkchairObject', jonSit.rotation.x, sittableObject.rotation.x)
            
       
    
           jonSit.rotation.y = sittableObject.rotation.y
           jon.position.setX(jonPositionx)
           jon.position.setZ(jonPositionz)
        }
           
       }
       else{
            event.object.material.emissive.set(0xFF0000)
       }
        
    }
  
    else if(checkObjectsCollisions(event.object) === false)
    {
        if(event.object == objectSatOn || event.object == objects[0]){
            jonSit.visible = false
            jonSleep.visible = false
            jon.visible = true
        }
      
        tempPositionx = event.object.position.x
        tempPositiony = event.object.position.y
        tempPositionz = event.object.position.z
    
        //tempPosition = event.object.position
        event.object.material.emissive.set( 0x7C7C7C )
    }
    
    
    
    // if (SELECTED) {
    //     intersects = raycaster.intersectObject(plane);
    //     SELECTED.position.copy(intersects[0].point.sub(offset));
    //     edge0.geometry.verticesNeedUpdate = true; //THIS WILL TELL RENDERER THAT GEOMETRY HAS CHANGED
    //     return;
    // }
    // console.log(event.object.geometry.boundingBox)
    // console.log(wall.geometry.boundingBox)

    
  });
dragControls.addEventListener('dragend', function( event ){

    //console.log('tempposition at drag end',tempPosition, '--- position of object', event.object.position)
    console.log(tempPositionx, tempPositionz)
    console.log(event.object.position.x,event.object.position.z)
    dragtoMove.style.visibility = "hidden"
    dragtoMove.style.opacity = "0%"
    if(checkObjectforSitting(event.object) != null)
    {
       
        jon.position.setX(jonPositionx)
        jon.position.setZ(jonPositionz)
        objects[0].position.setX(jonPositionx)
        objects[0].position.setZ(jonPositionz)
        if(checkObjectforSitting(event.object).name == 'bed'){
            gsap.to(ambientLight, { duration: 8, delay: 0, intensity:0.6 })
            gsap.to(directionalLight, { duration: 8, delay: 0, intensity:0.4 })
            cssCanvas.style.opacity = "0%"
        }
       
    }
    else
    {
        updateJonPosition()
        event.object.position.set(tempPositionx,tempPositiony,tempPositionz)
    }
   
    //event.object.position.set(0,7)
    console.log('object at dragend', event.object)
    setBBoxtoObject( event.object )
    //console.log(event.object.geometry.boundingBox.intersectsBox(wall.geometry))
    //console.log(event.object.geometry.boundingBox)
    //console.log('objects in objects array', objects)
    
    event.object.material.emissive.set( 0x7C7C7C );

    //Updates html object location
    
    updateTextPosition(event.object.name, event.object.position.x, event.object.position.z, event.object.rotation.y, event.object.userData.number)
    event.object.updateMatrix()

    //getCSSforObject

})
//console.log(wall.geometry.intersectsBox(wall2))
console.log(wall)

/**Update Object bBox locations
 * 
 */

function setBBoxtoObject( mesh ){
   
        mesh.userData.bBox.setFromObject(mesh)
    
}

function updateJonPosition(){
    //jon.position.set(objects[ 0 ].position)
    jon.position.set(objects[ 0 ].position.x,objects[ 0 ].position.y,objects[ 0 ].position.z)
    console.log()
}

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

console.log('find obb', objects)
//console.log(objects[0].userData.obb)
console.log(objects[ 0 ].position)
console.log(objects)
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update mixer
    if(mixer !== null)
    {
        mixer.update(deltaTime)
    }
    
    // Composer
    composer.render(deltaTime)

    //Update Tween
    //TWEEN.update()
    
   
    jonSit.position.setX(jon.position.x)
    jonSit.position.setZ(jon.position.z)
    jonSleep.position.setX(jon.position.x)
    jonSleep.position.setZ(jon.position.z)
    //camera.lookAt(new Vector3(0 ,0 ,0 ))
    // Update controls
    //console.log(controlUpdating)
    if(controlUpdating == true)
    {
        controls.update(deltaTime)
    }
    
    //console.log(checkObjectsCollisions(objects[2]))
    // for ( let i = 0, il = objects.length; i < il; i ++ ) {
        
        
    //     try {
    //         const object = objects[ i ];
    //         object.userData.bBox.setFromObject(object);
    //       } catch (e) {
    //         // exit the loop
    //         break; 
       

    //  }
    
        
 

    
    renderer.render(scene, camera)

    
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
    
}

function render() {

    renderer.render( scene, camera );

}

tick()
import * as THREE from 'three'
import {updateTextPosition, makeObjectText, updateAllPoemTextPositions} from '../text/textManager.js'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

let objectTypes = ['Sofa', 'Plant', 'Table', 'Chair','Banana','Laptop','Bed']
let objects = []
let objectNumbers = []

let scene

const manager = new THREE.LoadingManager()
const gltfLoader = new GLTFLoader( manager)

class ObjectManager{
    constructor(typeOfObject){
        this.typeOfObject = typeOfObject
        this.objectNumber
        this.textDiv
    }
    AddObjecttoDraggable(object){
        objects.push(object)
    }
    RetrieveDraggableObjects(){
        return objects
    }
    MakeObject(ObjectType) {
        if(ObjectType == 'box'){
            const testBox = new THREE.Mesh(
                new THREE.BoxGeometry(.8, 2, 1),
                new THREE.MeshStandardMaterial({
                    color: '#969696',
                    metalness: 0,
                    roughness: 0.5
                })
            )
            testBox.position.set(0,1.78,0)
            scene.add(testBox)
            makeObjectText('box')
           objects.push(textBox)
        }
        if(ObjectType == 'plant'){
            gltfLoader.load(
                '/models/RoomObjects/Plant/Houseplant.gltf',
                (gltf) =>
                {
                    const children = [...gltf.scene.children]
                    for(const child of children)
                    {
                        
                        child.scale.set(.2,.2,.2)
                        child.name = 'plant'
                        child.position.set(0,0,0)
                        
                        child.userData.number = objectNumbers[objectNumbers.length - 1] + 1 
                        console.log(child.userData.number)
                        objectNumbers.push(child.userData.number)
                        child.userData.bBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
                        child.userData.bBox.setFromObject(child);
                        makeObjectText('plant')
                        scene.add(child)
                        objects.push(child)
                    }
                }
            )
            console.log(objectNumbers)
            
        }
        if(ObjectType == 'chair'){
            gltfLoader.load(
                '/models/RoomObjects/Chair/Chair.gltf',
                (gltf) =>
                {
                    // console.log(gltf.scene)
            
                    const children = [...gltf.scene.children]
                    for(const child of children)
                    {
                        //child.rotation.x = Math.PI * 0.5
                        child.name = 'chair'
                        child.position.set(0,0,0)
                        child.userData.number = objectNumbers[objectNumbers.length - 1] + 1 
                        objectNumbers.push(child.userData.number)
                       
                        child.userData.bBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
                        child.userData.bBox.setFromObject(child);
                        child.userData.isSittable = true
                        scene.add(child)
                        objects.push(child)
                        makeObjectText(ObjectType)

                    }
                    
                }
            )
            
        }
        if(ObjectType == 'table'){
            gltfLoader.load(
                '/models/RoomObjects/Table/Table3.gltf',
                (gltf) =>
                {
            
                    const children = [...gltf.scene.children]
                    for(const child of children)
                    {

                       
                        child.name = 'table'
                        child.position.set(0,0,0)
                        child.userData.number = objectNumbers[objectNumbers.length - 1] + 1 
                        objectNumbers.push(child.userData.number)
                        child.userData.bBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
                        child.userData.bBox.setFromObject(child);
                        child.userData.bBox.material = 
                        makeObjectText(ObjectType)
                        scene.add(child)
                        objects.push(child)
            
                    }
                    
                }
            )
            
        }
        if(ObjectType == 'sofa'){
            gltfLoader.load(
                '/models/RoomObjects/Sofa/Sofa2.gltf',
                (gltf) =>
                {

            
                    
                    const children = [...gltf.scene.children]
                    for(const child of children)
                    {


                        child.position.set(0,0,0)
                        child.name = 'couch'
                        child.userData.number = objectNumbers[objectNumbers.length - 1] + 1 
                        objectNumbers.push(child.userData.number)
                        child.userData.bBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
                        child.userData.bBox.setFromObject(child);
                        child.userData.isSittable = true
                        makeObjectText(ObjectType)
                        
                        scene.add(child)
                        objects.push(child)
 
                    }

                    
                }
            )
            
        }
        if(ObjectType == 'banana'){
            gltfLoader.load(
                '/models/RoomObjects/Fruits/banana.gltf',
                (gltf) =>
                {

            
                    
                    const children = [...gltf.scene.children]
                    for(const child of children)
                    {

                        
                        child.position.set(0,0,0)
                        child.name = 'banana'
                        child.userData.number = objectNumbers[objectNumbers.length - 1] + 1 
                        objectNumbers.push(child.userData.number)
                        child.userData.bBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
                        child.userData.bBox.setFromObject(child);
                        //child.userData.isSittable = true
                        makeObjectText(ObjectType)
                        
                        scene.add(child)
                        objects.push(child)
 
                    }

                    
                }
            )
            
        }
        if(ObjectType == 'laptop'){
            gltfLoader.load(
                '/models/RoomObjects/Electronics/Laptop.gltf',
                (gltf) =>
                {

            
                    
                    const children = [...gltf.scene.children]
                    for(const child of children)
                    {

                        
                        child.position.set(0,0,0)
                        child.name = 'laptop'
                        child.userData.number = objectNumbers[objectNumbers.length - 1] + 1 
                        objectNumbers.push(child.userData.number)
                        child.userData.bBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
                        child.userData.bBox.setFromObject(child);
                        //child.userData.isSittable = true
                        makeObjectText(ObjectType)
                        
                        scene.add(child)
                        objects.push(child)
 
                    }

                    
                }
            )
            
        }
        if(ObjectType == 'bed'){
            gltfLoader.load(
                '/models/RoomObjects/Bed/Bed2.gltf',
                (gltf) =>
                {

            
                    
                    const children = [...gltf.scene.children]
                    for(const child of children)
                    {

                        
                        child.position.set(0,0,0)
                        child.name = 'bed'
                        child.userData.number = objectNumbers[objectNumbers.length - 1] + 1 
                        objectNumbers.push(child.userData.number)
                        child.userData.bBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
                        child.userData.bBox.setFromObject(child);
                        child.userData.isSittable = true
                        makeObjectText(ObjectType)
                        
                        scene.add(child)
                        objects.push(child)
 
                    }

                    
                }
            )
            
        }
    }

    
}

const objectManager = new ObjectManager()

function setScene(tempScene){
    scene = tempScene
}
function retrieveObjects(){
    return objects
}
function attatchObjectList(objectsList){
    objects = objectsList
}

function attatchObjectNumbers(numbers){
    objectNumbers = numbers
}

function importObject(objectTypes){
    var objectButton = document.createElement("div");
    const newContent = document.createTextNode(objectTypes);
    objectButton.setAttribute("class", "addObjectObjects")

    objectButton.appendChild(newContent)
    const addObjectDiv = document.getElementById("addObjectContent");
    addObjectDiv.appendChild(objectButton);

  }

  for(var i = 0; i < objectTypes.length; i++){
    importObject(objectTypes[i])
  }

  let objectButtons = document.getElementsByClassName("addObjectObjects")
  console.log('objectbuttongs',objectButtons)
  for(var i = 0; i < objectButtons.length; i++){
    let tempObject =  objectButtons[i]
    let tempObjectText = tempObject.innerHTML.toLowerCase()
   tempObject.onclick = function(){
        console.log(tempObjectText)
        
        objectManager.MakeObject(tempObjectText)
    }
    console.log(objectButtons[i].onclick)
  }
  //objectManager.MakeObject('plant')

  

export {ObjectManager, setScene, attatchObjectList, attatchObjectNumbers}



 
import './textClass'
import retrieveBasicText from './textClass'

let couchTexts = ['sinking lucid space']
let plantTexts = ['sinking lucid space']

let poemTexts = []
let objectNumbers

class PoemText{
    
    constructor(typeOfObject, objectNumber){
        console.log()
        this.typeOfObject = typeOfObject
        this.text = retrieveBasicText(this.typeOfObject)
        this.objectNumber = objectNumber
        this.textDiv
    }
    

    UpdatePoemText() {
        if(this.typeOfObject == 'couch')
        {
            this.text = couchTexts[0]
        }
        
    }
    UpdatePoemTextPosition(name, x, z, yRotation, number) {
        if(name == 'couch' || name == 'plant' || name == 'chair' || name == 'table' || name == 'banana' || name == 'bed' || name == 'laptop')
        {
            //the value from the mesh to match to the div object value
            let value = number

            const objects = document.getElementsByClassName(name)
            // console.log(objects , "the document get by class")
            // console.log(objects[0] , "the div")
            // console.log(objects[0].getAttribute('value') , "the value")

            let cssYRotation = yRotation * 57.2958
            let cssleft = (x + 4)/ 8
            let csstop = (z + 6)/ 12
           console.log('y rotation',cssYRotation)
            for(var i = 0; i < objects.length; i++)
            {
                //console.log("the object", objects[i])
                //console.log("the object value", objects[i].getAttribute('value'))
                if(objects[i].getAttribute('value') == value){
                    const object = objects[i]
                    //console.log("moved", object)
                    //console.log (cssleft, csstop)
                    const rotation = 'rotate(' + String(Math.round(cssYRotation)) + '%)'
                    console.log("rotation", rotation)
                    object.style.left = String(Math.round((cssleft * 90) / 2) * 2) + '%'
                    object.style.top = String(Math.round((csstop * 90) / 2) * 2) + '%'
                    object.style.transform = "rotate(" + String(Math.round(cssYRotation)) + "deg)"
                    break
                }
            }
            
        }

    }

    

    getObjeectNumbs(){
        return objectNumbers
    }

    getTypeOfObject() {
        return this.typeOfObject
    }
    getObjectNumber(){
        return this.objectNumber
    }
     
    UpdatePoemID() {
        this.objectNumber = 1
    }
    

    textImporter() {
        //this.UpdatePoemText()
        
        var textP = document.createElement("P");
        const newContent = document.createTextNode(this.text);

        //Putting type of object as an id
        const textID = document.createAttribute("ID")
        textID.value = this.typeOfObject
        console.log(objectNumbers[objectNumbers.length - 1])
        textP.setAttribute("value",objectNumbers[objectNumbers.length - 1])

        //creates class based off object name
        const textClass = document.createAttribute("class")
        textClass.value = this.typeOfObject
        //creates class for the p tag styling
        const textPClass = document.createAttribute("class")
        


        textP.setAttribute("class",this.typeOfObject + " poemText")
        //textP.className(this.typeOfObject + " poemText")

        
    
        textP.appendChild(newContent)
        const paperDiv = document.getElementById("paper");
        this.textDiv = paperDiv.appendChild(textP);
        console.log(this.textDiv)

        
      }
}



function makeObjectText(ObjectType){
    
        poemTexts.push( new PoemText(ObjectType, objectNumbers[objectNumbers.length - 1]))
        poemTexts[poemTexts.length - 1].textImporter()
        console.log("object numbers", objectNumbers)

}

function getObjectNumbers(numbers){
    objectNumbers = numbers
}


function updateTextPosition(name, x , z, yRotation, number){
    console.log('the object name', name, number)
    console.log(poemTexts)
    for(let i = 0 ; i < poemTexts.length; i++){
        poemTexts[i].getObjectNumber()
        //console.log('couch start', poemTexts[i])
        if(poemTexts[i].getTypeOfObject() == name && poemTexts[i].getObjectNumber() == number){
            console.log('couch hit')
            poemTexts[i].UpdatePoemTextPosition(name, x, z, yRotation, number)
            break
        }
    }
}

function updateAllPoemTextPositions(objects){
    for(var i = 0; i < objects.length; i++){
        console.log(objects)
        updateTextPosition(objects[i].name, objects[i].position.x, objects[i].position.z, objects[i].rotation.y, objects[i].userData.number)
    }
}

function removeObjectDiv(type, number){
    const objectDivs = document.getElementsByClassName(type)

    for(var i = 0; i < objectDivs.length; i++){
        if(objectDivs[i].getAttribute('value') == number){
            objectDivs[i].remove()
        }
    }
}




   


export {updateTextPosition, makeObjectText, updateAllPoemTextPositions, getObjectNumbers, removeObjectDiv};

let couchTexts = ['the brackets of the sinking lucid space continually fold inwards', 0, 'the sofa has a very worn down spot on the left of the couch from years of use', 0]
let plantTexts = ['looking out for jon slowly', 0, "I hope to be the sun's friend", 0]
let tableTexts = ['ask a question', 0, 'cluttered objects collected over the beat of the day-to-day', 0]
let chairTexts = ['pointing lines', 0 , '. pause', 0]
let bananaTexts = ['banana', 0]
let jonTexts = ['Jon in space', 0]
let bedTexts = ['finding more time', 0, 'contain a thought', 0]
let laptopTexts = ['check behind the glass', 0, 'subtracting from the landscape', 0]
   
function searchTextandRemove(list){
   
    const mostUnused = []
    let lastSmallest = list[1]
    for(var i = 1; i < list.length; i = i+2){
       if(lastSmallest > list[i])[
           lastSmallest = list[i]
       ]
    }
    for(var i = 1; i < list.length; i = i+2){
        if(list[i] == lastSmallest){
            mostUnused.push(list[i-1])
            list[i] = list[i] + 1
        }
    }
    var entryIndex = (Math.floor(Math.random() * mostUnused.length))
    var textItem = mostUnused[entryIndex]
   console.log(list)
    return textItem
}

function retrieveBasicText(typeOfObject){
    if(typeOfObject == 'couch')
    {
        const poemText = searchTextandRemove(couchTexts) 
        return poemText
    }
    if(typeOfObject == 'plant')
    {
        const poemText = searchTextandRemove(plantTexts) 
        return poemText
    }
    if(typeOfObject == 'table')
    {
        const poemText = searchTextandRemove(tableTexts) 
        return poemText
    }
    if(typeOfObject == 'chair')
    {
        const poemText = searchTextandRemove(chairTexts) 
        return poemText
    }
    if(typeOfObject == 'banana')
    {
        const poemText = searchTextandRemove(bananaTexts) 
        return poemText
    }
    if(typeOfObject == 'bed')
    {
        const poemText = searchTextandRemove(bedTexts) 
        return poemText
    }
    if(typeOfObject == 'jonbox')
    {
        const poemText = searchTextandRemove(jonTexts) 
        return poemText
    }
    if(typeOfObject == 'laptop')
    {
        const poemText = searchTextandRemove(laptopTexts) 
        return poemText
    }
    else{
        return 'an object in a dream'
    }
}

export default retrieveBasicText
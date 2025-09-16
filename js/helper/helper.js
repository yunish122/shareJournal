
export function create_element(elem,classes){
    let element = document.createElement(elem)
    element.classlist.add(classes)
    return element
}   

export function createSpan(classes = []){
    let spantag = document.createElement('span')
    spantag.classList.add(...classes)
    return spantag
}
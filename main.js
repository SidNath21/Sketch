const container = document.querySelector("#container");
const buttons = document.querySelector("#buttons");
const styleContainer = document.querySelector("#info");
const propertiesContainer = document.querySelector(".properties");

const clearButton = document.createElement("button");
clearButton.textContent = "Clear";
clearButton.classList.add("clearButton");
buttons.appendChild(clearButton);

const resizeButton = document.createElement("button");
resizeButton.textContent = "Resize";
resizeButton.classList.add("resizeButton");
buttons.appendChild(resizeButton);

const colorButton = document.createElement("button");
colorButton.textContent = "Color";
colorButton.classList.add("colorButton");
buttons.appendChild(colorButton);

const penStatus = document.createElement("p");
const gridStatus = document.createElement("p");
const colorStatus = document.createElement("p");
penStatus.textContent = "Pen Closed";
gridStatus.textContent = "Grid Size: 16 x 16";
colorStatus.textContent = "Current Color: Black";
penStatus.classList.add("penStatus");
gridStatus.classList.add("gridStatus");
colorStatus.classList.add("colorStatus");
propertiesContainer.appendChild(penStatus);
propertiesContainer.appendChild(gridStatus);
propertiesContainer.appendChild(colorStatus);

const radios = document.getElementsByName("colorStyle");
for(let i=0; i<radios.length; i++){
    radios[i].onclick = radioClick;
}


let canDraw = false;
let cells;
let cellColor = "silver";
let cellColorHover = "grey";
let cellColorDrawn = "black";
let canChooseColor = false;
let gridSize = 16;
let cellsDrawn = 0;
let colorNum = 0;

createGrid(gridSize);

document.body.onkeyup = function(e){
    if(e.keyCode == 16){
        canDraw = (canDraw == false) ? true : false;
        penStatus.textContent = (canDraw) ? "Pen Open" : "Pen Closed";
        if(canDraw){
            for(let i=0; i<cells.length; i++){
                if(cells[i].style.backgroundColor == cellColorHover){
                    cellsDrawn++;
                    cells[i].style.backgroundColor = cellColorDrawn;
                }
            }
        }
    } 
}

clearButton.addEventListener("click", clear);
resizeButton.addEventListener("click", resize);
colorButton.addEventListener("click", chooseColor);


function createGrid(num){

    for(let i=0; i<num; i++){
        const column = document.createElement("div");
        column.classList.add("column");
        container.appendChild(column);
        for(let j=0; j<num; j++){
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.style.backgroundColor = cellColor;
            column.appendChild(cell);
        }
    }

    cells = document.querySelectorAll(".cell");
    for(let i=0; i<cells.length; i++){
        cells[i].addEventListener("mouseover", draw);
        cells[i].addEventListener("mouseout", mouseOut);
            
        
    }
}

function draw(){


    if(!canChooseColor){
        if(colorNum == 0) cellColorDrawn = "black";
        else if(colorNum == 1) cellColorDrawn = getRandomColor();
        else if(colorNum == 2) cellColorDrawn = getDarkerColor(this.style.backgroundColor);
    }

    if(canDraw){
        if(this.style.backgroundColor == cellColor) cellsDrawn++;
        this.style.backgroundColor = cellColorDrawn;
    }

    else{
        if(this.style.backgroundColor == cellColor) this.style.backgroundColor = cellColorHover;     
    }

    
}

function radioClick(){
    canChooseColor = false;
    if(this.value == 0){
         colorNum = 0;
         colorStatus.textContent = "Current Color: Black" ;

    }
    if(this.value == 1){
        colorNum = 1;
        colorStatus.textContent = "Current Color: Random";
    } 
    if(this.value == 2){
        colorNum = 2;
        colorStatus.textContent = "Current Color: Darken";
    } 
    
}

function getRandomColor(){
    const colorR = (Math.floor(Math.random()*256));
    const colorG = (Math.floor(Math.random()*256));
    const colorB = (Math.floor(Math.random()*256));
    return `RGB(${colorR} ${colorG} ${colorB})`;
}

function getDarkerColor(originalColor) {
    // Extracts the digits from the RGB color and returns a string RGB value with each number reduced by 25 (until it hits 0)
    if (originalColor == 'black') return originalColor;
    if (originalColor == 'white') return "RGB(230 230 230)";
    let colorValues = originalColor.match(/(\d+)/g);
    for (let x = 0; x < colorValues.length; x ++) {
        let intValue = parseInt(colorValues[x]);
        if (intValue - 25 < 0) {
            colorValues[x] = 0;
        } else colorValues[x] = intValue - 25;
    }
    let darkerColor = "RGB(";
    for (let y = 0; y < colorValues.length; y ++) {
        if (y === colorValues.length - 1) {
            darkerColor += colorValues[y] + ")";
        } else {
            darkerColor += colorValues[y] + " ";
        }
    }
    return darkerColor;
}


function mouseOut(){
    if(!canDraw){
        if(this.style.backgroundColor == cellColorHover) this.style.backgroundColor = cellColor;
    }
}

function clear(){
    for(let i=0; i<cells.length; i++){
        cells[i].style.backgroundColor = cellColor;
    } 
    cellsDrawn = 0;
    numStat.textContent = "Cells Drawn " + cellsDrawn;
}

function resize(){
    let num = parseInt(prompt("Chose number of squared per side \n Between 1 - 100"), 10); 
   
    while(isNaN(num)) num = parseInt(prompt("Chose number of squared per side \n Between 1 - 100"), 10); 
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    gridSize = num;
    cellsDrawn = 0;
    canDraw = false;
    gridStatus.textContent = "Grid Size: " + num + " x " + num;
    penStatus.textContent = "Pen Closed";

    createGrid(gridSize);
    
}

function chooseColor(){
    let color = prompt("Choose a valid color");
    if(validTextColor(color)){
        cellColorDrawn = color;
        canChooseColor = true;
    }

    for(let i=0; i<radios.length; i++){
        radios[i].checked = false;
    }

    colorStatus.textContent = "Current Color: " + color;
}

function validTextColor(stringToTest) {
    //Alter the following conditions according to your need.
    if (stringToTest === "") { return false; }
    if (stringToTest === "inherit") { return false; }
    if (stringToTest === "transparent") { return false; }

    var image = document.createElement("img");
    image.style.color = "rgb(0, 0, 0)";
    image.style.color = stringToTest;
    if (image.style.color !== "rgb(0, 0, 0)") { return true; }
    image.style.color = "rgb(255, 255, 255)";
    image.style.color = stringToTest;
    return image.style.color !== "rgb(255, 255, 255)";
}



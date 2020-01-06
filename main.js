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
let cellColor = "white";
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
    cellColorHover = "grey";
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
        console.log(this.style.backgroundColor + " " + cellColorHover + " " + cellColorDrawn);
        if(this.style.backgroundColor == cellColorHover) this.style.backgroundColor = cellColor;
        
        //if(cellColorHover != hexToRgb(cellColorHover)) this.style.backgroundColor = cellColor;
    }
}

function clear(){
    for(let i=0; i<cells.length; i++){
        cells[i].style.backgroundColor = cellColor;
    } 
    cellsDrawn = 0;
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
    //cellColorHover = lighten(colorNameToHex(color), 0.5);

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

function lighten(color, luminosity) {

	// validate hex string
	color = new String(color).replace(/[^0-9a-f]/gi, '');
	if (color.length < 6) {
		color = color[0]+ color[0]+ color[1]+ color[1]+ color[2]+ color[2];
	}
	luminosity = luminosity || 0;

	// convert to decimal and change luminosity
	var newColor = "#", c, i, black = 0, white = 255;
	for (i = 0; i < 3; i++) {
		c = parseInt(color.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(black, c + (luminosity * white)), white)).toString(16);
		newColor += ("00"+c).substr(c.length);
	}
	return newColor; 
}

function colorNameToHex(color)
{
    var colors = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

    if (typeof colors[color.toLowerCase()] != 'undefined')
        return colors[color.toLowerCase()];

    return false;
}

function hexToRgb(hex) {
    let x = [];
    hex = hex.replace('#', '')
    if (hex.length != 6) {
      hex = modifyHex(hex)
    }
    x.push(parseInt(hex.slice(0, 2), 16))
    x.push(parseInt(hex.slice(2, 4), 16))
    x.push(parseInt(hex.slice(4, 6), 16))
    return "rgb(" + x.toString() + ")"
  }

  function modifyHex(hex) {
    if (hex.length == 4) {
      hex = hex.replace('#', '');
    }
    if (hex.length == 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    return hex;
  }


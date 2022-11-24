let resulElement = document.querySelector('.result');
let rowId =1;
let mainContainer = document.querySelector('.main-container');//seleccionar el contenedor main

//peticion api de palabras

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '6f04666531msh476b0c0d08600a1p12042ejsnafd600cb405c',
		'X-RapidAPI-Host': '1000-most-common-words.p.rapidapi.com'
	}
};

fetch('https://1000-most-common-words.p.rapidapi.com/words/spanish?words_limit=1',options)
.then(result=>result.json())
.finally(()=>{
    let loadingElement = document.querySelector('.loading')
    loadingElement.style.display = 'none';
})
.then(data =>{
    console.log(data)
    let word =data[0];
    let wordArray = word.toUpperCase().split('');
    
    let actualRow = document.querySelector('.row');
    
    drawSquares(actualRow);
    listenInput(actualRow);
    
    addfocus(actualRow);
    
    
    
    function listenInput(actualRow){//
    
        let squares = actualRow.querySelectorAll('.square');//escuchar sobre la fila actual todo los elementos square
        squares = [...squares]; /*pasar nodelist a un arreglo*/
    
        let userInput=[]
    
        squares.forEach(Element => {
            Element.addEventListener('input',event=>{
                //si no se ha borrado  
                if(event.inputType !== 'deleteContentBackward'){
                    
                    //Recoger el ingreso del usuario
                    userInput.push(event.target.value.toUpperCase());//capturar valor ingresado
                    
                    if(event.target.nextElementSibling){
                        event.target.nextElementSibling.focus();//focus pasa cursor al recuadro siguiente
                    
                    }else{
                        let squaresFilled = document.querySelectorAll('.square');
                        squaresFilled = [...squaresFilled]
                        let lastFiveSquareFilled = squaresFilled.slice(-word.length);
                        let finalUserInput = [];
                        lastFiveSquareFilled.forEach(element =>{
                            finalUserInput.push(element.value.toUpperCase())
    
                        });
                        
    
                        //cambiar estilo si existe la letra pero en posicion incorrecta
                        let exitsIdexsArrays=existletter(wordArray,finalUserInput);
                        exitsIdexsArrays.forEach(element => {
                            squares[element].classList.add('gold');
                        });
    
                        //si no hay mas espacios pasa a comparar los arreglos
                        let rightIndex = compareArray(wordArray,finalUserInput)//comparar los arrays
                        console.log(rightIndex);
                        rightIndex.forEach(element=>{
                            squares[element].classList.add('green');//pinta de verde los elementos iguales
                        });
    
                        //si los arreglos son iguales
                        if(rightIndex.length==wordArray.length){
                            //si la longitud del arreglo de elementos correctos(rightIndex) es igual a la del arreglo original
                            //entonces e ganado
                            showResult('Ganaste!')
                            return; //sale de la funcion
                        }
                        
    
                        //crear nueva fila
                        let actualRow=createRow();
                        if(!actualRow){
                            return;
                        }
                        drawSquares(actualRow);
                        listenInput(actualRow);
                        addfocus(actualRow);
                    }
                }else{
                    userInput.pop();
                }
            //////////////////////7
            });
        })
    }
    
    
    
    
    //funciones
    function compareArray(Array1,Array2){//comparar los elementos de los arrays
        let iqualsIndex = [];
        Array1.forEach((Element,index)=>{
            if(Element == Array2[index]){
                console.log(`en la posicion ${index} si son iguales` );
                iqualsIndex.push(index)
            }else{
                console.log(`en la posicion ${index} no son iguales` );
            }
        });
        return iqualsIndex;
    }
    
    function existletter(Array1,Array2){
        //si la letra existe hace un push al arreglo exitsIdexsArrays con el indice de esa letra
        let exitsIdexsArrays= [];
        Array2.forEach((element,index)=>{
            if(Array1.includes(element)){
                exitsIdexsArrays.push(index);
            }else{
    
            }
        });
        return exitsIdexsArrays;
    }
    function createRow(){
        rowId++;//incrementar el id del nuevo div
        if(rowId<=5){//limitar a 5 la cantidad de filas
            let newRow = document.createElement('div');//crear un div
            newRow.classList.add('row');//agregar clase row al div
            newRow.setAttribute('id',rowId);
            mainContainer.appendChild(newRow);//agregar al main container newRow
            return newRow;
        }else{
            showResult(`Intenta de nuevo, la respuesta correcta era"${word.toUpperCase()}"`);//mensaje cuando pierde
            
        }
    }
    
    function drawSquares(actualRow){
        wordArray.forEach((item,index)=>{
            if(index === 0){
                actualRow.innerHTML += `<input type="text" maxlength="1" class="square focus"></input>`
            }else{
                actualRow.innerHTML += `<input type="text" maxlength="1" class="square"></input>`
            }
        });
    }
    function addfocus(actualRow){
        let focusElement = actualRow.querySelector('.focus'); 
        focusElement.focus();
    }
    
    function showResult(textMsg){//ver mensage gano o perdio
        resulElement.innerHTML=`<p>${textMsg}</p> <button class="btn">Reiniciar</button>`
    
        let resetBtn = document.querySelector('.btn')//boton reiniciar 
        resetBtn.addEventListener('click',()=>{
             location.reload();
        });
    }
})


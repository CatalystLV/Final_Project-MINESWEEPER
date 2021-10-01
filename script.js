document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid');
    const flagsLeft = document.querySelector('#flags-left');
    const bombCount = document.querySelector('#bombCount');
    document.getElementById("reset").addEventListener('click',resetBoard);
    document.getElementById("btn1").addEventListener('click',easy);
    document.getElementById("btn2").addEventListener('click',medium);
    document.getElementById("btn3").addEventListener('click',hard);

   
    let width = 10;
    // let bombAmount = 20;
    let bombAmount = parseInt(localStorage.getItem("bombs"));
    let flags = 0;
    let squares = [];
    let isGameOver = false;
    let field = width*width




function resetBoard(){  //to reset the game we refresh page :)
    document.location.reload(true)
}


function medium(){
    localStorage.setItem("bombs", 30);
    resetBoard() 
}

function easy(){
    localStorage.setItem("bombs", 20);
    resetBoard() 
}

function hard(){
    localStorage.setItem("bombs", 40);
    resetBoard() 
}

//create board

function createBoard(){
    if(!bombAmount){
        bombAmount = 20;
    }
    console.info(bombAmount)
    bombCount.innerHTML = bombAmount;
    flagsLeft.innerHTML = bombAmount;
    //shuffle bombs
    const bombsArray = Array(bombAmount).fill('bomb');
    const emptyArray = Array(width*width - bombAmount).fill('valid');
    const gameArray = emptyArray.concat(bombsArray);
    const shuffledArray = gameArray.sort(() => Math.random() -0.5)
    // console.info(shuffledArray)

    for(let i=0; i < width*width; i++) {
        const square =document.createElement('div')
        square.setAttribute ('id', i);
        square.classList.add(shuffledArray[i])
        grid.appendChild(square)
        squares.push(square)

        // click on square

        square.addEventListener('click', function(e) {
            click(square)
        })

        //control and left click

        square.oncontextmenu = function(e) {
            e.preventDefault()
            addFlag(square)
        }
    }

    //add numbers
    for(let i=0; i < squares.length; i++) {
        let total = 0;
        const isLeftEdge = (i % width === 0);
        const isRightEdge = (i % width === width -1);

        if(squares[i].classList.contains('valid')) {
            if(i > 0 && !isLeftEdge && squares[i-1].classList.contains('bomb')) total ++  //check square on west
            if(i > 9 && !isRightEdge && squares[i+1 - width].classList.contains('bomb')) total ++ //check square on north-east
            if(i > 10 && squares[i-width].classList.contains('bomb')) total ++  // check square on north
            if(i > 11 && !isLeftEdge && squares[i-1 - width].classList.contains('bomb')) total ++  // check square on north-west
            if(i < 98 && !isRightEdge && squares[i+1].classList.contains('bomb')) total ++ //check square on east
            if(i < 90 && !isLeftEdge && squares[i-1 + width].classList.contains('bomb')) total ++  //check square on south-west
            if(i < 88 && !isRightEdge && squares[i+1 + width].classList.contains('bomb')) total ++  //check square on south-east
            if(i < 89 && squares[i + width].classList.contains('bomb')) total ++  //check square on south

            // if(i > 0 && !isLeftEdge && squares[i-1].classList.contains('bomb')) total ++  //check square on west
            // if(i > (width-1) && !isRightEdge && squares[i+1 - width].classList.contains('bomb')) total ++ //check square on north-east
            // if(i > width && squares[i-width].classList.contains('bomb')) total ++  // check square on north
            // if(i > (width+1) && !isLeftEdge && squares[i-1 - width].classList.contains('bomb')) total ++  // check square on north-west
            // if(i < (field-2) && !isRightEdge && squares[i+1].classList.contains('bomb')) total ++ //check square on east
            // if(i < (field-width) && !isLeftEdge && squares[i-1 + width].classList.contains('bomb')) total ++  //check square on south-west
            // if(i < (field-width-2) && !isRightEdge && squares[i+1 + width].classList.contains('bomb')) total ++  //check square on south-east
            // if(i < (field-width-1) && squares[i + width].classList.contains('bomb')) total ++  //check square on south

            squares[i].setAttribute('data', total)
            
        }

    }

}

createBoard()

//add Flag with right click

function addFlag(square) {
    if (isGameOver) return
    if (!square.classList.contains('checked') && (flags < bombAmount)) {
        if (!square.classList.contains('flag')) {
            square.classList.add('flag')
            square.innerHTML = '⛳';
            flags ++
            flagsLeft.innerHTML = bombAmount - flags;
            checkForWin ()
        }else {
            square.classList.remove('flag')
            square.innerHTML = ''
            flags --
            flagsLeft.innerHTML = bombAmount - flags;
        }
    }
}

// click on square actions

function click(square) {
    let currentId = square.id
    if(isGameOver) return;
    if(square.classList.contains('checked') || square.classList.contains('flag')) return;
    if(square.classList.contains('bomb')) {
        // alert('Game over!')
        console.info('Game Over!')
        GameOver(square)
    }else {
        let total = square.getAttribute('data');
        if(total !=0){
            square.classList.add('checked');
            if(total == 1) square.classList.add('one');
            if(total == 2) square.classList.add('two');
            if(total == 3) square.classList.add('three');
            if(total == 4) square.classList.add('four');
            if(total == 5) square.classList.add('five');
            if(total == 6) square.classList.add('six');
            if(total == 7) square.classList.add('six');
            if(total == 8) square.classList.add('six');
            square.innerHTML = total;
            return
        }
        checkSquare(square, currentId)
        
    }
    square.classList.add('checked')
}


//check neighboring squares once square are clicked

function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0);
    const isRightEdge = (currentId % width === width -1)

    setTimeout(() => {
        if (currentId > 0 && !isLeftEdge) {  // checking square to left (West) from where you clicked
            const newId = squares[parseInt(currentId)-1].id 
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId > 9 && !isRightEdge) { // checking square to North-East from where you clicked
            const newId = squares[parseInt(currentId)+1 -width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId > 10){ // checking square to North from where you clicked
            const newId = squares[parseInt(currentId - width)].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId > 11 && !isLeftEdge) {  // checking square to North-West from where you clicked
            const newId = squares[parseInt(currentId) -1 -width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId < 98 && !isRightEdge) {  // checking square to East from where you clicked
            const newId = squares[parseInt(currentId) +1].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId < 89) {  // checking square to South from where you clicked
            const newId = squares[parseInt(currentId) + width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId < 88 && !isRightEdge) {  // checking square to South-East from where you clicked
            const newId = squares[parseInt(currentId) + 1 + width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId < 90 && !isLeftEdge) {  // checking square to South-East from where you clicked
            const newId = squares[parseInt(currentId) - 1 + width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }




    }, 10)
}

//GameOver

function GameOver(square) {
    console.info('Boom! Game OVer!');
    isGameOver = true;

    //show ALL bombs
    squares.forEach(square => {
        if (square.classList.contains('bomb')) {
            square.innerHTML = '🎇'
        }
    })
}


//check for WIN!
function checkForWin() {
    let matches = 0;
     for (let i = 0; i < squares.length; i++) {
        if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
            matches ++;
        }
        if (matches === bombAmount) {
            alert("YOU WIN!")
            console.info('YOU WIN');
            isGameOver = true;
        }
     }
}

function resetScore(){
    localStorage.setItem("count", 0);
    score = 0
    document.getElementById("myScore").innerHTML = score;
}

function setBombs(){
    localStorage.setItem("bombs",bombAmount)
}
setBombs()

})
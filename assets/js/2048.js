var Game = ( function () {
    
    // Checking browser supports localStorage
    /* Code snippet from stackoverflow */
    if (typeof localStorage === 'object') {
        try {
            localStorage.setItem('localStorage', 1);
            localStorage.removeItem('localStorage');
        } catch (e) {
            Storage.prototype._setItem = Storage.prototype.setItem;
            Storage.prototype.setItem = function() {};
            alert('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');
        }
    }
    /* ****** */
    
    var grid = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]];
    var prevGrid = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    var score=0;
    var highScore = 0;
    (localStorage.getItem("highscore")) ? (highScore = localStorage.getItem("highscore")) : (localStorage.setItem("highscore",highScore));
    
      (localStorage.getItem("score")) ? (score = parseInt( localStorage.getItem("score"),10) ) : (localStorage.setItem("score",score));
    
    var scoreArray = new Array();
    
    var states=new Array();

    var max = 2;
    var winning_tile = 2048;
    var tileList;
    var newGame;
    var checkingGameover = 0;
    
    var cssMap = {
        2: "two",
        4: "four",
        8: "eight",
        16: "sixteen",
        32: "three-two",
        64: "six-four",
        128: "one-two-eight",
        256: "two-five-six",
        512: "five-one-two",
        1024: "one-zero-two-four",
        2048: "two-zero-four-eight",
        4096: "four-zero-nine-six"};
    
    if(localStorage.getItem("states")){
        
        grid = JSON.parse (localStorage.getItem("states")).splice (0,JSON.parse(localStorage.getItem("states")).length);        
    }
  
    
    function initialise(){
        
    grid = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]];
    prevGrid = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    
    states = [];
    
    scoreArray = new Array;
    
    score=0;
    
    
    localStorage.setItem("score",score);
    highScore = localStorage.getItem("highscore");
    
    
        
    max = 2;
    winning_tile = 2048;

    for(var i=2;i>0;i--){
        var ar = randomPosition();
        grid[ar[0]][ar[1]] = randomNumber();
    }
        
    localStorage.setItem("states",JSON.stringify(copier()));
    
    document.getElementById('info').style.display = 'none';
    document.getElementById("gameover").style.display = "none";
    document.getElementById("finish").style.display = "none";
    reDraw();
    }
    
        
    function REFRESH(){
    // Don't use if(JSON.parse(localStorage.getItem("states"))) as if condition because it works incorrectly.. There might be some different working of JSON.parse
        
    if(!localStorage.getItem("states"))
        grid = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]];
    prevGrid = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    
    states = [];
    scoreArray = [];
    if(localStorage.getItem("score")){
        score = parseInt( localStorage.getItem("score"),10);
    }
    highScore = localStorage.getItem("highscore");
        
    max = 2;
    winning_tile = 2048;
    
    if(!localStorage.getItem("states")){
        for(var i=2;i>0;i--){
            var ar = randomPosition();
            grid[ar[0]][ar[1]] = randomNumber();
        }   
    }
        
    localStorage.setItem("states",JSON.stringify(copier()));
        
    document.getElementById("gameover").style.display = "none";
    document.getElementById("finish").style.display = "none";
    reDraw();
    }
    
    function prevState(){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            prevGrid[i][j] = grid[i][j];
        }
    }
    }
    
    function isMovePossible() {
    var temp = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            temp[i][j] = grid[i][j];   
        }
    }
    checkingGameover = 1;
    moveLeft();
    if(!isSame()){
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                grid[i][j] = temp[i][j];   
            }
        }
        return true;
    }
    
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            grid[i][j] = temp[i][j];   
        }
    }
    checkingGameover = 1;
    moveUp();
    if(!isSame()){
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                grid[i][j] = temp[i][j];   
            }
        }
        return true;
    }
    
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            grid[i][j] = temp[i][j];   
        }
    }
    checkingGameover = 1;
    moveRight();
    if(!isSame()){
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                grid[i][j] = temp[i][j];   
            }
        }
        return true;
    }
    
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            grid[i][j] = temp[i][j];   
        }
    }
    checkingGameover = 1;
    moveDown();
    if(!isSame()){
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                grid[i][j] = temp[i][j];   
            }
        }
        return true;
    }
    
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            grid[i][j] = temp[i][j];   
        }
    }
return false;
}

    /*
    function isMovePossible(){
        for(var i=0; i<4;i++){
            for(var j=0;j<4;j++){
                if((i>0&&i<3)&&(j>0&&j<3)){
                    if((grid[i][j]===grid[i-1][j]) || (grid[i][j]===grid[i+1][j]) || (grid[i][j]===grid[i][j-1]) || (grid[i][j]===grid[i][j+1])){
                    return true;   
                    }
                }
                if(i===0 && j===0){
                    if((grid[i][j]===grid[i+1][j]) || (grid[i][j]===grid[i][j+1]))
                        return true;
                }
                else if (i===0 && j===3){
                    if((grid[i][j]===grid[i][j-1]) || (grid[i][j]===grid[i+1][j]))
                        return true;
                }
                else if (i===3 && j===0){
                    if((grid[i][j]===grid[i-1][j]) || (grid[i][j]===grid[i][j+1]))
                        return true;
                }
                else if (i===3 && j===3) {
                    if((grid[i][j]===grid[i-1][j]) || (grid[i][j]===grid[i][j-1]))
                        return true;   
                }
                else {
                    if(i===0 && (j>0 && j<3)){
                        if((grid[i][j]===grid[i][j-1]) || (grid[i][j]===grid[i][j+1]))
                            return true;
                    }
                    else if (i===3 && (j>0 && j<3)) {
                        if((grid[i][j]===grid[i][j-1]) || (grid[i][j]===grid[i][j+1]))
                            return true; 
                    }
                    else if (j===3 && (i>0 && i<3)) {
                        if((grid[i][j]===grid[i-1][j]) || (grid[i][j]===grid[i+1][j]))
                            return true; 
                    }
                    else {
                        if((grid[i][j]===grid[i-1][j]) || (grid[i][j]===grid[i+1][j]))
                            return true;
                    }
                }
            }
        }
    return false;
    }*/

    function gameOver(){
        if(isMovePossible())
            return;
        
        document.getElementById("gameover").style.display = "block";
       // states = [];
    //    localStorage.setItem("states",JSON.stringify(states));
        
    }
    
    function hasWon() {
        if(max === winning_tile){
            document.getElementById("finish").style.display = "block";
        }
    }
    
    function continuE(){
        winning_tile *= 2;
        document.getElementById("finish").style.display = "none";
    }
    
    function copier() {
        var temp=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                temp[i][j] = grid[i][j];
            }
        }
        return temp;
    }
    
    function undoSaver(){
        
        
        if (states.length < 5){    
            states[states.length] = copier();
        }
        if(states.length === 5){
            states.shift();
            states.push(copier());
        //    states[states.length - 1] = copier();
        }
        //console.log(states);
    }
    
    function undo(){
        
        if(!states[0]){
            return;
        }
        
        
        var prev = states[states.length - 1];
        states.pop();
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                grid[i][j] = prev[i][j];
            }
        }
        if(scoreArray.length !== 0){
            score = scoreArray[scoreArray.length - 1];
             scoreArray.pop();
        }
        
    }
  
    
   /*
    function undo(){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            grid[i][j] = prevGrid[i][j];
        }
    }
return;
}*/
    
    function isSame(){
        var zCount = 0;
    
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                if(grid[i][j]!=prevGrid[i][j])
                    return false;
                if(!grid[i][j])
                    zCount++;
            }
        }
        if(zCount==16)
            return false;

    return true;
    }
    
    function randomNumber () {
        return ( Math.floor(Math.random() * 10) < 8 ? 2 : 4 );
    }
    
    function randomPosition () {
                var flag = 0;
        for(var a=0;a<4;a++){
            for(var b=0;b<4;b++){
                if(grid[a][b] === 0){
                    flag = 1;
                    break;
                }
            }
            if(flag === 1){
                break;
            }
        }
        if (flag===0)
            return [ -1, -1 ];
        
        if(isSame()){
            return [grid.length + 1,grid.length + 1];
        }
        while(1){
            var i = Math.floor(Math.random() * 4);
            var j = Math.floor(Math.random() * 4);
            if(grid[i][j] === 0){
                return [i,j]; 
            }
        }
    }
    
    function moveLeft () {
        var i,j,k;
    
        for(i=0;i<4;i++){
            
            for(j=1;j<4;j++){
                if(grid[i][j] !== 0){
                    for(k=j ; k>0 && grid[i][k-1] === 0 ; k--) {
                        grid[i][k-1] = grid[i][k];
                        grid[i][k] = 0;
                    }
                }
            }
            
            for(j=1;j<4;j++){
                if(grid[i][j] !== 0){
                    if(grid[i][j] === grid[i][j-1]){
                        
                        if(max < grid[i][j]*2){
                            max = grid[i][j] * 2;   
                        }
                        
                        grid[i][j-1] *= 2;
                        grid[i][j] = 0;
                        if(checkingGameover===0)
                            score += grid[i][j-1];
                        checkingGameover = 0;
                    }
                }
            }
            
            for(j=1;j<4;j++){
                if(grid[i][j] !== 0) {
                    for(k=j ; k>0 && grid[i][k-1] === 0 ; k--) {
                        grid[i][k-1] = grid[i][k];
                        grid[i][k] = 0;
                    }
                }
            }
        }

    }
    function moveUp () {  
        var i,j,k;
    
        for(j=0;j<4;j++){
            
            for(i=1;i<4;i++){
                if(grid[i][j] !== 0){
                    for(k=i; k>0 && grid[k-1][j] === 0 ; k--) {
                        grid[k-1][j] = grid[k][j];
                        grid[k][j] = 0;
                    }
                }
            }
            
            for(i=1;i<4;i++){
                if(grid[i][j] !== 0){
                    if(grid[i][j] === grid[i-1][j]){
                        
                        if(max < grid[i][j]*2){
                            max = grid[i][j] * 2;   
                        }
                        
                        grid[i-1][j] *= 2;
                        grid[i][j] = 0;
                        if(checkingGameover===0)
                            score += grid[i-1][j];
                        checkingGameover = 0;
                    }
                }
            }
            
            for(i=1;i<4;i++){
                if(grid[i][j] !== 0){
                    for(k=i; k>0 && grid[k-1][j] === 0; k--) {
                        grid[k-1][j] = grid[k][j];
                        grid[k][j] = 0;
                    }
                }
            }
        }

    }
    function moveRight () {
        var i,j,k;
    
        for(i=0;i<4;i++){
            
            for(j=2;j>=0;j--){
                if(grid[i][j] !== 0){
                    for(k=j ; k<3 && grid[i][k+1] === 0 ; k++) {
                        grid[i][k+1] = grid[i][k];
                        grid[i][k] = 0;
                    }
                }
            }
            
            for(j=2;j>=0;j--){
                if(grid[i][j] !== 0){
                    if(grid[i][j] === grid[i][j+1]){
                        
                        if(max < grid[i][j]*2){
                            max = grid[i][j] * 2;   
                        }
                        
                        grid[i][j+1] *= 2;
                        grid[i][j] = 0;
                        if(checkingGameover===0)
                            score += grid[i][j+1];
                        checkingGameover = 0;
                    }
                }
            }
            
            for(j=2;j>=0;j--){
                if(grid[i][j] !== 0){
                    for(k=j ; k<3 && grid[i][k+1] === 0 ; k++){
                        grid[i][k+1] = grid[i][k];
                        grid[i][k] = 0;
                    }
                }
            }
        }
    
    }
    function moveDown () {
        var i,j,k;
    
        for(j=0;j<4;j++){
            
            for(i=2 ; i>=0 ; i--) {
                if(grid[i][j] !== 0){
                    for(k=i ; k<3 && grid[k+1][j] === 0 ; k++) {
                        
                        grid[k+1][j] = grid[k][j];
                        grid[k][j] = 0;
                    }
                }
            }
            
            for(i=2;i>=0;i--){
                if(grid[i][j] !== 0) {
                    if(grid[i][j] === grid[i+1][j]){
                        
                        if(max < grid[i][j]*2){
                            max = grid[i][j] * 2;   
                        }
                        
                        grid[i+1][j] *= 2;
                        grid[i][j] = 0;
                        if(checkingGameover===0)
                            score += grid[i+1][j];
                        checkingGameover = 0;
                    }
                }
            }
            
            for(i=2;i>=0;i--){
                if(grid[i][j] !== 0){
                    for(k=i ; k<3 && grid[k+1][j]===0 ; k++) {
                        
                        grid[k+1][j] = grid[k][j];
                        grid[k][j] = 0;
                    }
                }
            }
            
            
        }
   
    }
    
    function setHighScore(){
        highScore = score;
        localStorage.setItem("highscore",highScore);
    }
    
    function setScore(){
        
        
        if(scoreArray.length < 5){
            scoreArray[scoreArray.length] = score;
        }
        if(scoreArray.length === 5){
            scoreArray.shift();
            scoreArray.push(score); 
        }
        
    }
    
    function reDraw () {
        for(var i=0; i<grid.length;i++){
            for(var j=0; j<grid[i].length; j++){
                var tile = tileList[i*grid[0].length + j];
                
                if(grid[i][j] !== 0) {
                    tile.setAttribute("class","tile " + cssMap[grid[i][j]]); }
                else {
                    tile.setAttribute("class","tile");
                    }
                
            }
        }
        document.querySelector("#score div").innerHTML = score;
        document.querySelector("#best div").innerHTML = localStorage.getItem("highscore");
    }
    
    function changeCursor(){
        this.style.cursor = "pointer";
    }
    
    
    function move(e) {
        var flag=0;
        
        switch(e.keyCode){
            case 37:
            case 65:
                prevState();
                undoSaver();
                setScore();
                moveLeft();
                
                break;
                
            case 38:
            case 87:
                prevState();
                undoSaver();
                setScore();
                moveUp();
                
                break;
                
            case 39:
            case 68:
                prevState();
                undoSaver();
                setScore();
                moveRight();
                
                break;
                
            case 40:
            case 83:
                prevState();
                undoSaver();
                setScore();
                moveDown();
                        
                
                break;
                
        /*    case 82:
                initialise();
                flag = 1;
                break;*/
                
            case 85:
                undo();
                flag = 1;
                break;
            
            default:
                return;
        }
        localStorage.setItem("score",score);
        
        if(flag==0){
            
            var ar = randomPosition();
            if(ar[0] === grid.length + 1) {
                return;      
            } else if(ar[0] !== -1) {
                grid[ar[0]][ar[1]] = randomNumber();   
            } else {
                gameOver();
            }
        }
        flag = 0;
        localStorage.setItem("states",JSON.stringify(copier()));
        
        if(highScore <= score)
            setHighScore();
        
        hasWon();
        reDraw();
    }

    return {
        init: function () {
            tileList = document.querySelectorAll(".tile");
            REFRESH();
            
            window.addEventListener('keydown',move);
            newGame = document.getElementsByClassName("restart");    
            for(var i =0;i<newGame.length;i++){
                newGame[i].addEventListener('click',initialise);
                newGame[i].addEventListener('mouseover',changeCursor);
            }     
            document.getElementById("continue").addEventListener('mouseover',changeCursor); document.getElementById("continue").addEventListener('click',continuE);
            
            document.getElementById("start-info").addEventListener('click', function (e) {
                document.getElementById('info').style.display = 'block';
            });
            document.getElementById("exit-info").addEventListener('click', function (e) {
                document.getElementById('info').style.display = 'none';
            });
        }
    };
    
} ) ();
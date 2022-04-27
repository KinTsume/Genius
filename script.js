//Get color divs
let blue = document.querySelector('.blue');
let green = document.querySelector('.green');
let red = document.querySelector('.red');
let yellow = document.querySelector('.yellow');

//Get audio
let blueAudio = document.querySelector('#audio-blue');
let greenAudio = document.querySelector('#audio-green');
let redAudio = document.querySelector('#audio-red');
let yellowAudio = document.querySelector('#audio-yellow');

let speed = 1;

let order = [];
let playerOrder = [];

let playerClickCount = 0;

let intervals = [];

let time = 1000;

let stopAllIntervals = () => {
    for(inter in intervals){
        clearInterval(inter);
        
    }

    intervals = [];
}

/*---------------------- Game main functions -------------------------------*/

//Add a random color to the order array
let addShuffledColor = () => {
    order.push(Math.floor(Math.random() * 4));
}

//Show the order to click
let showOrder = () => {
    let i = 0;

    let verifyColor = () =>{

        selectColor(order[i]);
        audioFadeIn(order[i]);
        

        //remove the color in 'time' miliseconds
        setTimeout(() => {
            removeSelected(order[i]);
            audioFadeOut(order[i]);
            i++;
            if(i < order.length){
                setTimeout(() => {
                    //Keep executing the function through the order array
                    verifyColor();
                }, time / 2);
                
            } else {
                setTimeout(() => {
                    toggleMode(false);
                }, time);                
            }
        }, time / 2);
        
    }

    //Execute the function for the first time
    verifyColor();
}

let verifyOrder = (clickCount) => {
    //Verify if the last item in playerOrder is equal to the last in order

    if(playerOrder[clickCount] != order[clickCount]){
        console.log(order);
        console.log(playerOrder);
        console.log('Wrong');
        return false
    } 
    console.log('Right');
    return true;
}

let levelUp = () => {
    playerClickCount = 0;
    playerOrder = [];
    toggleMode(true);
    time *= speed;
}

/*------------------ Select color functions -------------------*/

let removeSelected = (num) => {
    let currentColor;

    switch(num){
        case 0:
            currentColor = blue;
            break;

        case 1:
            currentColor = green;
            break;

        case 2:
            currentColor = red;
            break;

        case 3:
            currentColor = yellow;
            break;
    }
    currentColor.classList.remove('selected');
}

let selectColor = (num) => {

    let currentColor;

    switch(num){
        case 0:
            currentColor = blue;
            break;

        case 1:
            currentColor = green;
            break;

        case 2:
            currentColor = red;
            break;

        case 3:
            currentColor = yellow;
            break;
    }
    currentColor.classList.add('selected');
}


/*----------------- Audio related functions -----------------*/

let audioFadeIn = (audioIndex) => {
    let currentAudio = selectAudio(audioIndex);
    stopAllAudios();
    currentAudio.volume = 0;
    currentAudio.play();

    fadein = setInterval(() => {

        stopAllIntervals();
        intervals.push(fadein);

        if(currentAudio.volume > .5){
            clearInterval(fadein);
        }   else {
            currentAudio.volume += .01;
        }
    }, 1);
}

let audioFadeOut = (audioIndex) => {

    let Audio = selectAudio(audioIndex);
    Audio.volume = .5;

    fadeout = setInterval(() => {

        stopAllIntervals();
        intervals.push(fadeout);

        if(Audio.volume < .1){
            Audio.pause();
            Audio.volume = 0;
            Audio.currentTime = 0;
            clearInterval(fadeout);
        } else {
            Audio.volume -= .01;
        }
    }, 1);
}

let selectAudio = (index) => {
    let audioElement;
    switch(index){
        case 0:
            audioElement = blueAudio;
            break;

        case 1:
            audioElement = greenAudio;
            break;

        case 2:
            audioElement = redAudio;
            break;

        case 3:
            audioElement = yellowAudio;
            break;
    }

    return audioElement;
}

let stopAllAudios = () => {
    blueAudio.pause()
    blueAudio.currentTime = 0;

    greenAudio.pause()
    greenAudio.currentTime = 0;

    redAudio.pause()
    redAudio.currentTime = 0;

    yellowAudio.pause()
    yellowAudio.currentTime = 0;
}

/*------------ Toggle the show order mode and the player mode ------------ */

let toggleMode = (autoMode) => {

    const div = document.querySelector('.toggle-mode');
    const text = div.querySelector('p');

    div.classList.remove('hidden');

    if(autoMode){
        text.innerText = 'Attention!';
        disableButtons();
        setTimeout(() => {
            div.classList.add('hidden');
            setTimeout(() => {
                addShuffledColor();
                showOrder();
            }, 1000)
            
        }, 1000)
    } else {
        text.innerText = 'Your turn!';
        setTimeout(() => {
            div.classList.add('hidden');
            enableButtons();
        }, 1000)
    }
    
}

/*---------------- Player functions ---------------*/

function blueClickHandler(){
    playerClick(0);
}

function greenClickHandler(){
    playerClick(1);
}

function redClickHandler(){
    playerClick(2);
}

function yellowClickHandler(){
    playerClick(3);
}

let enableButtons = () => {
    blue.addEventListener('click', blueClickHandler);
    green.addEventListener('click', greenClickHandler);
    red.addEventListener('click', redClickHandler);
    yellow.addEventListener('click', yellowClickHandler);
}

let disableButtons = () => {
    blue.removeEventListener('click', blueClickHandler);
    green.removeEventListener('click', greenClickHandler);
    red.removeEventListener('click', redClickHandler);
    yellow.removeEventListener('click', yellowClickHandler);
}

let playerClick = (num) => {

    playerOrder.push(num);
    console.log('clicked');

    if(!verifyOrder(playerClickCount)){
        gameOver();

    } else {
        stopAllIntervals();
        audioFadeIn(num);
        selectColor(num);

        setTimeout(() => {

            audioFadeOut(num);
            removeSelected(num);
            playerClickCount++;
            if(playerClickCount === order.length){
                levelUp();          
            }

        }, time / 2);
    }   
}

/*--------------- Game state functions --------------*/

function start(){
    document.querySelector('.menu').classList.add('hidden');
    document.querySelector('.game-over').classList.add('hidden');
    toggleMode(true);
}

//Not implemented
function startHard(){
    speed = .8;
    start();
}

let gameOver = () => {
    order = [];
    playerOrder = [];
    playerClickCount = 0;

    speed = 1;
    disableButtons();

    document.querySelector('.game-over').classList.remove('hidden');
}

let goToMenu = () => {
    document.querySelector('.menu').classList.remove('hidden');
    document.querySelector('.game-over').classList.add('hidden');
}

document.querySelector('#start').addEventListener('click', start);
document.querySelector('#menu-button').addEventListener('click', goToMenu);

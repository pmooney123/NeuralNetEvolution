var currentFPS = 0;
var paused = true;
var runningSim = true;

var maxSimSteps = 200; //auto pause at here
var currentSimStep = 0; //simstep #
var roundLength = 300; //how many steps in a round
var currentRound = 0;
var maxRounds = 100;
var popSize = 100; //number of organisms
var geneticLength = 4; //number of genes
var innerNeurons = 1; //number of inner neurons

var mapWidth = 200;
var mapHeight = 200;
var tileMap; //holds map info

var popArray = []; //holds all organisms

var mostCommonGene = "default";
var survivalRate = 0;

const canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const statsButton = document.getElementById('stats-button');
const statsText = document.getElementById('stats');
startButton.addEventListener("click", function() {
             resetSim();
           });
pauseButton.addEventListener("click", function() {
                paused = !paused;
           });
statsButton.addEventListener("click", function() {
                console.log(popArray[0].getConnectionText());
           });
function startNewSim() {
    for (let i = 0; i < popSize; i++) {
        popArray.push(new Organism(geneticLength, innerNeurons));
    }
    animate();
}
function getRandomSurvivor() {
    let count = 0;
    for (let i = getRandomInt(popArray.length); count < 1000; i = getRandomInt(popArray.length)) {
        count++;
        if (popArray[i].reproduce) {
            return popArray[i];
        }
    }
}
function setReproduced() {
    for (let i = 0; i < popArray.length; i++) {
        if (popArray[i].x > mapWidth * 0.90) {
            popArray[i].reproduce = true;
        }
    }
}
function createNewGeneration() {
    let oldPopArray = popArray;
    let newPopArray = [];

    let numSurvived = 0;
    for (let i = 0; i < popArray.length; i++) {
        if (popArray[i].reproduce) {
            numSurvived++;
        }
    }
    survivalRate = 100 * numSurvived/popArray.length;

    while (newPopArray.length < popSize) {
        let parent1 = getRandomSurvivor();
        //console.log(parent1);
        let parent2 = getRandomSurvivor();
        //console.log('here');
        let newOrg = new Organism(geneticLength, innerNeurons, parent1);
        newPopArray.push(newOrg)
    }
    popArray = newPopArray;

}
function advanceSim() {
    if (currentSimStep < maxSimSteps) {
        currentSimStep++;
        ctx.clearRect(0,0,mapWidth * 2,mapHeight * 2);
        for (let i = 0; i < popArray.length; i++) {
            popArray[i].update();
            popArray[i].draw(ctx);
        }
        ctx.fillStyle = 'rgba(0,200,0,0.5)';
        ctx.fillRect(mapWidth * 0.90, 0, mapWidth * 0.1 + 2, mapHeight);
    } else {
        if (currentRound < maxRounds) {
            currentRound++;
            currentSimStep = 0;
            setReproduced();
            createNewGeneration();
        }
    }
}
function resetSim() {
    currentRound = 0;
    currentSimStep = 0;
    popArray = [];
    for (let i = 0; i < popSize; i++) {
        popArray.push(new Organism(geneticLength, innerNeurons));
    }
}
function animate() {
    if (runningSim) {
        if (!paused) {
            //console.log('advancing sim');
            advanceSim();
        }
    } else {

    }
    statsText.innerText = "STATS: \n Paused: " + paused + " \n Running: " + runningSim + " \n Step: " + currentSimStep + "/" + maxSimSteps + " \n Round: " + currentRound + "/" + maxRounds + " \n Survival%: " + survivalRate;


    requestAnimationFrame(animate);
}
startNewSim();






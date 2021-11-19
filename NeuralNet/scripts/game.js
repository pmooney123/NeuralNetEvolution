var currentFPS = 0;
var paused = false;
var runningSim = true;

var maxSimSteps = 200; //auto pause at here
var currentSimStep = 0; //simstep #
var roundLength = 250; //how many steps in a round
var currentRound = 0;
var maxRounds = 200;
var mutationRatio = 1000000;
var popSize = 500; //number of organisms
var geneticLength = 6; //number of genes
var innerNeurons = 1; //number of inner neurons

var mapWidth = 200;
var mapHeight = 200;
var tileMap; //holds map info

var popArray = []; //holds all organisms

var mostCommonGene = "default";
var survivalRate = 0;

const canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
const canvas2 = document.getElementById('canvas2');
var ctx2 = canvas2.getContext('2d');

const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const mutateButton = document.getElementById('mutate');

const statsButton = document.getElementById('stats-button');
const statsText = document.getElementById('stats');
mutateButton.addEventListener("click", function() {
             mutationRatio *= 0.1;
           });
startButton.addEventListener("click", function() {
             resetSim();
           });
pauseButton.addEventListener("click", function() {
                paused = !paused;
           });
statsButton.addEventListener("click", function() {
                console.log(popArray[0].getConnectionText());
                drawBrain();
           });
function drawBrain() {
    ctx2.clearRect(0, 0, 1000, 1000);
    ctx2.fillStyle = 'white';
    ctx2.fillRect(0,0,200,200);
    let organism = popArray[0];

    //draw sensors
    let x = 5;
    let startx = x;
    let y = 5;
    let dx = 40;
    let maxx = 300;
    let dy = 40;
    for (let i = 0; i < organism.sensors.length; i++){
        ctx2.fillStyle = 'blue';
        ctx2.fillRect(x, y, 20, 20);
        organism.sensors[i].x = x;
        organism.sensors[i].y = y;
        ctx2.font = '14px serif';
        ctx2.fillStyle = 'black';
        ctx2.fillText(organism.sensors[i].getCode(), x, y + 15);

        x += dx;
        if (x > maxx) {
            x = startx;
            y += dy;
        }
    }

    //draw inner neurons
    x = 5;
    startx = x;
    y += 60;
    for (let i = 0; i < organism.neurons.length; i++){
        ctx2.fillStyle = 'pink';
        ctx2.fillRect(x, y, 20, 20);
        organism.neurons[i].x = x;
        organism.neurons[i].y = y;
        ctx2.font = '14px serif';
        ctx2.fillStyle = 'black';
        ctx2.fillText(organism.neurons[i].getCode(), x, y + 15);
        x += dx;
        if (x > maxx) {
            x = startx;
            y += dy;
        }
    }


    //draw action outputs
    x = 5;
    startx = x;
    y += 60;
    for (let i = 0; i < organism.actions.length; i++){
        ctx2.fillStyle = 'red';
        ctx2.fillRect(x, y, 20, 20);
        organism.actions[i].x = x;
        organism.actions[i].y = y;
        ctx2.font = '14px serif';
        ctx2.fillStyle = 'black';
        ctx2.fillText(organism.actions[i].getCode(), x, y + 15);

        x += dx;
        if (x > maxx) {
            x = startx;
            y += dy;
        }


    }


    //draw connections
    for (let i = 0; i < organism.connections.length; i++) {
        if (organism.connections[i].multiplier >= 0) {
            ctx2.strokeStyle = 'green';
        } else {
            ctx2.strokeStyle = 'red';
        }
        ctx2.lineWidth = Math.abs(organism.connections[i].multiplier);

        ctx2.beginPath();       // Start a new path
        ctx2.moveTo(organism.connections[i].sensor.x, organism.connections[i].sensor.y);    // Move the pen to (30, 50)
        ctx2.lineTo(organism.connections[i].output.x, organism.connections[i].output.y);  // Draw a line to (150, 100)
        ctx2.stroke();
    }

}
function startNewSim() {
    for (let i = 0; i < popSize; i++) {
        popArray.push(new Organism(geneticLength, innerNeurons));
    }
    animate();
}
function getRandomSurvivor() {
    let count = 0;
    for (let i = getRandomInt(popArray.length); count < 10000; i = getRandomInt(popArray.length)) {
        count++;
        if (popArray[i].reproduce) {
            return popArray[i];
        }
    }
}
function setReproduced() {
    for (let i = 0; i < popArray.length; i++) {
        if (popArray[i].x > mapWidth * 0.80) {
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
    for (let i = 0; i < popArray.length; i++) {
        if (popArray[i].reproduce) {
            let parent1 = getRandomSurvivor();
            //console.log(parent1);
            let parent2 = getRandomSurvivor();
            //console.log('here');
            let newOrg = new Organism(geneticLength, innerNeurons, parent1);
            newPopArray.push(newOrg);
        }
    }
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
        ctx.fillRect(mapWidth * 0.80, 0, mapWidth * 0.2 + 2, mapHeight);
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
    statsText.innerText = "STATS: \n Paused: " + paused + " \n Running: " + runningSim + " \n Step: " + currentSimStep + "/" + maxSimSteps + " \n Round: " + currentRound + "/" + maxRounds + " \n Survival%: " + survivalRate+ " \n Mutation%: " + 1/mutationRatio;


    requestAnimationFrame(animate);
}
startNewSim();






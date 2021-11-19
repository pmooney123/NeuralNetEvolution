class Organism {
    constructor(numGenes, numInnerNeurons, parent1) {
        //stats
        this.reproduce = false;
        this.x = getRandomInt(mapWidth);
        this.y = getRandomInt(mapHeight);
        this.size = 2;

        if (parent1 != null ) {
            //console.log('parent not null, using parent')
            this.color = parent1.color;
            //setGenome
            this.genes = [];
            for (let x = 0; x < numGenes; x++) {
                this.genes.push(parent1.genes[x]);
            }
        } else {
            //console.log('parent null, not using parent')
            this.color = "rgb(" + getRandomInt(255) + ", " + getRandomInt(255) + ", " + getRandomInt(255) + ")";
            //setGenome
            this.genes = [];
            for (let x = 0; x < numGenes; x++) {
                this.genes.push(getRandomNumGene());
            }
        }


        this.logGenome();

        //set Neural Chemistry
        this.sensors = [];
        this.sensors.push(new OscillatorSensor());
        this.sensors.push(new AgeSensor());
        this.sensors.push(new XAxisSensor());
        this.sensors.push(new YAxisSensor());
        this.sensors.push(new RandomSensor());

        this.neurons = [];
        for (let i = 0; i < numInnerNeurons; i++) {
            this.neurons.push(new InnerNeuron());
        }

        this.actions = [];
        this.actions.push(new XAxisAction());
        this.actions.push(new YAxisAction());
        this.actions.push(new RandomAction());

        this.inputs = []; //all possible sources for connection
        for (let i = 0; i < this.neurons.length; i++) {
            this.inputs.push(this.neurons[i]);
        }
        for (let i = 0; i < this.sensors.length; i++) {
            this.inputs.push(this.sensors[i]);
        }

        this.outputs = []; //all possible outputs for connection
        for (let i = 0; i < this.neurons.length; i++) {
            this.outputs.push(this.neurons[i]);
        }
        for (let i = 0; i < this.actions.length; i++) {
            this.outputs.push(this.actions[i]);
        }

        this.connections = [];
        for (let i = 0; i < this.genes.length; i++) {
            let newConnection = new Connection();
            let gene = this.genes[i];
            if (gene.substring(0,1) < this.inputs.length) {
                newConnection.sensor = this.inputs[gene.substring(0,1)];
            } else {
                newConnection.sensor = this.inputs[0];
            }
            if (gene.substring(1,2) < 8) {
                newConnection.multiplier = gene.substring(1,2) - 4;
            } else {
                newConnection.multiplier = 1;
            }
            if (gene.substring(2,3) < this.outputs.length) {
                newConnection.output = this.outputs[gene.substring(2,3)];
            } else {
                newConnection.output = this.outputs[getRandomInt(this.outputs.length)];
            }
            this.connections.push(newConnection);
        }
        for (let i = 0; i < this.connections.length; i++) {
            //console.log(this.connections[i].sensor.getName() + " connects to " + this.connections[i].output.getName() + " (x" + this.connections[i].multiplier + ")")
        }

    }
    update() {
        //clear inputs
        for (let i = 0; i < this.connections.length; i++) {
            this.connections[i].inputs = [];
            this.connections[i].input = 0;
        }

        //apply all sensor neuron connections
        for (let i = 0; i < this.connections.length; i++) {
            if (this.connections[i].sensor.isSensor == true) {
                let value = this.connections[i].sensor.getOutputRaw(this) * this.connections[i].multiplier;
                this.connections[i].output.inputs.push(value);
                //console.log(this.connections[i].sensor.getName() + " reports " + value + " to " + this.connections[i].output.getName());
            }
        }
        //sum all inputs so inner neurons are updated
        for (let i = 0; i < this.outputs.length; i++) {
            this.outputs[i].sum();
        }
        //get inner neuron outputs on other inner neurons
        for (let i = 0; i < this.connections.length; i++) {
            if (this.connections[i].sensor.isSensor == false && this.connections[i].output.isAction == false) {
                let value = this.connections[i].sensor.getOutputRaw(this) * this.connections[i].multiplier;
                this.connections[i].output.inputs.push(value);
                //console.log(this.connections[i].sensor.getName() + " reports " + value + " to " + this.connections[i].output.getName());
            }
        }

        //sum all
        for (let i = 0; i < this.outputs.length; i++) {
            this.outputs[i].sum();
        }

        //apply all inner neurons on action outputs
        for (let i = 0; i < this.connections.length; i++) {
            if (this.connections[i].sensor.isSensor == false && this.connections[i].output.isAction == false) {
                let value = this.connections[i].sensor.getOutputRaw(this) * this.connections[i].multiplier;
                this.connections[i].output.inputs.push(value);
                //console.log(this.connections[i].sensor.getName() + " reports " + value + " to " + this.connections[i].output.getName());
            }
        }

        //sum all and execute
        for (let i = 0; i < this.outputs.length; i++) {
            this.outputs[i].sum();
            if (this.outputs[i].isAction == true) {
                this.outputs[i].perform(this);
            }
        }


    }
    logGenome() {
        let text = "GENOME: ";
        for (let i = 0; i < this.genes.length; i++) {
            text = text.concat(" " + this.genes[i]);
        }
        //console.log(text);
    }
    randomizeGenome() {

    }
    getConnectionText() {
        let text = "";
        for (let i = 0; i < this.connections.length; i++) {
            text = text.concat("\n " + this.connections[i].getText());
        }
        return text;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    move(x, y) {
        this.x += x;
        this.y += y;
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x > mapWidth) {
            this.x = mapWidth;
        }
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y > mapHeight) {
            this.y = mapHeight;
        }
    }
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function getRandomNumGene() {

    let newGene = '';
    newGene = newGene.concat(getRandomInt(5));
    newGene = newGene.concat(getRandomInt(8));
    newGene = newGene.concat(getRandomInt(10));
    return newGene;
}
function getRandomGene() {
    let alphabet = 'abcdefghijklmnoqrstuvwxyz1234567890';

    let newGene = '';
    let newLetter = '';
    let geneSize = 3;
    for (let i = 0; i < geneSize; i++) {
        let index = getRandomInt(alphabet.length);
        newLetter = alphabet.substring(index, index + 1);
        newGene = newGene.concat(newLetter);
    }
    return newGene;
}
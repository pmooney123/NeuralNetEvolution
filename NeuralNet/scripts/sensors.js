class OscillatorSensor {
    constructor() {
        this.isSensor = true;
    }
    getOutputRaw(organism) {
        return Math.sin(currentSimStep);
    }
    getName() {
        return 'Oscillator Sensor';
    }
}
class AgeSensor {
    constructor() {
        this.isSensor = true;

    }
    getOutputRaw(organism) {
        return currentSimStep/maxSimSteps;
    }
    getName() {
        return 'Age Sensor';
    }
}
class XAxisSensor {
    constructor() {
        this.isSensor = true;

    }
    getOutputRaw(organism) {
        return organism.x/mapWidth;
    }
    getName() {
        return 'X-Axis Sensor';
    }
}
class YAxisSensor {
    constructor() {
        this.isSensor = true;

    }
    getOutputRaw(organism) {
        return organism.y/mapHeight;
    }
    getName() {
        return 'Y-Axis Sensor';
    }
}
class RandomSensor {
    constructor() {
        this.isSensor = true;

    }
    getOutputRaw(organism) {
        return Math.random();
    }
    getName() {
        return 'Random Sensor';
    }
}

class InnerNeuron {
    constructor() {
        this.inputs = [];
        this.id = getRandomInt(100);
        this.input = 0;
        this.isSensor = false;
        this.isAction = false;
    }
    getOutputRaw(organism) {
        //console.log(this.getName() + " has a total input of " + this.input);
        return this.input;
    }
    getName() {
        return 'Inner Neuron ' + this.id;
    }
    sum() {
        let total = 0;
        for (let i = 0; i < this.inputs.length; i++) {
            total += this.inputs[i];
        }
        if (this.inputs.length != 0) {
            total /= this.inputs.length;
        }
        this.input = total;
    }
}

class YAxisAction {
    constructor() {
        this.isAction = true;
        this.inputs = [];
        this.input = 0;
    }
    perform(organism) {

        organism.move(0, this.input);
    }
    getName() {
        return 'YAxis Output';
    }
    sum() {
        let total = 0;
        for (let i = 0; i < this.inputs.length; i++) {
            total += this.inputs[i];
        }
        if (this.inputs.length != 0) {
            total /= this.inputs.length;
        }
        this.input = total;
    }
}
class XAxisAction {
    constructor() {
        this.inputs = [];
        this.input = 0;
        this.isAction = true;
    }
    perform(organism) {
        //console.log(this.getName() + " has a total input of " + this.input);
        organism.move(this.input, 0);
    }
    getName() {
        return 'XAxis Output';
    }
    sum() {
        let total = 0;
        for (let i = 0; i < this.inputs.length; i++) {
            total += this.inputs[i];
        }
        if (this.inputs.length != 0) {
            total /= this.inputs.length;
        }
        this.input = total;
    }
}
class RandomAction {
    constructor() {
        this.inputs = [];
        this.input = 0;
        this.isAction = true;
    }
    perform(organism) {
        //console.log(this.getName() + " has a total input of " + this.input);
        if (Math.random() < 0.5) {
            organism.move(this.input, 0);
        } else {
            organism.move(0, this.input);
        }
    }
    getName() {
        return 'Random Output';
    }
    sum() {
        let total = 0;
        for (let i = 0; i < this.inputs.length; i++) {
            total += this.inputs[i];
        }
        if (this.inputs.length != 0) {
            total /= this.inputs.length;
        }
        this.input = total;
    }
}

class Connection {
    constructor() {
        this.sensor;
        this.output;
        this.multiplier = getRandomInt(8) - 4;

    }
    getText() {
        let verb = 'is connected to';
        if (this.multiplier > 0) {
            verb = 'stimulates';
            if (this.multiplier > 2) {
                verb = 'strongly stimulates';
            }
        } else {
            verb = 'inhibits';
            if (this.multiplier < -2) {
                verb = 'strongly inhibits';
            }
        }

        let text = this.sensor.getName() + " " + verb + " " + this.output.getName();

        return text;
    }
}

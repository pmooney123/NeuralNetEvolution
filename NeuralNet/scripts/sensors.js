class OscillatorSensor {
    constructor() {
        this.isSensor = true;
    }
    getCode() {
        return 'Osc'
    }
    getOutputRaw(organism) {
        return Math.sin(currentSimStep);
    }
    getName() {
        return 'Oscillator Sensor';
    }
} //OS
class AgeSensor {
    constructor() {
        this.isSensor = true;

    }
    getOutputRaw(organism) {
        return currentSimStep/maxSimSteps;
    }
    getCode() {
        return 'Age'
    }
    getName() {
        return 'Age Sensor';
    }
} //AG
class XAxisSensor {
    constructor() {
        this.isSensor = true;

    }
    getOutputRaw(organism) {
        //console.log(((organism.x - (mapWidth/2))/mapWidth));
        return ((organism.x - (mapWidth/2))/mapWidth);
    }
    getCode() {
        return '+XS'
    }
    getName() {
        return 'X-Axis Sensor';
    }
} //XA
class YAxisSensor {
    constructor() {
        this.isSensor = true;

    }
    getOutputRaw(organism) {
        return ((organism.y - (mapHeight/2))/mapHeight);
    }
    getCode() {
        return '+YS'
    }
    getName() {
        return 'Y-Axis Sensor';
    }
} //YA
class RandomSensor {
    constructor() {
        this.isSensor = true;

    }
    getOutputRaw(organism) {
        return Math.random() - 0.5;
    }
    getCode() {
        return 'RS'
    }
    getName() {
        return 'Random Sensor';
    }
} //RS

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
    getCode() {
        return this.id;
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
    getCode() {
        return 'Ya'
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
} //YA
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
    getCode() {
        return 'Xa'
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
} //XA
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
    getCode() {
        return 'Ra'
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
} //RA

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

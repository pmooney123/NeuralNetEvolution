# NeuralNetEvolution

Blue: sensor neuron (SN)- takes an input from the world and outputs -0.5 to 0.5. Can connect to inner neurons, and action neurons.
Pink: inner neuron (IN), can connect to sensors, actions, and any inner neuron (including itself)
Red: action neuron (AN)- takes an input and performs a behaviour

Sensors: Osc (sin wave) (-1.0 to 1.0)
Age (signal increases with age) (currently the only output from 0.0 to 1.0)
+XS (signal increases with distance from middle x) (-0.5 to 0.5)
+YS (signal increases with distance from middle y) (-0.5 to 0.5)
RS (generates a random signal) (-0.5 to 0.5)

Actions: Move x, move y, move random

Connection: can be inhibitory (sends negative signal) or stimulatory (sends postiive signal)
**Inhibitory signals are currently negative, when they should maybe just lower signal towards 0. Or change actions to be a specific direction.

Gene: 3 random ints (EX: 375). Int 1 determines source (any SN or IN), Int 2 determines multiplier, Int 3 determines output neuron (any IN or AN)


TO DO:
Sexual reproduction (currently asexual)
More sensors and actions.
Collission.
Display common genotypes.
Coordinate color to genotype.

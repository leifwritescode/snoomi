import { Genotype } from "./types/Genotype.js"
import { SimulationState } from "./types/SimulationState.js"

// indexed by post id
export type VirtualPet = {
    name: string, // the pets name
    birthdate: Date, // date and time of creation
    age: number, // in ticks
    generation: number, // pet generation 
    genes : Genotype, // genetic make-up of the pet
    state: SimulationState, // current simulation state of the pet
    owner: string, // username
}

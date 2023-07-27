import { makeNewGene } from "./genetics.js";
import { Genotype } from "./types/Genotype.js"
import { SimulationState, SimulationStateName, initialSimulationState } from "./types/SimulationState.js"
import { getRandomNumberInRange } from "./utilities.js"

// indexed by post id
export type VirtualPet = {
    owner: string, // username
    name: string, // the pets name
    birthdate: Date, // date and time of creation
    age: number, // in ticks
    generation: number, // pet generation 
    genes : Genotype, // genetic make-up of the pet
    state: SimulationState, // current simulation state of the pet
}

function r() : number {
    return getRandomNumberInRange(0, 10);
}

export function makeNewVirtualPet(name: string, owner: string) : VirtualPet {
    return {
        owner: owner,
        name: name,
        birthdate: new Date(),
        age: 0,
        generation: 0,
        genes: {
            top: makeNewGene(r),
            bottom: makeNewGene(r),
            hat: makeNewGene(r),
            face: makeNewGene(r),
            leftHand: makeNewGene(r),
            rightHand: makeNewGene(r),
            environment: makeNewGene(r),
            happiness: makeNewGene(r),
            discipline: makeNewGene(r),
            hunger: makeNewGene(r),
            weight: makeNewGene(r),
            intelligence: makeNewGene(r),
            aging: makeNewGene(r),
        },
        state: initialSimulationState()
    }
}
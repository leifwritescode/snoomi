import { makeNewGene } from "./genetics.js";
import { Genotype } from "./types/Genotype.js"
import { SimulationState, initialSimulationState } from "./types/SimulationState.js"
import { getRandomNumberInRange } from "./utilities.js"

/**
 * A virtual pet
 */
export type VirtualPet = {
    /**
     * The owner of the pet
     */
    owner: string,

    /**
     * The name of the pet
     */
    name: string,

    /**
     * The date and time of creation, in milliseconds since the unix epoch
     */
    birthdate: number,

    /**
     * The age of the pet, in days
     */
    age: number, // todo: age can be calculated from birthdate, is there an advantage to storing it explicitly?

    /**
     * The generation of the pet
     */
    generation: number,

    /**
     * The genetics of the pet
     */
    genes : Genotype,

    /**
     * The current state of the pet
     */
    state: SimulationState,
}

function r() : number {
    return getRandomNumberInRange(0, 10);
}

export function makeNewVirtualPet(name: string, owner: string) : VirtualPet {
    return {
        owner: owner,
        name: name,
        birthdate: Date.now(),
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
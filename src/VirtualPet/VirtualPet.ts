import { Genotype, Appearance, newFirstGenerationGenotype, newFirstGenerationPhenotype } from "./types/Genetics.js";
import { SimulationState, initialSimulationState } from "./types/Condition.js"

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
     * The genetic makeup of the pet
     */
    genotype : Genotype,

    /**
     * The physical characteristics of the pet
     */
    phenotype : Appearance,

    /**
     * The current state of the pet
     */
    state: SimulationState,
}

export function makeNewVirtualPet(name: string, owner: string) : VirtualPet {
    return {
        owner: owner,
        name: name,
        birthdate: Date.now(),
        age: 0,
        generation: 0,
        phenotype: newFirstGenerationPhenotype(),
        genotype: newFirstGenerationGenotype(),
        state: initialSimulationState()
    }
}
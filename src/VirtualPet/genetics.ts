import { Gene } from "./types/Gene.js";

const GENETICS_SELECTION_PROBABILITIES = [0.375, 0.075, 0.035, 0.015];
const GENETICS_GPP_INDEX_GENE = 0;
const GENETICS_GPP_INDEX_PROBABILITY = 1;

type GeneProbabilityPair = [number, number];

/**
 * Convert a gene to an array
 * @param gene the gene
 * @returns the genetic values in an array
 */
function getGeneAsArray(gene: Gene) : number[] {
    return [gene.primary, gene.hidden0, gene.hidden1, gene.hidden2];
}

/**
 * Given a sire and dam gene, determine the cumulative probability that each gene will occur
 * @param sire the sire gene
 * @param dam the dam gene
 * @returns an array of pairs of unique genes and the probability that that gene will be selected, ordered by probability descending
 */
function genesToCumulativeProbabilityMap(sire: Gene, dam: Gene) : GeneProbabilityPair[] {
    const cumulativeProbabilityMap = new Map<number, number>();
    const sireGeneAsArray = getGeneAsArray(sire);
    const damGeneAsArray = getGeneAsArray(dam);

    for (let i = 0; i < sireGeneAsArray.length; i++) {
        const probability = GENETICS_SELECTION_PROBABILITIES[i];

        if (cumulativeProbabilityMap.has(sireGeneAsArray[i])) {
            const current = cumulativeProbabilityMap.get(sireGeneAsArray[i])!;
            cumulativeProbabilityMap.set(sireGeneAsArray[i], current + probability);
        } else {
            cumulativeProbabilityMap.set(sireGeneAsArray[i], probability); 
        }

        if (cumulativeProbabilityMap.has(damGeneAsArray[i])) {
            const current = cumulativeProbabilityMap.get(damGeneAsArray[i])!;
            cumulativeProbabilityMap.set(damGeneAsArray[i], current + probability);
        } else {
            cumulativeProbabilityMap.set(damGeneAsArray[i], probability); 
        }
    }

    return Array.from(cumulativeProbabilityMap.entries()).sort((a, b) =>
        b[GENETICS_GPP_INDEX_PROBABILITY] - a[GENETICS_GPP_INDEX_PROBABILITY]
    );
}


/**
 * Get a random genetic value, weighted by probability, from the sire or dam
 * @returns the selected genetic value
 */
function getGeneticValueByProbability(sire: Gene, dam: Gene) : number {
    var genes = genesToCumulativeProbabilityMap(sire, dam);
    var random = Math.random();
    var selected = genes.length - 1;

    genes.some((value, index) => {
        const probability = value[GENETICS_GPP_INDEX_PROBABILITY]
        if (random < probability) {
            selected = index;
            return true;
        }

        random -= probability;
        return false;
    });

    return genes[selected][GENETICS_GPP_INDEX_GENE];
}

/**
 * Get a new gene with random hidden values, and a primary selected by probability from the sire and dam.
 * @param sire the sire gene
 * @param dam the dam gene
 * @param geneticValueFactory a function for generating random genetic values
 * @returns a new gene based on the sire and dam
 */
export function makeNewGeneFromSireAndDam(sire: Gene, dam: Gene, geneticValueFactory: {():number}) : Gene {
    return {
        primary: getGeneticValueByProbability(sire, dam),
        hidden0: geneticValueFactory(),
        hidden1: geneticValueFactory(),
        hidden2: geneticValueFactory()
    }
}

/** Get a new gene with random values
 * @returns a new gene with random values
 */
export function makeNewGene(geneticValueFactory: {():number}) : Gene {
    return {
        primary: geneticValueFactory(),
        hidden0: geneticValueFactory(),
        hidden1: geneticValueFactory(),
        hidden2: geneticValueFactory()
    }
}

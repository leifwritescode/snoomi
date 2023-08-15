# Genetics and Breeding

Each virtual pet has a genotype expressing their physical appearance, nutritional needs and preferences, affinities, and health characteristics, through individualised values referred to as 'genes'. Each gene has a dominant expression, which influences the present pet, and three recessive expressions that do not. A child has a small chance of inheriting a recessive expression instead of the dominant expression.

The value of a gene determines the way it influences the virtual pet's wellbeing. In broad terms, each gene is best thought of as describing a particular virtual pet's affinity for something. The way this is expressed is determined by the category of the gene.

The set of genes that a pet can express is referred to as the genetic code.

The genetic expression of a particular pet is referred to as that pet's genotype.

### Appearance (Phenotype)

Genes in this cateogry describe the virtual pet's outward appearance. For simplicity, these match the categories available to users in the Snoovatar editor.

Each gene in this category expresses positive integer value representing an index into a collection of available visual elements.

### Personality

A virtual pet's personality influences its performance in mini-games. Each gene expresses an affinity, or lackthereof, for genres or game mechanics.

| Gene | Affinity |
| --- | --- |
| Energetic | Physical games |
| Calm | Strategy games |
| Curious | Puzzles |
| Daredevil | High-risk endeavours |
| Agile | Precision tasks |
| Unafraid | Spooky games |
| Imaginative | Creativity |
| Eidetic | Memory games |

Genes in this category express values between +2, a strong affinity, and -2, a strong aversion. A pet with a strong affinity for a particular mechanic or genre will gain happiness when playing games that include them. Conversely, a pet with a strong aversion will _lose_ happiness when playing them. Some pets may also become more or less disciplined when playing games that they have an affinity for or are averse to, respectively.

### Nutrition

There are six genes that describe the nutrition available to a virtual pet, based on categories of diet. These are carnivory, herbivory, pescivory, fungivory, frugivory, and entomophagy.

When the player creates a meal for their pet, the food items they select determine how each of the above categories weigh on and influence the effect of the meal.

Each gene in the nutrition category expresses a value between +2, a strong affinity, and -2, a strong aversion. The impact of these values on the pet deepends on the scenario in which they are interpreted.

#### Dietary Needs

The dietary needs of a pet impact how restorative a meal is. A meal will never make a pet hungrier, however it is possible that a meal may not be restorative.

#### Food Preferences

The food preferences of a pet influence whether or not the pet will eat the meal. A meal may meet the dietary needs of a pet but not be palatable, and vice versa.

### General Health and Behaviour

There are four genes expressed in this category, influencing the rate of change over time for a pet's core measures of health.

#### Resilience

The resilience gene determines how rapidly a pet's happiness decreases. Pets with a high resilience will become unhappy at a slower rate than those with low resilience.

This gene is expressed as a value between 0.5, high resilience, and 1.5, low resilience. Note that these values are inversely correlated with the resilience measure.

#### Metabolism

Metabolism determines how rapidly a pet becomes hungry. A pet with high metabolism becomes hungrier faster than one with low metabolism.

This gene is expressed as a value between 0.5, low metabolism, and 1.5, high metabolism.

#### Delinquency

A pet's delinquency influences its proclivity toward misbhaviour. This includes behaviours such as defecating when displeased and refusing to eat meals. It is expressed as a value between 0, not delinquent, and 100, extremely delinquent.

Deliquency does not influence the pet in a way that is overtly visible to the player. Instead, the value of the delinquency gene is used as the deterministic input to misbehaviour tests.

#### Immunity

A pet's immunity affects the likelihood that it will become unwell. It is expressed as a value between 0, no immunity whatsoever, and 1, completely immune. The immunity gene is used as a multiplicative input into the random sickness test.

### Breeding

Two virtual pets may interact to produce a third pet. The genotype of the third pet is determined from the first two, using random probability.

A given gene has a dominant expression, and three recessive expressions. The dominant expression has a 75% chance of inheritance by the child. The recessive expressions have 15%, 7%, and 3% chances of inheritance.

The simulation first determines the valid expressions and their probability of inheritance. If an expression appears more than once, its probability of inheritance is the cumulative probabilities of each expression.
time it is expressed.

> Note that probability of inheritance is described relative to each pet. From the persepctive of the simulation the actual probability that a specific expression is inherited is `probability / 2`, as each parent contributes half of the gene pool.

For example, consider the following expression in two pets:

| Probability | Sire | Dam | |
| --- | --- | --- | --- |
| 75% | 1 | 5 | Dominant |
| 15% | 4 | 3 | Recessive A |
| 7% | 4 | 1 | Recessive B
| 3% | 2 | 6 | Recessive C |

In this scenario, the following probabilities of inheritance occur (in order of likeliness):

| Value | Probability |
| --- | --- |
| 1 |  41.5% |
| 5 | 37.5% |
| 4 | 11.5% |
| 3 | 7.5% |
| 2 | 1.5% |
| 6 | 1.5% |

/**
 * A collection of four values that influence a particular aspect of a Snoomagotchi.
 * The primary gene influences the appearance and behaviour of the current generation snoomagotchi, and the hiddne values have a chance of being passed on during mutation.
 */
export type Gene = {
    primary: number;
    hidden0: number;
    hidden1: number;
    hidden2: number;
}

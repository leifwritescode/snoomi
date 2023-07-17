import { VariantRecord } from "./VariantRecord.js";

export enum ViewStateName {
    VirtualPet = "VirtualPet",
    MealSelect = "MealSelect",
    FinishedMeal = "FinishedMeal",
    ActivitySelect = "PlaySelect",
    FinishedActivity = "FinishedActivity"
}

export type Home = VariantRecord<ViewStateName.VirtualPet>;
export type MealSelect = VariantRecord<ViewStateName.MealSelect>;
export type FinishedMeal = VariantRecord<ViewStateName.FinishedMeal>;
export type ActivitySelect = VariantRecord<ViewStateName.ActivitySelect>;
export type FinishedActivity = VariantRecord<ViewStateName.FinishedActivity>;

export type ViewState = Home | MealSelect | FinishedMeal | ActivitySelect | FinishedActivity;
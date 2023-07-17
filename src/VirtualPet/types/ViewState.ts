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

export enum ViewActioName {
    GoToVirtualPet = "GoToVirtualPet",
    GoToMealSelect = "GoToMealSelect",
    GoToFinishedMeal = "GoToFinishedMeal",
    GoToActivitySelect = "GoToActivitySelect",
    GoToFinishedActivity = "GoToFinishedActivity"
}

export type GoToVirtualPet = VariantRecord<ViewActioName.GoToVirtualPet>;
export type GoToMealSelect = VariantRecord<ViewActioName.GoToMealSelect>;
export type GoToFinishedMeal = VariantRecord<ViewActioName.GoToFinishedMeal>;
export type GoToActivitySelect = VariantRecord<ViewActioName.GoToActivitySelect>;
export type GoToFinishedActivity = VariantRecord<ViewActioName.GoToFinishedActivity>;

export type ViewAction = GoToVirtualPet | GoToMealSelect | GoToFinishedMeal | GoToActivitySelect | GoToFinishedActivity;

// method signature for view state reducers
type StateReducer<State extends ViewState> = (action: ViewAction, state: State) => ViewState;

const reduceViewStateHome: StateReducer<Home> = (action, state) => state;
const reduceViewStateMealSelect: StateReducer<MealSelect> = (action, state) => state;
const reduceViewStateFinishedMeal: StateReducer<FinishedMeal> = (action, state) => state;
const reduceViewStateActivitySelect: StateReducer<ActivitySelect> = (action, state) => state;
const reduceViewStateFinishedActivity: StateReducer<FinishedActivity> = (action, state) => state;

/**
 * {@link ViewState} reducer
 * @param {ViewAction} action the action
 * @param {ViewState} state the state
 * @returns a new {@link ViewState} made by applying {@link action} to {@link state}, or {@link state} if no transition occurs
 */
export const reduce: StateReducer<ViewState> = (action, state) => {
  switch (state.name) {
    case ViewStateName.VirtualPet:
      return reduceViewStateHome(action, state);
    case ViewStateName.MealSelect:
      return reduceViewStateMealSelect(action, state);
    case ViewStateName.FinishedMeal:
      return reduceViewStateFinishedMeal(action, state);
    case ViewStateName.ActivitySelect:
      return reduceViewStateActivitySelect(action, state);
    case ViewStateName.FinishedActivity:
      return reduceViewStateFinishedActivity(action, state);
    default:
      return state;
  }
}

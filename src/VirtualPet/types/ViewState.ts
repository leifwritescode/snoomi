import { Meal } from "./Meal.js";
import { VariantRecord } from "./VariantRecord.js";

export enum ViewStateName {
    VirtualPet = "VirtualPet",
    MealSelect = "MealSelect",
    FinishedMeal = "FinishedMeal",
    ActivitySelect = "PlaySelect",
    FinishedActivity = "FinishedActivity"
}

type Home = VariantRecord<ViewStateName.VirtualPet>;
type MealSelect = VariantRecord<ViewStateName.MealSelect>;
type FinishedMeal = VariantRecord<ViewStateName.FinishedMeal> & {
  meal: Meal
};
type ActivitySelect = VariantRecord<ViewStateName.ActivitySelect>;
type FinishedActivity = VariantRecord<ViewStateName.FinishedActivity> & {
  activity: string
};

export type ViewState = Home | MealSelect | FinishedMeal | ActivitySelect | FinishedActivity;

export enum ViewActionName {
    GoToVirtualPet = "GoToVirtualPet",
    GoToMealSelect = "GoToMealSelect",
    GoToFinishedMeal = "GoToFinishedMeal",
    GoToActivitySelect = "GoToActivitySelect",
    GoToFinishedActivity = "GoToFinishedActivity"
}

type GoToVirtualPet = VariantRecord<ViewActionName.GoToVirtualPet>;
type GoToMealSelect = VariantRecord<ViewActionName.GoToMealSelect>;
type GoToFinishedMeal = VariantRecord<ViewActionName.GoToFinishedMeal> & {
  meal: Meal
};
type GoToActivitySelect = VariantRecord<ViewActionName.GoToActivitySelect>;
type GoToFinishedActivity = VariantRecord<ViewActionName.GoToFinishedActivity> & {
  activity: string
};;

export type ViewAction = GoToVirtualPet | GoToMealSelect | GoToFinishedMeal | GoToActivitySelect | GoToFinishedActivity;

// method signature for view state reducers
type StateReducer<State extends ViewState> = (state: State, action: ViewAction) => ViewState;

const reduceViewStateHome: StateReducer<Home> = (state, action) => {
  switch (action.name) {
    case ViewActionName.GoToMealSelect:
      return <MealSelect> { name: ViewStateName.MealSelect };
    case ViewActionName.GoToActivitySelect:
      return <ActivitySelect> { name: ViewStateName.ActivitySelect };
    default:
      return state;
  }
}

const reduceViewStateMealSelect: StateReducer<MealSelect> = (state, action) => {
  switch (action.name) {
    case ViewActionName.GoToVirtualPet:
      return <Home> { name: ViewStateName.VirtualPet};
    case ViewActionName.GoToFinishedMeal:
      return <FinishedMeal> { name: ViewStateName.FinishedMeal, meal: action.meal };
    default:
      return state;
  }
}

const reduceViewStateFinishedMeal: StateReducer<FinishedMeal> = (state, action) => {
  switch (action.name) {
    case ViewActionName.GoToVirtualPet:
      return <Home> { name: ViewStateName.VirtualPet };
    default:
      return state;
  }
}

const reduceViewStateActivitySelect: StateReducer<ActivitySelect> = (state, action) => {
  switch (action.name) {
    case ViewActionName.GoToVirtualPet:
      return <Home> { name: ViewStateName.VirtualPet };
    case ViewActionName.GoToFinishedActivity:
      return <FinishedActivity> { name: ViewStateName.FinishedActivity, activity: action.activity };
    default:
      return state;
  }
}

const reduceViewStateFinishedActivity: StateReducer<FinishedActivity> = (state, action) => {
  switch (action.name) {
    case ViewActionName.GoToVirtualPet:
      return <Home> { name: ViewStateName.VirtualPet };
    default:
      return state;
  }
}

/**
 * {@link ViewState} reducer
 * @param {ViewAction} action the action
 * @param {ViewState} state the state
 * @returns a new {@link ViewState} made by applying {@link action} to {@link state}, or {@link state} if no transition occurs
 */
export const reduce: StateReducer<ViewState> = (state, action) => {
  switch (state.name) {
    case ViewStateName.VirtualPet:
      return reduceViewStateHome(state, action);
    case ViewStateName.MealSelect:
      return reduceViewStateMealSelect(state, action);
    case ViewStateName.FinishedMeal:
      return reduceViewStateFinishedMeal(state, action);
    case ViewStateName.ActivitySelect:
      return reduceViewStateActivitySelect(state, action);
    case ViewStateName.FinishedActivity:
      return reduceViewStateFinishedActivity(state, action);
  }
}

export const initialViewState:{():ViewState} = () => {
  return <Home> {
    name: ViewStateName.VirtualPet,
  };
}

import virtualPetView from "../views/virtualPetView.js";
import { VariantRecord } from "./VariantRecord.js";
import { VirtualPetComponent } from "./VirtualPetComponent.js";

export enum ViewStateName {
    VirtualPet = "VirtualPet",
    MealSelect = "MealSelect",
    FinishedMeal = "FinishedMeal",
    ActivitySelect = "PlaySelect",
    FinishedActivity = "FinishedActivity"
}

type BaseViewState<T extends ViewStateName> = VariantRecord<T> & {
  component: VirtualPetComponent
}

type Home = BaseViewState<ViewStateName.VirtualPet>;
type MealSelect = BaseViewState<ViewStateName.MealSelect>;
type FinishedMeal = BaseViewState<ViewStateName.FinishedMeal> & {
  meal: string
};
type ActivitySelect = BaseViewState<ViewStateName.ActivitySelect>;
type FinishedActivity = BaseViewState<ViewStateName.FinishedActivity> & {
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
  meal: string
};
type GoToActivitySelect = VariantRecord<ViewActionName.GoToActivitySelect>;
type GoToFinishedActivity = VariantRecord<ViewActionName.GoToFinishedActivity> & {
  activity: string
};;

type ViewAction = GoToVirtualPet | GoToMealSelect | GoToFinishedMeal | GoToActivitySelect | GoToFinishedActivity;

// method signature for view state reducers
type StateReducer<State extends ViewState> = (state: State, action: ViewAction) => ViewState;

const reduceViewStateHome: StateReducer<Home> = (state, action) => {
  switch (action.name) {
    case ViewActionName.GoToMealSelect:
      return <MealSelect> { component: virtualPetView };
    case ViewActionName.GoToActivitySelect:
      return <ActivitySelect> { component: virtualPetView };
    default:
      return state;
  }
}

const reduceViewStateMealSelect: StateReducer<MealSelect> = (state, action) => {
  switch (action.name) {
    case ViewActionName.GoToVirtualPet:
      return <Home> { component: virtualPetView };
    case ViewActionName.GoToFinishedMeal:
      return <FinishedMeal> { component: virtualPetView, meal: action.meal };
    default:
      return state;
  }
}

const reduceViewStateFinishedMeal: StateReducer<FinishedMeal> = (state, action) => {
  switch (action.name) {
    case ViewActionName.GoToVirtualPet:
      return <Home> { component: virtualPetView };
    default:
      return state;
  }
}

const reduceViewStateActivitySelect: StateReducer<ActivitySelect> = (state, action) => {
  switch (action.name) {
    case ViewActionName.GoToVirtualPet:
      return <Home> { component: virtualPetView };
    case ViewActionName.GoToFinishedActivity:
      return <FinishedActivity> { component: virtualPetView, activity: action.activity };
    default:
      return state;
  }
}

const reduceViewStateFinishedActivity: StateReducer<FinishedActivity> = (state, action) => {
  switch (action.name) {
    case ViewActionName.GoToVirtualPet:
      return <Home> { component: virtualPetView };
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
    default:
      return state;
  }
}

export const initialViewState:{():ViewState} = () => {
  return <Home>{
    name: ViewStateName.VirtualPet,
    component: virtualPetView
  }
}

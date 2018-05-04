// actions describe events which can occur in your app

//PURE FUNCTIONS
// 1. Always retunr the same result when given the same input
// 2. Pure functions execution doesnt depend on the state of the app
// 2. only depend on the arguments passed to it
// 3. pure functions dont modify vars outside of scope

// Function that takes current state and action and return new State
// Reducers need to be a pure function to make predictability easier

// concat returns a NEW array, push modifies the original array

// QUESTION TO BE UNDESTOOD: The reducer function needs to be pure. Making an Ajax request inside of it would make it an impure function.

function todos(state = [], action) {
  switch (action.type) {
    case "ADD_TODO":
      return state.concat([action.todo]);
    case "REMOVE_TODO":
      return state.filter(todo => todo.id !== action.id);
    case "TOGGLE_TODO":
      return state.map(
        todo =>
          todo.id !== action.id
            ? todo
            : Object.assign({}, todo, { complete: !todo.complete })
      );
    default:
      return state;
  }
}

function goals(state = [], action) {
  switch (action.type) {
    case "ADD_GOAL":
      return state.concat([action.goal]);
    case "REMOVE_GOAL":
      return state.filter(goal => goal.id !== action.id);
    default:
      return state;
  }
}

// combineReducers = Turns an object whose values are different reducing functions into a single reducing function you can pass to createStore.
// combineReducers(todos, goals)

// function combineReducers(reducersArray, state, action) {
//   let returnState = {};
//   reducersArray.forEach(
//     reducer => (returnState[reducer] = () => reducer(state[reducer], action))
//   );
//   console.log(returnState);
//   return returnState;
// }

function app(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action)
  };
}

//{
//   todos: todos(state.todos, action),
//   goals: goals(state.goals, action)
// };

function createStore(reducer) {
  // when you invoke createStore, you get an object with
  //public interface (get, listen, update) and a private state

  // Four parts to a store
  //1. State
  //2. Get - return state
  //3. Listen - keeps track of subscribed f and execute them when state changes
  //4. Update

  let state;
  let listeners = [];

  const getState = () => state;

  const subscribe = listener => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };

  // whole purpose of dispatch is to change the state predictably
  const dispatch = action => {
    // call todos()
    state = reducer(state, action);
    listeners.forEach(listener => listener());
    // go through all listeners [fun, fun ]and invoke them
  };

  // dispatch the action itself to change the state

  return {
    getState,
    subscribe,
    dispatch
  };
}

const store = createStore(app);

const unsubscribe = store.subscribe(() => {
  console.log("New state: ", store.getState());
});

store.dispatch({
  type: "ADD_TODO",
  todo: {
    id: 0,
    name: "Learn Redux",
    complete: false
  }
});

store.dispatch({
  type: "ADD_TODO",
  todo: {
    id: 1,
    name: "Learn PURE Functions",
    complete: false
  }
});

store.dispatch({
  type: "TOGGLE_TODO",
  id: 0
});

store.dispatch({
  type: "REMOVE_TODO",
  id: 0
});

store.dispatch({
  type: "ADD_GOAL",
  goal: {
    id: 0,
    name: "Learn redux again"
  }
});

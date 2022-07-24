import React, { useReducer, useContext, useEffect, createContext } from "react";
import axios from "axios";

// Step 1: Initial State and Actions
const initialState = {
  imageList: [],
};

const actions = {
  INITIALIZE: "INITIALIZE",
  TEST_ADD: "TEST_ADD",
};

function reducer(state, action) {
  switch (action.type) {
    case actions.INITIALIZE:
      return {
        ...state,
        imageList: action.payload,
      };
    case actions.TEST_ADD:
      return {
        ...state,
        imageList: [...state.imageList, action.payload],
      };
    default:
      return state;
  }
}

// Step 3: Create the Context and Provider to Dispatch the Actions.
const ImageListContext = createContext();

const Provider = ({ children }) => {
  //Here we pass the reducer function and theinitialState to the useReducer hook. This will return state and dispatch. The state will have the initialState. And the dispatch is used to trigger our actions, just like in redux.
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    axios.get("/getfiles").then((response) => {
      dispatch({
        type: actions.INITIALIZE,
        payload: response.data.files,
      });
    });
  }, []);

  if (!state) return null;

  const store = {
    imageList: state.imageList,
    testAddImageList: (fileName) => {
      dispatch({
        type: actions.TEST_ADD,
        payload: { Key: fileName },
      });
    },
  };

  //We pass the value object as a prop to the TodoListContext's Provider, so that we can access it using useContext.
  return (
    <ImageListContext.Provider value={store}>
      {children}
    </ImageListContext.Provider>
  );
};

//Step 4: Create components that will use the store.
function ViewImageList() {
  const { imageList } = useContext(ImageListContext);
  console.log(imageList);

  return (
    <div>
      <ul>
        {imageList.map((image, index) => (
          <li key={index}>{image.Key}</li>
        ))}
      </ul>
    </div>
  );
}

function TestAddToList() {
  const { imageList, testAddImageList } = useContext(ImageListContext);
  const fileName = "test";
  return (
    <div>
      <button
        onClick={() => {
          testAddImageList(fileName);
          console.log(imageList);
        }}
      >
        Add "test"
      </button>
    </div>
  );
}

//Step 5: Final step, wrapping the above two components to the Provider.
export default function App() {
  return (
    <Provider>
      <ViewImageList />
      <TestAddToList />
    </Provider>
  );
}

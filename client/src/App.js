import React, { useReducer, useContext, useEffect, createContext } from "react";
import axios from "axios";
import UploadImage from "./UploadImage";

// Step 1: Initial State and Actions
const initialState = {
  imageList: [],
};

const actions = {
  INITIALIZE: "INITIALIZE",
  TEST_ADD: "TEST_ADD",
  UPLOAD: "UPLOAD",
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
    case actions.UPLOAD:
      return {
        ...state,
        imageList: [...state.imageList, action.payload],
      };
    default:
      return state;
  }
}

// Step 3: Create the Context and Provider to Dispatch the Actions.
export const ImageListContext = createContext();
export const DispatchContext = createContext();

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
    actions: actions,
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
    <DispatchContext.Provider value={dispatch}>
      <ImageListContext.Provider value={store}>
        {children}
      </ImageListContext.Provider>
    </DispatchContext.Provider>
  );
};

//Step 4: Create components that will use the store.
function ViewImageList() {
  const { imageList } = useContext(ImageListContext);
  //console.log(imageList);

  return (
    <div>
      <ul>
        {imageList.map((image, index) => (
          <li key={index}>
            <p>{image.Key}</p>
            {image.SignedUrl && <img src={image.SignedUrl} />}
          </li>
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
export function App() {
  return (
    <Provider>
      <UploadImage />
      <ViewImageList />
      <TestAddToList />
    </Provider>
  );
}

import React, { useReducer, useContext, useEffect, createContext } from "react";
import axios from "axios";
import UploadImage from "./UploadImage";

// Step 1: Initial State and Actions
const initialState = {
  imageList: [],
};

const actions = {
  INITIALIZE: "INITIALIZE",
  UPLOAD: "UPLOAD",
  DELETE: "DELETE",
};

function reducer(state, action) {
  switch (action.type) {
    case actions.INITIALIZE:
      return {
        ...state,
        imageList: action.payload,
      };
    case actions.UPLOAD:
      return {
        ...state,
        imageList: [...state.imageList, action.payload],
      };
    case actions.DELETE:
      return {
        ...state,
        imageList: state.imageList.filter(
          (_item, index) => index !== action.payload
        ),
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
    /*testAddImageList: (fileName) => {
      dispatch({
        type: actions.TEST_ADD,
        payload: { Key: fileName },
      });
    },
    */
  };

  //We pass the value object as a prop to the Context's Provider, so that we can access it using useContext.
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
  const dispatch = useContext(DispatchContext);

  const handleDelete = (fileName, index) => {
    axios
      .get(`/deletefile/${fileName}`)
      .then((res) => {
        console.log(res);
        dispatch({ type: actions.DELETE, payload: index });
        console.log(imageList);
      })
      .catch((error) => {
        console.error(error.response);
      });
  };

  return (
    <div>
      <ul>
        {imageList.map((image, index) => (
          <li key={index}>
            <p>{image.Key}</p>
            {image.SignedUrl && <img src={image.SignedUrl} />}
            <button onClick={() => handleDelete(image.Key, index)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

//Step 5: Final step, wrapping the above two components to the Provider.
export function App() {
  return (
    <Provider>
      <UploadImage />
      <ViewImageList />
    </Provider>
  );
}

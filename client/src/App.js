import React, { useReducer, useEffect, createContext } from "react";
import axios from "axios";
import { UploadImage, ViewImageList } from "./ViewAndUpload";

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

export const ImageContext = createContext({
  actions: actions,
  ...initialState,
  uploadImage: () => Promise.resolve(),
  deleteImage: () => Promise.resolve(),
});

export const ImageProvider = ({ children }) => {
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

  const uploadImage = async (formData, setMessages) => {
    axios
      .post("/uploadfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res) {
          console.log(res.data.files);
          setMessages("File uploaded successfully");
          dispatch({
            type: actions.UPLOAD,
            payload: res.data.files,
          });
        }
      })
      .catch((error) => {
        console.error(error.response);
        setMessages("Please select a file");
      });
  };

  const deleteImage = async (fileName, index) => {
    console.log(fileName);
    axios
      .get(`/deletefile?filename=${fileName}`)
      .then((res) => {
        console.log(res);
        dispatch({ type: actions.DELETE, payload: index });
      })
      .catch((error) => {
        console.error(error.response);
      });
  };

  return (
    <ImageContext.Provider
      value={{
        actions: actions,
        imageList: state.imageList,
        uploadImage,
        deleteImage,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

//Step 5: Final step, wrapping the above two components to the Provider.
export function App() {
  return (
    <ImageProvider>
      <UploadImage />
      <ViewImageList />
    </ImageProvider>
  );
}

import { USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS } from "./userConstant";

const initialState = {
    userInfo: null,
    loading: false,
    error: null,
  };
  
  export const userLoginReducer = (state = initialState, action) => {
      switch (action.type) {
        case USER_LOGIN_REQUEST:
          return { ...state, loading: true }; // Conserve l'état précédent
        case USER_LOGIN_SUCCESS:
          return { loading: false, userInfo: action.payload, error: null }; // Réinitialise l'erreur
        case USER_LOGIN_FAIL:
          return { loading: false, error: action.payload }; // Conserve userInfo
        default:
          return state;
      }
  };
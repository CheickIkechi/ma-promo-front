import axios from 'axios';
import { USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS,USER_LOGOUT } from './userConstant';

export const login = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: { 'Content-Type': 'application/json' },
    };

    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}api/users/login`,
      credentials, // Envoi direct de l'objet credentials
      config
    );

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    // Stocker les informations de l'utilisateur dans localStorage
    localStorage.setItem('userInfo', JSON.stringify(data)); // Stocker les informations de l'utilisateur
    localStorage.setItem('token', data.token); // Stocker le token d'authentification
    return { type: USER_LOGIN_SUCCESS, payload: data }; // Retourner l'action


  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : 'Une erreur est survenue. Veuillez réessayer.';

    dispatch({
      type: USER_LOGIN_FAIL,
      payload: message,
    });

    return { type: USER_LOGIN_FAIL, payload: message };

  }
};




export const logout = () => (dispatch) => {
  // Supprime les informations de l'utilisateur du localStorage
  localStorage.removeItem('userInfo');
  localStorage.removeItem('token');

  // Dispatche l'action USER_LOGOUT pour informer Redux
  dispatch({ type: USER_LOGOUT });
};

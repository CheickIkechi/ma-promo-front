import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from './redux/transactionSlice';
import { userLoginReducer } from './redux/userReducer';

// Récupérer les informations de l'utilisateur et le token depuis localStorage
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const tokenFromStorage = localStorage.getItem('token') || null; // Récupérer le token

const initialState = {
  userLogin: { userInfo: userInfoFromStorage, token: tokenFromStorage }, // Inclure le token dans l'état initial
};

const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    userLogin: userLoginReducer,
  },
  preloadedState: initialState,
});

export default store;


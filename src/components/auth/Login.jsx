import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/userAction';
import { useNavigate } from 'react-router-dom';
import { USER_LOGIN_SUCCESS } from '../../redux/userConstant';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard'); // Si le token est présent, rediriger vers le dashboard
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resultAction = await dispatch(login({ username, password }));

    if (resultAction.type === USER_LOGIN_SUCCESS) {
      navigate('/dashboard');
    } else {
      setErrorMessage(resultAction.payload || 'Erreur de connexion. Vérifiez vos informations.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Bienvenue  !</h2>
      <p className="text-gray-600 mb-6 text-center">Connecte toi pour accéder à ton tableau de bord.</p>
      {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
          <input
            type="text"
            className="w-full mt-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            type="password"
            className="w-full mt-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Login;
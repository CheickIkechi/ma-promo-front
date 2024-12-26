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
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            className="w-full mt-2 p-2 border border-gray-300 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="w-full mt-2 p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded">
          Login
        </button>
      </form>
      <div className="mt-4 text-center">
        <a href="/forgot-password" className="text-blue-500">Forgot Password?</a>
      </div>
    </div>
  );
};

export default Login;

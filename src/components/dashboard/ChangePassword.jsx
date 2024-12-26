import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Nouveau champ pour la confirmation
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const userInfo = useSelector((state) => state.userLogin.userInfo);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Vérification que le nouveau mot de passe et la confirmation correspondent
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`, // Inclure le token JWT
        },
      };

      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}api/users/change-password`,
        { oldPassword, newPassword },
        config
      );

      setMessage(data.message);
      // Réinitialiser les champs après un changement réussi
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response.data.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Changer le Mot de Passe</h2>
      {message && <p className="text-green-600 text-center">{message}</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Ancien Mot de Passe</label>
          <input
            type="password"
            className="w-full mt-2 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nouveau Mot de Passe</label>
          <input
            type="password"
            className="w-full mt-2 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Confirmer le Nouveau Mot de Passe</label>
          <input
            type="password"
            className="w-full mt-2 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">
          Changer le Mot de Passe
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
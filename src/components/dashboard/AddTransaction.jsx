import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransactions } from '../../redux/transactionSlice';

const AddTransaction = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userLogin); // Récupérer les informations de l'utilisateur
  const [showPopup, setShowPopup] = useState(null); // null, 'cotisation', or 'collect'
  const [amount, setAmount] = useState('');
  const [donateur, setDonateur] = useState(''); // Nom pour le collect
  const [description, setDescription] = useState('');

  const handleCotisationSubmit = (e) => {
    e.preventDefault();
    dispatch(addTransactions({ amount, subtype: 'cotisation', reason: 'Cotisation', userId: userInfo._id }));
    resetForm();
  };

  const handleCollectSubmit = (e) => {
    e.preventDefault();
    dispatch(addTransactions({ amount, subtype: 'collect', reason: description, donateur, userId: userInfo._id }));
    resetForm();
  };

  const resetForm = () => {
    setShowPopup(null);
    setAmount('');
    setDonateur('');
    setDescription('');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Ajouter une transaction</h2>
      <div className="flex space-x-4">
        <button 
          className="py-2 px-4 bg-blue-500 text-white rounded" 
          onClick={() => setShowPopup('cotisation')}
        >
          Ma Cotisation
        </button>
        <button 
          className="py-2 px-4 bg-green-500 text-white rounded" 
          onClick={() => setShowPopup('collect')}
        >
          Collect
        </button>
      </div>

      {/* Popup for Cotisation */}
      {showPopup === 'cotisation' && (
        <div className="popup">
          <form onSubmit={handleCotisationSubmit}>
          <div className="mb-4 mt-4">
          <label className="block text-sm font-medium text-gray-700">Montant</label>
              <input
                type="number"
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded">
              Soumettre
            </button>
            <button type="button" onClick={resetForm} className="py-2 px-4 bg-gray-500 text-white rounded ml-2">
              Annuler
            </button>
          </form>
        </div>
      )}

      {/* Popup for Collect */}
      {showPopup === 'collect' && (
        <div className="popup">
          <form onSubmit={handleCollectSubmit}>
            <div className="mb-4 mt-4">
              <label className="block text-sm font-medium text-gray-700">Nom du donateur ou de la société</label>
              <input
                type="text"
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                value={donateur}
                maxLength={30}
                onChange={(e) => {
                  if (e.target.value.length <= 30) {
                    setDonateur(e.target.value);
                  }
                }}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Montant</label>
              <input
                type="number"
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Argument (facultatif)</label>
              <textarea
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button type="submit" className="py-2 px-4 bg-green-500 text-white rounded">
              Soumettre
            </button>
            <button type="button" onClick={resetForm} className="py-2 px-4 bg-gray-500 text-white rounded ml-2">
              Annuler
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddTransaction;
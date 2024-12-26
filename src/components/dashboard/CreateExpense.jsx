import React, { useState } from 'react';
import axios from 'axios';

const CreateExpense = () => {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Fonction qui gère l'envoi du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  
    setMessage(null);  

    try {
      const token = localStorage.getItem('token');  // Récupère le token de l'utilisateur
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,  // Ajoute le token dans l'en-tête de la requête
        },
      };

      // Envoi de la requête pour créer une nouvelle dépense
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}api/transactions/create-expense`,
        { amount, reason, beneficiary },  // Corps de la requête avec les données du formulaire
        config
      );

      // Message de succès après création de la dépense
      setMessage(response.data.message);
      setAmount('');  // Réinitialise les champs du formulaire
      setReason('');
      setBeneficiary('');
    } catch (error) {
      // Gestion des erreurs et affichage d'un message d'erreur
      setMessage(
        error.response?.data?.message || 'Échec de la création de la transaction de dépense.'
      );
    } finally {
      setLoading(false);  // Désactive l'état de chargement après l'exécution
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Initier une Demande de Dépense</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        {/* Champ pour le montant */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Montant
          </label>
          <input
            type="number"
            placeholder="Entrez le montant"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>

        {/* Champ pour le bénéficiaire */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Bénéficiaire
          </label>
          <input
            type="text"
            placeholder="Entrez le nom du bénéficiaire"
            value={beneficiary}
            maxLength={30}
            onChange={(e) => setBeneficiary(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>

        {/* Champ pour la raison de la dépense */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Motif
          </label>
          <textarea
            placeholder="Entrez la raison de la dépense"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>

        {/* Bouton de soumission */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={loading}  // Désactive le bouton si la requête est en cours
          >
            {loading ? 'Soumission...' : 'Soumettre'}
          </button>
        </div>
      </form>
      
      {/* Message de retour de l'API ou d'erreur */}
      {message && (
        <p className="mt-4 text-center text-green-500 font-semibold">{message}</p>
      )}
    </div>
  );
};

export default CreateExpense;

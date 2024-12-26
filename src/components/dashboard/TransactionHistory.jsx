import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState('idle'); // idle, loading, success, failed
  const [error, setError] = useState(null);
  const [selectedReason, setSelectedReason] = useState(''); // Pour le popup

  // Récupération des données utilisateur depuis le store Redux
  const { userInfo, token } = useSelector((state) => state.userLogin);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userInfo || !userInfo._id) {
        setError('ID utilisateur non trouvé');
        return;
      }

      setStatus('loading');
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}api/transactions/entree/${userInfo._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Envoi du token
            },
          }
        );

        setTransactions(response.data);
        setStatus('success');
      } catch (err) {
        setError(err.message || 'Échec de la récupération des transactions');
        setStatus('failed');
      }
    };

    fetchTransactions();
  }, [userInfo, token]);

  const handleReasonClick = (reason) => {
    setSelectedReason(reason);
  };

  const closePopup = () => {
    setSelectedReason('');
  };

  if (status === 'loading') {
    return <p>Chargement des transactions...</p>;
  }

  if (status === 'failed') {
    return <p>Erreur : {error}</p>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h3 className="text-2xl font-semibold mb-4 text-center">Historique des Transactions</h3>
      {transactions.length === 0 ? (
        <p className="text-gray-500 text-center">Aucune transaction trouvée.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-2 text-left border-b">Motif</th>
                <th className="px-2 py-2 text-left border-b">Trésorier</th>
                <th className="px-2 py-2 text-left border-b">Montant</th>
                <th className="px-2 py-2 text-left border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="odd:bg-white even:bg-gray-50">
                  <td className="px-2 py-2 border-b">
                    <span
                      className="cursor-pointer text-blue-600 hover:underline"
                      onClick={() => handleReasonClick(transaction.reason)}
                    >
                      {transaction.reason.length > 7
                        ? `${transaction.reason.substring(0, 7)}...`
                        : transaction.reason}
                    </span>
                  </td>
                  <td className="px-2 py-2 border-b">{transaction.treasurerUsername}</td>
                  <td className="px-2 py-2 border-b text-green-600 font-bold">
                    {transaction.amount} cfa
                  </td>
                  <td className="px-2 py-2 border-b">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Popup pour afficher la raison complète */}
      {selectedReason && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h4 className="text-lg font-semibold mb-2">Détails de la Transaction</h4>
            <p>{selectedReason}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
              onClick={closePopup}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ValiderTransaction = () => {
  const [transactionsEnAttente, setTransactionsEnAttente] = useState([]);
  const [selectedReason, setSelectedReason] = useState(''); // Pour le popup

  // Récupérer les transactions non validées
  useEffect(() => {
    const fetchTransactionsEnAttente = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}api/transactions/pending-treasurer`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransactionsEnAttente(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des transactions en attente:', error);
      }
    };

    fetchTransactionsEnAttente();
  }, []);

  // Valider une transaction
  const handleValider = async (transactionId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}api/transactions/validate-treasurer/${transactionId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Mettre à jour la liste localement après validation
      setTransactionsEnAttente((prev) =>
        prev.filter((transaction) => transaction._id !== transactionId)
      );
    } catch (error) {
      console.error('Erreur lors de la validation de la transaction:', error);
    }
  };

  // Rejeter une transaction
  const handleRejeter = async (transactionId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}api/transactions/reject-treasurer/${transactionId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Mettre à jour la liste localement après rejet
      setTransactionsEnAttente((prev) =>
        prev.filter((transaction) => transaction._id !== transactionId)
      );
    } catch (error) {
      console.error('Erreur lors du rejet de la transaction:', error);
    }
  };

  const handleReasonClick = (reason) => {
    setSelectedReason(reason);
  };

  const closePopup = () => {
    setSelectedReason('');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6 text-center">Transactions à Valider</h2>
      <div className="overflow-x-auto">
        <div className="max-h-96 overflow-y-auto"> {/* Conteneur avec défilement vertical */}
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Motif</th>
                <th className="py-2 px-4 border-b">Montant</th>
                <th className="py-2 px-4 border-b">Donateur</th>
                <th className="py-2 px-4 border-b">Type</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactionsEnAttente.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className="cursor-pointer text-blue-600 hover:underline"
                      onClick={() => handleReasonClick(transaction.reason)}
                    >
                      {transaction.reason.length > 7
                        ? `${transaction.reason.substring(0, 7)}...`
                        : transaction.reason}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">{transaction.amount.toFixed(2)} CFA</td>
                  <td className="py-2 px-4 border-b">{transaction.donateur || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{transaction.subtype}</td>
                  <td className="py-2 px-4 border-b flex justify-center gap-2">
                    <button
                      onClick={() => handleValider(transaction._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Valider
                    </button>
                    <button
                      onClick={() => handleRejeter(transaction._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Rejeter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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

export default ValiderTransaction;
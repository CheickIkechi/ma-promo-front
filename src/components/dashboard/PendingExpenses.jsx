import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const PendingExpenses = () => {
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userInfo } = useSelector((state) => state.userLogin);
  const userRole = userInfo?.role;
  const token = useSelector((state) => state.userLogin.token);

  // Fonction pour récupérer les dépenses en attente
  const fetchPendingExpenses = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}api/transactions/pending-expenses`,
        config
      );
      setPendingExpenses(response.data);
      console.log('Pending expenses fetched:', response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pending expenses.');
      console.error('Error fetching pending expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPendingExpenses();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleValidation = async (transactionId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}api/transactions/validate/${transactionId}`,
        {},
        config
      );
      alert(response.data.message);

      // Rechargez les dépenses après validation
      fetchPendingExpenses();
      console.log(`Transaction ${transactionId} validated by ${userRole}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to validate transaction.');
      console.error('Error validating transaction:', err);
    }
  };

  const getStatusMessage = (transaction) => {
    if (!transaction) return 'Transaction invalide';

    const { validatedByPresident, validatedByPCO } = transaction;

    if (validatedByPresident && validatedByPCO) {
      return 'Transaction validée par le président et le PCO';
    } else if (validatedByPresident) {
      return 'En attente de validation par le PCO';
    } else if (validatedByPCO) {
      return 'En attente de validation par le président';
    } else {
      return 'En attente de validation par les deux parties';
    }
  };

  const canValidate = (expense) => {
    return !(expense.validatedByPresident && expense.validatedByPCO);
  };

  if (loading) {
    return <p>Chargement des transactions...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Transactions de Dépense En Attente</h2>
      {pendingExpenses.length === 0 ? (
        <p>Aucune dépense en attente à examiner.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white shadow-md rounded">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Montant</th>
                <th className="px-4 py-2 text-left">Motif</th>
                <th className="px-4 py-2 text-left">Initiée par</th>
                <th className="px-4 py-2 text-left">Statut</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingExpenses.map((expense) => (
                <tr key={expense._id}>
                  <td className="border px-4 py-2">{expense.amount} CFA</td>
                  <td className="border px-4 py-2 truncate max-w-xs md:max-w-md break-words">
                  {expense.reason}
                  </td>
                  <td className="border px-4 py-2">{expense.initiatedBy.username}</td>
                  <td className="border px-4 py-2">{getStatusMessage(expense)}</td>
                  <td className="border px-4 py-2">
                    {canValidate(expense) && (
                      <button
                        onClick={() => handleValidation(expense._id)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
                      >
                        Valider
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingExpenses;
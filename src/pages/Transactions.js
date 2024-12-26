import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaArrowRight,
  FaMoneyBillAlt,
  FaHandHoldingUsd,
  FaWallet,
  FaTimes,
  FaCrown,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState({ price: '', reason: '', date: '' });
  const [activeTab, setActiveTab] = useState('tout');
  const [totals, setTotals] = useState({ income: 0, expense: 0 });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Vérifier si l'utilisateur est connecté
  const token = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Récupérer toutes les transactions sans filtrage par utilisateur
        const response = await axios.get(`${process.env.REACT_APP_API_URL}api/transactions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = response.data;
        setTransactions(data);

        const income = data
          .filter((t) => t.type === 'entrée')
          .reduce((sum, t) => sum + t.amount, 0);
        const expense = data
          .filter((t) => t.type === 'sortie')
          .reduce((sum, t) => sum + t.amount, 0);

        setTotals({ income, expense });
      } catch (error) {
        console.error('Erreur lors du chargement des transactions :', error);
        setError('Une erreur est survenue lors du chargement des transactions.');
      }
    };

    fetchTransactions();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}api/transactions/leaderboard`
      );
      setLeaderboard(response.data);
      setShowLeaderboard(true);
    } catch (err) {
      setError(err.message || 'Échec de la récupération du classement');
    }
  };

  const filteredTransactions = transactions
    .filter((t) => {
      if (activeTab === 'entrée') return t.type === 'entrée';
      if (activeTab === 'sortie') return t.type === 'sortie';
      return true;
    })
    .filter((t) => {
      const matchesPrice = filter.price ? Math.abs(t.amount) === parseFloat(filter.price) : true;
      const matchesReason = filter.reason ? t.reason.toLowerCase().includes(filter.reason.toLowerCase()) : true;
      const matchesDate = filter.date ? t.date.includes(filter.date) : true;

      return matchesPrice && matchesReason && matchesDate;
    });

  const dynamicTotal =
    activeTab === 'tout'
      ? totals.income - totals.expense
      : filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  const totalLabel =
    activeTab === 'entrée'
      ? 'Total Entrées'
      : activeTab === 'sortie'
      ? 'Total Sorties'
      : 'Restant';

  const totalIcon =
    activeTab === 'entrée'
      ? FaHandHoldingUsd
      : activeTab === 'sortie'
      ? FaWallet
      : FaMoneyBillAlt;

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Barre de recherche */}
      <div className="flex flex-col md:flex-row items-center gap-2">
        <input
          type="text"
          placeholder="Rechercher par motif"
          className="border p-1 w-full md:w-2/3"
          value={filter.reason}
          onChange={(e) => setFilter({ ...filter, reason: e.target.value })}
        />
        <input
          type="number"
          placeholder="Rechercher par montant"
          className="border p-1 w-full md:w-2/3"
          value={filter.price}
          onChange={(e) => setFilter({ ...filter, price: e.target.value })}
        />
        <input
          type="date"
          placeholder="Rechercher par date"
          className="border p-1 w-full md:w-2/3"
          value={filter.date}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
        />
      </div>

      {/* Onglets de filtre */}
      <div className="flex justify-center gap-4 bg-gray-100 p-2 rounded-lg">
        {['tout', 'entrée', 'sortie'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 font-bold rounded-md ${
              activeTab === tab
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 hover:bg-blue-100'
            }`}
          >
            {tab === 'tout' ? 'Tout' : tab === 'entrée' ? 'Entrées' : 'Sorties'}
          </button>
        ))}
      </div>

      {/* Liste des transactions */}
      <div className="overflow-y-auto max-h-[50vh] divide-y divide-gray-200">
        {filteredTransactions.map((transaction) => (
          <div
            key={transaction._id}
            onClick={() => setSelectedTransaction(transaction)}
            className="p-4 flex justify-between items-center bg-white rounded-lg shadow mb-2 cursor-pointer"
          >
            {/* Affichage conditionnel pour "tout" ou autres filtres */}
            <div className="flex-1">
              {activeTab === 'tout' ? (
                <>
                  <span className="block font-bold">
                    {transaction.type === 'entrée' ? 'Entrée' : 'Sortie'}
                  </span>
                  <span className="text-gray-600">
                    {transaction.type === 'entrée'
                      ? transaction.initiatedBy?.username || 'Inconnu'
                      : transaction.reason || 'Aucune raison'}
                  </span>
                </>
              ) : (
                <>
                  <span className="block font-bold capitalize">
                    {transaction.type === 'entrée' 
                      ? transaction.subtype 
                      : transaction.donateur}
                  </span>
                  <span className="truncate max-w-xs text-gray-600">
                    {transaction.type === 'entrée' 
                      ? transaction.initiatedBy?.username 
                      : transaction.reason}
                  </span>
                </>
              )}
            </div>


            {/* Montre la somme de la transaction */}
            <div className="w-1/3 flex justify-center">
              <span
                className={`font-bold ${
                  transaction.type === 'entrée' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {transaction.amount} cfa
              </span>
            </div>

            {/* Date de la transaction */}
            <div className="w-1/4 text-gray-500 text-right">
              {new Date(transaction.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {/* Totaux dynamiques */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-300 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2">
          {React.createElement(totalIcon, { className: 'text-blue-500 text-xl' })}
          <span className="font-bold">{totalLabel} : </span>
          <span className="text-lg font-semibold">{dynamicTotal} cfa</span>
        </div>
        <button
          onClick={() => {
            if (token) {
              navigate('/dashboard'); // Rediriger vers le dashboard
            } else {
              navigate('/login'); // Rediriger vers la page de login
            }
          }}
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
        >
          <FaArrowRight /> {token ? 'Actions' : 'Se connecter'}
        </button>
      </div>

      {/* Popup transaction */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg w-full">
            <button
              className="text-red-500 float-right"
              onClick={() => setSelectedTransaction(null)}
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-bold mb-4">
              Détails de la transaction
            </h3>
            {selectedTransaction.donateur && (
              <p>
                <strong>Donateur ou le commerçant :</strong> {selectedTransaction.donateur}
              </p>
            )}
            <p>
              <strong>Initier par:</strong> {selectedTransaction.initiatedBy.username}
            </p>
            <p>
              <strong>Motif:</strong> {selectedTransaction.reason}
            </p>
            <p>
              <strong>Montant:</strong> {selectedTransaction.amount} cfa
            </p>
            <p>
              <strong>Date:</strong> {new Date(selectedTransaction.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {/* Bouton flottant pour le classement */}
      <button
        onClick={fetchLeaderboard}
        className="fixed bottom-24 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
      >
        <FaCrown className="text-2xl" />
      </button>

      {/* Popup pour le classement */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-red-500"
              onClick={() => setShowLeaderboard(false)}
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-bold mb-4">Classement des Collecteurs</h3>
            <ul>
              {leaderboard.map((entry) => (
                <li key={entry._id} className="mb-2">
                  {entry.user.username}: {entry.totalFunds} CFA
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;

import React, { useEffect, useRef } from 'react';
import { FaHome, FaPlus, FaHistory, FaKey, FaCheckCircle, FaMoneyBill, FaTimesCircle, FaSignOutAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/userAction'; // Assure-toi que l'action de déconnexion existe dans ton store Redux

const Sidebar = ({ onMenuClick, isOpen, toggleSidebar }) => {
  const userState = useSelector((state) => state.userLogin);
  const { userInfo } = userState;
  const { username, role } = userInfo || {}; // Récupérer le nom et le rôle de l'utilisateur
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sidebarRef = useRef();

  // Fermer la sidebar en cliquant à l'extérieur uniquement si elle est ouverte
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleSidebar();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, toggleSidebar]);

  // Fonction de déconnexion
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full text-white bg-green-950 p-4 transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64 z-50`}
    >
      {/* Bouton pour fermer la sidebar */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 text-white"
      >
        <FaTimesCircle />
      </button>

      <h2 className="text-xl font-semibold mb-6 text-center">Tableau de bord</h2>

      {/* Affichage du nom et du rôle de l'utilisateur */}
      {userInfo && (
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-center">Bienvenue !</h2>
          <p className="text-lg font-medium underline underline-offset-8">{username}</p>
          <p className="text-sm text-gray-300 mt-2">{role}</p>
        </div>
      )}

      <ul>
        <li>
          <button
            onClick={() => navigate("/")}
            className="block py-2 hover:bg-green-700 w-full text-left"
          >
            <FaHome className="mr-2" />
            Accueil
          </button>
        </li>
        <hr className="text-green-500" />
        {/* Éléments communs */}
        <li>
          <button
            onClick={() => onMenuClick("transaction-history")}
            className="block py-2 hover:bg-green-700 w-full text-left"
          >
            <FaHistory className="mr-2" />
            Historique des transactions
          </button>
        </li>
        <li>
          <button
            onClick={() => onMenuClick("add-transaction")}
            className="block py-2 hover:bg-green-700 w-full text-left"
          >
            <FaPlus className="mr-2" />
            Ajouter une transaction
          </button>
        </li>

        {/* Éléments spécifiques aux rôles */}
        {role === 'tresorier' && (
          <>
            <li>
              <button
                onClick={() => onMenuClick("validate-transaction")}
                className="block py-2 hover:bg-green-700 w-full text-left"
              >
                <FaCheckCircle className="mr-2" />
                Valider la transaction
              </button>
            </li>
            <li>
              <button
                onClick={() => onMenuClick("Depense")}
                className="block py-2 hover:bg-green-700 w-full text-left"
              >
                <FaMoneyBill className="mr-2" />
                Dépense
              </button>
            </li>
          </>
        )}

        {(role === 'president' || role === 'PCO') && (
          <li>
            <button
              onClick={() => onMenuClick("ValidateByPresidentAndPco")}
              className="block py-2 hover:bg-green-700 w-full text-left"
              >
                <FaCheckCircle className="mr-2" />
                Valider
              </button>
            </li>
          )}
  
          <li>
            <button
              onClick={() => onMenuClick("modify-password")}
              className="block py-2 hover:bg-green-700 w-full text-left"
            >
              <FaKey className="mr-2" />
              Modifier le mot de passe
            </button>
          </li>
  
          {/* Bouton de déconnexion */}
          <li>
            <button
              onClick={handleLogout}
              className="block py-2 hover:bg-green-700 w-full text-left mt-6 text-red-500"
            >
              <FaSignOutAlt className="mr-2" />
              Se déconnecter
            </button>
          </li>
        </ul>
      </div>
    );
  };
  
  export default Sidebar;
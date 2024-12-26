import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Transactions from './pages/Transactions';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/auth/Login';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Transactions />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Exemple de données initiales pour les transactions
const initialState = {
  transactions: [],
  pendingTransactions: [],
  error: null,
  status: 'idle',
};

// Action asynchrone pour récupérer les transactions (par exemple depuis une API)
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { userLogin } = getState();
      const token = userLogin?.userInfo?.token;

      const response = await fetch(`${process.env.REACT_APP_API_URL}api/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Action asynchrone pour valider une transaction
export const validateTransaction = createAsyncThunk(
  'transactions/validateTransaction',
  async (transactionId) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}api/transactions/${transactionId}/validate`, {
      method: 'POST',
    });
    const data = await response.json();
    return data; // Retourne la transaction validée
  }
);
 
export const addTransactions = createAsyncThunk(
  'transactions/addTransaction',
  async ({ amount, subtype, reason, userId ,donateur}, { getState, rejectWithValue }) => {
    try {
      const { userLogin } = getState();
      const token = userLogin?.userInfo?.token;

      const response = await fetch(`${process.env.REACT_APP_API_URL}api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          reason,
          donateur,
          userId,
          type: 'entrée', // Vous pouvez ajuster cela selon votre logique
          subtype,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add transaction');
      }

      const data = await response.json();
      return data; // Retourne la transaction ajoutée
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction(state, action) {
      const { subtype, amount, reason, name } = action.payload;
      const newTransaction = {
        id: Date.now(), // Remplacer par un ID généré par le backend
        amount,
        reason: subtype === 'collect' ? `${reason} (${name})` : reason,
        type: 'entrée',
        subtype,
        validatedByTreasurer: false,
        validatedByPresidentAndPCO: false,
        date: new Date(),
      };
      state.transactions.push(newTransaction);
    },
  },
});


export const { addTransaction } = transactionSlice.actions;

export default transactionSlice.reducer;

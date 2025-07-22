import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";
import AuthContext from './AuthContext';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = React.useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/credits/history");
      setTransactions(res.data.transactions || []);
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TransactionContext.Provider value={{ transactions, loading, fetchTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionContext; 
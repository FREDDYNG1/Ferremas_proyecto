import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
  // Intentar cargar la moneda preferida desde localStorage al inicio
  const [currency, setCurrency] = useState(() => {
    const savedCurrency = localStorage.getItem('monedaPreferida');
    return savedCurrency || 'CLP'; // Moneda por defecto: CLP
  });

  // Guardar la moneda seleccionada en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('monedaPreferida', currency);
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}; 
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore.js';

const Expenses = ({ tripId }) => {
  const { tripId: paramTripId } = useParams();
  const activeTripId = tripId || paramTripId;

  const { currentUser, isAuthenticated } = useAuthStore();

  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ totalExpenses: 0, totalParticipants: 0, equalShare: 0 });
  const [tripMembers, setTripMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get all expenses
      const expensesResponse = await axios.get(`${API_BASE_URL}/expense-api/trip/${activeTripId}`);
      setExpenses(expensesResponse.data);

      // Get summary
      const summaryResponse = await axios.get(`${API_BASE_URL}/expense-api/summary/${activeTripId}`);
      setSummary(summaryResponse.data);

      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch expenses data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTripMembers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/trip-api/trip/${activeTripId}`);
        setTripMembers(response.data.members || []);
        // Select all members by default
        setSelectedParticipants(response.data.members?.map((m) => m._id) || []);
      } catch (err) {
        console.error('Failed to fetch trip members for dropdown', err);
      }
    };

    if (activeTripId) {
      fetchTripMembers();
      fetchData();
    }
  }, [activeTripId]);

  const handleParticipantToggle = (memberId) => {
    if (selectedParticipants.includes(memberId)) {
      setSelectedParticipants(selectedParticipants.filter((id) => id !== memberId));
    } else {
      setSelectedParticipants([...selectedParticipants, memberId]);
    }
  };

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    if (!title || !amount) {
      alert('Title and amount are required.');
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/expense-api/create-expense`,
        {
          tripId: activeTripId,
          title,
          amount: parseFloat(amount),
          participants: selectedParticipants,
        },
        getAuthConfig()
      );
      setTitle('');
      setAmount('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create expense.');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/expense-api/delete-expense/${expenseId}`, getAuthConfig());
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete expense.');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      <h3 className="text-2xl font-bold text-white mb-6">Expense Splitter</h3>

      {/* Expense Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Total Trip Costs</p>
          <p className="text-2xl font-black text-white">${summary.totalExpenses?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Trip Participants</p>
          <p className="text-2xl font-black text-white">{summary.totalParticipants || 0} People</p>
        </div>
        <div className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Equal Share / Head</p>
          <p className="text-2xl font-black text-indigo-400">${summary.equalShare?.toFixed(2) || 0}</p>
        </div>
      </div>

      {/* Create Expense Form */}
      {isAuthenticated && (
        <form onSubmit={handleCreateExpense} className="bg-slate-950/40 border border-slate-800/80 p-5 rounded-2xl mb-8">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Add New Expense</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Expense Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flight Tickets, Hotel Booking"
                  className="w-full px-3.5 py-2.5 border border-slate-700 rounded-lg text-white bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Amount ($)</label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  placeholder="e.g. 120.00"
                  className="w-full px-3.5 py-2.5 border border-slate-700 rounded-lg text-white bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            {/* Participants selection */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Split with Participants</label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-slate-950/50 border border-slate-800 rounded-xl">
                {tripMembers.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No trip members found to split.</p>
                ) : (
                  tripMembers.map((member) => {
                    const isChecked = selectedParticipants.includes(member._id);
                    return (
                      <button
                        type="button"
                        key={member._id}
                        onClick={() => handleParticipantToggle(member._id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                            : 'bg-slate-800 border-slate-700/60 text-slate-400'
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${isChecked ? 'bg-indigo-400' : 'bg-slate-600'}`}></span>
                        {member.name}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
            >
              Add Expense
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm p-3 rounded-lg text-center mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : expenses.length === 0 ? (
        <p className="text-slate-400 text-center py-6 bg-slate-950/20 border border-dashed border-slate-800 rounded-2xl">
          No expenses recorded yet.
        </p>
      ) : (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Transactions</h4>
          <div className="grid grid-cols-1 gap-4">
            {expenses.map((expense) => {
              const isPayer = isAuthenticated && currentUser && expense.paidBy?._id === currentUser._id;
              
              return (
                <div
                  key={expense._id}
                  className="bg-slate-950/30 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-700/80 transition-all"
                >
                  <div>
                    <h5 className="text-base font-bold text-white leading-tight">{expense.title}</h5>
                    <p className="text-xs text-slate-500 mt-1">
                      Paid by: <span className="text-indigo-300 font-semibold">{expense.paidBy?.name || 'Unknown'}</span> • Split with:{' '}
                      <span className="text-slate-400 font-medium">
                        {expense.participants?.map((p) => p.name).join(', ') || 'No one'}
                      </span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-lg font-black text-white">${expense.amount?.toFixed(2)}</span>
                    {isPayer && (
                      <button
                        onClick={() => handleDeleteExpense(expense._id)}
                        className="p-2 rounded-lg hover:bg-red-500/15 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Expense"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { DollarSign, Users, CreditCard, Trash2, Plus, Loader2 } from 'lucide-react';
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
        const response = await axios.get(`${API_BASE_URL}/trip-api/trip/${activeTripId}`, getAuthConfig());
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-text-dark flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Expense Splitter
          </h3>
          <p className="text-xs text-text-muted">Track collective costs and split bills seamlessly</p>
        </div>
      </div>

      {/* Expense Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 border-l-4 border-l-primary p-5 rounded-xl shadow-sm">
          <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Total Trip Costs</p>
          <p className="text-2xl font-black text-text-dark flex items-center">
            <DollarSign className="w-5 h-5 text-text-dark shrink-0" />
            {summary.totalExpenses?.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-white border border-slate-200/80 border-l-4 border-l-slate-400 p-5 rounded-xl shadow-sm">
          <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Trip Participants</p>
          <p className="text-2xl font-black text-text-dark flex items-center gap-1.5">
            <Users className="w-5 h-5 text-slate-400 shrink-0" />
            {summary.totalParticipants || 0} People
          </p>
        </div>
        <div className="bg-white border border-slate-200/80 border-l-4 border-l-accent p-5 rounded-xl shadow-sm">
          <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Equal Share / Head</p>
          <p className="text-2xl font-black text-primary flex items-center">
            <DollarSign className="w-5 h-5 text-primary shrink-0" />
            {summary.equalShare?.toFixed(2) || 0}
          </p>
        </div>
      </div>

      {/* Create Expense Form */}
      {isAuthenticated && (
        <form onSubmit={handleCreateExpense} className="bg-slate-50 border border-slate-200/85 p-5 sm:p-6 rounded-xl">
          <h4 className="text-xs font-bold text-text-dark uppercase tracking-wider mb-4">Add New Expense</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-text-muted">Expense Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hiking Gear, Camping Spot"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-text-dark bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-semibold"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-text-muted">Amount ($)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                    <DollarSign className="h-3.5 w-3.5" />
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    placeholder="e.g. 120.00"
                    className="w-full pl-8 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-text-dark bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-semibold"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Participants selection */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-text-muted">Split with Participants</label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-white border border-slate-200 rounded-xl">
                {tripMembers.length === 0 ? (
                  <p className="text-xs text-text-muted italic font-medium">No trip members found to split.</p>
                ) : (
                  tripMembers.map((member) => {
                    const isChecked = selectedParticipants.includes(member._id);
                    return (
                      <button
                        type="button"
                        key={member._id}
                        onClick={() => handleParticipantToggle(member._id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all duration-300 cursor-pointer ${
                          isChecked
                            ? 'bg-primary/10 border-primary text-primary shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-text-muted hover:border-slate-300'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${isChecked ? 'bg-primary' : 'bg-slate-450'}`}></span>
                        {member.name}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 text-xs font-bold text-white bg-accent hover:bg-accent-hover rounded-xl shadow-md shadow-accent/15 transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Expense
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-650 text-xs p-3.5 rounded-xl text-center font-bold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-12 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
          <CreditCard className="w-10 h-10 text-slate-350 mx-auto mb-3" />
          <p className="text-text-muted text-sm font-medium">No expenses recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Transactions Ledger</h4>
          <div className="grid grid-cols-1 gap-3">
            {expenses.map((expense) => {
              const isPayer = isAuthenticated && currentUser && expense.paidBy?._id === currentUser._id;
              
              return (
                <div
                  key={expense._id}
                  className="bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md hover:border-primary/20 transition-all duration-300"
                >
                  <div>
                    <h5 className="text-sm font-bold text-text-dark leading-tight">{expense.title}</h5>
                    <p className="text-xs text-text-muted mt-1 font-medium">
                      Paid by: <span className="text-primary font-bold">{expense.paidBy?.name || 'Unknown'}</span> • Split with:{' '}
                      <span className="text-text-dark font-semibold">
                        {expense.participants?.map((p) => p.name).join(', ') || 'No one'}
                      </span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-50 pt-2 sm:pt-0">
                    <span className="text-base font-black text-text-dark">${expense.amount?.toFixed(2)}</span>
                    {isPayer && (
                      <button
                        onClick={() => handleDeleteExpense(expense._id)}
                        className="p-1.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-650 transition-all duration-300 cursor-pointer"
                        title="Delete Expense"
                      >
                        <Trash2 className="w-4 h-4" />
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

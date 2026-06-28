import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BarChart3, Trash2, Plus, Loader2, Vote, Check } from 'lucide-react';
import useAuthStore from '../store/authStore.js';

const Polls = ({ tripId }) => {
  const { tripId: paramTripId } = useParams();
  const activeTripId = tripId || paramTripId;

  const { currentUser, isAuthenticated } = useAuthStore();

  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']); // Start with 2 option fields

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  };

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/poll-api/trip/${activeTripId}`);
      setPolls(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load polls.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTripId) {
      fetchPolls();
    }
  }, [activeTripId]);

  const handleAddOptionField = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOptionField = (index) => {
    if (options.length <= 2) return;
    const updatedOptions = options.filter((_, idx) => idx !== index);
    setOptions(updatedOptions);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    const filteredOptions = options.filter((opt) => opt.trim() !== '');

    if (!question || filteredOptions.length < 2) {
      alert('Question and at least 2 options are required.');
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/poll-api/create-poll`,
        {
          tripId: activeTripId,
          question,
          options: filteredOptions,
        },
        getAuthConfig()
      );
      setQuestion('');
      setOptions(['', '']);
      fetchPolls();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create poll.');
    }
  };

  const handleVote = async (pollId, optionIndex) => {
    try {
      await axios.put(
        `${API_BASE_URL}/poll-api/vote/${pollId}`,
        { optionIndex },
        getAuthConfig()
      );
      fetchPolls();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register vote.');
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to delete this poll?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/poll-api/delete-poll/${pollId}`, getAuthConfig());
      fetchPolls();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete poll.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-text-dark flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Group Polls
          </h3>
          <p className="text-xs text-text-muted">Cast votes on choices and decide together</p>
        </div>
      </div>

      {/* Create Poll Form */}
      {isAuthenticated && (
        <form onSubmit={handleCreatePoll} className="bg-slate-50 border border-slate-200/85 p-5 sm:p-6 rounded-xl">
          <h4 className="text-xs font-bold text-text-dark uppercase tracking-wider mb-4">Create New Poll</h4>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-text-muted">Question</label>
              <input
                type="text"
                required
                placeholder="e.g. Which base camp should we start from?"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-text-dark bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-semibold"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-text-muted">Options</label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-xl text-text-dark bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-semibold"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOptionField(index)}
                        className="p-2 text-slate-400 hover:text-red-650 transition-all duration-300 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                onClick={handleAddOptionField}
                className="mt-2 text-xs font-bold text-primary hover:text-primary-hover transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Option
              </button>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 text-xs font-bold text-white bg-accent hover:bg-accent-hover rounded-xl shadow-md shadow-accent/15 transition-all duration-300 cursor-pointer"
            >
              Create Poll
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
      ) : polls.length === 0 ? (
        <div className="text-center py-12 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
          <Vote className="w-10 h-10 text-slate-350 mx-auto mb-3" />
          <p className="text-text-muted text-sm font-medium">No polls created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {polls.map((poll) => {
            const isPollCreator = isAuthenticated && currentUser && poll.createdBy?._id === currentUser._id;
            const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

            return (
              <div key={poll._id} className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-base font-bold text-text-dark leading-snug">{poll.question}</h4>
                    <p className="text-xs text-text-muted mt-1 font-medium">
                      Asked by: <span className="text-primary font-bold">{poll.createdBy?.name || 'Unknown'}</span>
                    </p>
                  </div>
                  {isPollCreator && (
                    <button
                      onClick={() => handleDeletePoll(poll._id)}
                      className="p-1.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-650 transition-all duration-300 cursor-pointer"
                      title="Delete Poll"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  )}
                </div>

                {/* Options and Voting buttons */}
                <div className="space-y-3">
                  {poll.options.map((opt, index) => {
                    const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;

                    return (
                      <div key={opt._id} className="relative group overflow-hidden rounded-xl border border-slate-200/85">
                        <div
                          className="absolute inset-y-0 left-0 bg-primary/5 transition-all duration-500 pointer-events-none"
                          style={{ width: `${percentage}%` }}
                        ></div>
                        <div className="relative flex justify-between items-center px-4 py-3.5 transition-all gap-4">
                          <span className="text-xs text-text-dark font-bold">{opt.text}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-text-muted font-semibold">{opt.votes} votes ({percentage}%)</span>
                            {isAuthenticated && (
                              <button
                                onClick={() => handleVote(poll._id, index)}
                                className="px-3 py-1.5 text-[10px] font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-sm transition-all duration-300 cursor-pointer"
                              >
                                Vote
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {totalVotes > 0 && (
                  <p className="text-[10px] text-text-muted text-right mt-3 font-bold">Total votes: {totalVotes}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Polls;

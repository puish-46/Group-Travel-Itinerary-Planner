import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
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
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      <h3 className="text-2xl font-bold text-white mb-6">Group Polls</h3>

      {/* Create Poll Form */}
      {isAuthenticated && (
        <form onSubmit={handleCreatePoll} className="bg-slate-950/40 border border-slate-800/80 p-5 rounded-2xl mb-8">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Create New Poll</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Question</label>
              <input
                type="text"
                required
                placeholder="e.g. Which beach should we visit first?"
                className="w-full px-3.5 py-2.5 border border-slate-700 rounded-lg text-white bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Options</label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-slate-700 rounded-lg text-white bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOptionField(index)}
                        className="p-2 text-slate-500 hover:text-red-400 cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                onClick={handleAddOptionField}
                className="mt-3 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Option
              </button>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
            >
              Create Poll
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
      ) : polls.length === 0 ? (
        <p className="text-slate-400 text-center py-6 bg-slate-950/20 border border-dashed border-slate-800 rounded-2xl">
          No polls created yet.
        </p>
      ) : (
        <div className="space-y-6">
          {polls.map((poll) => {
            const isPollCreator = isAuthenticated && currentUser && poll.createdBy?._id === currentUser._id;
            const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

            return (
              <div key={poll._id} className="bg-slate-950/30 border border-slate-800 rounded-2xl p-5 relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-base font-bold text-white leading-snug">{poll.question}</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Created by: <span className="text-slate-300 font-semibold">{poll.createdBy?.name || 'Unknown'}</span>
                    </p>
                  </div>
                  {isPollCreator && (
                    <button
                      onClick={() => handleDeletePoll(poll._id)}
                      className="p-1 rounded-lg hover:bg-red-500/15 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete Poll"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Options and Voting buttons */}
                <div className="space-y-3">
                  {poll.options.map((opt, index) => {
                    const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;

                    return (
                      <div key={opt._id} className="relative group">
                        <div
                          className="absolute inset-y-0 left-0 bg-indigo-500/10 rounded-xl transition-all duration-500 pointer-events-none"
                          style={{ width: `${percentage}%` }}
                        ></div>
                        <div className="relative flex justify-between items-center border border-slate-800/80 px-4 py-3 rounded-xl hover:border-slate-700 transition-all gap-4">
                          <span className="text-sm text-slate-300 font-medium">{opt.text}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 font-semibold">{opt.votes} votes ({percentage}%)</span>
                            {isAuthenticated && (
                              <button
                                onClick={() => handleVote(poll._id, index)}
                                className="px-3 py-1 text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
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
                  <p className="text-[11px] text-slate-500 text-right mt-3 font-medium">Total votes: {totalVotes}</p>
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

import express from 'express';
import PollModel from '../models/PollModel.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

// POST /create-poll - Create a poll for a trip (Protected)
router.post('/create-poll', verifyToken, async (req, res) => {
  try {
    const { tripId, question, options } = req.body;

    // Basic validation
    if (!tripId || !question || !options || !Array.isArray(options) || options.length === 0) {
      return res.status(400).json({ message: 'Trip ID, question, and options are required.' });
    }

    // Format options array
    const formattedOptions = options.map(opt => {
      if (typeof opt === 'string') {
        return { text: opt, votes: 0 };
      }
      return { text: opt.text, votes: opt.votes || 0 };
    });

    const newPoll = new PollModel({
      tripId,
      question,
      options: formattedOptions,
      createdBy: req.user.id
    });

    const savedPoll = await newPoll.save();
    res.status(201).json({ message: 'Poll created successfully.', poll: savedPoll });
  } catch (error) {
    res.status(500).json({ message: 'Server error during poll creation.', error: error.message });
  }
});

// GET /trip/:tripId - Get all polls for a trip
router.get('/trip/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;

    const polls = await PollModel.find({ tripId }).populate('createdBy', 'name email');
    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching polls.', error: error.message });
  }
});

// PUT /vote/:pollId - Increment vote count for selected option
router.put('/vote/:pollId', async (req, res) => {
  try {
    const { pollId } = req.params;
    const { optionIndex } = req.body;

    if (optionIndex === undefined) {
      return res.status(400).json({ message: 'Option index is required to vote.' });
    }

    const index = parseInt(optionIndex, 10);

    const poll = await PollModel.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found.' });
    }

    // Validate if the index is within range
    if (isNaN(index) || index < 0 || index >= poll.options.length) {
      return res.status(400).json({ message: 'Invalid option index.' });
    }

    // Increment vote count for that option
    poll.options[index].votes += 1;
    await poll.save();

    res.status(200).json({ message: 'Vote registered successfully.', poll });
  } catch (error) {
    res.status(500).json({ message: 'Server error registering vote.', error: error.message });
  }
});

// DELETE /delete-poll/:pollId - Delete poll (Protected, only creator can delete)
router.delete('/delete-poll/:pollId', verifyToken, async (req, res) => {
  try {
    const { pollId } = req.params;
    const userId = req.user.id;

    const poll = await PollModel.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found.' });
    }

    // Verify ownership
    if (poll.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied. Only the poll creator can delete this poll.' });
    }

    await PollModel.findByIdAndDelete(pollId);
    res.status(200).json({ message: 'Poll deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting poll.', error: error.message });
  }
});

export default router;

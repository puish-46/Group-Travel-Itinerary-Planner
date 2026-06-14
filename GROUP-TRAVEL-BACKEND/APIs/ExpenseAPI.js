import express from 'express';
import ExpenseModel from '../models/ExpenseModel.js';
import TripModel from '../models/TripModel.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

// POST /create-expense - Create expense (Protected)
router.post('/create-expense', verifyToken, async (req, res) => {
  try {
    const { tripId, title, amount, participants } = req.body;

    // Basic validation
    if (!tripId || !title || !amount) {
      return res.status(400).json({ message: 'Trip ID, title, and amount are required.' });
    }

    const payerId = req.user.id;

    // If participants are not specified, default to empty array
    const expenseParticipants = Array.isArray(participants) ? participants : [];

    const newExpense = new ExpenseModel({
      tripId,
      title,
      amount,
      paidBy: payerId,
      participants: expenseParticipants
    });

    const savedExpense = await newExpense.save();
    res.status(201).json({ message: 'Expense created successfully.', expense: savedExpense });
  } catch (error) {
    res.status(500).json({ message: 'Server error during expense creation.', error: error.message });
  }
});

// GET /trip/:tripId - Get all expenses for a trip
router.get('/trip/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;

    const expenses = await ExpenseModel.find({ tripId })
      .populate('paidBy', 'name email')
      .populate('participants', 'name email');

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching expenses.', error: error.message });
  }
});

// GET /summary/:tripId - Calculate total expenses, total participants, and equal share per person
router.get('/summary/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;

    // Fetch the trip to get the total number of members/participants
    const trip = await TripModel.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    const totalParticipants = trip.members.length;

    // Fetch all expenses for the trip
    const expenses = await ExpenseModel.find({ tripId });
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Calculate equal share
    const equalShare = totalParticipants > 0 ? (totalExpenses / totalParticipants) : 0;

    res.status(200).json({
      totalExpenses,
      totalParticipants,
      equalShare
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error calculating expense summary.', error: error.message });
  }
});

// DELETE /delete-expense/:expenseId - Delete expense (Protected, only the payer can delete)
router.delete('/delete-expense/:expenseId', verifyToken, async (req, res) => {
  try {
    const { expenseId } = req.params;
    const userId = req.user.id;

    const expense = await ExpenseModel.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found.' });
    }

    // Check if the logged-in user is the one who paid (paidBy)
    if (expense.paidBy.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied. Only the person who paid for this expense can delete it.' });
    }

    await ExpenseModel.findByIdAndDelete(expenseId);
    res.status(200).json({ message: 'Expense deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting expense.', error: error.message });
  }
});

export default router;

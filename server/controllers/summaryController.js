import Summary from '../models/summary.js';
import { v4 as uuidv4 } from 'uuid';

//  Create Summary
export const createSummary = async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;
    const summaryNumber = `SUM-${uuidv4().slice(0, 8).toUpperCase()}`;

    const newSummary = new Summary({
      userId,
      items,
      totalAmount,
      summaryNumber,
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60000) // 30 mins from now
    });

    await newSummary.save();

    res.status(201).json({
      message: 'Summary created successfully',
      summary: newSummary,
      summaryNumber: newSummary.summaryNumber,
      estimatedDeliveryTime: newSummary.estimatedDeliveryTime,
      status: newSummary.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Summary creation failed', error: error.message });
  }
};

//  Get Summary By ID
export const getSummaryById = async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.summaryId);
    if (!summary) {
      return res.status(404).json({ message: 'Summary not found' });
    }
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve summary', error: error.message });
  }
};

//  Get User Summaries
export const getUserSummaries = async (req, res) => {
  try {
    const summaries = await Summary.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(summaries);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve summaries', error: error.message });
  }
};

const Investment = require('../models/Investment');
const User = require('../models/User');

exports.createInvestment = async (req, res) => {
  const { amount } = req.body;

  if (amount < 50) {
    return res.status(400).json({ message: 'Minimum investment is $50.' });
  }

  try {
    const user = await User.findByPk(req.userId);

    if (!user) return res.status(404).json({ message: 'User not found.' });

    const now = new Date();
    const payoutDate = new Date();
    payoutDate.setDate(now.getDate() + 30);

    const investment = await Investment.create({
      amount,
      startDate: now,
      nextPayoutDate: payoutDate,
      UserId: user.id
    });

    user.investment += amount;
    await user.save();

    // If referred, pay 10% bonus to referrer
    if (user.referredBy) {
      const referrer = await User.findOne({ where: { referralCode: user.referredBy } });
      if (referrer) {
        referrer.referralBonus += amount * 0.1;
        await referrer.save();
      }
    }

    res.status(201).json({ message: 'Investment created successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Investment failed.', error: err.message });
  }
};

exports.getInvestments = async (req, res) => {
  try {
    const investments = await Investment.findAll({ where: { UserId: req.userId } });
    res.json(investments);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch investments.', error: err.message });
  }
};

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8);
};

exports.register = async (req, res) => {
  const { name, email, password, referralCode, country } = req.body;

  if (country.toLowerCase() === 'united states') {
    return res.status(403).json({ message: 'US investors are not allowed.' });
  }

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ where: { referralCode } });
      if (referrer) referredBy = referralCode;
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      referralCode: generateReferralCode(),
      referredBy,
      country
    });

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password.' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const referralLink = `${req.protocol}://${req.get('host')}/register?ref=${user.referralCode}`;

    res.json({
      name: user.name,
      email: user.email,
      balance: user.balance,
      investment: user.investment,
      referralBonus: user.referralBonus,
      referralLink
    });
  } catch (err) {
    res.status(500).json({ message: 'Dashboard error', error: err.message });
  }
};

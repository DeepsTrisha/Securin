const CVE = require('../models/cve');

exports.getCVEs = async (req, res, next) => {
  try {
    const cves = await CVE.find();
    res.json(cves);
  } catch (error) {
    next(error);
  }
};

exports.getCVEById = async (req, res, next) => {
  try {
    const cve = await CVE.findById(req.params.id);
    if (!cve) {
      return res.status(404).json({ message: 'CVE not found' });
    }
    res.json(cve);
  } catch (error) {
    next(error);
  }
};
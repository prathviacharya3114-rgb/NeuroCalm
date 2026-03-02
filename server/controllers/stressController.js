const Session = require('../models/Session');
const { v4: uuidv4 } = require('uuid');

exports.analyzeStress = (req, res) => {
    const { tapSpeed = 0, accelerometerRMS = 0, isLateNight = false, ambientLight = 100 } = req.body;

    let score = 0;
    if (tapSpeed > 4) score += 40;
    else if (tapSpeed > 2.5) score += 25;
    else score += 10;

    if (accelerometerRMS > 12) score += 30;
    else if (accelerometerRMS > 6) score += 15;

    if (isLateNight) score += 20;

    if (ambientLight < 50) score += 10;

    const stressLevel = score >= 80 ? "CRITICAL" : score >= 60 ? "HIGH" : score >= 35 ? "MEDIUM" : "LOW";
    const interventionType = (stressLevel === "CRITICAL" || stressLevel === "HIGH") ? "breathing" : stressLevel === "MEDIUM" ? "grounding" : "haptic_reset";

    res.json({ stressLevel, stressScore: score, interventionType });
};

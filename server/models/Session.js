const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    stressLevel: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], required: true },
    stressScore: { type: Number, required: true },
    triggers: {
        tapSpeed: Number,
        accelerometerRMS: Number,
        isLateNight: Boolean,
        ambientLight: Number
    },
    interventionType: { type: String, enum: ["breathing", "grounding", "affirmation", "haptic_reset"], required: true },
    completedIntervention: { type: Boolean, default: false }
});

module.exports = mongoose.model('Session', sessionSchema);

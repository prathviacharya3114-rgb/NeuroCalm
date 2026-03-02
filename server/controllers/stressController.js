const Session = require('../models/Session');
const { v4: uuidv4 } = require('uuid');

exports.analyzeStress = async (req, res) => {
    try {
        const { tapSpeed = 0, accelerometerRMS = 0, isLateNight = false, ambientLight = 100 } = req.body;

        let score = 0;
        // Tap Speed (0-40)
        if (tapSpeed > 4) score += 40;
        else if (tapSpeed > 2.5) score += 25;
        else score += 10;

        // Motion Intensity (0-30)
        if (accelerometerRMS > 12) score += 30;
        else if (accelerometerRMS > 6) score += 15;

        // Late Night Usage (0-20)
        if (isLateNight) score += 20;

        // Ambient Light (0-10)
        if (ambientLight < 50) score += 10;

        // Categorize Stress
        const stressLevel = score >= 80 ? "CRITICAL" : score >= 60 ? "HIGH" : score >= 35 ? "MEDIUM" : "LOW";

        // Intervention Logic
        // HIGH/CRITICAL -> breathing, MEDIUM -> grounding, LOW -> affirmation
        let interventionType = "haptic_reset"; // Default fallback
        if (stressLevel === "CRITICAL" || stressLevel === "HIGH") {
            interventionType = "breathing";
        } else if (stressLevel === "MEDIUM") {
            interventionType = "grounding";
        } else {
            interventionType = "affirmation";
        }

        // Save to MongoDB
        const session = new Session({
            sessionId: uuidv4(),
            stressLevel,
            stressScore: score,
            triggers: {
                tapSpeed,
                accelerometerRMS,
                isLateNight,
                ambientLight
            },
            interventionType
        });

        await session.save();

        res.json({
            success: true,
            data: {
                stressLevel,
                stressScore: score,
                interventionType,
                sessionId: session.sessionId
            }
        });
    } catch (error) {
        console.error("Error analyzing stress:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

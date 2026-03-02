const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const { v4: uuidv4 } = require('uuid');

router.post('/', async (req, res) => {
    try {
        const sessionData = {
            ...req.body,
            sessionId: req.body.sessionId || uuidv4()
        };
        const session = new Session(sessionData);
        await session.save();
        res.status(201).json(session);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create session' });
    }
});

router.get('/', async (req, res) => {
    try {
        const sessions = await Session.find().sort({ timestamp: -1 }).limit(20);
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
});

module.exports = router;

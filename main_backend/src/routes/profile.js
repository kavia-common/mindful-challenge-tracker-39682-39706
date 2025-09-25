'use strict';

const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profile');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Profile
 *     description: User profile management
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/', requireAuth, (req, res) => { getProfile(req, res); });

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Update current user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               bio: { type: string }
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 */
router.put('/', requireAuth, (req, res) => { updateProfile(req, res); });

module.exports = router;

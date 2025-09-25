const express = require('express');
const healthController = require('../controllers/health');
const authRoutes = require('./auth');
const profileRoutes = require('./profile');
const painRoutes = require('./pain');

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * tags:
 *   - name: Health
 *     description: Service health
 *   - name: Auth
 *     description: User authentication
 *   - name: Profile
 *     description: User profile management
 *   - name: Pain
 *     description: Pain/discomfort tracking
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

// Mount feature routes
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/pain', painRoutes);

module.exports = router;

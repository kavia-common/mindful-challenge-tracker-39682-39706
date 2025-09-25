'use strict';

const express = require('express');
const { listPain, createPain, getPain, updatePain, deletePain } = require('../controllers/pain');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Pain
 *     description: Pain/discomfort tracking
 */

/**
 * @swagger
 * /pain:
 *   get:
 *     summary: List pain entries
 *     tags: [Pain]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List retrieved
 */
router.get('/', requireAuth, (req, res) => { listPain(req, res); });

/**
 * @swagger
 * /pain:
 *   post:
 *     summary: Create pain entry
 *     tags: [Pain]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [intensity, location]
 *             properties:
 *               intensity: { type: integer, minimum: 1, maximum: 10 }
 *               location: { type: string }
 *               description: { type: string }
 *               occurredAt: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Entry created
 */
router.post('/', requireAuth, (req, res) => { createPain(req, res); });

/**
 * @swagger
 * /pain/{id}:
 *   get:
 *     summary: Get pain entry by id
 *     tags: [Pain]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200:
 *         description: Entry retrieved
 *       404:
 *         description: Not found
 */
router.get('/:id', requireAuth, (req, res) => { getPain(req, res); });

/**
 * @swagger
 * /pain/{id}:
 *   put:
 *     summary: Update pain entry
 *     tags: [Pain]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               intensity: { type: integer, minimum: 1, maximum: 10 }
 *               location: { type: string }
 *               description: { type: string }
 *               occurredAt: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Entry updated
 *       404:
 *         description: Not found
 */
router.put('/:id', requireAuth, (req, res) => { updatePain(req, res); });

/**
 * @swagger
 * /pain/{id}:
 *   delete:
 *     summary: Delete pain entry
 *     tags: [Pain]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200:
 *         description: Entry deleted
 *       404:
 *         description: Not found
 */
router.delete('/:id', requireAuth, (req, res) => { deletePain(req, res); });

module.exports = router;

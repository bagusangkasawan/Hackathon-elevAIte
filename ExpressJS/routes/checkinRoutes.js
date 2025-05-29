const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { checkin, getCheckins, getRecommendation } = require('../controllers/checkinController');

/**
 * @swagger
 * tags:
 *   name: Checkin
 *   description: Daily mood check-ins and recommendations
 */

/**
 * @swagger
 * /checkin:
 *   post:
 *     summary: Submit daily mood check-in
 *     tags: [Checkin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mood
 *               - description
 *             properties:
 *               mood:
 *                 type: string
 *                 enum: [baik, sedang, buruk]
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Check-in saved
 *       400:
 *         description: User already checked in today
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, checkin);

/**
 * @swagger
 * /checkin:
 *   get:
 *     summary: Get all check-ins of the user
 *     tags: [Checkin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of check-ins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   mood:
 *                     type: string
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 */
router.get('/', authMiddleware, getCheckins);

/**
 * @swagger
 * /checkin/recommendation:
 *   get:
 *     summary: Get mood analysis and activity recommendation based on last 3 check-ins
 *     tags: [Checkin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recommendation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recommendation:
 *                   type: string
 *       400:
 *         description: No check-ins found
 */
router.get('/recommendation', authMiddleware, getRecommendation);

module.exports = router;

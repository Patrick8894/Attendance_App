const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const appealController = require('../controllers/appealController');

/**
 * @swagger
 * /appeal:
 *   get:
 *     summary: Retrieve a list of appeals
 *     responses:
 *       200:
 *         description: A list of appeals
 */
router.get('/', appealController.getAllAppeals);

/**
 * @swagger
 * /appeal/new:
 *   post:
 *     summary: Create a new appeal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uin:
 *                 type: string
 *               classId:
 *                 type: string
 *               appealReason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created a new appeal
 */
router.post(
    '/new',
    [
      body('uin').isString().withMessage('UIN must be a string'),
      body('classId').isString().withMessage('Class ID must be a string'),
      body('appealReason').isString().withMessage('Appeal Reason must be a string'),
    ],
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
    appealController.createAppeal
);

/**
/**
 * @swagger
 * /appeal/{id}:
 *   post:
 *     summary: Review an appeal
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the appeal to review
 *     responses:
 *       200:
 *         description: Updated the appeal
 */
router.post('/:id', appealController.reviewAppeal);

module.exports = router;
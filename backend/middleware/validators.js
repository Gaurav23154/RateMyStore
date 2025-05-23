const { body } = require('express-validator');

const registerValidation = [
    body('name')
        .isLength({ min: 2, max: 60 })
        .withMessage('Name must be between 2 and 60 characters'),
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email'),
    body('password')
        .isLength({ min: 8, max: 32 })
        .withMessage('Password must be between 8 and 32 characters')
        .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
        .withMessage('Password must contain at least one uppercase letter and one special character'),
    body('address')
        .isLength({ max: 400 })
        .withMessage('Address must not exceed 400 characters'),
    body('role')
        .isIn(['admin', 'store_owner', 'user'])
        .withMessage('Invalid role selected')
];

const storeValidation = [
    body('name')
        .isLength({ min: 2, max: 60 })
        .withMessage('Name must be between 2 and 60 characters'),
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email'),
    body('address')
        .isLength({ max: 400 })
        .withMessage('Address must not exceed 400 characters')
];

const ratingValidation = [
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    body('store_id')
        .isInt()
        .withMessage('Invalid store ID')
];

const passwordUpdateValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 8, max: 16 })
        .withMessage('Password must be between 8 and 16 characters')
        .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
        .withMessage('Password must contain at least one uppercase letter and one special character')
];

module.exports = {
    registerValidation,
    storeValidation,
    ratingValidation,
    passwordUpdateValidation
}; 
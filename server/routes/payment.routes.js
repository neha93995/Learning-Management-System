// import Router from 'express';
// import { allPayments, buySubscription, cancelSubscription, getRazorpayApiKey, verifySubscription } from '../controllers/payment.controller.js';
// import { authorizedRoles, isLoggedIn } from '../middlewares/auth.middleware.js';

// const router = Router();

// router
//     .route('/razorpay-key')
//     .get(
//         isLoggedIn,
//         getRazorpayApiKey);

// router
//     .router('/subscription')
//     .post(
//         isLoggedIn,
//         buySubscription);

// router
//     .router('/verify')
//     .post(
//         isLoggedIn,
//         verifySubscription);

// router
//     .route('/unsubscribe')
//     .post(
//         isLoggedIn,
//         cancelSubscription);

// router
//     .route('/')
//     .get(
//         isLoggedIn,
//         authorizedRoles('ADMIN'),
//         allPayments
//         );

// export default router;
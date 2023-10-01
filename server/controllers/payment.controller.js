
import User from '../models/'
import {config} from 'dotenv';
import AppError from '../utils/error.util';
import { razorpay } from '../server';
config();

export const getRazorpayApiKey = async(req, res, next)=>
{

    res.status(200).json({
        success:true,
        message:"RAZORPAY API KEY",
        key:process.env.RAZORPAY_KEY_ID
    });
}


export const buySubscription = async(req, res, next)=>
{

    const {id} = req.user;

    const user = await User.findById(id);

    if(!user)
    {
        return next(new AppError("unauthorized , please login"));
    }


    if(user.role === 'ADMIN')
    {
        return next(new AppError('admin can not purchase a subscription',400));
    }


    const subscription = await razorpay.subscriptions.create({
        plan_id:process.env.RAZORPAY_PLAN_ID,
        customer_notify:1
    });

    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;


    await user.save();

    res.status(200).json({
        success:true,
        message:"Subscribed successfully",
        subscription_id:subscription.id
    })

}

export const verifySubscription = async(req, res, next)=>
{
    const {id} = req.user;

    const {razorpay_payment_id, razorpay_signature, razorpay_subscription_id } = req.body;


    const user = await User.findById(id);

    if(!user)
    {
        return next(new AppError("Unauthorized, please login"));
    }

    const subscriptionId = user.subscription.id;

    const genereatedSignature = crypto
    .createHmac('sha256',process.env.RAZORPAY_SECRET)
    .update(`${razorpay_payment_id}|${subscriptionId}`)
    .digest('hex');

    if(genereatedSignature != razorpay_signature)
    {
        return next(new AppError('Payment not verified, please try again',500));
    }

    await Payment.create({
        razorpay_payment_id,
        razorpay_signature,
        razorpay_subscription_id,
    })

}

export const cancelSubscription = async(req, res, next)=>
{

}

export const allPayments = async(req, res, next)=>
{

}


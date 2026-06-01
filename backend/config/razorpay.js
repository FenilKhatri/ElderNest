import Razorpay from "razorpay";

let instance = null;

const getRazorpayInstance = () => {
    if (!instance) {
        instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy",
            key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
        });
    }
    return instance;
};

export default getRazorpayInstance;

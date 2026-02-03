const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }, // price at time of order
    attributes: { type: mongoose.Schema.Types.Mixed },
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
    fullName: String,
    street: String,
    city: String,
    postalCode: String,
    country: String,
}, { _id: false });

const paymentSchema = new mongoose.Schema({
    provider: String,
    paymentId: String,
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    meta: { type: mongoose.Schema.Types.Mixed }, // any provider-specific info
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'KZT' },
    status: { type: String, enum: ['created', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'], default: 'created' },
    shippingAddress: shippingAddressSchema,
    payment: paymentSchema,
    notes: { type: String },
}, {
    timestamps: true
});

// Index for fast user order queries
orderSchema.index({ user: 1, createdAt: -1 });

// Static factory: create order from cart and user info
orderSchema.statics.createFromCart = async function ({ userId, cart, shippingAddress, paymentInfo }) {
    if (!cart || !cart.items || cart.items.length === 0) throw new Error('Cart is empty');

    const items = cart.items.map(it => ({
        product: it.product,
        quantity: it.quantity,
        price: it.priceAtAdd,
        attributes: it.attributes,
    }));

    const totalAmount = items.reduce((s, i) => s + (i.price * i.quantity), 0);

    const order = new this({
        user: userId,
        items,
        totalAmount,
        currency: 'KZT',
        shippingAddress,
        payment: paymentInfo,
    });

    return order.save();
};

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
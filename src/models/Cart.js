const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    priceAtAdd: { type: Number, required: true, min: 0 }, // snapshot of price when added
    attributes: { type: mongoose.Schema.Types.Mixed }, // e.g., size, color
    addedAt: { type: Date, default: Date.now },
}, { _id: false });

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
}, {
    timestamps: true
});

cartSchema.methods.addItem = async function (productId, qty = 1, priceAtAdd = null, attributes = {}) {
    qty = Number(qty);
    if (qty <= 0) throw new Error('Quantity must be > 0');

    if (priceAtAdd === null) {
        const Product = mongoose.model('Product');
        const prod = await Product.findById(productId).select('price');
        if (!prod) throw new Error('Product not found');
        priceAtAdd = prod.price;
    }

    const existing = this.items.find(it =>
        it.product.toString() === productId.toString() &&
        JSON.stringify(it.attributes || {}) === JSON.stringify(attributes || {})
    );

    if (existing) {
        existing.quantity += qty;
    } else {
        this.items.push({ product: productId, quantity: qty, priceAtAdd, attributes });
    }

    // this.updatedAt = new Date(); -- УДАЛЕНО (Mongoose сделает это сам при .save())
    return this.save();
};

// Calculate total price (sum of priceAtAdd * qty)
cartSchema.methods.getTotal = function () {
    return this.items.reduce((sum, it) => sum + (it.priceAtAdd * it.quantity), 0);
};

// Remove item or decrease quantity
cartSchema.methods.removeItem = function (productId, qty = null, attributes = {}) {
    const idx = this.items.findIndex(it => it.product.toString() === productId.toString() && JSON.stringify(it.attributes || {}) === JSON.stringify(attributes || {}));
    if (idx === -1) return this.save();

    if (qty === null || this.items[idx].quantity <= qty) {
        this.items.splice(idx, 1);
    } else {
        this.items[idx].quantity -= qty;
    }
    return this.save();
};

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
    key: { type: String, required: true },
    value: { type: String, required: true },
}, { _id: false });

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true, index: true },
    description: { type: String, default: '' },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false },
    images: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'KZT' },
    stock: { type: Number, default: 0, min: 0 },
    attributes: [attributeSchema],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

function makeSlug(text) {
    return text
        .toString()
        .normalize('NFKD')            // normalize accents
        .replace(/[^\w\s-]/g, '')    // remove non-word chars
        .trim()
        .replace(/\s+/g, '-')
        .toLowerCase();
}

// If slug missing, create from title
productSchema.pre('validate', function (next) {
    if (!this.slug && this.title) {
        this.slug = makeSlug(this.title);
    }
    next();
});

// Virtual for availability
productSchema.virtual('isInStock').get(function () {
    return this.stock > 0;
});

// Instance method to decrease stock (use in order flow)
productSchema.methods.decreaseStock = async function (qty = 1) {
    if (qty < 0) throw new Error('The quantity must be positive');

    const updatedProduct = await mongoose.model('Product').findOneAndUpdate(
        { _id: this._id, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { new: true }
    );

    if (!updatedProduct) throw new Error('Not enough goods in stock');
    this.stock = updatedProduct.stock;
    return this;
};

const Product = mongoose.model('Product', productSchema);
module.exports = Product;

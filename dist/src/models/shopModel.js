"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
//The Model type provides the mongoose methods
const shopSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please provide product name'],
        trim: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true
    },
    description: {
        type: String,
        required: [true, 'Please provide product description']
    },
    logo: {
        url: {
            type: String
        },
        secure_url: {
            type: String
        }
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviews: [{
            userId: { type: mongoose_1.Types.ObjectId, ref: 'User', required: true },
            title: String,
            description: String,
            images: [{ id: String, secure_url: String, url: String }],
            star: { type: Number, min: 0, max: 5, default: 0 },
            date: { type: Date, default: Date.now }
        }],
    address: {
        type: String,
        require: true
    },
    updated: Date,
    created: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
});
exports.default = (0, mongoose_1.model)('Shop', shopSchema);
//# sourceMappingURL=shopModel.js.map
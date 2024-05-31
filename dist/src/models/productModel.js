"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please provide product name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide product description']
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: [true, 'Please provide product price'],
        maxlength: [6, 'Product price should not exceed 6 digits']
    },
    currencyCode: {
        type: String,
        required: [true, 'Please provide product price'],
        uppercase: true,
        enum: ['INR'],
    },
    brand: {
        type: String,
        required: [true, 'Please provide product brand']
    },
    color: {
        type: String,
        required: true
    },
    sizes: [{ type: String }],
    image: {
        url: {
            type: String
        },
        secure_url: {
            type: String
        }
    },
    images: [
        {
            url: {
                type: String,
                required: true
            },
            secure_url: {
                type: String,
                required: true
            }
        }
    ],
    ratings: {
        type: Number,
        default: 0
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    sellerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shopId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true,
    },
    reviews: [{
            userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true },
            title: { type: String },
            description: { type: String },
            star: { type: Number, min: 0, max: 5, default: 0 },
            date: { type: Date, default: Date.now }
        }],
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Unisex'],
        default: null,
        required: true
    },
    stock: {
        type: Number,
        default: 0
    },
    isDiscontinued: {
        type: Boolean,
        default: false
    },
    keywords: [String],
    updatedAt: { type: Date },
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // }
}, {
    timestamps: true
});
// productSchema.pre<ProductDocument>(/^save$/, async function (next): Promise<void> {
//   if (!this.isModified('name')) {
//     next(); return
//   }
//   this.name = this..split(' ').map((item) => item.charAt(0).toUpperCase() + item.slice(1)).join(' ')
//   if (!this.isModified('category')) {
//     next(); return
//   }
//   this.category = this.brand.split(' ').map((item) => item.charAt(0).toUpperCase() + item.slice(1)).join(' ')
//   if (!this.isModified('brand')) {
//     next(); return
//   }
//   this.brand = this.name.split(' ').map((item) => item.charAt(0).toUpperCase() + item.slice(1)).join(' ')
// })
productSchema.pre('save', function (next) {
    this.updatedAt = new Date(Date.now());
    next();
});
exports.default = mongoose_1.default.model('Product', productSchema);
//# sourceMappingURL=productModel.js.map
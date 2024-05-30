"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
//The Model type provides the mongoose methods
const categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please provide product name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide product description']
    },
    image: {
        secure_url: {
            type: String
        }
    },
    created: {
        type: Date,
        default: Date.now
    }
});
exports.default = (0, mongoose_1.model)('Category', categorySchema);
//# sourceMappingURL=categoryModel.js.map
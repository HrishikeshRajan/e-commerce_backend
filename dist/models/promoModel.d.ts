import mongoose from 'mongoose';
import { Promo } from 'types/CouponManagement';
export interface PromoDocument extends Promo {
}
declare const PromoModel: mongoose.Model<PromoDocument, {}, {}, {}, mongoose.Document<unknown, {}, PromoDocument> & Omit<PromoDocument & Required<{
    _id: string;
}>, never>, any>;
export default PromoModel;
//# sourceMappingURL=promoModel.d.ts.map
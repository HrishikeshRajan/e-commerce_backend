
import { Request, Response, NextFunction } from 'express'
import { IResponse } from 'types/IResponse.interfaces';
import Loggerfactory from '@utils/LoggerFactory/LoggerFactory'
import { sendHTTPResponse } from '@services/response.services';
import { StatusCodes } from 'http-status-codes';
import FlashSale from '@models/flashSale.model';
import { convertToBase64 } from '@utils/image.helper';
import Cloudinary from '@repositories/ImageProcessing.repository';
import { ImageProcessingServices } from '@services/image.processing.services';
import { UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { imageUrl } from 'types/cloudinary.interfaces';
import { merge } from 'lodash';
import CartModel, { CartCore, CartItemCore, ORDER_STATUS } from '@models/cartModel';
import { Types } from 'mongoose';
import currency from 'currency.js';
import productModel from '@models/productModel';
const logger = Loggerfactory.getLogger('development')()
import mongoose from 'mongoose';
import { ProductDocument } from 'types/product.interface';
import CustomError from '@utils/CustomError';
const handleImageUpload = async (req: Request): Promise<UploadApiResponse> => {
    const options: UploadApiOptions = {
        folder: 'offers',
        gravity: 'auto',
    }
    const base64: string | undefined = convertToBase64(req)
    const ImageServiceRepository = new Cloudinary()
    const imageServices = new ImageProcessingServices()
    const imageUrls: UploadApiResponse = await imageServices.uploadImage(ImageServiceRepository, base64 as string, options)
    return imageUrls
}

export const create = async (
    req: Request,
    res: Response<IResponse, {}>,
    next: NextFunction):
    Promise<void> => {
    try {

        console.log(req.body)
        // const secure_url = await handleImageUpload(req)
        // const url = (await secure_url).secure_url
        // console.log(url)
        logger.info(`Flash sale create controller initiated. user: ${req.user.id}`);

        // const secure_url = await handleImageUpload(req)
        // req.body.banner.secure_url = (await secure_url).secure_url
        merge(req.body, { banner: { secure_url: 'https://res.cloudinary.com/dxv2tmvfw/image/upload/v1710495002/offers/s0zqyfnstdyeeaojhelq.png' } })
        merge(req.body, { users: { maxUsersCount: 10 } })

        const product = await productModel.findById(req.body.product, '_id price stock')
        if (!product) {
            return next(new CustomError('No product found', StatusCodes.NOT_FOUND, false))
        }

        if (product.stock < req.body.totalQuantityToSell) {
            return next(new CustomError('Not enough stock', StatusCodes.NOT_FOUND, false))
        }

        req.body.currentStock = req.body.totalQuantityToSell

        // if(req.body.type === 'PERCENTAGE'){

        // }
        // if(req.body.type === 'FLAT') {}

        //     const savings = (product.price / 100) * req.body.discountPercentage
        //     const gstInPercentage = 12
        //     const tax = currency(product.price).multiply(gstInPercentage).divide(100)
        //     const priceAfterDiscount = currency(product.price).subtract(savings).add(tax.value).value
        //     const discounted = { priceAfterDiscount }
        //     merge(req.body, discounted)
        //   console.log(req.body)

        const flashsale = await FlashSale.create(req.body)


        product.stock -= req.body.totalQuantityToSell
        product.modifiedPaths()
        await product.save()

        const response: IResponse = {
            res,
            message: {
                message: flashsale
            },
            success: true,
            statusCode: StatusCodes.CREATED
        }
        sendHTTPResponse(response)
    } catch (error: unknown) {
        console.log(error)
        logger.error('An error occurred', { error });
        next(error)
    }
}
//Flash sale type issue, not showing in client side

export const get = async (
    req: Request,
    res: Response<IResponse, {}>,
    next: NextFunction):
    Promise<void> => {
    try {

        logger.info(`Flash sale create controller initiated`);


        const sale = await FlashSale.find({}).sort({ _id: -1 })
        const response: IResponse = {
            res,
            message: {
                sale: sale[0]
            },
            success: true,
            statusCode: StatusCodes.OK
        }
        sendHTTPResponse(response)
    } catch (error: unknown) {
        console.log(error)
        logger.error('An error occurred', { error });
        next(error)
    }
}

export const moveToCart = async (
    req: Request,
    res: Response<IResponse, {}>,
    next: NextFunction):
    Promise<void> => {
    try {

        logger.info(`moveToCart controller initiated. user: ${req.user.id}`);
        const sale = await FlashSale.findById(req.params.saleId).populate<{ product: { _id: string, price: number, stock: number } }>('product', 'price stock _id')
        if (!sale) throw new Error('No flash sale found')

        if (sale.users?.usedBy.includes(req.user.id)) {
            throw new Error('Not Applicable')
        }
        const productPrice = sale?.product?.price
        const gstInPercentage = 12
        const tax = currency(sale.product.price).multiply(gstInPercentage).divide(100)

        let cartObject = {
            userId: new mongoose.Types.ObjectId(req.user.id),
            grandTotalPrice: sale.priceAfterDiscount! + tax.value,
            grandTotalQty: 1,
            grandTotalPriceString: '1000',
            products: {}
        }
        const orderItem: CartItemCore = {
            product: new Types.ObjectId(sale?.product._id),
            qty: 1,
            options: req.body.options,
            orderStatus: ORDER_STATUS.NOT_PROCESSED,
            totalPrice: productPrice,
            gstInPercentage,
            taxAmount: tax.value,
            totalPriceBeforeTax: productPrice,
            totalPriceAfterTax: Math.round(productPrice + tax.value),
            discount: {
                discountSourceId: sale._id,
                source: 'FlashSale'
            }
        }


        //@ts-ignore
        cartObject.products[sale.product._id.toString()] = orderItem
        console.log(req.body)
        const cart = await CartModel.create(cartObject)
        sale.users?.usedBy.push(req.user.id)
        sale.modifiedPaths()
        await sale.save()
        const response: IResponse = {
            res,
            message: {
                cart: cart
            },
            success: true,
            statusCode: StatusCodes.CREATED
        }
        sendHTTPResponse(response)
    } catch (error: unknown) {
        logger.error('An error occurred', { error });
        next(error)
    }
}



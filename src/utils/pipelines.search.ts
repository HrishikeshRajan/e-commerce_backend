import { Types } from "mongoose"

export const getMatchPipleLine = (key: string, value: string) => {

    switch (key) {
      case 'orderId': return {
        '$match': {
          //@ts-ignore
          'order.orderId': new Types.ObjectId(value)
        }
      }
      
      case 'productNames': return {
        "$search": {
          "regex": {
            "path": "order.product.name",
            "query": value
          }
        }
      }
      case 'productName': return {
        '$match': {
          //@ts-ignore
          'order.product.name': value
        }
      }
      case 'customerId': return {
        '$match': {
          //@ts-ignore
          'order.customerId._id':  new Types.ObjectId(value)
        }
      }
      case 'productId': return {
        '$match': {
          //@ts-ignore
          'order.product.productId':  new Types.ObjectId(value)
        }
      }
      case 'qty': return {
        '$match': {
          //@ts-ignore
          'order.qty':  Number(value)
        }
      }
      case 'stock': return {
        '$match': {
          //@ts-ignore
          'order.product.stock':  Number(value)
        }
      }
      case 'size': return {
        '$match': {
          //@ts-ignore
          'order.options.size': value
        }
      }
      case 'color': return {
        '$match': {
          //@ts-ignore
          'order.options.color':  value
        }
      }
      case 'productPrice': return {
        '$match': {
          //@ts-ignore
          'order.product.price':  Number(value)
        }
      }
      case 'taxAmount': return {
        '$match': {
          //@ts-ignore
          'order.taxAmount':  Number(value)
        }
      }
      case 'totalPriceAfterTax': return {
        '$match': {
          //@ts-ignore
          'order.totalPriceAfterTax':  {
            '$gte': Number(value)
          }
        }
        
      }
      case 'paymentId': return {
        '$match': {
          //@ts-ignore
          'order.paymentDetails.paymentId':  value
        }
      }
      default: return null
    }
  
  
  }
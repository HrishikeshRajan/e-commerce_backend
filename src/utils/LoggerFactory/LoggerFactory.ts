
import { devLogger } from "./DevelopmentLogger";
import { productionLogger } from "./ProductionLogger";

let logger = devLogger
if (process.env.NODE_ENV === 'production') {
    logger = productionLogger
}

export default logger
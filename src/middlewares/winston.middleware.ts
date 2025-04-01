import devLogger from '../utils/log/dev.logger';
import uatLogger from '../utils/log/uat.logger';
import prdLogger from '../utils/log/prd.logger';
import { SERVER, ENV_TYPE } from '../config';
const env = SERVER.ENV;

// กำหนดประเภทของ logger ให้ชัดเจน
let logger: ReturnType<typeof devLogger | typeof uatLogger | typeof prdLogger>;

// ตรวจสอบสภาพแวดล้อมและตั้งค่า logger ที่เหมาะสม
switch (env) {
    case ENV_TYPE.Dev:
        logger = devLogger();
        break;
    case ENV_TYPE.Uat:
        logger = uatLogger();
        break;
    case ENV_TYPE.Prd:
        logger = prdLogger();
        break;
    default:
        logger = devLogger(); // ค่า default ในกรณีที่ไม่มีการตั้งค่า
}

export default logger;

import winston from 'winston';
import 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';

const { DailyRotateFile, File, Console } = winston.transports;
const { combine, timestamp, label, printf, colorize } = winston.format;
import { SERVER, ENV_TYPE, LOG_DIR } from '../../config';
import { getTransactionId } from '../transaction.util';

const env = SERVER.ENV;

// สร้าง Folder logs Directory ถ้ายังไม่มี
const createLogDirectory = async (): Promise<void> => {
    try {
        await fs.promises.mkdir(LOG_DIR as string, { recursive: true });
    } catch (error) {}
};

// เรียกใช้ฟังก์ชันสร้าง log directory
createLogDirectory();

// กำหนดเส้นทางของไฟล์ log
const filenameInfo = path.resolve(LOG_DIR as string, `info-%DATE%.log`);
const filenameError = path.resolve(LOG_DIR as string, `error-%DATE%.log`);

// กำหนด Level Logger ตาม ENV
const levelLogger = () => {
    return env === ENV_TYPE.Dev ? 'debug' : 'warn';
};

// กำหนดสีสำหรับระดับข้อความ
const customColors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'gray'
};

winston.addColors(customColors);

// กำหนดการตั้งค่า Format Logger => {Console, DailyRotateFile}
const printLogger = printf(({ timestamp, level, message, label }) => {
    const transactionId = getTransactionId();
    const fileName = `${path.basename(require.main?.filename || 'unknown')}`;
    return `${timestamp} [${label}] [${transactionId}] ${fileName} ${level} : ${message}`;
});

// กำหนดการตั้งค่าของ Console
const consoleTransport = new Console({
    level: levelLogger(),
    format: combine(
        label({ label: env }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        colorize({ all: true }), // ใช้ colorize ทุกระดับ
        printLogger
    )
});

// กำหนดการตั้งค่าของ dailyRotateFileTransport
const dailyRotateFileTransportInfo = new DailyRotateFile({
    level: levelLogger(),
    filename: filenameError,
    datePattern: `YYYY-MM-DD`,
    format: combine(label({ label: env }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), printLogger),
    zippedArchive: true, // บีบอัดไฟล์ log เก่าหลังจากหมุนเวียน
    maxSize: '5m', // ขนาดสูงสุดของไฟล์ log ก่อนหมุนเวียน
    maxFiles: '1d' // เก็บไฟล์ log ไว้ 1 วัน
});

const dailyRotateFileTransport = new DailyRotateFile({
    level: `error`,
    filename: filenameError,
    datePattern: `YYYY-MM-DD`,
    format: combine(label({ label: env }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), printLogger),
    zippedArchive: true, // บีบอัดไฟล์ log เก่าหลังจากหมุนเวียน
    maxSize: '5m', // ขนาดสูงสุดของไฟล์ log ก่อนหมุนเวียน
    maxFiles: '1d' // เก็บไฟล์ log ไว้ 1 วัน
});

const devLogger = () => {
    return winston.createLogger({
        transports: [consoleTransport, dailyRotateFileTransportInfo, dailyRotateFileTransport]
    });
};

export default devLogger;

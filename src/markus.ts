/**
 * @author WMXPY
 * @fileoverview Config
 */

import { NextFunction, Request, Response } from 'express';
import * as Path from 'path';

type middleware = (req: Request, res: Response, next: NextFunction) => Promise<void>;

interface IConfig {
    crossOrigin: string;
    db: string;
    imagePath: string;
    imagePFolder: number;
    isDebug: boolean;
    maxThread: number;
    uploadLimit: number;
    portNumber: number;
    verbose: boolean;
    white404ImagePath: string;
    black404ImagePath: string;
    middleware: {
        prepares: middleware[];
        permissions: middleware[];
    };
}

const validPermissionMiddleware: middleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if ((req as any).body.key === 'test') {
        (req as any).valid = true;
    } else {
        (req as any).valid = false;
    }
    next();
    return;
};

const Config: IConfig = {
    crossOrigin: '*',
    db: 'mongodb://localhost/markus-test',
    imagePath: 'F:/path',
    imagePFolder: 12,
    isDebug: true,
    maxThread: 4,
    uploadLimit: 25,
    portNumber: 8080,
    verbose: false,
    white404ImagePath: Path.resolve('assets/404image_white.png'),
    black404ImagePath: Path.resolve('assets/404image_black.png'),
    middleware: {
        prepares: [],
        permissions: [validPermissionMiddleware],
    },
};

export default Config;
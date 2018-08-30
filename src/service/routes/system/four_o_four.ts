/**
 * @author WMXPY
 * @description Routes
 * @fileoverview 404 handler
 */

import { Request, RequestHandler, Response } from "express";
import { error, ERROR_CODE } from "../../../util/error/error";
import { ExpressNextFunction, IExpressRoute, ROUTE_MODE } from '../../interface';

export default class RouteAllFourOFour implements IExpressRoute {
    public readonly name: string = 'MR@Internal:Route^Four-O-Four';
    public readonly path: string = '*';
    public readonly mode: ROUTE_MODE = ROUTE_MODE.ALL;

    public readonly ignoreInDoc: boolean = true;

    public readonly prepare: boolean = true;
    public readonly authorization: boolean = false;
    public readonly stack: RequestHandler[] = [
        this.handle,
    ];
    public readonly after: boolean = true;

    public available() {
        return true;
    }

    protected async handle(req: Request, res: Response, next: ExpressNextFunction): Promise<void> {
        res.agent.failed(404, error(ERROR_CODE.FOUR_O_FOUR_NOT_FOUND));
        next();
        return;
    }
}

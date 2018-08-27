/**
 * @author WMXPY
 * @description Routes
 * @fileoverview Get Image handler
 */

import { ObjectID, ObjectId } from "bson";
import { Request, RequestHandler, Response } from "express";
import { IImageCallback } from "../../../database/interface/image";
import * as Direct from "../../../direct/import";
import { IConfig } from '../../../markus';
import { ExpressNextFunction, IExpressRoute, ROUTE_MODE } from '../../interface';

export default class RouteGetImageByPath implements IExpressRoute {
    public readonly path: string;
    public readonly mode: ROUTE_MODE = ROUTE_MODE.GET;

    public readonly prepare: boolean = true;
    public readonly authorization: boolean = false;
    public readonly stack: RequestHandler[] = [
        this.handler,
    ];
    public readonly after: boolean = true;

    private _emptyPath: string;

    public constructor(emptyPicturePath: string, listenPath: string) {
        this._emptyPath = emptyPicturePath;
        this.path = listenPath;
    }

    public available(config: IConfig) {
        return true;
    }

    protected async handler(req: Request, res: Response, next: ExpressNextFunction): Promise<void> {
        try {
            const id: ObjectID = new ObjectId(req.params.id);
            const callback: IImageCallback = await Direct.Image.getImageCallbackById(id);
            res.agent.smartFileSend(callback.path);
        } catch (err) {
            res.agent.smartFileSend(this._emptyPath);
        } finally {
            next();
        }
        return;
    }
}
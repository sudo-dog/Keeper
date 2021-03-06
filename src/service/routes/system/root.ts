/**
 * @author WMXPY
 * @description Routes
 * @fileoverview Root
 */

import { Request, RequestHandler, Response } from "express";
import { markusVersion } from "../../../util/struct/agent";
import { resource } from "../../decorator";
// tslint:disable-next-line
import { ExpressNextFunction, EXPRESS_ASSERTION_TYPES_END, IExpressAssertionJSONType, IExpressRoute, ROUTE_MODE } from '../../interface';
import LodgeableExpressRoute from "../lodgeable";

@resource('/routes/system', 'root')
export default class RouteRoot extends LodgeableExpressRoute implements IExpressRoute {
    public readonly name: string = 'MR@Internal-Route^Root';
    public readonly path: string = '/';
    public readonly mode: ROUTE_MODE = ROUTE_MODE.GET;

    public readonly prepare: boolean = true;
    public readonly authorization: boolean = false;
    public readonly stack: RequestHandler[];
    public readonly after: boolean = true;

    public readonly assertResponse: IExpressAssertionJSONType = {
        agent: { type: EXPRESS_ASSERTION_TYPES_END.STRING },
        version: { type: EXPRESS_ASSERTION_TYPES_END.STRING },
    };

    public constructor() {
        super();

        this.handle = this.handle.bind(this);
        this.stack = [
            this.handle,
        ];
    }

    protected async handle(req: Request, res: Response, next: ExpressNextFunction): Promise<void> {
        try {
            const version: string = await markusVersion();
            this.verbose('root attempted');
            res.agent.add('agent', 'Markus');
            res.agent.add('version', version);
        } catch (err) {
            console.log(err);
            res.agent.failed(500, err);
        } finally {
            next();
        }
        return;
    }
}

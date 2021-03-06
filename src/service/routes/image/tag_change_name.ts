/**
 * @author WMXPY
 * @description Routes
 * @fileoverview Rename tag
 */

import { Request, RequestHandler, Response } from "express";
import { MARKUS_AUTHORIZATION_ROLE } from "../../../declare/interface";
import * as Direct from "../../../direct/import";
import { assert } from '../../../util/error/assert';
import { ERROR_CODE } from "../../../util/error/error";
import { infoLog } from "../../decorator";
// tslint:disable-next-line
import { ExpressNextFunction, EXPRESS_ASSERTION_TYPES_END, EXPRESS_POST_SUBMIT_FORMAT, IDocInformation, IExpressAssertionJSONType, IExpressRoute, ROUTE_MODE } from '../../interface';
import LodgeableExpressRoute from "../lodgeable";

@infoLog()
export default class RouteRenameTag extends LodgeableExpressRoute implements IExpressRoute {
    public readonly name: string = 'MR@Internal-Route^Rename-Tag';
    public readonly path: string = '/tag/rename';
    public readonly mode: ROUTE_MODE = ROUTE_MODE.POST;

    public readonly prepare: boolean = true;
    public readonly authorization: boolean = true;
    public readonly stack: RequestHandler[] = [
        this.handler,
    ];
    public readonly after: boolean = true;
    public readonly authRole: MARKUS_AUTHORIZATION_ROLE[] = [MARKUS_AUTHORIZATION_ROLE.MANAGE];

    public readonly postType: EXPRESS_POST_SUBMIT_FORMAT[] = [
        EXPRESS_POST_SUBMIT_FORMAT.X_WWW_FORM_URLENCODED,
        EXPRESS_POST_SUBMIT_FORMAT.APPLICATION_JSON
    ];
    public readonly assertBody: IExpressAssertionJSONType = {
        tag: { type: EXPRESS_ASSERTION_TYPES_END.STRING },
        name: { type: EXPRESS_ASSERTION_TYPES_END.STRING },
    };
    public readonly doc: IDocInformation = {
        name: {
            EN: 'Rename Tag',
        },
        description: {
            EN: 'Rename target tag with a new name, <tag> for original tag name, <name> for new name',
        },
    };

    protected async handler(req: Request, res: Response, next: ExpressNextFunction): Promise<void> {
        try {
            const tagName: string = req.body.tag;
            const newName: string = req.body.name;
            assert(tagName).and(newName).to.be.exist(ERROR_CODE.REQUEST_PATTERN_NOT_MATCHED);
            const newTag = await Direct.Tag.renameTagToNewNameByTagCurrentName(tagName, newName);
            res.agent.add('tag', newTag.name);
        } catch (err) {
            res.agent.failed(400, err);
        } finally {
            next();
        }
        return;
    }
}

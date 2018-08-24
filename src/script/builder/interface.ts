/**
 * @author WMXPY
 * @description Route Builder
 * @fileoverview Interfaces
 */

export interface IExpressBuilder {
    route: (route: IExpressRoute) => IExpressBuilder;
    routes: (routes: IExpressRoute[]) => IExpressBuilder;
    flush: () => any;
}

export enum ROUTE_MODE {
    POST = 'POST',
    GET = 'GET',
    DELETE = 'DELETE',
    PUT = 'PUT',
    ALL = 'ALL',
}

export interface IExpressRoute {
    readonly path: string;
    readonly stack: any[];
    readonly mode: any;
    readonly authorization: boolean;

    available: (route: ROUTE_MODE) => boolean;
}

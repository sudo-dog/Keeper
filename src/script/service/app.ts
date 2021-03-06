/**
 * @author WMXPY
 * @fileoverview Express Application
 */

import { LOG_MODE } from "#log/interface";
import Log from '#log/log';
import * as bodyParser from "body-parser";
import * as express from "express";
import { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";
import { middleware } from '../../interface';
import { initMarkusGlobalConfig, MarkusExtensionConfig } from "../../markus";
import ExpressBuilder from "../../service/builder";
import * as Extension from '../../service/extension/import';
import * as Route from '../../service/routes/import';
import { SERVICE_ROUTE_UPLOAD_BUFFER_MODE } from "../../service/routes/upload/upload_buffer";
import ExtensionToolBoxExtension from '../../toolbox/extension';
import { error, ERROR_CODE } from "../../util/error/error";
import { RESPONSE } from "../../util/interface";
import UploadManager from '../../util/manager/upload';
import { markusVersion } from "../../util/struct/agent";
import * as Handler from '../handlers/import';
import { ResponseAgent } from "../handlers/util/agent";

initMarkusGlobalConfig();

const log: Log = new Log(global.Markus.Config.isDebug ? LOG_MODE.VERBOSE : LOG_MODE.INFO);
global.Markus.Log = log;

mongoose.set('useCreateIndex', true);
mongoose.connect(
    global.Markus.Config.host + '/' + global.Markus.Config.database,
    { useNewUrlParser: true },
);

markusVersion().then((version: string) => {
    global.Markus.Environment.version = version;
}).catch((err: Error) => {
    global.Markus.Environment.version = 'X';
    console.log(err);
});

const db: mongoose.Connection = mongoose.connection;
db.on('error', console.log.bind(console, 'connection error:'));

const app: express.Express = express();
const appBuilder: ExpressBuilder = new ExpressBuilder(app, log);

app.use(bodyParser.json({
    limit: global.Markus.Config.uploadLimit + 'mb',
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: global.Markus.Config.uploadLimit + 'mb',
}));
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError) {
        res.status(400).send({
            status: RESPONSE.FAILED,
            error: error(ERROR_CODE.REQUEST_APPLICATION_JSON_CANNOT_PARSE),
        });
    } else {
        next();
    }
});

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    req.log = log;

    if (global.Markus.Config.crossOrigin) {
        res.header("Access-Control-Allow-Origin", global.Markus.Config.crossOrigin);
    }
    res.header("X-Powered-By", 'Markus');
    res.header("X-Markus-Version", global.Markus.Environment.version);
    res.agent = new ResponseAgent(res, log);
    next();
});

appBuilder.use(new Extension.ExtensionDocGenerate(log));
appBuilder.use(new ExtensionToolBoxExtension(log));

const uploadManager: UploadManager = new UploadManager();
const prepares: middleware[] = MarkusExtensionConfig.middleware.prepares;
const permissions: middleware[] = MarkusExtensionConfig.middleware.permissions;
const afters: middleware[] = [
    ...MarkusExtensionConfig.middleware.after,
    Handler.Markus.FlushHandler,
];

// Handler(s) for user agent
appBuilder.route(new Route.RouteRoot().setLog(log));
appBuilder.route(new Route.RouteAuth());

// Handler(s) for Image Get
app.get('/w/:id', ...prepares, Handler.GetImage.imageGetBlankWhiteHandler, ...afters);
app.get('/b/:id', ...prepares, Handler.GetImage.imageGetBlankBlackHandler, ...afters);

// Handler(s) for Image Upload
appBuilder.route(new Route.RouteUploadByBuffer(
    SERVICE_ROUTE_UPLOAD_BUFFER_MODE.IMAGE,
    '/m/buffer',
    'Image',
    uploadManager.generateMulterEngine('image'),
    uploadManager.generateBufferEngine(),
));
app.post('/m/base64', ...prepares, uploadManager.generateBase64Engine(), ...permissions, Handler.Markus.UploadBase64Handler);

// Handler(s) for Avatar Get
appBuilder.route(new Route.RouteGetAvatar());

// Handler(s) for Avatar Set
appBuilder.route(new Route.RouteUploadByBuffer(
    SERVICE_ROUTE_UPLOAD_BUFFER_MODE.AVATAR,
    '/v/buffer',
    'Avatar',
    uploadManager.generateMulterEngine('image'),
    uploadManager.generateBufferEngine(),
));
app.post('/v/base64', ...prepares, uploadManager.generateBase64Engine(), ...permissions, Handler.Avatar.avatarBase64Handler);

// Handler(s) for Image List Get
appBuilder.route(new Route.RouteCompressByTag().setLog(log));
appBuilder.route(new Route.RouteRenameTag());
app.post('/tag', ...prepares, Handler.GetImage.imageGetListByTagHandler);

// Handler(s) for Tag List Get
appBuilder.route(new Route.RouteSearchGlobal());
appBuilder.route(new Route.RouteTagList());
appBuilder.route(new Route.RouteTagAdvancedList());

// Handler(s) for Image status change
appBuilder.route(new Route.RouteDeactivateImageById());
app.post('/deactivate/tag', ...prepares, ...permissions, Handler.Markus.DeactivateTagHandler, ...afters);

// Handler(s) for debug
if (global.Markus.Config.isDebug) {
    appBuilder.route(new Route.RouteRiskyEmptyDatabase());
    appBuilder.route(new Route.RouteRiskyGetList());
}

// Handler(s) for 404
appBuilder.last(new Route.RouteFourOFour());

const expressApp: express.Express = appBuilder.flush();
export default expressApp;

/**
 * @author WMXPY
 * @fileoverview Management Utils Load
 */

import Config, { MODE } from "../../markus";
import { fileBuilder } from "../data/path";
import { s3ExternalFilePathBuilder } from "../external/s3";

export type ImageLoadFunction = (folder: string, filename: string) => string;

export const getImageLoadPathBuilder = (): ImageLoadFunction => {
    if (Config.mode === MODE.AMAZON_S3) {
        return getImageFromAmazonS3LoadPathBuilder;
    }
    return fileBuilder;
};

export const getImageFromAmazonS3LoadPathBuilder: ImageLoadFunction = (folder: string, filename: string): string => {
    return s3ExternalFilePathBuilder(folder, filename);
};
/**
 * @author WMXPY
 * @fileoverview Mocks
 */

import * as fs from 'fs';

export class MockExpress {
    private result: any[] = [];

    public req(): any {
        return {
            file: 'example.jpg',
        };
    }

    public res(): any {
        return {
            send: (content: any) => {
                this.result.push(content);
            },
        };
    }
}

export const mockUnlinkSet = (): () => string[] => {
    type UnlinkCB = (err: Error | null) => void;

    const tempUnlink: (path: string, cb: UnlinkCB) => void = fs.unlink;
    const unlinkSet: string[] = [];

    (fs as any).unlink = (path: string, cb: UnlinkCB) => {
        unlinkSet.push(path);
        cb(null);
    };

    return (): string[] => {
        (fs as any).unlink = tempUnlink;
        return unlinkSet;
    };
};

export const mockWriteFile = (): () => Array<{
    content: string;
    path: string;
}> => {
    type WriteCB = (err: Error | null) => void;

    const tempWrite: (path: string, cb: WriteCB) => void = fs.unlink;
    const writeSet: Array<{
        content: string;
        path: string;
    }> = [];

    (fs as any).writeFile = (path: string, content: string, cb: WriteCB) => {
        writeSet.push({
            path,
            content,
        });
        cb(null);
    };

    return (): Array<{
        content: string;
        path: string;
    }> => {
        (fs as any).writeFile = tempWrite;
        return writeSet;
    };
};

export const mockWriteStream = (): () => {
    eventList: string[];
    contentList: any[];
} => {
    type eventCB = (...any: any[]) => void;
    const tempWriteStream: (path: string) => void = fs.createWriteStream;

    const eventList: string[] = [];
    const contentList: any[] = [];

    (fs as any).createWriteStream = (path: string) => {
        let finishFunc: eventCB;
        return {
            on: (event: string, cb: eventCB) => {
                if (event === 'finish') {
                    finishFunc = cb;
                }
                eventList.push(event);
            },
            write: (content: any) => {
                contentList.push(content);
            },
            end: () => {
                finishFunc();
            },
        };
    };

    return (): {
        eventList: string[];
        contentList: any[];
    } => {
        (fs as any).createWriteStream = tempWriteStream;
        return {
            eventList,
            contentList,
        };
    };
};

export const monkFsSyncs = (func: () => any) => {
    const tempUnlinkSync: any = fs.unlinkSync;
    const tempReadFileSync: any = fs.readFileSync;
    const tempWriteFileSync: any = fs.writeFileSync;
    const tempMakeDirSync: any = fs.mkdirSync;

    const unlinkSet: string[] = [];
    const readSet: string[] = [];
    const writeSet: string[] = [];
    const mkdirSet: string[] = [];
    (fs as any).unlinkSync = (filePath: string) => {
        unlinkSet.push(filePath);
    };

    (fs as any).readFileSync = (filePath: string) => {
        readSet.push(filePath);
    };

    (fs as any).writeFileSync = (filePath: string) => {
        writeSet.push(filePath);
    };

    (fs as any).mkdirSync = (dirPath: string) => {
        mkdirSet.push(dirPath);
    };

    func();

    (fs as any).unlinkSync = tempUnlinkSync;
    (fs as any).readFileSync = tempReadFileSync;
    (fs as any).writeFileSync = tempWriteFileSync;
    (fs as any).mkdirSync = tempMakeDirSync;

    return {
        unlink: unlinkSet,
        read: readSet,
        write: writeSet,
        mkdir: mkdirSet,
    };
};

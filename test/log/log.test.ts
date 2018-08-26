/**
 * @author WMXPY
 * @fileoverview Log Class Test
 */

import { expect } from 'chai';
import { LOG_MODE } from '../../src/log/interface';
import Log from '../../src/log/log';

describe.only('test log main class', (): void => {

    const createSimpleMockLogFunction = (): {
        func: (content: string) => void;
        logs: string[];
    } => {
        const logs: string[] = [];
        return {
            func: (content: string): void => {
                logs.push(content);
            },
            logs,
        };
    };

    it('create log should give a empty log agent', (): void => {
        const agent: Log = new Log(LOG_MODE.ALL);
        expect(agent.count).to.be.equal(0);
        expect(agent).to.be.lengthOf(0);
    });

    it('change log function should use new function instead', (): void => {
        const agent: Log = new Log(LOG_MODE.ALL);
        const temps: {
            func: (content: string) => void;
            logs: string[];
        } = createSimpleMockLogFunction();
        agent.func(temps.func);
        agent.error('test');
        expect(agent).to.be.lengthOf(1);
        expect(temps.logs).to.be.lengthOf(1);
    });
});

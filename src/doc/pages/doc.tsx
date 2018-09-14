/**
 * @author WMXPY
 * @description Doc React
 * @fileoverview Parent
 */

// tslint:disable-next-line
/// <reference path="../../declare/global.ts" />
import * as Fs from 'fs';
import * as Path from 'path';
import * as React from "react";
import { IDocTemplateRenderer } from '../interface';

const styles: {
    [key: string]: React.CSSProperties;
} = {
    outer: {
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
    },
    left: {
        backgroundColor: '#f5f5f5',
        overflowY: 'scroll',
        overflowX: 'hidden',
        padding: '15px',
        paddingLeft: '8px',
    },
    right: {
        padding: '15px',
        overflow: 'auto',
        flex: 1,
    },
    version: {
        textAlign: 'center',
    },
};

export default class Parent extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (<html>
            <head>
                <meta name="charset" content="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Markus - Document</title>
            </head>
            <body>
                <div style={styles.outer}>
                    <div style={styles.left} className="left">
                        <div className="title">Markus</div>
                        <div className="small-title">M</div>
                        {this.props.children}
                        <div style={styles.version}>
                            <a href="https://github.com/sudo-dog/markus">
                                v{global.Markus.Environment.version}
                            </a>
                        </div>
                    </div>
                    <div style={styles.right} id="content">
                        Select an api to see details
                    </div>
                </div>
            </body>
            <style>
                {this.getGlobalStyles()}
            </style>
            <script>
                {Fs.readFileSync(Path.resolve('assets', 'code', 'doc.js'), 'UTF8')}
            </script>
        </html>);
    }

    protected getGlobalStyles(): string {
        return [
            `body{margin:0;padding:0}`,
            `.card{box-shadow:0 1px 3px rgba(0,0,0,0.12),0 1px 2px rgba(0,0,0,0.24);background-color:white;cursor:pointer;transition:0.3s all}`,
            `.card:hover{box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)}`,
            `::-webkit-scrollbar{width:0.5em;height:0.5em}`,
            `::-webkit-scrollbar-thumb{background-color:#001F3F}`,
            `::-webkit-scrollbar-track{background-color:#AAAAAA}`,
            `pre.prettyprint{border:0}`,
            `.left{width:20%;min-width:300px}`,
            [
                `.title{text-align:right;display:block;font-size:3em;`,
                `color:white;background-color:#001F3F;padding-left:1em;padding-top:0.8em;`,
                `width:4em;padding-right:0.3em;padding-bottom:0.1em;margin:auto;margin-top:30px;margin-bottom:45px;`,
                `box-shadow:0 1px 3px rgba(0,0,0,0.12),0 1px 2px rgba(0,0,0,0.24)`,
                `}`,
            ].join(''),
            [
                `.small-title{display:none;color:#001F3F;text-align:center;`,
                `text-shadow:0 2px 4px rgba(0,0,0,0.12),0 2px 4px rgba(0,0,0,0.24);`,
                `font-size:3em;margin-top:15px;margin-bottom:25px;font-weight:bold;padding:5px}`,
            ].join(''),
            [
                `@media only screen and (max-width: 768px){`,
                `.card-content{display:none}.card{width:80px}.left{width:90px;min-width:90px}`,
                `.title{display:none}.small-title{display:block}`,
                `}`,
            ].join(''),
        ].join('');
    }
}
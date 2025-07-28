/* eslint-disable import/no-extraneous-dependencies */
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import camelcase from 'camelcase';
import Svgo from 'svgo';
import styleToObject from 'style-to-js';

import { iconTemplate } from '../templates/icon.template';
import { SVG_EXT } from './generate';
import { ENCODING, IGNORE_ICONS } from './constants';
import { generateComponentName } from './generate-component-name';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const removeEmptyRect = item => {
    const isRect = item.elem === 'rect';
    const noFill =
        item.attrs && item.attrs.fill ? item.attrs.fill.value === 'none' : true;
    const noChilds = item.content ? item.content.length === 0 : true;

    if (isRect && noChilds && noFill) {
        item.attrs = {};
    }

    return item;
};

const renameAttributesToCamelCase = item => {
    Object.keys(item.attrs || {}).forEach(rawAttributeName => {
        if (
            rawAttributeName.includes('-') &&
            !rawAttributeName.includes('data-')
        ) {
            const attribute = item.attrs[rawAttributeName];

            delete item.attrs[rawAttributeName];

            const attributeName = camelcase(rawAttributeName);

            item.attrs[attributeName] = {
                ...attribute,
                name: attributeName,
                local: camelcase(attribute.local),
            };
        }
    });

    return item;
};

const optimizer = new Svgo({
    plugins: [
        { convertPathData: { noSpaceAfterFlags: false } },
        { mergePaths: { noSpaceAfterFlags: false } },
        { removeAttrs: { attrs: '(xmlns|class)' } },
        { removeXMLNS: true },
        { prefixIds: true },
        { removeViewBox: false },
        { convertShapeToPath: false },
        {
            // @ts-ignore
            removeEmptyRect: {
                type: 'perItem',
                description: 'Remove empty rect',
                fn: removeEmptyRect,
            },
        },
    ],
});

const monoColorOptimizer = new Svgo({
    plugins: [{ removeAttrs: { attrs: 'fill' } }, { removeViewBox: false }],
});

const renameAttributesOptimizer = new Svgo({
    plugins: [
        { removeViewBox: false },
        {
            // @ts-ignore
            renameAttributesToCamelCase: {
                type: 'perItem',
                description: 'rename attributes to camel-case',
                fn: renameAttributesToCamelCase,
            },
        },
    ],
});

const transformSvg = (svg: string): string =>
    svg
        .replace(/xmlns:xlink/g, 'xmlnsXlink')
        .replace(/xlink:href/g, 'xlinkHref')
        .replace(/<rect\/>/g, '')
        .replace(
            /style="(.+?)"/g,
            (_, m) => `style={${JSON.stringify(styleToObject(m))}}`
        );

export async function createComponent(
    filePath: string,
    packageDir: string,
    packageName: string
) {
    const fileContent = await readFile(filePath, ENCODING);

    const basename = path.basename(filePath, `.${SVG_EXT}`);

    if (IGNORE_ICONS.includes(basename)) return '';

    const { componentName, color } = generateComponentName(
        basename,
        packageName
    );

    let { data } = await optimizer.optimize(fileContent);

    let svg = data;

    if (!color) {
        let { data } = await monoColorOptimizer.optimize(svg);
        svg = data;
    }

    {
        let { data } = await renameAttributesOptimizer.optimize(svg);
        svg = data;
    }

    svg = transformSvg(svg);

    const componentContent = iconTemplate
        .replace(/{{ComponentName}}/g, `${componentName}`)
        .replace('{{body}}', svg)
        .replace(/viewBox=\"[^"]*"/g, '$& {...props}')
        .replace(
            '<svg',
            `<svg role="img" focusable="false" ${
                color ? '' : 'fill="currentColor"'
            }`
        );

    const fullFileName = path.join(packageDir, `${componentName}.tsx`);

    await writeFile(fullFileName, componentContent, ENCODING);

    return componentName;
}

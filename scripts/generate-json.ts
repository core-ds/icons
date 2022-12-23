/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import camelcase from 'camelcase';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { ICON_POSTFIX, getPackageName, ENCODING } from './constants';

const FIGMA_API_URL = 'https://api.figma.com/v1';
const FIGMA_FILE_ID = 'ZcdUPebEhHfSZ91zgmv2cK';
const FIGMA_API_TOKEN = process.env.FIGMA_TOKEN;

const writeFile = promisify(fs.writeFile);

type FrameInfo = {
    nodeId: string;
    name: string;
    pageId: string;
    pageName: string;
};

type FigmaComponent = {
    key: string;
    file_key: string;
    node_id: string;
    thumbnail_url: string;
    name: string;
    description: string;
    updated_at: string;
    created_at: string;
    containing_frame: FrameInfo;
};

type FigmaResponse = {
    status: number;
    error: boolean;
    meta: {
        components?: FigmaComponent[];
        component_sets?: FigmaComponent[];
    };
};

function getName(iconComponent: FigmaComponent): string {
    const { containing_frame, name } = iconComponent;

    const pageName = containing_frame.pageName.replace(
        'general (glyph)',
        'glyph'
    );

    let iconName = name;

    if (!pageName) {
        return '';
    }

    if (pageName !== 'site') {
        const size = name.replace('Size=', '');
        iconName = `${containing_frame.name}_${size}`;
    }

    const rx = new RegExp(
        `^([^\\/]+\\/)?(?:${pageName}_)?(?<iconName>([a-z0-9-]+)(?<size>_[a-z0-9]+)?(?<color>_[a-z0-9]+)?)$`
    );

    const m = rx.exec(iconName);

    if (!m) {
        return '';
    }

    return `${pageName.trim()}_${m.groups.iconName.trim()}`;
}

export async function generateJson(components, componentsSet) {
    const json = {};

    components.forEach(component => {
        const figmaIconName = component.name;
        const svgIconName = getName(component);

        if (svgIconName) {
            const [rawPackageName, name, size, color] = svgIconName.split('_');
            let reactIconName = `${name}_${size}${color ? `_${color}` : ''}`;

            reactIconName = camelcase(reactIconName, {
                pascalCase: true,
            });

            reactIconName += ICON_POSTFIX;

            const packageName = getPackageName(rawPackageName);

            if (!json[packageName]) {
                json[packageName] = {};
            }

            componentsSet.forEach(componentSet => {
                if (
                    component.containing_frame.nodeId === componentSet.node_id
                ) {
                    const description =
                        componentSet.description + component.description;

                    json[packageName][reactIconName] = {
                        figmaIconName,
                        svgIconName,
                        reactIconName,
                        figmaDescription: description,
                    };
                }
            });
        }
    });

    const jsonFileName = path.resolve(__dirname, '../packages/search.json');

    await writeFile(jsonFileName, JSON.stringify(json), ENCODING);
}
/**
 * Генерация JSON-файла для витрины иконок.
 * Этот файл нужен для поиска иконок по их description из фигмы
 */
export async function getComponets() {
    const reqUrl = `${FIGMA_API_URL}/files/${FIGMA_FILE_ID}/components`;
    const reqUrlSet = `${FIGMA_API_URL}/files/${FIGMA_FILE_ID}/component_sets`;

    await Promise.all([
        axios.get<FigmaResponse>(reqUrl, {
            headers: { 'X-FIGMA-TOKEN': FIGMA_API_TOKEN },
        }),
        axios.get<FigmaResponse>(reqUrlSet, {
            headers: { 'X-FIGMA-TOKEN': FIGMA_API_TOKEN },
        }),
    ])
        .then(
            ([
                {
                    data: {
                        meta: { components },
                    },
                },
                {
                    data: {
                        meta: { component_sets },
                    },
                },
            ]) => generateJson(components, component_sets)
        )
        .catch(error => console.log(error));
}

getComponets();

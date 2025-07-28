import axios from 'axios';
import { FigmaResponse } from './generate-json';

const FIGMA_FILE_IDS = {
    ICONS: 'ZcdUPebEhHfSZ91zgmv2cK',
    LOGOTYPES: 'yZBSrRbQbdxac3VVcscJ45',
    FLAGS: 'RHkvF3gsacdtwxSCgOCWV0',
};

const FIGMA_API_URL = 'https://api.figma.com/v1';
const FIGMA_API_TOKEN = process.env.FIGMA_TOKEN;

export type FigmaMeta = {
    name: string;
    description: string;
};

export type MetaCollection = Map<string, FigmaMeta>;
export type MetaCollections = {
    components?: Map<string, MetaCollection>;
    component_sets?: Map<string, MetaCollection>;
};

const getRequestUrls = (fileId: string) => {
    const reqUrl = `${FIGMA_API_URL}/files/${fileId}/components`;
    const reqUrlSet = `${FIGMA_API_URL}/files/${fileId}/component_sets`;

    return { reqUrl, reqUrlSet };
};

const getFigmaCollection = (url: string) => {
    return axios.get<FigmaResponse>(url, {
        headers: { 'X-FIGMA-TOKEN': FIGMA_API_TOKEN },
    });
};

export const getFigmaIcons = async () => {
    const { reqUrlSet } = getRequestUrls(FIGMA_FILE_IDS.ICONS);

    const {
        data: {
            meta: { component_sets },
        },
    } = await getFigmaCollection(reqUrlSet);

    const componentSetsPages = new Map<string, MetaCollection>([
        ['android', new Map<string, FigmaMeta>()],
        ['rocky', new Map<string, FigmaMeta>()],
        ['general (glyph)', new Map<string, FigmaMeta>()],
        ['invest', new Map<string, FigmaMeta>()],
        ['ios', new Map<string, FigmaMeta>()],
        ['corp', new Map<string, FigmaMeta>()],
        ['site', new Map<string, FigmaMeta>()],
    ]);

    component_sets.forEach(item => {
        if (componentSetsPages.has(item.containing_frame.pageName)) {
            componentSetsPages
                .get(item.containing_frame.pageName)
                .set(item.name, {
                    name: item.name,
                    description: item.description,
                });
        }
    });

    return {
        component_sets: componentSetsPages,
    };
};

export const getFigmaLogotypes = async () => {
    const { reqUrl, reqUrlSet } = getRequestUrls(FIGMA_FILE_IDS.LOGOTYPES);

    const [
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
    ] = await Promise.all([
        getFigmaCollection(reqUrl),
        getFigmaCollection(reqUrlSet),
    ]);

    const componentsPages = new Map<string, MetaCollection>([
        ['general (logo)', new Map<string, FigmaMeta>()],
        ['logo-corp', new Map<string, FigmaMeta>()],
        ['deprecated (logotype)', new Map<string, FigmaMeta>()],
    ]);

    const componentSetsPages = new Map<string, MetaCollection>([
        ['general (logo)', new Map<string, FigmaMeta>()],
        ['logo-corp', new Map<string, FigmaMeta>()],
        ['deprecated (logotype)', new Map<string, FigmaMeta>()],
    ]);

    components.forEach(item => {
        if (componentsPages.has(item.containing_frame.pageName)) {
            componentsPages.get(item.containing_frame.pageName).set(item.name, {
                name: item.name,
                description: item.description,
            });
        }
    });

    component_sets.forEach(item => {
        if (componentSetsPages.has(item.containing_frame.pageName)) {
            componentSetsPages
                .get(item.containing_frame.pageName)
                .set(item.name, {
                    name: item.name,
                    description: item.description,
                });
        }
    });

    return {
        components: componentsPages,
        component_sets: componentSetsPages,
    };
};

export const getFigmaFlags = async () => {
    const { reqUrl } = getRequestUrls(FIGMA_FILE_IDS.FLAGS);

    const {
        data: {
            meta: { components },
        },
    } = await getFigmaCollection(reqUrl);

    const componentsPages = new Map<string, MetaCollection>([
        ['general (flag)', new Map<string, FigmaMeta>()],
    ]);

    components.forEach(item => {
        if (componentsPages.has(item.containing_frame.pageName)) {
            componentsPages.get(item.containing_frame.pageName).set(item.name, {
                name: item.name,
                description: item.description,
            });
        }
    });

    return {
        components: componentsPages,
    };
};

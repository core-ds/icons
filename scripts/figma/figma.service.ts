import axios from 'axios';

import {
    FigmaMeta,
    FigmaResponse,
    MetaCollection,
    MetaCollections,
    MetaPages,
} from '../../types/figma';

const FIGMA_API_URL = 'https://api.figma.com/v1';
const FIGMA_API_TOKEN = process.env.FIGMA_TOKEN;

const FIGMA_FILE_IDS = {
    ICONS: 'ZcdUPebEhHfSZ91zgmv2cK',
    LOGOTYPES: 'yZBSrRbQbdxac3VVcscJ45',
    FLAGS: 'RHkvF3gsacdtwxSCgOCWV0',
} as const;

const getFigmaUrl = (fileId: string, type: 'components' | 'component_sets') =>
    `${FIGMA_API_URL}/files/${fileId}/${type}`;

const fetchFigmaFile = (url: string) => {
    return axios.get<FigmaResponse>(url, {
        headers: { 'X-FIGMA-TOKEN': FIGMA_API_TOKEN },
    });
};

const buildMetaCollection = (
    items: FigmaResponse['meta']['components' | 'component_sets'],
    allowedPages: string[]
): MetaPages => {
    const pagesCollection = new Map<string, MetaCollection>();

    allowedPages.forEach(page => {
        pagesCollection.set(page, new Map<string, FigmaMeta>());
    });

    items.forEach(item => {
        const page = item.containing_frame.pageName;
        if (pagesCollection.has(page)) {
            pagesCollection.get(page)!.set(item.name, {
                name: item.name,
                description: item.description,
            });
        }
    });

    return pagesCollection;
};

export const FigmaService = {
    async getIcons(): Promise<MetaCollections> {
        const url = getFigmaUrl(FIGMA_FILE_IDS.ICONS, 'component_sets');
        const {
            data: {
                meta: { component_sets },
            },
        } = await fetchFigmaFile(url);

        const pages = [
            'android',
            'rocky',
            'general (glyph)',
            'invest',
            'ios',
            'corp',
            'site',
        ];

        return {
            component_sets: buildMetaCollection(component_sets, pages),
        };
    },

    async getLogotypes(): Promise<MetaCollections> {
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
            fetchFigmaFile(getFigmaUrl(FIGMA_FILE_IDS.LOGOTYPES, 'components')),
            fetchFigmaFile(
                getFigmaUrl(FIGMA_FILE_IDS.LOGOTYPES, 'component_sets')
            ),
        ]);

        const pages = ['general (logo)', 'logo-corp', 'deprecated (logotype)'];

        return {
            components: buildMetaCollection(components, pages),
            component_sets: buildMetaCollection(component_sets, pages),
        };
    },

    async getFlags(): Promise<MetaCollections> {
        const {
            data: {
                meta: { components },
            },
        } = await fetchFigmaFile(
            getFigmaUrl(FIGMA_FILE_IDS.FLAGS, 'components')
        );

        const pages = ['general (flag)'];

        return {
            components: buildMetaCollection(components, pages),
        };
    },
};

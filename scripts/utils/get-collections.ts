import { PACKAGES } from '../constants';
import { MetaCollection, MetaCollections } from '../../types/figma';

type CollectionSource = {
    icons: MetaCollections;
    logotypes: MetaCollections;
    flags: MetaCollections;
};

const LOGOTYPE_MAPPING: Record<string, string> = {
    [PACKAGES.LOGO]: 'general (logo)',
    [PACKAGES.LOGO_AM]: 'general (logo)',
    [PACKAGES.LOGOTYPE]: 'deprecated (logotype)',
};

const FLAGS_MAPPING: Record<string, string> = {
    [PACKAGES.FLAG]: 'general (flag)',
};

const ICONS_COMPONENT_SETS = new Set([
    PACKAGES.GLYPH,
    PACKAGES.ANDROID,
    PACKAGES.CORP,
    PACKAGES.INVEST,
    PACKAGES.IOS,
    PACKAGES.ROCKY,
    PACKAGES.SITE,
]);

export const getCollection = (
    packageName: string,
    collections: CollectionSource
): MetaCollection => {
    // icon component_sets
    if (ICONS_COMPONENT_SETS.has(packageName)) {
        const page =
            packageName === PACKAGES.GLYPH ? 'general (glyph)' : packageName;
        return collections.icons.component_sets.get(page);
    }

    // logo components
    if (LOGOTYPE_MAPPING[packageName]) {
        const page = LOGOTYPE_MAPPING[packageName];
        return collections.logotypes.components.get(page);
    }

    // logo-corp component_sets
    if (packageName === PACKAGES.LOGO_CORP) {
        return collections.logotypes.component_sets.get(packageName);
    }

    // flags
    if (packageName === PACKAGES.FLAG) {
        const page = FLAGS_MAPPING[packageName];
        return collections.flags.components.get(page);
    }

    return new Map();
};

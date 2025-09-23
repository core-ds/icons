import path from 'path';
import { readdirSync } from 'fs';
import { FigmaService } from './figma/figma.service';
import { getTransformer } from './transform/package-strategy';
import { generateComponentName } from './generate-component-name';
import { createFigmaName } from './transform/normalize-name';
import { writeJSON } from './utils/fs';
import { ICONS_ROOT, SRC_DIR, UI_PRIMITIVE_PACKAGES } from './utils/path';
import { getCollection } from './utils/get-collections';
import { MetaCollection } from '../types/figma';

const generateMeta = (pkg: string, collection: MetaCollection) => {
    const files = readdirSync(path.join(ICONS_ROOT, pkg));
    const transformer = getTransformer(pkg);

    const meta = files.reduce((acc, file) => {
        const basename = file.replace('.svg', '');
        const figmaName = createFigmaName(file, pkg);
        const { componentName } = generateComponentName(basename, pkg);

        const description = collection.get(figmaName)?.description || '';

        return {
            ...acc,
            [componentName]: {
                description,
                ...transformer(basename, componentName),
            },
        };
    }, {});

    writeJSON(path.resolve(SRC_DIR, `meta_${pkg}.json`), meta);
};

(async () => {
    const [icons, logotypes, flags] = await Promise.all([
        FigmaService.getIcons(),
        FigmaService.getLogotypes(),
        FigmaService.getFlags(),
    ]);

    UI_PRIMITIVE_PACKAGES.forEach(pkg => {
        const collection = getCollection(pkg, { icons, logotypes, flags });
        generateMeta(pkg, collection);
        console.log(`[+] meta_${pkg}.json`);
    });
})();

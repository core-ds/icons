import path from 'path';
import { readdirSync, writeFileSync } from 'fs';
import {
    FigmaMeta,
    getFigmaFlags,
    getFigmaIcons,
    getFigmaLogotypes,
    MetaCollection,
    MetaCollections,
} from './api';
import { EXCLUDED_PACKAGES, PACKAGES } from './constants';
import { generateComponentName } from './generate-component-name';
import { transformBaseNameToAndroid } from './transform-base-name-to-android';
import { transformBaseNameToIos } from './transform-base-name-to-ios';

const uiPrimitivesIconsRoot = path.resolve(
    __dirname,
    '../node_modules/ui-primitives/icons'
);

const srcDir = path.resolve(__dirname, '../packages');
const packages = readdirSync(uiPrimitivesIconsRoot).filter(
    pkg => !Object.values(EXCLUDED_PACKAGES).includes(pkg)
);
const sizes = ['xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl', '20', '24'];

// Имя некоторых пакетов не совпадает с префиксом имени файла, дополнительно обрабатываем эти кейсы
const getPackageNamePattern = (packageName: string) => {
    if (packageName === PACKAGES.LOGO_AM) {
        return PACKAGES.LOGO;
    }

    return packageName;
};

// Отбрасываем имя пакета
const dropPackageName = (name: string, packageName: string) => {
    const regex = new RegExp(`^${getPackageNamePattern(packageName)}_`);

    return name.replace(regex, '');
};

// Отбрасываем модификатор цвета
const dropColorModifier = (name: string) => {
    const regex = new RegExp(`_(${sizes.join('|')})_(\\w+)`, 'g');

    return name.replace(regex, '_$1');
};

// Отбрасываем размер
const dropIconSize = (name: string) => {
    const regex = new RegExp(`_(${sizes.join('|')})`, 'g');

    return name.replace(regex, '');
};

// Отбрасываем стилевую часть (актуально для logo-corp)
const dropStyle = (fileName: string) => {
    const styles = ['line', 'thinline'];
    const regex = new RegExp(`-(${styles.join('|')})`, 'g');

    return fileName.replace(regex, '');
};

const createFigmaName = (fileName: string, packageName: string) => {
    let figmaName = fileName.replace('.svg', '');
    figmaName = dropPackageName(figmaName, packageName);

    // Для некоторых макетов не отбрасываем цвет и размер
    if (
        [
            PACKAGES.FLAG,
            PACKAGES.LOGO,
            PACKAGES.LOGO_AM,
            PACKAGES.LOGOTYPE,
        ].includes(packageName)
    ) {
        return figmaName;
    }

    figmaName = dropColorModifier(figmaName);
    figmaName = dropIconSize(figmaName);

    if (packageName === PACKAGES.LOGO_CORP) {
        figmaName = dropStyle(figmaName);
    }

    return figmaName;
};

const findDescription = (figmaObject: FigmaMeta) => {
    if (figmaObject) {
        return figmaObject.description;
    }

    return '';
};

// Получить коллекцию объектов исходя из макета (components или component_sets)
const getFigmaCollectionByPackage = (
    packageName: string,
    collections: {
        icons: MetaCollections;
        logotypes: MetaCollections;
        flags: MetaCollections;
    }
) => {
    if (
        [
            PACKAGES.GLYPH,
            PACKAGES.ANDROID,
            PACKAGES.CORP,
            PACKAGES.INVEST,
            PACKAGES.IOS,
            PACKAGES.ROCKY,
            PACKAGES.SITE,
        ].includes(packageName)
    ) {
        return collections.icons.component_sets.get(
            packageName === PACKAGES.GLYPH ? 'general (glyph)' : packageName
        );
    }

    if (
        [PACKAGES.LOGO, PACKAGES.LOGO_AM, PACKAGES.LOGOTYPE].includes(
            packageName
        )
    ) {
        let pkg = packageName;

        if ([PACKAGES.LOGO, PACKAGES.LOGO_AM].includes(packageName)) {
            pkg = 'general (logo)';
        }

        if (packageName === PACKAGES.LOGOTYPE) {
            pkg = 'deprecated (logotype)';
        }

        return collections.logotypes.components.get(pkg);
    }

    if ([PACKAGES.LOGO_CORP].includes(packageName)) {
        return collections.logotypes.component_sets.get(packageName);
    }

    if (packageName === PACKAGES.FLAG) {
        return collections.flags.components.get('general (flag)');
    }

    return new Map<string, FigmaMeta>();
};

const generatePackageJSON = (
    packageName: string,
    figmaCollection: MetaCollection
) => {
    const packagePath = path.resolve(uiPrimitivesIconsRoot, packageName);
    const files = readdirSync(packagePath);

    const serializeData = files.reduce((prev, file) => {
        const figmaName = createFigmaName(file, packageName);

        const figmaObject = figmaCollection.get(figmaName);
        const description = findDescription(figmaObject);

        const basename = file.replace('.svg', '');
        const { componentName } = generateComponentName(basename, packageName);

        if (packageName === PACKAGES.ANDROID) {
            return {
                ...prev,
                [componentName]: {
                    description,
                    basename,
                    web: componentName,
                    webComponent: `import { ${componentName} } from '@alfalab/icons-${packageName}/${componentName}';`,
                    android: transformBaseNameToAndroid(basename),
                    middle: basename,
                },
            };
        }

        if (packageName === PACKAGES.IOS) {
            return {
                ...prev,
                [componentName]: {
                    description,
                    basename,
                    web: componentName,
                    webComponent: `import { ${componentName} } from '@alfalab/icons-${packageName}/${componentName}';`,
                    ios: transformBaseNameToIos(basename),
                    middle: basename,
                    cdn: basename,
                    url: `https://alfabank.servicecdn.ru/icons/${basename}.svg`,
                },
            };
        }

        if (packageName === PACKAGES.LOGO_AM) {
            return {
                ...prev,
                [componentName]: {
                    description,
                    basename,
                    android: transformBaseNameToAndroid(basename),
                    ios: transformBaseNameToIos(basename),
                    middle: basename,
                    cdn: basename,
                    url: `https://alfabank.servicecdn.ru/icons/${basename}.svg`,
                },
            };
        }

        return {
            ...prev,
            [componentName]: {
                description,
                basename,
                web: componentName,
                webComponent: `import { ${componentName} } from '@alfalab/icons-${packageName}/${componentName}';`,
                android: transformBaseNameToAndroid(basename),
                ios: transformBaseNameToIos(basename),
                middle: basename,
                cdn: basename,
                url: `https://alfabank.servicecdn.ru/icons/${basename}.svg`,
            },
        };
    }, {});

    const fileName = `meta_${packageName}.json`;
    const srcFileName = path.resolve(srcDir, fileName);

    writeFileSync(srcFileName, JSON.stringify(serializeData, null, 2));
    console.log(`[+] ${fileName}`);
};

const generatePackagesMetaData = async (packages: string[]) => {
    const [
        iconsFigmaCollections,
        logotypesFigmaCollections,
        flagsFigmaCollections,
    ] = await Promise.all([
        getFigmaIcons(),
        getFigmaLogotypes(),
        getFigmaFlags(),
    ]);

    packages.forEach(pkg => {
        const collection = getFigmaCollectionByPackage(pkg, {
            icons: iconsFigmaCollections,
            logotypes: logotypesFigmaCollections,
            flags: flagsFigmaCollections,
        });

        generatePackageJSON(pkg, collection);
    });
};

generatePackagesMetaData(packages)
    .then(() => {
        process.exit(0);
    })
    .catch(error => {
        console.log(error);
        process.exit(1);
    });

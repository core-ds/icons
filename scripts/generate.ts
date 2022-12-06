import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { createComponent } from './create-component';
import { checkOrCreateFiles } from './create-files';
import { getPackageName, ENCODING, MOBILE_PREFIXES } from './constants';

const rootIconsDir = path.resolve(
    __dirname,
    '../node_modules/ui-primitives/icons'
);

const srcDir = path.resolve(__dirname, '../packages');

const readDir = promisify(fs.readdir);
const mkDir = promisify(fs.mkdir);

const EXCLUDED_CATEGORIES = ['purgatory', 'dev'];
const EXCLUDED_PACKAGES = ['art'];

interface Icon {
    name: string;
    variants: Set<string>;
}

interface Icons {
    [key: string]: Icon[]; // key is package name
}

export const SVG_EXT = 'svg';

const icons: Icons = {};

/**
 * Проверяем пакет иконок на дубли.
 * Если встречаем одну и ту же иконку в разных категориях (папках) -
 * то выводим предупреждение и удаляем дублирующиеся иконки
 */
function deleteDuplicates(packageName: string) {
    icons[packageName].forEach(icon => {
        const iconVariantNames = [...icon.variants].map(filePath =>
            path.basename(filePath)
        );

        if (new Set(iconVariantNames).size !== iconVariantNames.length) {
            console.warn(
                `Обнаружены дубликаты иконок:\n${[...icon.variants].join(
                    '\n'
                )}\n`
            );

            /**
             * Создаем пустой массив, и добавляем туда иконки без дублей
             */
            const variants: string[] = [];

            icon.variants.forEach(filePath => {
                const basename = path.basename(filePath);

                if (!variants.find(iconName => iconName.includes(basename))) {
                    variants.push(filePath);
                }
            });

            // eslint-disable-next-line no-param-reassign
            icon.variants = new Set(variants);
        }
    });
}

function generateIcon(iconName: string, dir: string) {
    const re = new RegExp(`.${SVG_EXT}$`);
    const iconPrefix = dir.split('/')[7];
    const iconNameParams = iconName.replace(re, '').split('_')
 
    let name = '';

    if ( MOBILE_PREFIXES.includes(iconPrefix) ) { 
     [ name ] = iconNameParams; 
    } else { 
        [ , name] = iconNameParams; 
    }

    const packageName = getPackageName(iconPrefix);

    if (!icons[packageName]) {
        icons[packageName] = [];
    }

    const index = icons[packageName].findIndex(icon => icon.name === name);

    if (index === -1) {
        icons[packageName].push({
            name,
            variants: new Set([path.join(dir, iconName)]),
        });
    } else {
        icons[packageName][index].variants.add(path.join(dir, iconName));
    }
}

async function processDir(dir: string) {
    return readDir(dir, ENCODING).then(iconNames => {
        iconNames
            .filter(iconName => path.extname(iconName) === `.${SVG_EXT}`)
            .forEach(iconName => {
                generateIcon(iconName, dir);
            });
    });
}

async function generateIconsTree(categories: string[]) {
    return await Promise.all(categories.map(item => {
       if (path.extname(item) === `.${SVG_EXT}`) {
            let svgItem = item.split('/ui-primitives/icons/')
            return generateIcon(svgItem[1], rootIconsDir)
       } else {
            return processDir(item)
       }
    }));
}

async function createPackage(packageName: string) {
    const packageDir = path.join(srcDir, packageName);
    const srcPackageDir = path.join(packageDir, 'src');

    await checkOrCreateFiles(packageDir, srcPackageDir, packageName);

    /**
     * Проверяем пакет иконок на дубли, так как иногда случалось так,
     * что одна и та же иконка находилась в разных категориях (папках).
     */
    deleteDuplicates(packageName);

    const iconVariants = icons[packageName].reduce(
        (acc, icon) => [...acc, ...icon.variants],
        []
    );

    const componentNames = await Promise.all(
        iconVariants.map(filePath => createComponent(filePath, srcPackageDir, packageName ))
    );

    componentNames.sort();
}

async function generateComponents() {
    await Promise.all(
        Object.keys(icons)
            .filter(packageName => !EXCLUDED_PACKAGES.includes(packageName))
            .map(createPackage)
    );
}

async function main() {
    let categories = await readDir(rootIconsDir, ENCODING);

    categories = categories
        .filter(dir => !EXCLUDED_CATEGORIES.includes(dir))
        .map(dir => path.join(rootIconsDir, dir));

    await generateIconsTree(categories);

    try {
        await readDir(srcDir, ENCODING);
    } catch (err) {
        await mkDir(srcDir);
    }

    await generateComponents();
}

main();

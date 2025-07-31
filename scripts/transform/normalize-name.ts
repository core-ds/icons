import { PACKAGES } from '../constants';

const SIZES = ['xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl', '20', '24'] as const;
const STYLES = ['line', 'thinline'] as const;

// Отбрасываем имя пакета
const dropPackageName = (prefix: string) => (name: string) => {
    const regex = new RegExp(`^${prefix}_`);
    return name.replace(regex, '');
};

// Отбрасываем модификатор цвета
const dropColorModifier = (name: string) => {
    const regex = new RegExp(`_(${SIZES.join('|')})_(\\w+)`, 'g');
    return name.replace(regex, '_$1');
};

// Отбрасываем размер
const dropSize = (name: string) => {
    const regex = new RegExp(`_(${SIZES.join('|')})`, 'g');
    return name.replace(regex, '');
};

// Отбрасываем стилевую часть (актуально для logo-corp)
const dropStyle = (name: string) => {
    const regex = new RegExp(`-(${STYLES.join('|')})`, 'g');
    return name.replace(regex, '');
};

const PACKAGE_PREFIX_OVERRIDE = {
    [PACKAGES.LOGO_AM]: PACKAGES.LOGO,
} as const;

const PACKAGE_TRANSFORM_PIPELINE = {
    [PACKAGES.LOGO_CORP]: [dropColorModifier, dropSize, dropStyle],
    [PACKAGES.ANDROID]: [dropColorModifier, dropSize],
    [PACKAGES.IOS]: [dropColorModifier, dropSize],
    [PACKAGES.GLYPH]: [dropColorModifier, dropSize],
    [PACKAGES.CORP]: [dropColorModifier, dropSize],
    [PACKAGES.INVEST]: [dropColorModifier, dropSize],
    [PACKAGES.ROCKY]: [dropColorModifier, dropSize],
    [PACKAGES.SITE]: [dropColorModifier, dropSize],
    [PACKAGES.FLAG]: [], // без изменений
    [PACKAGES.LOGO]: [], // без изменений
    [PACKAGES.LOGO_AM]: [], // без изменений
    [PACKAGES.LOGOTYPE]: [], // без изменений
};

export const createFigmaName = (
    fileName: string,
    packageName: string
): string => {
    const basename = fileName.replace('.svg', '');

    const basePrefix = PACKAGE_PREFIX_OVERRIDE[packageName] ?? packageName;
    const nameWithoutPrefix = dropPackageName(basePrefix)(basename);

    const transforms = PACKAGE_TRANSFORM_PIPELINE[packageName] ?? [];

    return transforms.reduce((name, fn) => fn(name), nameWithoutPrefix);
};

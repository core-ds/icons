import { ICON_POSTFIX, MOBILE_PREFIXES } from './constants';
import camelcase from 'camelcase';

export const generateComponentName = (
    basename: string,
    packageName: string
) => {
    const iconParams = basename.split('_');

    let [, name, size, color] = iconParams;

    if (MOBILE_PREFIXES.includes(packageName)) {
        [name, size, color] = iconParams;
    }

    let componentName = `${name}_${size}${color ? `_${color}` : ``}`;

    componentName = camelcase(componentName, {
        pascalCase: true,
    });

    componentName += ICON_POSTFIX;

    return { componentName, color };
};

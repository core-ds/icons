import { transformBaseNameToAndroid } from '../transform-base-name-to-android';
import { transformBaseNameToIos } from '../transform-base-name-to-ios';
import { PACKAGES } from '../constants';

type PackageTransformer = (
    basename: string,
    componentName: string
) => Record<string, string>;

export const getTransformer = (packageName: string): PackageTransformer => {
    switch (packageName) {
        case PACKAGES.ANDROID:
            return (basename: string) => ({
                android: transformBaseNameToAndroid(basename),
                middle: basename,
            });

        case PACKAGES.IOS:
            return (basename: string, componentName: string) => ({
                web: componentName,
                webComponent: `import { ${componentName} } from '@alfalab/icons-${packageName}/${componentName}';`,
                ios: transformBaseNameToIos(basename),
                middle: basename,
                cdn: basename,
                url: `https://alfabank.servicecdn.ru/icons/${basename}.svg`,
            });

        case PACKAGES.LOGO_AM:
            return (basename: string) => ({
                android: transformBaseNameToAndroid(basename),
                ios: transformBaseNameToIos(basename),
                middle: basename,
                cdn: basename,
                url: `https://alfabank.servicecdn.ru/icons/${basename}.svg`,
            });

        case PACKAGES.SITE:
            return (basename: string, componentName: string) => ({
                web: componentName,
                webComponent: `import { ${componentName} } from '@alfalab/icons-${packageName}/${componentName}';`,
                middle: basename,
                cdn: basename,
                url: `https://alfabank.servicecdn.ru/icons/${basename}.svg`,
            });

        default:
            return (basename: string, componentName: string) => ({
                web: componentName,
                webComponent: `import { ${componentName} } from '@alfalab/icons-${packageName}/${componentName}';`,
                android: transformBaseNameToAndroid(basename),
                ios: transformBaseNameToIos(basename),
                middle: basename,
                cdn: basename,
                url: `https://alfabank.servicecdn.ru/icons/${basename}.svg`,
            });
    }
};

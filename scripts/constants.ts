const PACKAGE_ALIAS = {
    icon: 'classic',
};

export const getPackageName = (iconPrefix: string) =>
    PACKAGE_ALIAS[iconPrefix] || iconPrefix;

export const ICON_POSTFIX = 'Icon';

export const ENCODING = 'utf-8';

export const MOBILE_PREFIXES = ['ios', 'android'];

export const IGNORE_ICONS = ['rocky_tshirt_m'];

export const PACKAGES = {
    GLYPH: 'glyph',
    ANDROID: 'android',
    CORP: 'corp',
    FLAG: 'flag',
    INVEST: 'invest',
    IOS: 'ios',
    LOGO: 'logo',
    LOGO_AM: 'logo-am',
    LOGO_CORP: 'logo-corp',
    LOGOTYPE: 'logotype',
    ROCKY: 'rocky',
    SITE: 'site',
};

export const EXCLUDED_PACKAGES = {
    SHAPE: 'shape',
    DEV: 'dev',
    ICON: 'icon',
    ART: 'art',
};

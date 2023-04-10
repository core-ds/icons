const PACKAGE_ALIAS = {
    icon: 'classic',
};

export const getPackageName = (iconPrefix: string) =>
    PACKAGE_ALIAS[iconPrefix] || iconPrefix;

export const ICON_POSTFIX = 'Icon';

export const ENCODING = 'utf-8';

export const MOBILE_PREFIXES = ['ios', 'android'];

export const IGNORE_ICONS = ['rocky_tshirt_m'];

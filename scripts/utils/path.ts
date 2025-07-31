import path from 'path';
import { readdirSync } from 'fs';
import { EXCLUDED_PACKAGES } from '../constants';

export const ICONS_ROOT = path.resolve(
    __dirname,
    '../../node_modules/ui-primitives/icons'
);

export const UI_PRIMITIVE_PACKAGES = readdirSync(ICONS_ROOT).filter(
    pkg => !Object.values(EXCLUDED_PACKAGES).includes(pkg)
);

export const SRC_DIR = path.resolve(__dirname, '../../packages');

#!/bin/bash

# Подтягиваем тэги
git fetch --prune --unshallow
git fetch --tags

# Устанавливаем npm-registry
npm set registry https://registry.npmjs.org

# Генерируем React-компоненты из свежего пакета ui-primitives
yarn install
yarn add --dev ui-primitives@latest
yarn generate

# Смотрим, были ли какие-то изменения в иконках
changed_packages=`lerna changed`;

# Если изменения были, апдейтим версию подпакетов
lerna version minor --no-push --yes

# Собираем все подпакеты

lerna exec --parallel -- rm -rf dist

lerna exec --parallel -- rollup -c ../../rollup.config.js

lerna exec --parallel -- cp package.json dist/package.json

rm -rf dist

mkdir dist

# Генерируем dist для общего пакета @alfalab/icons.
lerna exec --parallel -- $(pwd)/bin/build-root-package.sh \$LERNA_PACKAGE_NAME 

# Генерируем вспомогательный json-файл для поиска в витрине иконок
yarn generate-json

# Копируем в dist search.json
cp -r packages/search.json dist/search.json

# Смотрим, были ли какие-то изменения в search.json
changed_json=`git status --porcelain | grep search.json`

# Добавляем новые иконки в git
git config --local user.email "ds@gitmax.tech"
git config --local user.name "core-ds-bot"
git add .
git commit -m "feat(*): add new icons"

#Релизим агрегирующий пакет, если были измнения в подпакетах
if [ -z "$changed_packages" ]
then
    if [ "$changed_json" ]
    then 
        echo "Publish updated search.json"
        npm version patch --git-tag-version false

        cp package.json dist/package.json
        # Публикуем пакет
        npm publish ./dist
    else
        echo "No new icons added"
    fi

        git add packages/search.json
        git commit -m "chore(*): update search.json"
else
    echo "Publish root package"
    npm version minor --git-tag-version false

    cp package.json dist/package.json
    # Публикуем пакет
    npm publish dist    
fi

git add .
git commit -m "chore(*): update version"

# Релизим все подпакеты
lerna publish from-package --contents dist --yes

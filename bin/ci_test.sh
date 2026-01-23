#!/bin/bash

# Подтягиваем тэги
git fetch --prune --unshallow
git fetch --tags

# Генерируем React-компоненты из свежего пакета ui-primitives
yarn install
yarn add --dev ui-primitives@latest
yarn generate

# Добавляем новые иконки в git
git config --local user.email "ds@gitmax.tech"
git config --local user.name "core-ds-bot"
git add .
git commit -m "feat(*): add new icons"

# Смотрим, были ли какие-то изменения в иконках
changed_packages=`lerna changed`;

# Если изменения были, апдейтим версию подпакетов
lerna version minor --no-push --yes

# Собираем все подпакеты

lerna exec --parallel -- rm -rf dist

lerna exec --parallel -- rollup -c ../../rollup.config.js

lerna exec --parallel -- cp package.json dist/package.json
lerna exec --parallel -- cp ../../README.md dist/README.md

rm -rf dist

mkdir dist

# Генерируем dist для общего пакета @alfalab/icons.
lerna exec --parallel -- $(pwd)/bin/build-root-package.sh \$LERNA_PACKAGE_NAME

# Генерируем вспомогательные файлы, необходимые для работы демо-страницы
yarn generate-meta

# Копируем в dist файлы meta_*.json
for file in packages/meta_*.json; do
  # Проверяем, что файл существует
  if [ -f "$file" ]; then
    cp "$file" dist/
  fi
done

# Проверка изменений в файлах meta_*.json
changed_meta_files=$(git diff --name-only | grep 'meta_.*\.json$')

#Релизим агрегирующий пакет, если были измнения в подпакетах
#if [ -z "$changed_packages" ]
#then
#    if [ "$changed_meta_files" ]
#    then
#        echo "Publish updated meta files"
#        echo "changed meta files: $changed_meta_files"
#
#        npm version patch --git-tag-version false
#
#        cp package.json dist/package.json
#
#        #  Добавляем каждый файл в staging
#        echo "$changed_meta_files" | tr '\n' '\0' | xargs -0 git add
#        git commit -m "chore(*): update meta files"
#
#        # Публикуем пакет
#        npm publish dist
#    fi
#
#else
#    echo "Publish root package"
#    npm version minor --git-tag-version false
#
#    cp package.json dist/package.json
#    # Публикуем пакет
#    npm publish dist
#fi

# TODO Test root publish
echo "Publish root package"
npm version minor --git-tag-version false

cp package.json dist/package.json
# Публикуем пакет
npm publish dist

git add .
git commit -m "chore(*): update version"

# Релизим все подпакеты
#lerna publish from-package --contents dist --yes

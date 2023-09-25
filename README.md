## Как найти иконку

[Витрина иконок с поиском](https://core-ds.github.io/icons-demo/)

## Как сюда попадают новые иконки

-   Дизайнер рисует [иконки в фигме](https://www.figma.com/file/ZcdUPebEhHfSZ91zgmv2cK/Icons).
-   С помощью [фигма-плагина](https://www.figma.com/community/plugin/1098026825756738050/Publish-Icons) создаётся пулл-реквест с иконками в репозиторий [ui-primitives](https://github.com/core-ds/ui-primitives).
-   После мёрджа пулл-реквеста в [ui-primitives](https://github.com/core-ds/ui-primitives) и публикации нового пакета, с помощью github-actions начинается процесс генерации новых реакт-компонентов на основе svg-файлов иконок.
-   После успешной генерации новых React-компонетов, публикуются новые версии пакетов.

## Какие есть пакеты иконок

На данный момент есть следующие пакеты иконок:
| Пакет | Ссылка на npmjs.com | Описание
| ------ | ------ | ------
| @alfalab/icons | [@alfalab/icons](https://www.npmjs.com/package/@alfalab/icons) | Общий пакет со всеми иконками
| @alfalab/icons-classic (old) | [@alfalab/icons-classic](https://www.npmjs.com/package/@alfalab/icons-classic) |  Устаревшие иконки
| @alfalab/icons-glyph | [@alfalab/icons-glyph](https://www.npmjs.com/package/@alfalab/icons-glyph) | Основной стиль иконок для всех продуктов
| @alfalab/icons-flag | [@alfalab/icons-flag](https://www.npmjs.com/package/@alfalab/icons-flag) | Иконки флагов стран
| @alfalab/icons-logotype | [@alfalab/icons-logotype](https://www.npmjs.com/package/@alfalab/icons-logotype) | Логотипы
| @alfalab/icons-corp | [@alfalab/icons-corp](https://www.npmjs.com/package/@alfalab/icons-corp) | Используются только в продуктах корпоратов
| @alfalab/icons-rocky | [@alfalab/icons-rocky](https://www.npmjs.com/package/@alfalab/icons-rocky) | Иконки в новом стиле
| @alfalab/icons-ios | [@alfalab/icons-ios](https://www.npmjs.com/package/@alfalab/icons-ios) | Используются только на iOS устройствах
| @alfalab/icons-android | [@alfalab/icons-android](https://www.npmjs.com/package/@alfalab/icons-android) | Используются только на Android устройствах


## Как импортить иконки в проект

`import { IconName } from '@alfalab/{packageName}/{IconName}';`

или

`import IconName from '@alfalab/{packageName}/{IconName}';`

## Цвет иконок

В пакете `@alfalab/icons-glyph` цвет иконок задается атрибутом `fill="currentColor"`, т.е. цвет наследуется от родительского свойства `color`.

В пакете `@alfalab/icons-classic` цвет иконок не наследуется.

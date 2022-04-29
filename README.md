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
| @alfalab/icons-classic | [@alfalab/icons-classic](https://www.npmjs.com/package/@alfalab/icons-classic) |  
| @alfalab/icons-glyph | [@alfalab/icons-glyph](https://www.npmjs.com/package/@alfalab/icons-glyph) | Иконки в новом стиле
| @alfalab/icons-flag | [@alfalab/icons-flag](https://www.npmjs.com/package/@alfalab/icons-flag) | Иконки флагов стран
| @alfalab/icons-logotype | [@alfalab/icons-logotype](https://www.npmjs.com/package/@alfalab/icons-logotype) | Логотипы
| @alfalab/icons-corp | [@alfalab/icons-corp](https://www.npmjs.com/package/@alfalab/icons-corp) | Иконки corp

## Как импортить иконки в проект

`import { AddMIcon } from '@alfalab/icons-glyph/AddMIcon';`

или

`import AddMIcon from '@alfalab/icons-glyph/AddMIcon';`

## Цвет иконок

В пакете `@alfalab/icons-glyph` цвет иконок задается атрибутом `fill="currentColor"`, т.е. цвет наследуется от родительского свойства `color`.

В пакете `@alfalab/icons-classic` цвет иконок не наследуется.

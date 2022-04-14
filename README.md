## Как найти иконку

[Витрина иконок с поиском](https://core-ds.github.io/icons-demo/)

## Как сюда попадают новые иконки

-   Дизайнер рисует [иконки в фигме](https://www.figma.com/file/QoGuPDB1hAMoMMqsQQ4Mx7lB/Icons?node-id=3882%3A144).
-   С помощью [фигма-плагина](https://www.figma.com/community/plugin/822773501021259599/Publish-Icons) создаётся пулл-реквест с иконками в репозиторий [ui-primitives](https://github.com/core-ds/ui-primitives).
-   После мёрджа пулл-реквеста в [ui-primitives](https://github.com/core-ds/ui-primitives) и публикации нового пакета, с помощью github-actions начинается процесс генерации новых реакт-компонентов на основе svg-файлов иконок.
-   После успешной генерации новых React-компонетов, публикуются новые версии пакетов.

## Какие есть пакеты иконок

На данный момент есть следующие пакеты иконок:
| Пакет | Ссылка на npmjs.com | Описание
| ------ | ------ | ------
| @core-ds/icons | [@core-ds/icons](https://www.npmjs.com/package/@alfalab/icons) | Общий пакет со всеми иконками
| @core-ds/icons-classic | [@core-ds/icons-classic](https://www.npmjs.com/package/@alfalab/icons-classic) |  
| @core-ds/icons-glyph | [@core-ds/icons-glyph](https://www.npmjs.com/package/@alfalab/icons-glyph) | Иконки в новом стиле
| @core-ds/icons-flag | [@core-ds/icons-flag](https://www.npmjs.com/package/@alfalab/icons-flag) | Иконки флагов стран
| @core-ds/icons-logotype | [@core-ds/icons-logotype](https://www.npmjs.com/package/@alfalab/icons-logotype) | Логотипы
| @core-ds/icons-corp | [@core-ds/icons-corp](https://www.npmjs.com/package/@alfalab/icons-corp) | Иконки corp

## Как импортить иконки в проект

`import { AddMIcon } from '@core-ds/icons-glyph/AddMIcon';`

или

`import AddMIcon from '@core-ds/icons-glyph/AddMIcon';`

## Размеры иконок

Все иконки соответствуют [размерной сетке](https://github.com/core-ds/ui-primitives/wiki/%D0%A2%D1%80%D0%B5%D0%B1%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BA-%D0%B8%D0%BA%D0%BE%D0%BD%D0%BA%D0%B0%D0%BC).

## Цвет иконок

В пакете `@core-ds/icons-glyph` цвет иконок задается атрибутом `fill="currentColor"`, т.е. цвет наследуется от родительского свойства `color`.

В пакете `@core-ds/icons-classic` цвет иконок не наследуется.

# <img src="https://pipui.ru/Themes/Default/img/logo.svg" width="28" height="28"> PipUI - CSS/JS/HTML Framework

PipUI — Кроссбраузерный фреймворк веб-интерфейсов. Распространяется свободно по лицензии MIT. Насчитывает множество компонентов для быстрой и адаптивной верстки.
Разработка и поддержка ведется по сей день.

# Установка через NPM
```shell script
npm install
```

### Сборка
```shell script
npm run build
```

### Сборка дистрибутива
```shell script
npm run dist
```

Информацию о сборке отдельных компонентов и дистрибутивов, можно найти в файле package.json

# Установка через CDN
Фреймворк PipUI использует несколько внешних библиотек, которые дополняют фреймворк иконкми, скриптами и эффектами. А именно: Font Awesome(v4.7.0), JQuery, JQuery Easing

Для начала работы, требуется подключение всех необходимых скриптов и стилей между тегами `<head>`

Скачать фреймворк PipUI можно на странице скачивания

```HTML
<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" />

<!-- JQuery -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

<!-- JQuery Easing -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.4.1/jquery.easing.min.js"></script>

<!-- PipUI -->
<link rel="stylesheet" href="https://cdn.pipui.ru/latest/dist/css/pipui.min.css" />
<link rel="stylesheet" href="https://cdn.pipui.ru/latest/dist/css/pipui-responsive.min.css" />
<script src="https://cdn.pipui.ru/latest/dist/js/pipui.min.js"></script>
```

Полную документацию можно найти на странице https://pipui.ru/docs/

if(typeof PipUI != 'undefined'){
    PipUI.i18n()
        .set('date._jan', 'Янв')
        .set('date._feb', 'Фев')
        .set('date._mar', 'Мар')
        .set('date._apr', 'Апр')
        .set('date._may', 'Май')
        .set('date._jun', 'Июн')
        .set('date._jul', 'Июл')
        .set('date._aug', 'Авг')
        .set('date._sep', 'Сен')
        .set('date._oct', 'Окт')
        .set('date._nov', 'Ноя')
        .set('date._dec', 'Дек')

        .set('date.jan', 'Январь')
        .set('date.feb', 'Февраль')
        .set('date.mar', 'Март')
        .set('date.apr', 'Апрель')
        .set('date.may', 'Май')
        .set('date.jun', 'Июнь')
        .set('date.jul', 'Июль')
        .set('date.aug', 'Август')
        .set('date.sep', 'Сентябрь')
        .set('date.oct', 'Октябрь')
        .set('date.nov', 'Ноябрь')
        .set('date.dec', 'Декабрь')

        .set('date._mo', 'Пн')
        .set('date._tu', 'Вт')
        .set('date._we', 'Ср')
        .set('date._th', 'Чт')
        .set('date._fr', 'Пт')
        .set('date._sa', 'Сб')
        .set('date._su', 'Вс')

        .set('date.mo', 'Понедельник')
        .set('date.tu', 'Вторник')
        .set('date.we', 'Среда')
        .set('date.th', 'Четверг')
        .set('date.fr', 'Пятница')
        .set('date.sa', 'Суббота')
        .set('date.su', 'Воскресенье')

        .set('date.hours', 'Часы')
        .set('date.minutes', 'Минуты')
        .set('date.seconds', 'Секунды');
}

class DateComponent {
    static VERSION = '1.0.0';

    static #tmp = new Date();

    static months = [
        PipUI.i18n().get('date.jan'), PipUI.i18n().get('date.feb'), PipUI.i18n().get('date.mar'),
        PipUI.i18n().get('date.apr'), PipUI.i18n().get('date.may'), PipUI.i18n().get('date.jun'),
        PipUI.i18n().get('date.jul'), PipUI.i18n().get('date.aug'), PipUI.i18n().get('date.sep'),
        PipUI.i18n().get('date.oct'), PipUI.i18n().get('date.nov'), PipUI.i18n().get('date.dec')
    ];

    static _months = [
        PipUI.i18n().get('date._jan'), PipUI.i18n().get('date._feb'), PipUI.i18n().get('date._mar'),
        PipUI.i18n().get('date._apr'), PipUI.i18n().get('date._may'), PipUI.i18n().get('date._jun'),
        PipUI.i18n().get('date._jul'), PipUI.i18n().get('date._aug'), PipUI.i18n().get('date._sep'),
        PipUI.i18n().get('date._oct'), PipUI.i18n().get('date._nov'), PipUI.i18n().get('date._dec')
    ];

    static _week = [
        PipUI.i18n().get('date._mo'), PipUI.i18n().get('date._tu'), PipUI.i18n().get('date._we'),
        PipUI.i18n().get('date._th'), PipUI.i18n().get('date._fr'), PipUI.i18n().get('date._sa'),
        PipUI.i18n().get('date._su')
    ];

    static week = [
        PipUI.i18n().get('date.mo'), PipUI.i18n().get('date.tu'), PipUI.i18n().get('date.we'),
        PipUI.i18n().get('date.th'), PipUI.i18n().get('date.fr'), PipUI.i18n().get('date.sa'),
        PipUI.i18n().get('date.su')
    ];



    /**
     * @param {number} num
     *
     * @return {number}
     * */
    static leadingZero(num){
        return num < 10 ? '0'+num : num;
    }



    /**
     * @param {int} year
     *
     * @param {int} month
     *
     * @return {int}
     * */
    static daysInMonth(year, month){
        this.#tmp.setFullYear(year);

        this.#tmp.setMonth(month);

        this.#tmp.setDate(32);

        return 32 - this.#tmp.getDate();
    }



    /**
     * @see https://www.php.net/manual/datetime.format.php
     *
     * @param {Date} date
     *
     * @param {string} str
     *
     * @return {string}
     * */
    static format(date, str){
        if(!date){ return str; }

        let _d = date.getDate();

        let _m = date.getMonth();

        let _Y = date.getFullYear();

        let _D = date.getDay();

        let _G = date.getHours();

        let _i = date.getMinutes();

        let _s = date.getSeconds();


        let d = this.leadingZero(_d);

        let D = this._week[_D];

        let l = this.week[D];

        let N = _D == 0 ? 7 : _D;

        let start = new Date(_Y, 0, 0).getTime();

        let days = (d - start) / 1000 / 24;

        let z = Math.floor(days);

        let W = Math.floor(days / 7);

        let F = this.months[_d];

        let m = this.leadingZero(_m+1);

        let M = this._months[_m];

        let t = this.daysInMonth(_Y, _m);

        let L = _Y % 400 == 0 || (_Y % 4 == 0 && _Y % 100 != 0) ? 1 : 0;

        let y = _Y.toString().substr(-2);

        let a = _G >= 12 ? 'pm' : 'am';

        let A = a.toUpperCase();

        let g = a == 'pm' && _G == 0 ? 12 : _G % 12;

        let h = this.leadingZero(g);

        let H = this.leadingZero(_G);

        let i = this.leadingZero(_i);

        let s = this.leadingZero(_s);

        let v = date.getMilliseconds();

        let u = v*1000;


        let offset = date.getTimezoneOffset();

        let ofDiv = parseInt(offset / 60);

        let otDiv = offset % 60;

        let sign = '+';

        if(offset < 0){
            ofDiv *= -1;
            otDiv *= -1;
            sign = '-';
        }

        let of = [sign, this.leadingZero(ofDiv), otDiv];

        let O = of.join();

        let P = of[0]+of[1]+':'+of[2];

        let p = P == '+00:00' ? 'Z' : P;

        let Z = offset * 60;

        let c = date.toISOString();

        let r = D+', '+_d+' '+M+' '+_Y+' '+H+':'+i+':'+s;

        let U = parseInt(date.getTime() / 1000);

        let seconds = _s + (_i * 60) + (_G * 3600);

        let B = parseInt(seconds / 86.4);



        // День месяца, 2 цифры с ведущим нулём от 01 до 31
        str = str.replace(/d/gm, d);

        // Текстовое представление дня недели, 3 символа 	от Mon до Sun
        str = str.replace(/D/gm, D);

        // День месяца без ведущего нуля от 1 до 31
        str = str.replace(/j/gm, _d);

        // Полное наименование дня недели 	от Sunday до Saturday
        str = str.replace(/l/gm, l);

        // Порядковый номер дня недели в соответствии со стандартом ISO 8601 	от 1 (понедельник) до 7 (воскресенье)
        str = str.replace(/N/gm, N);

        // Порядковый номер дня недели 	от 0 (воскресенье) до 6 (суббота)
        str = str.replace(/w/gm, _D);

        // Порядковый номер дня в году (начиная с 0) 	От 0 до 365
        str = str.replace(/z/gm, z);

        // Порядковый номер недели года в соответствии со стандартом ISO 8601; недели начинаются с понедельника 	Например: 42 (42-я неделя года)
        str = str.replace(/W/gm, W);

        // Полное наименование месяца, например, January или March 	от January до December
        str = str.replace(/F/gm, F);

        // Порядковый номер месяца с ведущим нулём 	от 01 до 12
        str = str.replace(/m/gm, m);

        // Сокращённое наименование месяца, 3 символа 	от Jan до Dec
        str = str.replace(/M/gm, M);

        // Порядковый номер месяца без ведущего нуля 	от 1 до 12
        str = str.replace(/n/gm, _m);

        // Количество дней в указанном месяце 	от 28 до 31
        str = str.replace(/t/gm, t);

        // Признак високосного года 	1, если год високосный, иначе 0.
        str = str.replace(/L/gm, L);

        // Полное числовое представление года, не менее 4 цифр, с - для годов до нашей эры. 	Примеры: -0055, 0787, 1999, 2003, 10191.
        str = str.replace(/Y/gm, _Y);

        // Номер года, 2 цифры 	Примеры: 99, 03
        str = str.replace(/y/gm, y);

        // Ante meridiem (лат. "до полудня") или Post meridiem (лат. "после полудня") в нижнем регистре 	am или pm
        str = str.replace(/a/gm, a);

        // Ante meridiem или Post meridiem в верхнем регистре 	AM или PM
        str = str.replace(/A/gm, A);

        // Время в формате Интернет-времени (альтернативной системы отсчёта времени суток) 	от 000 до 999
        str = str.replace(/B/gm, B);

        // Часы в 12-часовом формате без ведущего нуля 	от 1 до 12
        str = str.replace(/g/gm, g);

        // Часы в 24-часовом формате без ведущего нуля 	от 0 до 23
        str = str.replace(/G/gm, _G);

        // Часы в 12-часовом формате с ведущим нулём 	от 01 до 12
        str = str.replace(/h/gm, h);

        // Часы в 24-часовом формате с ведущим нулём 	от 00 до 23
        str = str.replace(/H/gm, H);

        // Минуты с ведущим нулём 	от 00 до 59
        str = str.replace(/i/gm, i);

        // Секунды с ведущим нулём 	от 00 до 59
        str = str.replace(/s/gm, s);

        // Микросекунды. Учтите, что date() всегда будет возвращать 000000, т.к. она принимает целочисленный (int) параметр, тогда как DateTime::format() поддерживает микросекунды, если DateTime создан с ними. 	Например: 654321
        str = str.replace(/u/gm, u);

        // Миллисекунды. Замечание такое же как и для u. 	Пример: 654
        str = str.replace(/v/gm, v);

        // Разница с временем по Гринвичу без двоеточия между часами и минутами 	Например: +0200
        str = str.replace(/O/gm, O);

        // Разница с временем по Гринвичу с двоеточием между часами и минутами 	Например: +02:00
        str = str.replace(/P/gm, P);

        // То же, что и P, но возвращает Z вместо +00:00 (доступен, начиная с PHP 8.0.0) 	Например: Z или +02:00
        str = str.replace(/p/gm, p);

        // Смещение часового пояса в секундах. Для часовых поясов, расположенных западнее UTC, возвращаются отрицательные числа, а для расположенных восточнее UTC - положительные.
        str = str.replace(/Z/gm, Z);

        // Дата в формате стандарта ISO 8601 	2004-02-12T15:19:21+00:00
        str = str.replace(/c/gm, c);

        // Дата в формате » RFC 222/» RFC 5322 	Например: Thu, 21 Dec 2000 16:01:07 +0200
        str = str.replace(/r/gm, r);

        // Количество секунд, прошедших с начала Эпохи Unix (1 января 1970 00:00:00 GMT)
        str = str.replace(/U/gm, U);

        return str;
    }
}

if(typeof PipUI != 'undefined'){
    PipUI.addComponent('Date', DateComponent.VERSION);
    /** @return {DateComponent} */
    PipUI.Date = DateComponent;
}
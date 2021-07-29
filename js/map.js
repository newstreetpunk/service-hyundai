$(function() {

    let maps = [
            {
                parent: '.dealer-map',
                id: "map",
                position: [53.275197,50.227754],
                zoom: 17,
                balloonContentHeader: '<img src="img/hyundai-logo.svg" alt="Хёндэ" style="width: 335px"><br>',
                balloonContentBody: '<h6><b>Официальный сервисный центр "Hyundai"</b></h6> \
                                    <p>пн — вс: 8:00 — 20:00</p> \
                                    <a href="tel:+78463210000" class="dealer-phone-map d-flex align-items-center"><img src="img/icons/phone_icon.png" alt="Phone Icon" class="me-2"> +7 (846) 321-00-00</a> \
                                    <a href="https://yandex.ru/maps/51/samara/?from=api-maps&ll=50.227754%2C53.275435&mode=routes&origin=jsapi_2_1_78&rtext=~53.275197%2C50.227754&rtt=auto&ruri=~ymapsbm1%3A%2F%2Fgeo%3Fll%3D50.228%252C53.275%26spn%3D0.001%252C0.001%26text%3D%25D0%25A0%25D0%25BE%25D1%2581%25D1%2581%25D0%25B8%25D1%258F%252C%2520%25D0%25A1%25D0%25B0%25D0%25BC%25D0%25B0%25D1%2580%25D0%25B0%252C%2520%25D0%2594%25D0%25B5%25D0%25BC%25D0%25BE%25D0%25BA%25D1%2580%25D0%25B0%25D1%2582%25D0%25B8%25D1%2587%25D0%25B5%25D1%2581%25D0%25BA%25D0%25B0%25D1%258F%2520%25D1%2583%25D0%25BB%25D0%25B8%25D1%2586%25D0%25B0%252C%252055&z=17"  target="_blank" class="dealer-phone">📍 Как добраться</a><br>',
                balloonContentFooter: '',
                hintContent: 'Официальный сервисный центр Hyundai'
            },

        ],
        start_load_script = false, // Переменная для определения была ли хоть раз загружена Яндекс.Карта (чтобы избежать повторной загрузки при наведении)
        end_load_script = false; // Переменная для определения был ли загружен скрипт Яндекс.Карт полностью (чтобы не возникли какие-нибудь ошибки, если мы загружаем несколько карт одновременно)


    //Функция создания карты сайта и затем вставки ее в блок с идентификатором "map-yandex"
    function init() {
        var myMapTemp = new ymaps.Map(this.id, {
            // center: [53.27530961361495,50.23211527185821], // координаты центра на карте
            center: this.position,
            zoom: this.zoom, // коэффициент приближения карты
        });
        myMapTemp.behaviors.disable('scrollZoom');

        var myPlacemarkTemp = new ymaps.Placemark(
            this.position, {
                balloonContentHeader: this.balloonContentHeader,
                balloonContentBody: this.balloonContentBody,
                balloonContentFooter: this.balloonContentFooter,
                hintContent: this.hintContent
            }, {
                preset: 'islands#blueAutoIcon',
                iconColor: '#002c5f'
            });
        myMapTemp.geoObjects.add(myPlacemarkTemp); // помещаем флажок на карту
        myMapTemp.balloon.open(this.position,
            this.balloonContentHeader + this.balloonContentFooter + this.balloonContentBody, {});

        // Получаем первый экземпляр коллекции слоев, потом первый слой коллекции
        var layer = myMapTemp.layers.get(0).get(0),
            parent = this.parent;

        // Решение по callback-у для определния полной загрузки карты
        waitForTilesLoad(layer).then(function(value) {
            // Скрываем индикатор загрузки после полной загрузки карты
            jQuery(parent).children('.loader').removeClass('is-active');
        });
    }

    // Функция для определения полной загрузки карты (на самом деле проверяется загрузка тайлов) 
    function waitForTilesLoad(layer) {
        return new ymaps.vow.Promise(function(resolve, reject) {
            var tc = getTileContainer(layer),
                readyAll = true;
            tc.tiles.each(function(tile, number) {
                if (!tile.isReady()) {
                    readyAll = false;
                }
            });
            if (readyAll) {
                resolve();
            } else {
                tc.events.once("ready", function() {
                    resolve();
                });
            }
        });
    }

    function getTileContainer(layer) {
        for (var k in layer) {
            if (layer.hasOwnProperty(k)) {
                if (
                    layer[k] instanceof ymaps.layer.tileContainer.CanvasContainer ||
                    layer[k] instanceof ymaps.layer.tileContainer.DomContainer
                ) {
                    return layer[k];
                }
            }
        }
        return null;
    }

    // Функция загрузки API Яндекс.Карт по требованию (в нашем случае при наведении)
    function loadScript(url, callback) {
        var script = document.createElement("script");

        if (script.readyState) { // IE
            script.onreadystatechange = function() {
                if (script.readyState == "loaded" ||
                    script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { // Другие браузеры
            script.onload = function() {
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    // Основная функция, которая проверяет когда мы навели на блок с классом "ymap-container"
    function ymap(map) {
        jQuery(map.parent).one("mouseenter", function() {
            // Показываем индикатор загрузки до тех пор, пока карта не загрузится
            jQuery(map.parent).children('.loader').addClass('is-active');

            if (!start_load_script) { // проверяем первый ли раз загружается Яндекс.Карта, если да, то загружаем

                // Чтобы не было повторной загрузки карты, мы изменяем значение переменной
                start_load_script = true;

                // Загружаем API Яндекс.Карт
                loadScript("https://api-maps.yandex.ru/2.1/?lang=ru_RU&loadByRequire=1", function() {
                    end_load_script = !end_load_script;
                    // Как только API Яндекс.Карт загрузились, сразу формируем карту и помещаем в блок с идентификатором "map-yandex"
                    ymaps.load(init, map);
                });
            } else {
                var check_load = setInterval(function() {
                    if(end_load_script) {
                        clearInterval(check_load);
                        ymaps.load(init, map);
                    } 
                }, 100);
            }
        });
    }

    //Запускаем основную функцию для массива карт
    maps.forEach(function(map){
        ymap(map)
    });
});
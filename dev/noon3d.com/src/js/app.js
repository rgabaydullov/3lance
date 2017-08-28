function updateGrid() {
    var lineHeight = $(window).height()+'px';

    View.sections.binoculus.css({
        lineHeight: lineHeight
    });
    View.sections.benefits.css({
        lineHeight: lineHeight
    });

    if($(window).width() > 720)
    {
        View.nav.menu.show();
    }

    updatePanorama();
}

function rotateBinoculus(e) {
    var binoculus = $(this);

    var min = 1; var max = 30;

    var startX = (e.type == 'mousedown') ? e.pageX : (e.type == 'touchstart') ? e.originalEvent.touches[0].pageX : -1;
    startX = parseInt(startX);

    var _reset = {
        mouse: function() {
            $(document)
                .off('mousemove.rotateBinoculus')
                .off('mouseup.rotateBinoculus');
        },
        touch: function() {
            $(document)
                .off('touchmove.rotateBinoculus')
                .off('touchend.rotateBinoculus');
        }
    };

    if(e.type == 'mousedown')
    {
        $(document)
            .on('mouseup.rotateBinoculus', _reset.mouse)
            .on('mousemove.rotateBinoculus', {binoculus: $(this), min: min, max: max}, changeSrc.bind(startX));
    }
    else if(e.type == 'touchstart')
    {
        $(document)
            .on('touchend.rotateBinoculus', _reset.touch)
            .on('touchmove.rotateBinoculus', {binoculus: $(this), min: min, max: max}, changeSrc.bind(startX));
    }

    function changeSrc(e) {
        var binoculus = e.data.binoculus;
        var min = e.data.min;
        var max = e.data.max;

        if(!!binoculus === false) {
            return;
        }
        if(!!startX === false) {
            return;
        }

        binoculus.on('dragstart.rotateBinoculus', function(){return false;});

        var moveX = (e.type == 'mousemove') ? e.pageX : (e.type == 'touchmove') ? e.originalEvent.touches[0].pageX : -1;

        var state = ''+binoculus.attr('src');
        var current = parseInt(state.replace(/[^0-9]*/g, ''));

        var diff = parseInt(startX - moveX);
        var pdiff = Math.abs(diff);

        if(pdiff >= 10) {
            var k;
            if (diff > 0) {
                k = 1;
            }
            else if (diff < 0) {
                k = -1;
            }

            current = getSrc(current, k, min, max);

            binoculus.attr('src', 'src/img/noon/' + current + '.png');

            startX = moveX;
        }

        function getSrc(value, dir, min, max) {
            if(dir === 1)
            {
                value++;
            }
            else if(dir === -1)
            {
                value--
            }

            value = (value < min) ? min : (value > max) ? max : value;

            return (value == 0) ? min : value;
        }
    }
}

function updatePanorama() {
    var $panoramaPresent = View.panorama.present;
    var $panoramaOld = View.panorama.old;
    var $panoramaSlider = View.panorama.slider;

    var $panoramaPresProp = {
        height: $panoramaPresent.height(),
        width: $panoramaPresent.width()
    };

    $panoramaOld.find('img').css({
        left: $panoramaPresProp.height+'px'
    });
    $panoramaOld.css({
        left: (-$panoramaPresProp.height)+'px',
        visibility: 'visible'
    });
    $panoramaSlider.css({
        left: ($panoramaOld.width() - $panoramaPresProp.height)+'px',
        visibility: 'visible'
    });
}

function panoramaSlider(e) {
    var slider = e.data.pels.slider;
    var old = e.data.pels.old;
    var present = e.data.pels.present;
    var panorama = e.data.pels.panorama;

    presentProperties = {
        height: present.height(),
        width: present.width()
    };
    oldProperties = {
        height: old.height(),
        width: old.width()
    };

    if(e.type == 'touchstart')
    {
        panorama.on('touchend', function() {
            $(this).off('touchend');
            $(this).off('touchmove');
        });

        panorama.on('touchmove', function(event) {
            var mouse = {
                x: event.originalEvent.touches[0].pageX
            };
            mouse.x = (mouse.x < 0) ? 0 : (mouse.x > presentProperties.width) ? presentProperties.width : mouse.x;
            var percentage = ((mouse.x - (presentProperties.width - presentProperties.height)) * 100) / (presentProperties.width);
            old.css({width: (100 + percentage)+'%'});
            slider.css({left: mouse.x+'px'});
        });
    }
    else if(e.type == 'mousedown')
    {
        panorama.on('mouseup', function() {
            $(this).off('mouseup');
            $(this).off('mousemove');
        });

        panorama.on('mousemove', function(event) {
            var mouse = {
                x: event.pageX
            };
            mouse.x = (mouse.x < 0) ? 0 : (mouse.x > presentProperties.width) ? presentProperties.width : mouse.x;
            var percentage = ((mouse.x - (presentProperties.width - presentProperties.height)) * 100) / (presentProperties.width);
            old.css({width: (100 + percentage)+'%'});
            slider.css({left: mouse.x+'px'});
        });
    }
}

function navigateLanding(e) {
    var navs = e.data.nels;
    var sections = e.data.sels;

    var positionsY = [
        sections.binoculus[0].offsetTop,
        sections.benefits[0].offsetTop,
        sections.possibilities[0].offsetTop,
        sections.use[0].offsetTop,
        sections.contacts[0].offsetTop
    ];
    var scrollY = document.documentElement.scrollTop || $('body').get(0).scrollTop;
    var scrollYMax = $('body').get(0).scrollHeight;

    var current;
    var active;
    var next;
    (function(navs, sections, scrollY, scrollYMax, positionsY) {

        for(var i = 0; i < navs.menu.children().length; i++)
        {
            var _el = navs.menu.find('li').eq(i);
            if(_el.is('.active'))
            {
                current = _el;
            }
            next = (positionsY[i+1]) ? positionsY[i+1] : scrollYMax;

            if(scrollY >= (positionsY[i]-60) && scrollY < next)
            {
                active = navs.menu.find('li').eq(i);
            }
        }
    })(navs, sections, scrollY, scrollYMax, positionsY);

    if(!active.is('.active'))
    {
        current.removeClass('active');
        active.toggleClass('active');

        if(active.index() == 2)
        {
            View.header.css({
                background: 'transparent'
            });
        } else {
            View.header.css({
                background: '#000'
            });
        }

        View.nav.bar.find('small').html(active.text());
    }
}

function showMenu(e) {
    var $menu = View.nav.menu;

    var _display = $menu.css('display');

    View.nav.menu.on('click.navMenu', showMenu);

    if($(window).width() < 720)
    {
        if(_display == 'block')
        {
            $menu.hide();
        }
        else if(_display == 'none')
        {
            $menu.show();
        }
    }
}

function Model() {
    var model = {};
    model.header = '#noon-header';
    model.rotation = {
        binocular: '#noon-binoculus',
        left: '#noon-rotate-left',
        right: '#noon-rotate-right'
    };
    model.panorama = {
        present: '#noon-panorama-present',
        old: '#noon-panorama-old',
        slider: '#noon-panorama-slider',
        panorama: '#noon-panorama',
        left: '#noon-panorama-left',
        right: '#noon-panorama-right'
    };
    model.sections = {
        binoculus: '#binoculus',
        benefits: '#benefits',
        possibilities: '#possibilities',
        use: '#use',
        contacts: '#contacts'
    };
    model.navs = {
        menu: '#noon-menu',
        phone: '#noon-phone-navigation'
    };
    model.nav = {
        menu: '#noon-nav',
        bar: '#noon-page-title',
        close: '#noon-hide-menu'
    };

    return model;
}
function View(model) {
    var view = {};
    view.header = $(model.header);
    view.rotation = {
        binocular: $(model.rotation.binocular),
        leftArrow: $(model.rotation.left),
        rightArrow: $(model.rotation.right)
    };
    view.panorama = {
        present: $(model.panorama.present),
        old: $(model.panorama.old),
        slider: $(model.panorama.slider),
        panorama: $(model.panorama.panorama),
        leftArrow: $(model.panorama.left),
        rightArrow: $(model.panorama.right)
    };
    view.sections = {
        binoculus: $(model.sections.binoculus),
        benefits: $(model.sections.benefits),
        possibilities: $(model.sections.possibilities),
        use: $(model.sections.use),
        contacts: $(model.sections.contacts)
    };
    view.navs = {
        menu: $(model.navs.menu),
        phone: $(model.navs.phone)
    };
    view.nav = {
        menu: $(model.nav.menu),
        bar: $(model.nav.bar),
        close: $(model.nav.close)
    };

    return view;
}

function Controller(model, view) {
    var controller = {};
    view.rotation.binocular.on('mousedown touchstart', {rels: view.rotation}, rotateBinoculus);

    view.panorama.slider.on('mousedown', {pels: view.panorama}, panoramaSlider);
    view.panorama.slider.on('touchstart', {pels: view.panorama}, panoramaSlider);

    view.nav.bar.on('click.showMenu', showMenu);

    $(window).on('scroll', {nels: view.navs, sels: view.sections}, navigateLanding);

    return controller;
}

var Model = new Model();
var View = new View(Model);
var Controller = new Controller(Model, View);

$(window).on('keydown', function(event) {
    if(event.ctrlKey || event.metaKey)
    {
        switch(String.fromCharCode(event.which).toLowerCase())
        {
            case 's':
                event.preventDefault();
                break;
            case 'f':
                event.preventDefault();
                break;
            case 'g':
                event.preventDefault();
                break;
            case 'u':
                event.preventDefault();
                break;
        }
    }
});

//history.replaceState(null ,null, 'index.html'+String.fromCharCode(8237));

$(window)
    .on('load', updateGrid)
    .on('resize.updateGrid', updateGrid);
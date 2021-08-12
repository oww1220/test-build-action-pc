import '@babel/polyfill';
import jQuery from 'jquery';
import lottie from 'lottie-web';
const log = console.log;
var CommonUI;
(function (CommonUI) {
    CommonUI.$ = jQuery;
    CommonUI.Resize = {
        chk(target) {
            if ((target.width() || 0) >= 1025) {
                target.removeClass('pc mobile tablet').addClass('pc');
            }
            else if ((target.width() || 0) >= 768) {
                target.removeClass('pc mobile tablet').addClass('tablet');
            }
            else {
                target.removeClass('pc mobile tablet').addClass('mobile');
            }
        },
        font() {
            const doc = document.documentElement;
            const caculateWidth = String((doc.clientWidth / 320) * 62.5 * 100);
            let fontSizeVal = parseFloat(caculateWidth) / 100;
            fontSizeVal = fontSizeVal >= 85 ? 85 : fontSizeVal;
            doc.style.fontSize = fontSizeVal + '%';
        },
        resize($BODY) {
            CommonUI.$(window).on('resize', () => {
                this.chk($BODY);
                this.font();
            });
        },
    };
    CommonUI.Map = {
        init() {
            class JqMap {
                constructor() {
                    this.map = null;
                    this.map = new Object();
                }
                put(key, value) {
                    this.map[key] = value;
                }
                get(key) {
                    return this.map[key];
                }
                containsKey(key) {
                    return key in this.map;
                }
                clear() {
                    for (const prop in this.map) {
                        delete this.map[prop];
                    }
                }
                remove(key) {
                    delete this.map[key];
                }
                keys() {
                    const arKey = new Array();
                    for (const prop in this.map) {
                        arKey.push(prop);
                    }
                    return arKey;
                }
                values() {
                    const arVal = new Array();
                    for (const prop in this.map) {
                        arVal.push(this.map[prop]);
                    }
                    return arVal;
                }
                size() {
                    let count = 0;
                    for (const prop in this.map) {
                        count++;
                    }
                    return count;
                }
            }
            return new JqMap();
        },
    };
    CommonUI.Layer = {
        scrollTop: 0,
        calculate(layer) {
            const $layer = CommonUI.$(layer), layerIn = $layer.find('.modal-inner'), winH = CommonUI.$(window).height() || 0, winW = CommonUI.$(window).width() || 0;
            layerIn.find('.modal-scroll').removeAttr('style');
            const layerH = $layer.height() || 0, layerW = $layer.width() || 0, marginH = parseInt(layerIn.css('marginTop')) + parseInt(layerIn.css('marginBottom'));
            if (winH < layerH) {
                layerIn.find('.modal-scroll').css({
                    height: winH - marginH,
                    overflow: 'auto',
                });
                $layer.css({
                    top: 0,
                    left: (winW - layerW) / 2,
                });
            }
            else {
                layerIn.find('.modal-scroll').removeAttr('style');
                $layer.css({
                    top: (winH - layerH) / 2,
                    left: (winW - layerW) / 2,
                });
            }
        },
        openClick(target, dimmed, parent, callback) {
            const that = this;
            CommonUI.$(document).on('click', target, function (e) {
                const layer = '.' + CommonUI.$(this).data('layer');
                const targetDom = CommonUI.$(this);
                const show = () => {
                    that.open(layer, dimmed, parent);
                };
                if (callback) {
                    callback(show, layer, targetDom);
                }
                else {
                    show();
                }
                e.preventDefault();
            });
        },
        open(layer, dimmed, parent, callback) {
            const that = this;
            that.scrollTop = CommonUI.$(window).scrollTop() || 0;
            CommonUI.$('body').addClass('fixed');
            CommonUI.$('body').css({ top: -that.scrollTop });
            if (dimmed)
                CommonUI.$(dimmed).fadeIn();
            if (callback)
                callback(layer);
            CommonUI.$(parent + layer).show();
            that.calculate(layer);
            CommonUI.$(window).on('resize.layer', function () {
                that.calculate(layer);
            });
        },
        closeClick(target, dimmed, parent, callback) {
            const that = this;
            CommonUI.$(document).on('click', target, function (e) {
                let layer;
                const targetDom = CommonUI.$(this);
                const hide = () => {
                    that.close(layer, dimmed, parent);
                };
                if (target == dimmed) {
                    layer = parent;
                }
                else {
                    layer = parent + '.' + CommonUI.$(this).data('layer');
                }
                if (callback) {
                    callback(hide, layer, targetDom);
                }
                else {
                    hide();
                }
                e.preventDefault();
            });
        },
        close(layer, dimmed, parent, callback) {
            const that = this;
            if (layer != dimmed) {
                CommonUI.$(layer).hide();
            }
            else {
                CommonUI.$(parent).hide();
            }
            if (dimmed)
                CommonUI.$(dimmed).fadeOut();
            if (callback)
                callback(layer);
            CommonUI.$('body').removeClass('fixed');
            CommonUI.$('body').css({ top: 0 });
            CommonUI.$(window).scrollTop(that.scrollTop);
            CommonUI.$(window).off('resize.layer');
        },
    };
    CommonUI.LayerRocket = {
        cashGenerator: null,
        eventChkFlag: true,
        open(layer, callback) {
            const that = this;
            return function* () {
                that.eventChkFlag = false;
                const $target = CommonUI.$(layer);
                try {
                    CommonUI.$('body').addClass('overlay-hidden');
                    $target.css({ display: 'flex' });
                    const delay0 = yield CommonUI.Async.wait(100);
                    $target.addClass('active');
                    $target.find('.layer-cont').addClass('active');
                    const delay2 = yield CommonUI.Async.wait(300);
                    $target.find('.btn-rocket-close').addClass('open');
                    if (callback)
                        callback(layer);
                }
                catch (err) {
                    log(err.message);
                }
                that.eventChkFlag = true;
            };
        },
        close(layer, callback) {
            const that = this;
            return function* () {
                that.eventChkFlag = false;
                const $target = CommonUI.$(layer);
                try {
                    CommonUI.$('body').removeClass('overlay-hidden');
                    $target.find('.btn-rocket-close').removeClass('open');
                    $target.find('.btn-rocket-close').addClass('close');
                    $target.find('.layer-cont').removeClass('active');
                    const delay1 = yield CommonUI.Async.wait(1000);
                    $target.removeClass('active');
                    const delay3 = yield CommonUI.Async.wait(300);
                    $target.find('.btn-rocket-close').removeClass('close');
                    const delay4 = yield CommonUI.Async.wait(100);
                    $target.hide();
                    if (callback)
                        callback(layer);
                }
                catch (err) {
                    log(err.message);
                }
                that.eventChkFlag = true;
            };
        },
    };
    CommonUI.Event = {
        toggle(target, parent, callback) {
            CommonUI.$(document).on('click', target, function (e) {
                const $this = CommonUI.$(this);
                const $targetDiv = CommonUI.$(target);
                const layer = CommonUI.$('.' + $this.data('target'));
                const sort = $this.data('sort');
                const onClass = $this.data('on');
                const siblings = $this.data('siblings');
                const $parent = CommonUI.$(parent);
                const logic = () => {
                    if (onClass) {
                        if (parent === null ? $this.hasClass('on') : layer.is(':visible')) {
                            $this.removeClass('on');
                            layer.removeClass('on');
                        }
                        else {
                            if (siblings) {
                                $targetDiv.removeClass('on');
                                $parent.removeClass('on');
                            }
                            $this.addClass('on');
                            layer.addClass('on');
                        }
                    }
                    if (layer.is(':visible')) {
                        if (sort == 'fade') {
                            layer.fadeOut();
                        }
                        else if (sort == 'normal') {
                            layer.hide();
                        }
                        else if (sort == 'none') {
                            return false;
                        }
                        else {
                            layer.slideUp();
                        }
                    }
                    else {
                        if (sort == 'fade') {
                            if (siblings) {
                                $parent.fadeOut();
                            }
                            layer.fadeIn();
                        }
                        else if (sort == 'normal') {
                            if (siblings) {
                                $parent.hide();
                            }
                            layer.show();
                        }
                        else if (sort == 'none') {
                            return false;
                        }
                        else {
                            if (siblings) {
                                $parent.slideUp();
                            }
                            layer.slideDown();
                        }
                    }
                };
                if (callback) {
                    callback(logic, layer);
                }
                else {
                    logic();
                }
            });
        },
        goTop(target) {
            target.on('click', function (e) {
                CommonUI.$('html, body').stop().animate({ scrollTop: 0 }, 1000);
                e.preventDefault();
            });
        },
        topScrollCh(target, parent) {
            if (parent.hasClass('pc')) {
                const winScroll = CommonUI.$(window).scrollTop() || 0;
                if (winScroll == 0) {
                    target.fadeOut();
                    CommonUI.$('#header .inner').removeClass('on');
                }
                else {
                    target.fadeIn();
                    CommonUI.$('#header .inner').addClass('on');
                }
            }
            else {
                return;
            }
        },
        taps(tab_nav, callback) {
            const target = tab_nav + '.tab_nav li';
            CommonUI.$(document).on('click', target, function (e) {
                const $this = CommonUI.$(this);
                const $layer = CommonUI.$(tab_nav + '.tab_cont');
                const idx = $this.index();
                const swap = () => {
                    $this.addClass('on').siblings().removeClass('on');
                    $layer.find('> div').eq(idx).show().siblings().hide();
                };
                if (callback) {
                    callback(swap);
                }
                else {
                    swap();
                }
                e.preventDefault();
            });
        },
    };
    CommonUI.Lottie = {
        init({ elem, loopFlag, autoplayFlag, pathString }) {
            return lottie.loadAnimation({
                container: elem,
                renderer: 'svg',
                loop: loopFlag,
                autoplay: autoplayFlag,
                path: pathString,
            });
        },
    };
    CommonUI.Async = {
        generaterRun(iter) {
            return (function iterate({ value, done }) {
                if (done)
                    return value;
                if (value.constructor === Promise) {
                    return value.then((data) => iterate(iter.next(data))).catch((err) => iter.throw(err));
                }
                else {
                    return iterate(iter.next(value));
                }
            })(iter.next());
        },
        wait(ms, value) {
            return new Promise((resolve) => setTimeout(resolve, ms, value));
        },
        promise(callback) {
            return new Promise((resolve, reject) => {
                callback(resolve, reject);
            });
        },
        debounce(f, interval) {
            let timer = null;
            return (...args) => {
                clearTimeout(timer);
                return new Promise((resolve) => {
                    timer = setTimeout(() => resolve(f(...args)), interval);
                });
            };
        },
        throttling(f, interval) {
            let timer = null;
            return (...args) => {
                return new Promise((resolve) => {
                    if (!timer) {
                        timer = setTimeout(() => {
                            resolve(f(...args));
                            timer = null;
                        }, interval);
                    }
                });
            };
        },
    };
    CommonUI.Fn = {
        filter: function* (f, iter) {
            for (const a of iter) {
                if (f(a))
                    yield a;
            }
        },
        map: function* (f, iter) {
            for (const a of iter) {
                yield f(a);
            }
        },
        take: function (length, iter) {
            let res = [];
            for (const a of iter) {
                res.push(a);
                if (res.length === length)
                    return res;
            }
            return res;
        },
        reduce: function (f, acc, iter) {
            for (const a of iter) {
                acc = f(acc, a);
            }
            return acc;
        },
    };
})(CommonUI || (CommonUI = {}));
export default CommonUI;
window.CommonUI = CommonUI;
window.$ = window.CommonUI.$;

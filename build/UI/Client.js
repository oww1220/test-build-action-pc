import * as Universe from '@src/UI/Universe';
import CommonUI from '@src/CommonUI';
import AOS from 'aos';
import $ from 'jquery';
const log = console.log;
const { Async, LayerRocket, Lottie } = CommonUI;
$(() => {
    setTimeout(() => {
        AOS.init({
            once: true,
            delay: 200,
            duration: 600,
        });
    }, 500);
    if ($('.aos-tab').length) {
        const $target = $('.aos-tab li');
        $target.on('click', (e) => {
            $('.aos-init').removeClass('aos-animate');
            AOS.refresh();
        });
    }
    if (document.getElementById('webgl-universe')) {
        (() => {
            const stage = new Universe.Stage();
            stage.init();
            const mesh = new Universe.Mesh(stage);
            mesh.init();
            window.addEventListener('resize', () => {
                stage.onResize();
            });
            const _raf = () => {
                window.requestAnimationFrame(() => {
                    stage.onRaf();
                    mesh.onRaf();
                    _raf();
                });
            };
            _raf();
        })();
    }
    (() => {
        if ($('.intro-overlay').length) {
            const aniObj = Lottie.init({
                elem: document.getElementById('lottie00_01'),
                loopFlag: false,
                autoplayFlag: false,
                pathString: '../../bundle/json/00_data-01.json',
            });
            function* introClose() {
                try {
                    const delay0 = yield Async.wait(500);
                    aniObj.play();
                    const delay1 = yield Async.wait(2000);
                    $('.intro-overlay .intro-video').hide();
                    $('.intro-overlay').addClass('active');
                    const delay3 = yield Async.wait(2000);
                    $('.intro-overlay').hide();
                }
                catch (err) {
                    log(err.message);
                }
            }
            Async.generaterRun(introClose());
        }
    })();
    (() => {
        $(document).on('click', '.rocket-layer-open', (e) => {
            const layer = '.' + $(e.currentTarget).data('layer');
            if (!LayerRocket.eventChkFlag)
                return;
            LayerRocket.cashGenerator = LayerRocket.open(layer, (layer) => {
                console.log(`${layer} layer open!`);
            })();
            Async.generaterRun(LayerRocket.cashGenerator);
        });
        $(document).on('click', '.btn-rocket-close', (e) => {
            const layer = '.' + $(e.currentTarget).data('layer');
            if (!LayerRocket.eventChkFlag)
                return;
            LayerRocket.cashGenerator = LayerRocket.close(layer, (layer) => {
                console.log(`${layer} layer close!`);
            })();
            Async.generaterRun(LayerRocket.cashGenerator);
        });
    })();
});

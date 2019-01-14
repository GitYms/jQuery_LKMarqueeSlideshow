/**
 * Title: LKMarqueeSlideshow
 * Version: 1.1.1
 * Description: plugin
 * Author: LiuZhenghe
 * Date: 2019-01-10
 */

(function($) {
    // What does the LKMarqueeSlideshow plugin do?
    $.fn.LKMarqueeSlideshow = function(options) {

        if (!this.length) {
            return this;
        };

        var opts = $.extend(true, {}, $.fn.LKMarqueeSlideshow.defaults, options);

        this.each(function() {
            var $this = $(this);
            var slide_container = $(this); // 轮播容器
            var slide_wrapper = $(this).find('.slide_wrapper'); // 滚动区域
            var slide_item = $(this).find('.slide_item'); // 轮播元素
            var item_length = slide_item.length; // 轮播元素个数
            var changeType = opts.changeType; // 改变运动方向方式
            var arrow_left = $(opts.arrow_left); // 左箭头
            var arrow_right = $(opts.arrow_right); // 右箭头
            var speed = opts.speed; // 速度
            var timer; // 定时器
            var mode = opts.mode; // 滚动方向
            var slidesPerView = opts.slidesPerView; // 同时显示的 slide 数量
            var loopAdditionalSlides = opts.loopAdditionalSlides; // 复制若干份轮播元素追加到当前轮播元素之后

            // 判断是否传入属性 loopAdditionalSlides ，如果没有传入，则默认属性值为 1，也就是克隆出一份轮播元素到当前轮播元素之后。
            if (loopAdditionalSlides == null) {
                loopAdditionalSlides = 1;
            } else {
                loopAdditionalSlides = loopAdditionalSlides;
            };

            // 判断是否传入属性 slidesPerView，如果没有传入，则默认属性值为 1。
            if (slidesPerView == null) {
                slidesPerView = 1;
            } else {
                slidesPerView = slidesPerView;
            };

            // 拷贝出若干份轮播添加到当前轮播元素后边，默认是一份。
            for (var i = 1; i <= loopAdditionalSlides; i++) {
                slide_item.clone().appendTo(slide_wrapper);
            }
            slide_item = $(this).find('.slide_item');

            // 初始化轮播容器的高，轮播元素、轮播容器的宽、。
            var slide_height = slide_item[0].clientHeight;
            slide_container.css('height', slide_height);
            var container_width = slide_container[0].clientWidth;
            var container_height = slide_container[0].clientHeight;

            // mode 属性判断：
            if (mode == "vertical") {
                // 当 mode 值为 vertical 时，轮播垂直滚动。
                slide_item.css({
                    'width': container_width,
                    'height': container_height / slidesPerView
                });
                // 初始化滚动区域的高。
                var wrapper_height = 0;
                for (var i = 0; i < slide_item.length; i++) {
                    wrapper_height += slide_item[i].clientHeight;
                };
                slide_wrapper.css('height', wrapper_height);
            } else {
                // 当不设置 mode 属性时，默认为水平滚动，设置轮播元素向左浮动。
                slide_item.css({
                    'width': container_width / slidesPerView,
                    'float': 'left'
                });
                // 初始化滚动区域的宽。
                var wrapper_width = 0;
                for (var i = 0; i < slide_item.length; i++) {
                    wrapper_width += slide_item[i].clientWidth;
                };
                slide_wrapper.css('width', wrapper_width);
            };

            // 滚动主方法：
            function moveFun() {
                // 垂直滚动方法：
                if (mode == "vertical") {
                    var wrapper_top = slide_wrapper[0].offsetTop; // 滚动区域向上偏移量
                    var wrapper_height = slide_wrapper[0].offsetHeight; // 滚动区域高
                    // 当轮播向上滚动的偏移量小于滚动区域一半的高度时，立刻定位到初始化位置。
                    if (wrapper_top < -(slide_wrapper[0].offsetHeight / (loopAdditionalSlides + 1))) {
                        slide_wrapper[0].style.top = 0;
                    } else if (wrapper_top > 0) {
                        // 当滚动区域向上偏移量大于0时（也就是向下滚动时），将滚动区域定位到滚动区域一半的位置上，这样就实现了无分滚动效果。
                        slide_wrapper[0].style.top = -(wrapper_height / (loopAdditionalSlides + 1)) + "px";
                    };
                    // 滚动元素 top 的值 = 滚动区域向上的偏移量 + speed，配合下边的定时器方法，偏移量不断增加，实现滚动效果。
                    slide_wrapper[0].style.top = slide_wrapper[0].offsetTop - speed + "px";

                } else {
                    // 水平滚动方法：
                    var wrapper_left = slide_wrapper[0].offsetLeft; // 滚动区域向左偏移量
                    var wrapper_width = slide_wrapper[0].offsetWidth; // 滚动区域宽
                    // 当轮播向左滚动的偏移量小于滚动区域一半的宽度时，立刻定位到初始化位置。
                    if (wrapper_left < -(slide_wrapper[0].offsetWidth / (loopAdditionalSlides + 1))) {
                        slide_wrapper[0].style.left = 0;
                    } else if (wrapper_left > 0) {
                        // 当滚动区域向左偏移量大于0时（也就是向右滚动时），将滚动区域定位到滚动区域一半的位置上，这样就实现了无分滚动效果。
                        slide_wrapper[0].style.left = -(wrapper_width / (loopAdditionalSlides + 1)) + "px";
                    };
                    // 滚动元素 left 的值 = 滚动区域向左的偏移量 + speed，配合下边的定时器方法，偏移量不断增加，实现滚动效果。
                    slide_wrapper[0].style.left = slide_wrapper[0].offsetLeft - speed + "px";
                };
            };
            // 每 0.02s 执行一次移动效果，实现匀速运动。
            timer = setInterval(moveFun, 20);

            // 鼠标移入滚动区域时停止滚动
            slide_container.mouseenter(function(event) {
                event.preventDefault();
                clearInterval(timer);
            });
            // 鼠标移出滚动区域时继续滚动
            slide_container.mouseleave(function(event) {
                event.preventDefault();
                timer = setInterval(moveFun, 20);
            });

            // 判断当轮播元素只有一个的时候，清除定时器。
            if (slide_item.length / 2 == 1) {
                clearInterval(timer);
            };

            // 鼠标左右切换效果：
            // 当 changeType 传入的是"mouseenter"，鼠标移入发生切换。
            // 当 changeType 不穿入任何参数时，鼠标点击发生切换。
            var speed_new = opts.speed;
            if (changeType == "mouseenter") {
                arrow_left.mouseenter(function(event) {
                    event.preventDefault();
                    speed = speed_new;
                });
                arrow_right.mouseenter(function(event) {
                    event.preventDefault();
                    speed = -speed_new;
                });
            } else {
                arrow_left.click(function(event) {
                    event.preventDefault();
                    speed = speed_new;
                });
                arrow_right.click(function(event) {
                    event.preventDefault();
                    speed = -speed_new;
                });
            };


        });

        return this;
    };

    // default options
    $.fn.LKMarqueeSlideshow.defaults = {
        speed: null, // 速度
        slidesPerView: null, // 同时显示的 slide 数量
        loopAdditionalSlides: null, // 复制若干份轮播元素追加到当前轮播元素之后
        mode: null, // 滚动方向
        changeType: null, // 改变运动方向方式
        arrow_left: null, // 左箭头
        arrow_right: null // 右箭头
    };

})(jQuery);
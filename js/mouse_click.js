// 鼠标点击生成随机颜色心形
(function(window, document) {
    const hearts = [];

    // 生成随机颜色
    function getRandomColor() {
        const r = Math.floor(255 * Math.random());
        const g = Math.floor(255 * Math.random());
        const b = Math.floor(255 * Math.random());
        return `rgb(${r}, ${g}, ${b})`;
    }

    // 初始化心形样式（核心：通过伪元素实现心形形状）
    function initHeartStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .heart {
                width: 8px;  /* 心形宽度 */
                height: 8px; /* 心形高度 */
                position: fixed;
                transform: rotate(45deg);
                z-index: 99999;
            }
            .heart::before, .heart::after {
                content: '';
                width: inherit;
                height: inherit;
                border-radius: 50%;
                position: absolute;
                background: inherit;
            }
            .heart::before {
                left: -4px; /* 左半圆 */
            }
            .heart::after {
                top: -4px; /* 上半圆 */
            }
        `;
        document.head.appendChild(style);
    }

    // 创建心形元素
    function createHeart(event) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        const color = getRandomColor();
        heart.style.background = color; // 心形主体颜色
        heart.style.left = `${event.clientX - 4}px`; // 居中对齐点击位置
        heart.style.top = `${event.clientY - 4}px`; // 居中对齐点击位置

        hearts.push({
            el: heart,
            y: event.clientY - 4, // 居中对齐点击位置
            alpha: 1,
            scale: 1
        });
        document.body.appendChild(heart);
    }

    // 心形动画（上升、放大、渐隐）
    function animateHearts() {
        for (let i = 0; i < hearts.length; i++) {
            const item = hearts[i];
            if (item.alpha <= 0) {
                document.body.removeChild(item.el);
                hearts.splice(i, 1);
                i--;
                continue;
            }

            // 更新心形状态
            item.y -= 1;
            item.scale += 0.005;
            item.alpha -= 0.01;

            // 应用动画样式
            item.el.style.top = `${item.y}px`;
            item.el.style.opacity = item.alpha;
            item.el.style.transform = `rotate(45deg) scale(${item.scale})`;
        }
        requestAnimationFrame(animateHearts);
    }

    // 绑定点击事件
    function bindClickEvent() {
        window.addEventListener('click', createHeart);
    }

    // 初始化
    function init() {
        initHeartStyles();
        bindClickEvent();
        animateHearts();
    }

    init();
})(window, document);
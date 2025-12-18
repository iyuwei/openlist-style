// 主题-视频映射配置
const themeVideoMap = {
    'hope-ui-light': 'https://gitee.com/iyuwei/openlist-style/raw/master/video/1.mp4',
    'hope-ui-dark': 'https://gitee.com/iyuwei/openlist-style/raw/master/video/2.mp4'
};

// 全局状态：记录当前活跃视频
let activeVideoElement = null;
const BLUR_LEVEL = 4; // 统一模糊度（可自定义修改）

// 创建单个主题视频元素
function createThemeVideo(theme) {
    const videoSrc = themeVideoMap[theme];
    if (!videoSrc) return null;

    // 创建视频元素
    const video = document.createElement('video');
    video.src = videoSrc;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsinline = true;
    video.className = 'theme-background-video';

    // 视频样式（基础+模糊）
    video.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: blur(${BLUR_LEVEL}px);
        z-index: -1;
        transition: opacity 1s ease-in-out; /* 平滑过渡核心 */
        opacity: 0; /* 初始透明，准备过渡 */
    `;

    return video;
}

// 初始化背景视频（页面加载时）
function initBackgroundVideo() {
    // 获取初始主题
    let initialTheme = 'hope-ui-light';
    if (document.body.classList.contains('hope-ui-dark')) {
        initialTheme = 'hope-ui-dark';
    }

    // 创建初始视频并显示
    activeVideoElement = createThemeVideo(initialTheme);
    if (activeVideoElement) {
        document.body.appendChild(activeVideoElement);
        // 确保DOM渲染后再显示，避免闪烁
        setTimeout(() => {
            activeVideoElement.style.opacity = 1;
        }, 50);
    }
}

// 主题切换时更换视频（平滑过渡）
function switchBackgroundVideo(newTheme) {
    // 避免重复切换
    if (!newTheme || !themeVideoMap[newTheme]) return;

    // 创建新主题视频
    const newVideo = createThemeVideo(newTheme);
    if (!newVideo) return;

    // 添加新视频到页面（在旧视频下方）
    document.body.appendChild(newVideo);

    // 触发过渡：新视频淡入，旧视频淡出
    setTimeout(() => {
        newVideo.style.opacity = 1;
        if (activeVideoElement) {
            activeVideoElement.style.opacity = 0;
        }
    }, 50);

    // 过渡结束后移除旧视频，更新活跃视频
    setTimeout(() => {
        if (activeVideoElement && activeVideoElement.parentNode) {
            activeVideoElement.remove();
        }
        activeVideoElement = newVideo;
    }, 1000); // 与过渡时间一致（1s）
}

// 监听主题切换（body class变化）
function watchThemeChange() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'class') {
                const bodyClassList = document.body.classList;
                let currentTheme = null;

                // 判断当前主题（二选一，不会同时存在）
                if (bodyClassList.contains('hope-ui-dark')) {
                    currentTheme = 'hope-ui-dark';
                } else if (bodyClassList.contains('hope-ui-light')) {
                    currentTheme = 'hope-ui-light';
                }

                // 只有主题有效且与当前活跃视频对应的主题不同时，才切换
                if (currentTheme && activeVideoElement) {
                    const currentVideoSrc = themeVideoMap[currentTheme];
                    if (activeVideoElement.src !== currentVideoSrc) {
                        switchBackgroundVideo(currentTheme);
                    }
                }
            }
        });
    });

    // 监听body的class属性变化
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return observer;
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initBackgroundVideo();
        watchThemeChange();
    });
} else {
    initBackgroundVideo();
    watchThemeChange();
}
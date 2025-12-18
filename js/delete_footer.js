// 解决动态元素加载延迟问题：持续监听直到元素出现后删除
function waitAndDeleteTargetFooter() {
    // 目标元素选择器（与控制台可匹配的一致）
    const selector = 'div.footer.hope-stack.hope-c-dhzjXW.hope-c-PJLV.hope-c-PJLV-ihQbspH-css';
    
    // 先尝试直接查找元素
    const checkAndDelete = () => {
        const targetFooter = document.querySelector(selector);
        if (targetFooter) {
            targetFooter.remove();
            console.log('✅ 已成功删除目标footer元素');
            return true; // 找到并删除，终止监听
        }
        return false; // 未找到，继续监听
    };

    // 1. 立即检查一次
    if (checkAndDelete()) return;

    // 2. 监听DOM变化，直到元素出现（处理动态加载）
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            if (checkAndDelete()) {
                observer.disconnect(); // 完成后停止监听
            }
        });
    });

    // 监听整个文档的DOM变化（包括动态添加的元素）
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('正在监听目标元素，将在元素出现后自动删除');
}

// 页面加载后启动监听（即使元素动态渲染也能捕获）
window.addEventListener('load', waitAndDeleteTargetFooter);
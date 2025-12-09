// ページ読み込み後に背景を黒へフェード
window.addEventListener("load", () => {
    setTimeout(() => {
        document.body.classList.add("loaded");
    }, 1000);  // 1秒後
});

window.addEventListener("load", () => {
    const bar = document.querySelector(".white-bar");

    // 1.5秒待ってから伸び始める
    setTimeout(() => {
        bar.classList.add("expand");
    }, 1500);
});

window.addEventListener("load", () => {
    const list = document.querySelector(".title-list");
    const items = Array.from(list.querySelectorAll(".plant-title"));
    const whiteBar = document.querySelector(".white-bar");


    if (!list || items.length === 0) {
        console.error("title-list or items not found");
        return;
    }

    // 手動スクロール量（リスト全体を縦に動かす）
    let customScroll = 0;

    // ドラッグ用
    let isDragging = false;
    let startY = 0;
    let scrollAtDragStart = 0;

    const itemHeight = 100;   // ベースの間隔
    const centerY   = 300;    // スナップ位置（画面上から300px）
    
    customScroll = centerY;   // 300
    updateLayout();

    console.log("custom scroll + snap(300) + variable spacing ready");

    // -------------------------
    // ホイールでスクロール
    // -------------------------
    window.addEventListener(
        "wheel",
        (e) => {
            e.preventDefault();

            customScroll += e.deltaY;
            updateLayout();

            // 少し待ってからスナップ（ホイールを止めたとき）
            clearTimeout(window.__snapTimer);
            window.__snapTimer = setTimeout(() => {
                snapToNearest();
            }, 150);
        },
        { passive: false }
    );

    // -------------------------
    // ドラッグ開始
    // -------------------------
    list.addEventListener("mousedown", (e) => {
        isDragging = true;
        startY = e.clientY;
        scrollAtDragStart = customScroll;
        list.style.cursor = "grabbing";
    });

    // -------------------------
    // ドラッグ中
    // -------------------------
    window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        const delta = e.clientY - startY;
        customScroll = scrollAtDragStart + delta;

        updateLayout();
    });

    // -------------------------
    // ドラッグ終了 → スナップ
    // -------------------------
    window.addEventListener("mouseup", () => {
        if (!isDragging) return;
        isDragging = false;
        list.style.cursor = "pointer";
        snapToNearest();
    });

    // -------------------------
    // 一番 300px に近いアイテムにスナップ
    // -------------------------
    function snapToNearest() {
        let closestIndex = 0;
        let closestDist = Infinity;

        items.forEach((item, index) => {
            const baseY = index * itemHeight + customScroll; // 変形前の基準位置
            const dist  = Math.abs(baseY - centerY);

            if (dist < closestDist) {
                closestDist = dist;
                closestIndex = index;
            }
        });

        // そのアイテムの baseY が 300px に来るように customScroll を調整
        const baseYOfClosest = closestIndex * itemHeight + customScroll;
        customScroll += (centerY - baseYOfClosest);

        updateLayout();
    }

    // -------------------------
    // レイアウト更新
    // -------------------------
    function updateLayout() {

        // ---- アクティブ決定 ----
        let activeIndex = 0;
        let minDist = Infinity;

        items.forEach((item, index) => {
            const baseY = index * itemHeight + customScroll;
            const dist = Math.abs(baseY - centerY);
            if (dist < minDist) {
                minDist = dist;
                activeIndex = index;
            }
        });
        const activeText = items[activeIndex].textContent.trim();
        if (activeText.startsWith("001")) {
            whiteBar.classList.add("active");   // → test_head.png に差し替え
        } else {
            whiteBar.classList.remove("active"); // → 白線に戻す
        }

        // ---- 位置計算 ----

        // 1. アクティブの位置
        const yPositions = [];
        yPositions[activeIndex] = centerY;

        // 2. 上側（累積）
        let y = centerY;
        for (let i = activeIndex - 1; i >= 0; i--) {
            if (i === activeIndex - 1) {
                y -= 200;       // 1つ上だけ 200px 上
            } else {
                y -= 100;       // それ以外は 100px
            }
            yPositions[i] = y;
        }

        // 3. 下側（累積）
        y = centerY;
        for (let i = activeIndex + 1; i < items.length; i++) {
            if (i === activeIndex + 1) {
                y += 250;       // 1つ下だけ 300px 下
            } else {
                y += 100;       // それ以降は 100px
            }
            yPositions[i] = y;
        }

        // ---- transform 適用 ----
        items.forEach((item, index) => {
            item.style.transform = `translateY(${yPositions[index]}px)`;

            // 色切り替え
            if (index === activeIndex) {
                item.style.color = "rgba(255, 255, 255, 1)";
            } else {
                item.style.color = "rgba(255,255,255,0.1)";
            }
        });
        items.forEach((item, index) => {
            item.addEventListener("click", (e) => {
                e.stopPropagation();

                const text = item.textContent.trim();

                // 空行は無効
                if (text === "") return;

                // coming soon（003 _ coming soon etc）も無効
                if (text.toLowerCase().includes("coming soon")) return;

                // クリックした行がアクティブでなければ無効
                if (index !== activeIndex) return;

                // ここまで来たら遷移する
                window.location.href = "pages/viewer.html";
            });
        });

    }



    // 初期レイアウト
    updateLayout();
});

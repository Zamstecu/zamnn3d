const themes = {
    red:{
        main:"#dc2626",
        light:"#f87171",
        bright:"#fb7185",
        text:"#fecaca",
        dark:"#991b1b",
        rgb:"220,38,38",
        png:"https://raw.githubusercontent.com/Zamstecu/zamnn3d/main/和風な雲_月の背景イラスト.jpg",
        mp4:"crimson.mp4"
    },

    purple:{
        main:"#9333ea",
        light:"#c084fc",
        bright:"#e879f9",
        text:"#d8b4fe",
        dark:"#7e22ce",
        rgb:"147,51,234",
        png:"https://raw.githubusercontent.com/Zamstecu/zamnn3d/07fcf25a5d97f1e00bd2cb1b4de0c0888531f2c8/shinobu.png",
        mp4:"purple.mp4"
    },

    yellow:{
        main:"#eab308",
        light:"#fde047",
        bright:"#facc15",
        text:"#fef08a",
        dark:"#ca8a04",
        rgb:"234,179,8",
        png:"https://raw.githubusercontent.com/Zamstecu/zamnn3d/main/download%20(7).jpg",
        mp4:"golden.mp4"
    },

    blue:{
        main:"#2563eb",
        light:"#60a5fa",
        bright:"#38bdf8",
        text:"#bfdbfe",
        dark:"#1d4ed8",
        rgb:"37,99,235",
        png:"https://raw.githubusercontent.com/Zamstecu/zamnn3d/main/download%20(8).jpg",
        mp4:"ocean.mp4"
    }
};

const root = document.documentElement;
const body = document.body;
const video = document.getElementById("mainVideo");
const overlay = document.getElementById("themeOverlay");

const themeNames = ["red","purple","yellow","blue"];

const themeLabels = {
    red:"CRIMSON",
    purple:"PURPLE",
    yellow:"GOLDEN",
    blue:"OCEAN"
};

let currentTheme =
    localStorage.getItem("zamnnx3d-theme") || "red";

let swipeStartX = 0;
let swipeStartY = 0;
let swipePointerActive = false;
let swipeMoved = false;


/* PARTICLES */

function createParticles(){

    const box =
        document.getElementById("themeParticles");

    box.innerHTML = "";

    for(let i = 0; i < 22; i++){

        const p = document.createElement("span");

        p.className = "theme-particle";

        p.style.left =
            Math.random() * 100 + "%";

        p.style.bottom =
            (-10 - Math.random() * 20) + "px";

        p.style.animationDuration =
            (7 + Math.random() * 8) + "s";

        p.style.animationDelay =
            (-Math.random() * 10) + "s";

        p.style.setProperty(
            "--drift",
            (Math.random() * 140 - 70) + "px"
        );

        p.style.width =
        p.style.height =
            (2 + Math.random() * 4) + "px";

        box.appendChild(p);
    }
}


/* APPLY THEME */

function applyTheme(name, animate = true){

    const theme = themes[name];

    if(!theme) return;

    if(animate){

        body.classList.remove("theme-enter");
        body.classList.add("theme-changing");

        overlay.classList.add("active");
    }

    setTimeout(() => {

        Object.entries(theme).forEach(
            ([key,value]) => {

                if(["png","mp4"].includes(key))
                    return;

                root.style.setProperty(
                    `--theme-${key}`,
                    value
                );
            }
        );

        body.style.backgroundImage = `
            linear-gradient(
                rgba(8,4,15,.45),
                rgba(8,4,15,.75)
            ),
            url("${theme.png}")
        `;

        video.classList.add(
            "theme-video-out"
        );

        video.pause();

        video.src = theme.mp4;

        video.load();

        video.onloadeddata = () => {

            video.play().catch(() => {});

            video.classList.remove(
                "theme-video-out"
            );
        };

        localStorage.setItem(
            "zamnnx3d-theme",
            name
        );

        createParticles();

        if(animate){

            body.classList.remove(
                "theme-changing"
            );

            body.classList.add(
                "theme-enter"
            );

            setTimeout(() => {

                overlay.classList.remove(
                    "active"
                );

            },180);

            setTimeout(() => {

                body.classList.remove(
                    "theme-enter"
                );

            },800);
        }

    }, animate ? 220 : 0);
}


/* THEME UI */

function updateThemeUI(name){

    currentTheme = name;

    document.getElementById(
        "themeCurrent"
    ).textContent =
        themeLabels[name];

    document.getElementById(
        "themePreview"
    ).src =
        themes[name].png;

    const dots =
        document.getElementById(
            "themeDots"
        );

    dots.innerHTML =
        themeNames.map(theme => `
            <span class="theme-dot ${
                theme === name
                    ? "active"
                    : ""
            }"></span>
        `).join("");

    const index =
        themeNames.indexOf(name);

    document.getElementById(
        "worldCount"
    ).textContent =
        `WORLD ${
            String(index + 1).padStart(2,"0")
        } / 04`;

    document.getElementById(
        "worldLine"
    ).style.height =
        `${((index + 1) /
            themeNames.length) * 100}%`;
}


/* CHANGE THEME */

function changeTheme(direction){

    let index =
        themeNames.indexOf(
            currentTheme
        );

    index =
        (
            index +
            direction +
            themeNames.length
        ) % themeNames.length;

    const next =
        themeNames[index];

    body.classList.remove(
        "swiping-left",
        "swiping-right"
    );

    void body.offsetWidth;

    body.classList.add(
        direction > 0
            ? "swiping-left"
            : "swiping-right"
    );

    applyTheme(next,true);

    updateThemeUI(next);

    setTimeout(() => {

        body.classList.remove(
            "swiping-left",
            "swiping-right"
        );

    },550);
}


/* BUTTONS */

document
    .getElementById("themePrev")
    .addEventListener(
        "click",
        () => changeTheme(-1)
    );

document
    .getElementById("themeNext")
    .addEventListener(
        "click",
        () => changeTheme(1)
    );


/* KEYBOARD */

document.addEventListener(
    "keydown",
    e => {

        if(e.key === "ArrowLeft")
            changeTheme(-1);

        if(e.key === "ArrowRight")
            changeTheme(1);
    }
);


/* HIDE HINT */

function hideHint(){

    const hint =
        document.getElementById(
            "swipeHint"
        );

    if(hint)
        hint.remove();
}


/* SWIPE CHECK */

function canSwipe(target){

    return !target.closest(
        "a,button,input,textarea,select,video,.theme-nav"
    );
}


/* BEGIN SWIPE */

function beginSwipe(x,y,target){

    if(!canSwipe(target))
        return;

    swipeStartX = x;
    swipeStartY = y;

    swipePointerActive = true;
    swipeMoved = false;
}


/* MOVE SWIPE */

function moveSwipe(x,y,event){

    if(!swipePointerActive)
        return;

    const dx =
        x - swipeStartX;

    const dy =
        y - swipeStartY;

    if(!swipeMoved){

        if(Math.abs(dx) < 12)
            return;

        if(
            Math.abs(dy) >
            Math.abs(dx) * 1.15
        ){

            swipePointerActive = false;
            return;
        }

        swipeMoved = true;

        body.classList.add(
            "is-dragging"
        );

        body.style.userSelect =
            "none";
    }

    setSwipeProgress(dx);

    if(
        event &&
        event.cancelable
    ){

        event.preventDefault();
    }
}


/* END SWIPE */

function endSwipe(x){

    if(!swipePointerActive)
        return;

    const dx =
        x - swipeStartX;

    swipePointerActive = false;

    body.classList.remove(
        "is-dragging"
    );

    body.style.userSelect = "";

    setSwipeProgress(0);

    if(
        swipeMoved &&
        Math.abs(dx) > 55
    ){

        changeTheme(
            dx < 0
                ? 1
                : -1
        );
    }

    swipeMoved = false;
}


/* SWIPE PROGRESS */

function setSwipeProgress(dx){

    const bar =
        document.getElementById(
            "swipeProgress"
        );

    bar.style.width =
        Math.min(
            Math.abs(dx) / 150 * 100,
            100
        ) + "%";
}


/* TOUCH START */

document.addEventListener(
    "touchstart",
    e => {

        hideHint();

        const t =
            e.changedTouches[0];

        beginSwipe(
            t.clientX,
            t.clientY,
            e.target
        );

    },
    {passive:true}
);


/* TOUCH MOVE */

document.addEventListener(
    "touchmove",
    e => {

        const t =
            e.changedTouches[0];

        moveSwipe(
            t.clientX,
            t.clientY,
            e
        );

    },
    {passive:false}
);


/* TOUCH END */

document.addEventListener(
    "touchend",
    e => {

        endSwipe(
            e.changedTouches[0].clientX
        );

    },
    {passive:true}
);


/* TOUCH CANCEL */

document.addEventListener(
    "touchcancel",
    () => {

        swipePointerActive = false;
        swipeMoved = false;

        body.classList.remove(
            "is-dragging"
        );

        body.style.userSelect = "";

        setSwipeProgress(0);
    },
    {passive:true}
);


/* DESKTOP MOUSE */

document.addEventListener(
    "mousedown",
    e => {

        hideHint();

        beginSwipe(
            e.clientX,
            e.clientY,
            e.target
        );
    }
);

document.addEventListener(
    "mousemove",
    e => {

        moveSwipe(
            e.clientX,
            e.clientY,
            e
        );
    }
);

document.addEventListener(
    "mouseup",
    e => {

        endSwipe(
            e.clientX
        );
    }
);

document.addEventListener(
    "mouseleave",
    () => {

        if(!swipePointerActive)
            return;

        swipePointerActive = false;
        swipeMoved = false;

        body.classList.remove(
            "is-dragging"
        );

        body.style.userSelect = "";

        setSwipeProgress(0);
    }
);


/* PRELOAD */

function preloadThemes(){

    themeNames.forEach(name => {

        const theme =
            themes[name];

        const img =
            new Image();

        img.src =
            theme.png;

        const v =
            document.createElement(
                "video"
            );

        v.preload = "auto";
        v.muted = true;
        v.playsInline = true;
        v.src = theme.mp4;
    });
}


/* DISABLE IMAGE DRAG */

document
    .querySelectorAll("img")
    .forEach(img => {

        img.draggable = false;
    });


/* INITIALIZE */

preloadThemes();

applyTheme(
    currentTheme,
    false
);

updateThemeUI(
    currentTheme
);

createParticles();
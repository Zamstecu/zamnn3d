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


/* =========================
   ELEMENTS
========================= */

const root=document.documentElement;
const body=document.body;
const video=document.getElementById("mainVideo");
const overlay=document.getElementById("themeOverlay");
const particles=document.getElementById("themeParticles");

const themeCurrent=document.getElementById("themeCurrent");
const themePreview=document.getElementById("themePreview");
const themeDots=document.getElementById("themeDots");

const swipeProgress=document.getElementById("swipeProgress");
const swipeHint=document.getElementById("swipeHint");


/* =========================
   THEMES
========================= */

const themeNames=["red","purple","yellow","blue"];

const themeLabels={
    purple:"PURPLE",
    red:"CRIMSON",
    yellow:"GOLDEN",
    blue:"OCEAN"
};

let currentTheme=
    localStorage.getItem("zamnnx3d-theme")||"red";

let changing=false;


/* =========================
   PARTICLES
========================= */

function createParticles(){

    particles.innerHTML="";

    const amount=window.innerWidth<=700?12:18;

    for(let i=0;i<amount;i++){

        const p=document.createElement("span");

        p.className="theme-particle";

        p.style.left=Math.random()*100+"%";
        p.style.bottom=(-10-Math.random()*20)+"px";

        p.style.animationDuration=
            (8+Math.random()*7)+"s";

        p.style.animationDelay=
            (-Math.random()*10)+"s";

        p.style.setProperty(
            "--drift",
            (Math.random()*140-70)+"px"
        );

        const size=2+Math.random()*3;

        p.style.width=size+"px";
        p.style.height=size+"px";

        particles.appendChild(p);
    }
}


/* =========================
   IMAGE PRELOAD
========================= */

function preloadImage(name){

    if(!themes[name])return;

    const img=new Image();

    img.src=themes[name].png;
}


/* =========================
   PRELOAD NEARBY IMAGES
========================= */

function preloadNearbyImages(){

    const i=themeNames.indexOf(currentTheme);

    const next=
        themeNames[(i+1)%themeNames.length];

    const prev=
        themeNames[
            (i-1+themeNames.length)%
            themeNames.length
        ];

    preloadImage(next);
    preloadImage(prev);
}


/* =========================
   THEME UI
========================= */

function updateThemeUI(name){

    currentTheme=name;

    themeCurrent.textContent=
        themeLabels[name];

    themePreview.src=
        themes[name].png;

    themeDots.innerHTML=
        themeNames.map(theme=>`
            <span
                class="theme-dot ${
                    theme===name?"active":""
                }">
            </span>
        `).join("");

    const count=
        themeNames.indexOf(name)+1;

    const worldCount=
        document.getElementById("worldCount");

    const worldLine=
        document.getElementById("worldLine");

    if(worldCount){
        worldCount.textContent=
            `WORLD ${String(count).padStart(2,"0")} / 04`;
    }

    if(worldLine){
        worldLine.style.height=
            `${count*25}%`;
    }
}


/* =========================
   APPLY THEME
========================= */

function applyTheme(name,animate=true){

    if(!themes[name]||changing)return;

    const theme=themes[name];

    changing=true;

    if(animate){

        body.classList.remove("theme-enter");

        body.classList.add("theme-changing");

        overlay.classList.add("active");
    }


    setTimeout(()=>{

        /* COLORS */

        root.style.setProperty(
            "--theme-main",
            theme.main
        );

        root.style.setProperty(
            "--theme-light",
            theme.light
        );

        root.style.setProperty(
            "--theme-bright",
            theme.bright
        );

        root.style.setProperty(
            "--theme-text",
            theme.text
        );

        root.style.setProperty(
            "--theme-dark",
            theme.dark
        );

        root.style.setProperty(
            "--theme-rgb",
            theme.rgb
        );


        /* BACKGROUND */

        body.style.backgroundImage=`
            linear-gradient(
                rgba(8,4,15,.45),
                rgba(8,4,15,.75)
            ),
            url("${theme.png}")
        `;


        /* VIDEO */

        video.classList.add("theme-video-out");

        video.pause();

        video.removeAttribute("src");

        video.load();

        video.src=theme.mp4;

        video.load();


        video.onloadeddata=()=>{

            video.play().catch(()=>{});

            video.classList.remove(
                "theme-video-out"
            );

            video.onloadeddata=null;
        };


        /* SAVE */

        localStorage.setItem(
            "zamnnx3d-theme",
            name
        );


        currentTheme=name;

        updateThemeUI(name);

        createParticles();

        preloadNearbyImages();


        if(animate){

            body.classList.remove(
                "theme-changing"
            );

            body.classList.add(
                "theme-enter"
            );

            setTimeout(()=>{
                overlay.classList.remove(
                    "active"
                );
            },180);

            setTimeout(()=>{
                body.classList.remove(
                    "theme-enter"
                );
            },800);
        }


        setTimeout(()=>{
            changing=false;
        },500);

    },animate?180:0);
}


/* =========================
   CHANGE THEME
========================= */

function changeTheme(direction){

    if(changing)return;

    let i=
        themeNames.indexOf(currentTheme);

    i=
        (i+direction+themeNames.length)%
        themeNames.length;

    const next=
        themeNames[i];


    body.classList.remove(
        "swiping-left",
        "swiping-right"
    );

    void body.offsetWidth;

    body.classList.add(
        direction>0
            ?"swiping-left"
            :"swiping-right"
    );


    applyTheme(next,true);


    setTimeout(()=>{
        body.classList.remove(
            "swiping-left",
            "swiping-right"
        );
    },550);
}


/* =========================
   BUTTONS
========================= */

document
    .getElementById("themePrev")
    .addEventListener(
        "click",
        ()=>changeTheme(-1)
    );

document
    .getElementById("themeNext")
    .addEventListener(
        "click",
        ()=>changeTheme(1)
    );


/* =========================
   KEYBOARD
========================= */

document.addEventListener(
    "keydown",
    e=>{

        if(e.key==="ArrowLeft"){
            changeTheme(-1);
        }

        if(e.key==="ArrowRight"){
            changeTheme(1);
        }
    }
);


/* =========================
   HIDE HINT
========================= */

function hideHint(){

    if(swipeHint){
        swipeHint.remove();
    }
}


/* =========================
   SWIPE
========================= */

let swipeStartX=0;
let swipeStartY=0;

let swipeActive=false;
let swipeMoved=false;


function canSwipe(target){

    return !target.closest(
        "a,button,input,textarea,select,video,.theme-nav"
    );
}


function beginSwipe(x,y,target){

    if(!canSwipe(target))return;

    swipeStartX=x;
    swipeStartY=y;

    swipeActive=true;
    swipeMoved=false;
}


function moveSwipe(x,y,event){

    if(!swipeActive)return;

    const dx=x-swipeStartX;
    const dy=y-swipeStartY;


    if(!swipeMoved){

        if(Math.abs(dx)<12)return;

        if(
            Math.abs(dy)>
            Math.abs(dx)*1.15
        ){

            swipeActive=false;

            return;
        }

        swipeMoved=true;

        body.classList.add(
            "is-dragging"
        );

        body.style.userSelect="none";
    }


    if(swipeMoved){

        const progress=
            Math.min(
                Math.abs(dx)/150*100,
                100
            );

        swipeProgress.style.width=
            progress+"%";

        if(
            event &&
            event.cancelable
        ){
            event.preventDefault();
        }
    }
}


function endSwipe(x){

    if(!swipeActive)return;

    const dx=x-swipeStartX;

    swipeActive=false;

    body.classList.remove(
        "is-dragging"
    );

    body.style.userSelect="";

    swipeProgress.style.width="0";


    if(
        swipeMoved &&
        Math.abs(dx)>55
    ){

        changeTheme(
            dx<0?1:-1
        );
    }

    swipeMoved=false;
}


/* =========================
   TOUCH
========================= */

document.addEventListener(
    "touchstart",
    e=>{

        hideHint();

        const t=
            e.changedTouches[0];

        beginSwipe(
            t.clientX,
            t.clientY,
            e.target
        );
    },
    {passive:true}
);


document.addEventListener(
    "touchmove",
    e=>{

        const t=
            e.changedTouches[0];

        moveSwipe(
            t.clientX,
            t.clientY,
            e
        );
    },
    {passive:false}
);


document.addEventListener(
    "touchend",
    e=>{

        endSwipe(
            e.changedTouches[0].clientX
        );
    },
    {passive:true}
);


document.addEventListener(
    "touchcancel",
    ()=>{

        swipeActive=false;
        swipeMoved=false;

        body.classList.remove(
            "is-dragging"
        );

        body.style.userSelect="";

        swipeProgress.style.width="0";
    },
    {passive:true}
);


/* =========================
   DESKTOP DRAG
========================= */

document.addEventListener(
    "mousedown",
    e=>{

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
    e=>{

        moveSwipe(
            e.clientX,
            e.clientY,
            e
        );
    }
);


document.addEventListener(
    "mouseup",
    e=>{

        endSwipe(
            e.clientX
        );
    }
);


document.addEventListener(
    "mouseleave",
    ()=>{

        if(!swipeActive)return;

        swipeActive=false;
        swipeMoved=false;

        body.classList.remove(
            "is-dragging"
        );

        body.style.userSelect="";

        swipeProgress.style.width="0";
    }
);


/* =========================
   INITIALIZE
========================= */

preloadImage(currentTheme);

preloadNearbyImages();

updateThemeUI(currentTheme);

createParticles();

applyTheme(
    currentTheme,
    false
);

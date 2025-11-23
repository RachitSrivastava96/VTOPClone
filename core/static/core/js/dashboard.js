document.addEventListener("DOMContentLoaded", () => {

    /* ---------------------- ⏰ LIVE CLOCK ----------------------- */
    function updateClock() {
        const clock = document.getElementById("live-clock");
        if (!clock) return;

        const now = new Date();
        clock.innerText = now.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
    }
    setInterval(updateClock, 1000);
    updateClock();



    /* ------------ 📚 EXPAND / COLLAPSE COURSE LIST -------------- */
    const courseHeader = document.getElementById("course-header");
    const courseList = document.getElementById("course-list");

    if (courseHeader && courseList) {
        courseHeader.addEventListener("click", () => {
            courseList.classList.toggle("open");
            courseHeader.querySelector(".arrow").classList.toggle("rotated");
        });
    }

    const darkToggle = document.getElementById("dark-toggle");

    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark");
    }

    if (darkToggle) {
        darkToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            localStorage.setItem("darkMode", document.body.classList.contains("dark"));
        });
    }

});
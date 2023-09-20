var scrollToTop = document.querySelector(".scroll-to-top");
if (scrollToTop) {
    // Scroll to top button appear
    window.addEventListener("scroll", function () {
        var scrollDistance = window.pageYOffset;
        if (scrollDistance > 100) {
            scrollToTop.style.display = "block";
        } else {
            scrollToTop.style.display = "none";
        }
    });
}
var mainNav = document.querySelector("#mainNav");
if (mainNav) {
    //NavBar collapse
    var navbarCollapse = mainNav.querySelector(".navbar-collapse");
    if (navbarCollapse) {
        var collapse = new bootstrap.Collapse(navbarCollapse, {
            toggle: false,
        });
        var navbarItems = navbarCollapse.querySelectorAll("a");
        for (var item of navbarItems) {
            item.addEventListener("click", function () {
                collapse.hide();
            });
        }
        var searchBtn = document.querySelector("#searchBtn");
        searchBtn.addEventListener("click", function () {
            collapse.hide();
        });
    }

    // Navbar Shrink
    function collapseNavbar() {
        var scrollTop =
            window.pageYOffset !== undefined
                ? window.pageYOffset
                : (
                      document.documentElement ||
                      document.body.parentNode ||
                      document.body
                  ).scrollTop;

        if (scrollTop > 100) {
            mainNav.classList.add("navbar-shrink");
        } else {
            mainNav.classList.remove("navbar-shrink");
        }
    }
    collapseNavbar();
    document.addEventListener("scroll", collapseNavbar);
}

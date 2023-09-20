let isClicked = false;
$(".item:not(.add-charity-item)").mousedown(function () {
    isClicked = true;
});
$(".item:not(.add-charity-item)").mouseup(async function () {
    if (isClicked) {
        isClicked = false;
        $(this).addClass("active");
        setTimeout(() => {
            $(this).removeClass("active");
        }, 500);
        let id = $(this).attr("id");
        let charity = $(this).attr("data-charity");
        
        try {
            let result = await fetch(`/charities/${charity}/messages`, {
                method: "PUT",
                body: JSON.stringify({
                    id: id,
                    charity: charity,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            window.location.href = `/charities/${charity}/messages/${id}`;
        } catch (err) {
            console.log(err);
        }
    }
});
$("#search-input").on("keyup", handleSearchChange);

$("#search-field").submit(function (event) {
    event.preventDefault();
    $("#search-icon").addClass("fa-beat");
    handleSearchFilterChange;
    setTimeout(function () {
        $("#search-icon").removeClass("fa-beat");
    }, 3000);
});
function handleSearchChange() {
    $(".notFound").show();
    $(".notFound").html(
        'There are no messages at the moment <i class="fa-solid fa-box-open"></i>'
    );
    var searchResultEmpty = 1;
    $(".item").each(function () {
        var input = $("#search-input").val().toLowerCase();
        var shouldShow = 1;
        var this_h3 = $(this).children("h3");
        if (this_h3.text().toLowerCase().indexOf(input) >= 0 || input === "") {
            $(this).show();
            searchResultEmpty = 0;
        } else {
            $(this).hide();
        }
    });
    if ($(".item").length === 0) {
        $(".notFound").show();
        $(".notFound").html(
            'There are no messages at the moment <i class="fa-solid fa-box-open"></i>'
        );
    } else if (searchResultEmpty) {
        $(".notFound").show();
        $(".notFound").html(
            'No messages match your search <i class="fa fa-search-minus"></i>'
        );
    } else {
        $(".notFound").hide();
    }
}
if ($(".item").length === 0) {
    $(".notFound").show();
    $(".notFound").html(
        'There are no messages at the moment <i class="fa-solid fa-box-open"></i>'
    );
} else {
    $(".notFound").hide();
}

$("input[type=file]").on("change", function () {
    $(this).next(".error-message").hide();
});

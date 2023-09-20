// const imageInput = document.getElementById("imageInput");
// const previewImage = document.getElementById("priview");

// imageInput.addEventListener("change", (e) => {
//     previewImage.src = "";
//     const file = e.target.files[0];

//     if (file) {
//         const reader = new FileReader();

//         reader.onload = () => {
//             previewImage.src = reader.result;
//         };

//         reader.readAsDataURL(file);
//     }
// });

function adjustInputWidth(input) {
    input.style.width = (input.value.length + 2.3) * 10 + "px";
}

// Call the adjustInputWidth function on page load
window.onload = function () {
    var firstname = document.querySelector(".firstname");
    var lastname = document.querySelector(".lastname");
    adjustInputWidth(firstname);
    adjustInputWidth(lastname);
};
$("#removeImage").on("click", function (e) {
    e.preventDefault();
    previewImage.src = "**************";
});
$(".firstname").on("keyup", function () {
    $(".firstname-error").hide();
});
$(".lastname").on("keyup", function () {
    $(".lastname-error").hide();
});
$(".edit-field").on("keyup", function () {
    $(".phone-error").hide();
});

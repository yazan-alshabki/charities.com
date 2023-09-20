//Food Donation
$("#foodDonationButton").click(function () {
    $(".shadow").fadeIn(25);
    $("#FoodDonationService").fadeIn(400);
});
$(".error-message").each(function () {
    if ($(this).text() === "") {
        $(this).fadeOut();
    } else {
        $(this).fadeIn();
    }
});

$("input").on("keyup", function () {
    $(this).next(".error-message").hide();
});



$("#DonationcloseForm").click(function () {
    $(".shadow").fadeOut(400);
    $("#FoodDonationService").fadeOut(50);
    $("#FoodDonationHintMessage").fadeIn();
    $(".foodDonationForm").fadeOut();
});
$("#FoodDonationContinue").on("click", function () {
    $("#FoodDonationHintMessage").hide();
    $(".foodDonationForm").fadeIn();
    if ($(".newOptionSelect").val() === "AddNewOption") {
        $("#newOption").show();
        $("#newOptionLabel").show();
    } else {
        $("#newOption").hide();
        $("#newOptionLabel").hide();
    }
});

//Volunteering Service
$("#VolunteeringButton").click(function () {
    $(".shadow").fadeIn(25);
    $("#VolunteeringService").fadeIn(400);
});

$("#VolunteeringcloseForm").click(function () {
    $(".shadow").fadeOut(400);
    $("#VolunteeringService").fadeOut(50);
    $("#VolunteeringHintMessage").fadeIn();
    $(".volunteeringForm").fadeOut();
});
$("#VolunteeringContinue").on("click", function () {
    $("#VolunteeringHintMessage").hide();
    $(".volunteeringForm").fadeIn();
});

//Training Form
$("#TrainingButton").click(function () {
    $(".shadow").fadeIn(25);
    $("#TrainingService").fadeIn(400);
});

$("#TrainingcloseForm").click(function () {
    $(".shadow").fadeOut(400);
    $("#TrainingService").fadeOut(50);
    $("#TrainingHintMessage").fadeIn();
});

//Medicine and medical supplies Donation
$("#MedicineDonationButton").click(function () {
    $(".shadow").fadeIn(25);
    $("#MedicineDonationService").fadeIn(400);
});

$("#DonationcloseForm").click(function () {
    $(".shadow").fadeOut(400);
    const MedicineDonationForm = document.querySelector(
        ".MedicineDonationForm"
    );
    const quantityError = document.querySelector(".quantityError");
    const typeError = document.querySelector(".typeError");
    let quantity = document.querySelector("#quantity");
    let newOption = document.querySelector("#newOption");
    quantityError.textContent = "";
    typeError.textContent = "";
    quantity.value = "";
    newOption.value = "";
    if (quantityError.textContent !== "") {
        $(".quantityError").fadeIn();
    } else {
        $(".quantityError").fadeOut();
    }
    if (typeError.textContent !== "") {
        $(".typeError").fadeIn();
    } else {
        $(".typeError").fadeOut();
    }
    $("#MedicineDonationService").fadeOut(50);
    $("#MedicineDonationHintMessage").fadeIn();
    $(".MedicineDonationForm").fadeOut();
});
$("#MedicineDonationContinue").on("click", function () {
    let donationType = $("#DonationType").val();
    let RequestMedicineName = document.querySelector("#RequestMedicineName");
    let numberOfMedicine = RequestMedicineName.getAttribute("data-doc");
    let numberOfMedicalSupplies =
        RequestMedicalSupplies.getAttribute("data-doc");
    if (donationType === "Medicine") {
        if (numberOfMedicine === "0") {
            $("#newOptionLabel").fadeIn();
            $("#newOption").fadeIn();
        } else {
            $("#newOptionLabel").hide();
            $("#newOption").hide();
        }
        $(".MedicineSelect").show();
        $(".MedicalSuppliesSelect").hide();
        if ($("#MedicineName").val() === "AddNewOption") {
            $("#newOption").show();
            $("#newOptionLabel").show();
        } else {
            $("#newOption").hide();
            $("#newOptionLabel").hide();
        }
    } else if (donationType === "MedicalSupplies") {
        if (numberOfMedicalSupplies === "0") {
            $("#newOptionLabel").fadeIn();
            $("#newOption").fadeIn();
        } else {
            $("#newOptionLabel").hide();
            $("#newOption").hide();
        }
        $(".MedicineSelect").hide();
        $(".MedicalSuppliesSelect").show();
        if ($("#MedicalSupplies").val() === "AddNewOption") {
            $("#newOption").show();
            $("#newOptionLabel").show();
        } else {
            $("#newOption").hide();
            $("#newOptionLabel").hide();
        }
    }
    $("#MedicineDonationHintMessage").hide();
    $(".MedicineDonationForm").fadeIn();
});

//PersonalNeeds Donation
$("#PersonalNeedsDonationButton").click(function () {
    $(".shadow").fadeIn(25);
    $("#PersonalNeedsDonationService").fadeIn(400);
});

$("#DonationcloseForm").click(function () {
    $(".shadow").fadeOut(400);
    $("#PersonalNeedsDonationService").fadeOut(50);
    $("#PersonalNeedsDonationHintMessage").fadeIn();
    $(".PersonalNeedsDonationForm").fadeOut();
});
$("#PersonalNeedsDonationContinue").on("click", function () {
    $("#PersonalNeedsDonationHintMessage").hide();
    $(".PersonalNeedsDonationForm").fadeIn();
});

//Food Request
$("#foodRequestButton").click(function () {
    $(".shadow").fadeIn(25);
    $("#FoodRequestService").fadeIn(400);
});

$("#RequestcloseForm").click(function () {
    $(".shadow").fadeOut(400);
    $("#FoodRequestService").fadeOut(50);
    $("#FoodRequestHintMessage").fadeIn();
    $(".foodRequestForm").fadeOut();
});
$("#FoodRequestContinue").on("click", function () {
    $("#FoodRequestHintMessage").hide();
    $(".foodRequestForm").fadeIn();
    if ($(".newOptionSelect").val() === "AddNewOption") {
        $("#newOption").show();
        $("#newOptionLabel").show();
    } else {
        $("#newOption").hide();
        $("#newOptionLabel").hide();
    }
});

//Farming Training Form
$("#FarmingButton").click(function () {
    $(".shadow").fadeIn(25);
    $("#FarmingService").fadeIn(400);
});

$("#FarmingcloseForm").click(function () {
    $(".shadow").fadeOut(400);
    $("#FarmingService").fadeOut(50);
    $("#FarmingHintMessage").fadeIn();
});

//Medicine and medical supplies Request
$("#MedicineRequestButton").click(function () {
    $(".shadow").fadeIn(25);
    $("#MedicineRequestService").fadeIn(400);
});

$("#RequestcloseForm").click(function () {
    $(".shadow").fadeOut(400);
    let apologize = document.querySelector("#apologize");
    $("#apologize").hide();

    const MedicineRequestForm = document.querySelector(".MedicineRequestForm");
    let requestError = document.querySelector(".requestError");
    $(".requestError").text("");
    if ($(".requestError").text() !== "") {
        $(".requestError").fadeIn();
    } else {
        $(".requestError").fadeOut();
    }

    $("#MedicineRequestService").fadeOut(50);
    $("#MedicineRequestHintMessage").fadeIn();
    $(".MedicineRequestForm").fadeOut();
});
$("#MedicineRequestContinue").on("click", function () {
    let RequestType = $("#RequestType").val();
    let apologize = document.querySelector("#apologize");

    if (RequestType === "Medicine") {
        let RequestMedicineName = document.querySelector(
            "#RequestMedicineName"
        );
        let numberOfMedicine = RequestMedicineName.getAttribute("data-doc");
        if (numberOfMedicine === "0") {
            $("#apologize").fadeIn();
        } else {
            $(".RequestMedicineSelect").show();
            $(".RequestMedicalSuppliesSelect").hide();
            $(".MedicineRequestForm").fadeIn();
        }
    } else if (RequestType === "MedicalSupplies") {
        console.log("anas");

        let RequestMedicalSupplies = document.querySelector(
            "#RequestMedicalSupplies"
        );
        let numberOfMedicalSupplies =
            RequestMedicalSupplies.getAttribute("data-doc");
        if (numberOfMedicalSupplies === "0") {
            $("#apologize").fadeIn();
        } else {
            $(".RequestMedicineSelect").hide();
            $(".RequestMedicalSuppliesSelect").show();
            $(".MedicineRequestForm").fadeIn();
        }
    }
    $("#MedicineRequestHintMessage").hide();
});

//EMT Training Form
$("#EMTButton").click(function () {
    $(".shadow").fadeIn(25);
    $("#EMTService").fadeIn(400);
});

$("#EMTcloseForm").click(function () {
    $(".shadow").fadeOut(400);
    $("#EMTService").fadeOut(50);
    $("#EMTHintMessage").fadeIn();
});

//Personal Needs Request
$("#PersonalNeedsRequestButton").click(function () {
    $(".shadow").fadeIn(25);
    $("#PersonalNeedsRequestService").fadeIn(400);
});

$("#RequestcloseForm").click(function () {
    $(".shadow").fadeOut(400);
    $("#PersonalNeedsRequestService").fadeOut(50);
    $("#PersonalNeedsRequestHintMessage").fadeIn();
    $(".PersonalNeedsRequestForm").fadeOut();
});
$("#PersonalNeedsRequestContinue").on("click", function () {
    $("#PersonalNeedsRequestHintMessage").hide();
    $(".PersonalNeedsRequestForm").fadeIn();
});

//Life Skills Training Form
$("#LifeSkillsButton").click(function () {
    $(".shadow").fadeIn(25);
    $("#LifeSkillsService").fadeIn(400);
});

$("#LifeSkillscloseForm").click(function () {
    $(".shadow").fadeOut(400);
    $("#LifeSkillsService").fadeOut(50);
    $("#LifeSkillsHintMessage").fadeIn();
});

//Show Add new option field
$(".newOptionSelect").on("change", function () {
    if ($(this).val() === "AddNewOption") {
        $("#newOption").show();
        $("#newOptionLabel").show();
    } else {
        $("#newOption").hide();
        $("#newOptionLabel").hide();
        $(".typeError").hide();
    }
});

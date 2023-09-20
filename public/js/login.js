












document.querySelector(".show-password-icon").addEventListener("click", function(event){
      
    var password = document.querySelector(".password");
    
    if (password.type === "password") {
       password.type = "text";
       password.style.paddingRight = "10%";
       this.classList.remove("fa-eye");
       this.classList.add("fa-eye-slash");
       
    } else {
      password.type = "password";
      this.classList.remove("fa-eye-slash");
      this.classList.add("fa-eye");
    }
})
class NAVIGATIONANI{
    constructor(){
        this.navigationMenu = document.querySelector("[wrapper='navbar']");
        this.darkLogo = this.navigationMenu.querySelector("[logo='dark']");
        this.lightLogo = this.navigationMenu.querySelector("[logo='light']");
        this.setColor = "white";
        this.resetColor = "#340d45";
        this.init();
    }

    init(){
        this.startListener();
    }

    // function listen to window scroll -> animate the navigation menu.
    startListener(){
        if(this.darkLogo != undefined || this.darkLogo != null)this.darkLogo.style.display = "none";
        document.addEventListener("scroll", () => {
            let offset = window.pageYOffset;
            if(offset > 40)this.changeNav();
            if(offset < 40)this.resetNav();
        })
    }

    // function will change the style of navbar on scroll.
    changeNav(){
        this.navigationMenu.style.backgroundColor = this.setColor;
        this.darkLogo.style.display = "block";
        this.lightLogo.style.display = "none";
    }
    
    // function to reset the style of navbar
    resetNav(){
        this.navigationMenu.style.backgroundColor = this.resetColor;
        this.darkLogo.style.display = "none";
        this.lightLogo.style.display = "block";
    }
}

new NAVIGATIONANI();
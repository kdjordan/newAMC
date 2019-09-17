export default class Admin {
    constructor() {
        this.navTitles = document.querySelectorAll('.sidenav__title');
        this.messageSpan = document.querySelector('.message');
        this.events();  
    }

    
    events() {
       this.navTitles.forEach(el => {
           el.addEventListener('click', () => {
            console.log(this.messageSpan.innerHTML);
                this.subMenuToggle(el);
           })
       })
    }
    
    //methods
    subMenuToggle(el) {
        
        if(el.id == "users") {
           this.messageSpan.innerHTML = "Add New User";
           document.querySelector('.section-users').classList.remove('u-hidden');
           document.querySelector('.section-homes').classList.add('u-hidden');
           document.querySelector('.section-keepers').classList.add('u-hidden');
           
         
        } else if(el.id == "homes") {
            this.messageSpan.innerHTML = "Add New Home";
            document.querySelector('.section-homes').classList.remove('u-hidden');
            document.querySelector('.section-users').classList.add('u-hidden');
            document.querySelector('.section-keepers').classList.add('u-hidden');
        } 
        else if(el.id == "keepers") {
            this.messageSpan.innerHTML = "Add New Keeper";
            document.querySelector('.section-keepers').classList.remove('u-hidden');
            document.querySelector('.section-homes').classList.add('u-hidden');
            document.querySelector('.section-users').classList.add('u-hidden');
        }
    }
    
}
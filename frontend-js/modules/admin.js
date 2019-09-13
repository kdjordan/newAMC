export default class Admin {
    constructor() {
        this.navTitles = document.querySelectorAll('.sidenav__title');
        this.events();  
    }

    
    events() {
       this.navTitles.forEach(el => {
           el.addEventListener('click', () => {
                this.subMenuToggle(el);
           })
       })
    }
    
    //methods
    subMenuToggle(el) {
        
        if(el.dataset.id == "users") {
           document.getElementById('users').classList.toggle('show');
           document.getElementById('homes').classList.remove('show');
           document.getElementById('keepers').classList.remove('show');
        } else if (el.dataset.id == "homes") {
            document.getElementById('homes').classList.toggle('show');
            document.getElementById('users').classList.remove('show');
            document.getElementById('keepers').classList.remove('show');
        } else if(el.dataset.id == "keepers") {
            document.getElementById('keepers').classList.toggle('show');
            document.getElementById('homes').classList.remove('show');
            document.getElementById('users').classList.remove('show');
        }
    }
    
}
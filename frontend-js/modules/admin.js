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
        el.nextElementSibling.classList.toggle('show');
        el.querySelector('.carrot').classList.toggle('rotate');
        
        // console.log(document.querySelectorAll('.sidenav__dropdown'))
        
        document.querySelectorAll('.sidenav__title').forEach((menu) => {
            // console.log(el.id);
            // console.log(menu.id);
            if(el.id != menu.id) {
                console.log(menu.classList);
                console.log(menu.querySelector('.sidenav__dropdown'))
                
            }   
                
            
        })  
    }
    
}
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
        
        Array.from(el.children)[1].classList.toggle('show');
        el.querySelector('.carrot').classList.toggle('rotate');
        
        document.querySelectorAll('.sidenav__dropdown').forEach((menu) => {
           console.log('------');
           console.log(menu.classList.contains('.show'));
        })  
    }
    
}
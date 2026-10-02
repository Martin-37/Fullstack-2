let lastScrollTop = 0;
const header = document.querySelector("header");

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop < 0) scrollTop = 0;

    if (scrollTop < lastScrollTop){
        header.classList.add('scroll-down');
        header.classList.remove('scroll-up');

    }else{
        header.classList.add('scroll-down');
        header.classList.remove('scroll-up');
    }

    lastScrollTop = scrollTop;
});

import Navbar from "./Navbar";
function Header(juegos, setJuegosMostrados) {
    return(
    
    <header>
        <Navbar
                juegos={juegos}
                setJuegosMostrados={setJuegosMostrados}
            />
    </header>)
}

export default Header



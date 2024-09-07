import { useState } from "react";
import './scrollingMenu.scss';
import '../../assets/fontawesome-free-6.4.0-web/css/solid.css';
import '../../assets/fontawesome-free-6.4.0-web/css/fontawesome.css';

function ScrollingMenu (props){

    const [isActive, setIsActive] = useState(false);

    const clickOnTitleBar = () => {
        setIsActive (!isActive);
    }
    
    const chevronClass = "fa-solid fa-chevron-up" + (isActive ? " activeChevron" : "");
    const contentClass = (isActive ? "active" : "hidden") + " scrollingMenuContent";
   
    return (
        <div className="scrollingMenuPanel">
            <p onClick={clickOnTitleBar} className="scrollingMenuTitle">
                <span>{props.title}</span>
                <i className={chevronClass}></i>  
            </p>
            <p className={contentClass} >{props.content}</p>
        </div>
    )
}

export default ScrollingMenu;
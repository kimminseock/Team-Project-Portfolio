import './BottomNavigation.css'
import {NavLink, useLocation} from "react-router-dom";
const BottomNavigation = () => {
    const location = useLocation();
    // "가계부" 메뉴가 활성화되었는지 확인
    const isActiveAccountBook = location.pathname === '/' || location.pathname === '/month' || location.pathname === '/calender' || location.pathname === '/settlement';
    return (
        // 241206 수정
        <div className="BottomNavigation">
            <ul>
                <li>
                    <NavLink
                        to="/"
                        className={isActiveAccountBook ? "active" : "inactive"}>
                        {isActiveAccountBook ?
                            (<img src={require('../img/book-filled.svg').default} alt="가계부 아이콘"
                             style={{width: '23px'}}/>) :
                            (<img src={require('../img/book.svg').default} alt="가계부 아이콘"
                             style={{width: '23px'}}/>)
                        }
                        <p>가계부</p>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/statistics"
                        className={({isActive}) => (isActive ? "active" : "inactive")}>
                        {location.pathname === '/statistics'?
                            (<img src={require('../img/chart-pie-filled.svg').default} alt="가계부 아이콘"
                                  style={{width: '23px'}}/>) :
                            (<img src={require('../img/chart-pie.svg').default} alt="가계부 아이콘"
                                  style={{width: '23px'}}/>)
                        }
                        <p>통계</p>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/ai"
                        className={({isActive}) => (isActive ? "active" : "inactive")}>
                        {location.pathname === '/ai' ?
                            (<img src={require('../img/head-side-thinking-filled.svg').default} alt="가계부 아이콘"
                                  style={{width: '23px'}}/>) :
                            (<img src={require('../img/head-side-thinking.svg').default} alt="가계부 아이콘"
                                  style={{width: '23px'}}/>)
                        }
                        <p>AI</p>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/more"
                        className={({isActive}) => (isActive ? "active" : "inactive")}>
                        {location.pathname === '/more' ?
                            (<img src={require('../img/menu-dots-filled.svg').default} alt="가계부 아이콘"
                                  style={{width: '23px'}}/>) :
                            (<img src={require('../img/menu-dots.svg').default} alt="가계부 아이콘"
                                  style={{width: '23px'}}/>)
                        }
                        <p>더보기</p>
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}
export default BottomNavigation;
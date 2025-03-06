import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import './HeaderTitle.css'

const HeaderTitle = ({currentDate, onPrevMonth, onNextMonth}) => {
    // 도움말을 띄우거나 숨길 때 필요한 관리
    const [isTooltip, setIsTooltip] = useState(false);
    // 사용자가 첫 앱에 들어왔을 때 설명 창을 띄우기 위한 관리
    const [isTooltipModal, setIsTooltipModal] = useState(true);

    useEffect(() => {
        // 처음 방문 시 설명 창 2초간 표시
        if (isTooltipModal) {
            setIsTooltip(true); // 설명 창 표시
            const timer = setTimeout(() => {
                setIsTooltip(false); // 1초 후 숨김
                setIsTooltipModal(false); // 처음 방문 처리 완료
            }, 2000);

            return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
        }
    }, [isTooltipModal]);

    // 설명 창 표시 함수
    const showTooltip = () => {
        if (!isTooltipModal) {
            setIsTooltip(true);
        }
    };

    // 설명 창 숨김 함수
    const hideTooltip = () => {
        setIsTooltip(false);
    };
    // 필터페이지의 usestate - 추가 -
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    return (
        <div className={'HeaderTitle'}>
            <div className="calendar-wrapper">
                <button onClick={onPrevMonth} className="calendar-button">
                    <img src={require('../img/angle-small-left.svg').default} alt="left"
                         style={{width: '25px'}}/>
                </button>
                <span className="calendar-month">{`${year}년 ${month}월`}</span>
                <button onClick={onNextMonth} className="calendar-button">
                    <img src={require('../img/angle-small-right.svg').default} alt="right"
                         style={{width: '25px'}}/>
                </button>
            </div>
            <div className="button-wrapper">
                <button className="tooltip"
                        onClick={showTooltip}>
                    <img src={require('../img/tooltip.png')} alt="search" style={{width: '25px'}}/>
                </button>
                <Link to={'/search'}>
                    <button className="search-button">
                        <img src={require('../img/search.svg').default} alt="search" style={{width: '23px'}}/>
                    </button>
                </Link>
                <Link to={'/filter'}>
                    <button className="filter-button">
                        <img src={require('../img/settings-sliders.svg').default} alt="filter" style={{width: '23px'}}/>
                    </button>
                </Link>
            </div>
            {/*설명 창*/}
            {isTooltip && (
                <div className="tooltipModal">
                    일일 페이지에서 수입과 지출을 이렇게 확인하세요!<br/><br/>
                    +0000원: 수입 (들어온 돈)<br/>
                    -0000원: 지출 (나간 돈)<br/><br/>
                    오늘의 가계 상황을 쉽게 확인할 수 있습니다!
                    <button className="close"
                            onClick={hideTooltip}>닫기</button>
                </div>
            )}
        </div>
    );
}
export default HeaderTitle;
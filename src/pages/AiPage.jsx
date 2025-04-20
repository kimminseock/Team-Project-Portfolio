import {useState, useRef, useEffect} from "react";
import {nl2brReact} from "../js/util";
import './AiPage.css'

const AiPage = ({onSend, messages = []}) => {
    const [message, setMessage] = useState('');
    const containerRef = useRef(null);

    // 리렌더링시에 스크롤을 항상 맨 아래로 내림.
    useEffect(() => {
        if(containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]); // messages 상태가 변경될 때마다 실행

    const onClickSubmit = () => {
        if (!message) {
            return;
        }
        onSend(message);
        setMessage('');
    }

    const onChangeMessage = (event) => {
        setMessage(event.target.value);
    }

// enter 입력시에 전송
    const onKeyUp = (event) => {
        if(event.key === 'Enter') {
            onClickSubmit();
        }
    }
    return (
        <div className="AiPage">
            {messages.length === 0 ?
                <div className="intro">
                    <h2>가계부와 관련한<br/> 질문을 할 수 있어요.</h2>
                    <div>
                        <p>
                            <img src={require('../img/chat.png')} alt="말풍선 아이콘"
                                 style={{width: '17px'}}/>
                        </p>
                        가계부 요약해줘
                    </div>
                    <div>
                        <p>
                            <img src={require('../img/pencil.png')} alt="펜 아이콘"
                                 style={{width: '17px'}}/>
                        </p>
                        가계부 작성 방법을 알려줘
                    </div>
                    <div>
                        <p>
                            <img src={require('../img/30-days.png')} alt="달력 아이콘"
                                 style={{width: '17px'}}/>
                        </p>
                        월별로 요약해줘
                    </div>
                </div> : ''}
            {/*<h1>Chat</h1>*/}
            <div className={'chat-container'} ref={containerRef}>
            {
                    // 사람이 묻는 질문은 role:'user'로,
                    // 챗봇이 답하는 대답은 role:'assistant'으로 구분
                    messages.map((item, index) =>
                        <p className={item.role} key={index}>
                            {nl2brReact(item.content)}</p>)
                }
            </div>
            <div className={'input-container'}>
                <input type={'text'} placeholder=
                    {'메시지를 입력하세요.'} value={message}
                       onChange={onChangeMessage}
                       onKeyUp={onKeyUp}/>
                <button onClick={onClickSubmit}>
                    <img src={require('../img/paper-plane.png')} alt="전송 아이콘"
                          style={{width: '17px'}}/>
                </button>
            </div>
        </div>
    );
}

export default AiPage;

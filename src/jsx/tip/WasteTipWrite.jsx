import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/tip/wasteTipWrite.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import axiosConfig from "../../config/axiosConfig.js";

const WasteTipWrite = () => {
    const navigate = useNavigate();

    // 팁 정보를 저장하는 상태
    const [tip, setTip] = useState({
        tipCategory: 'WASTE',
        tipTitle: '',
        tipContent: '',
        tipViews: 0,
        tipCreatedDate: new Date().toISOString(),
        comments: []
    });

    // 입력 필드 변경 시 상태를 업데이트하는 함수
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTip(prevTip => ({
            ...prevTip,
            [name]: value
        }));
    };

    // 폼 제출 시 실행되는 함수
    const submitForm = async () => {
        if (!tip.tipTitle.trim() || !tip.tipContent.trim()) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        try {
            const response = await axiosConfig.post('/api/tips/save', tip);
            console.log('Server response:', response.data);
            alert("게시글을 등록했습니다.");
            navigate('/tip/waste');
        } catch (error) {
            console.error('Error:', error);
            handleAxiosError(error);
        }
    };

    // Axios 에러 처리 함수
    const handleAxiosError = (error) => {
        if (error.response) {
            // 서버 응답이 있는 경우
            console.log('Error response:', error.response.data);
            console.log('Error status:', error.response.status);
            console.log('Error headers:', error.response.headers);
            if (error.response.status === 401) {
                // 인증 실패 시
                alert('인증에 실패했습니다. 로그인 페이지로 이동합니다.');
                localStorage.removeItem('access');
                navigate('/login');
            } else {
                // 기타 에러
                alert(`팁 등록에 실패했습니다: ${error.response.data.message || '알 수 없는 오류'}`);
            }
        } else if (error.request) {
            // 요청은 보냈지만 응답을 받지 못한 경우
            console.log('Error request:', error.request);
            alert("서버로부터 응답을 받지 못했습니다. 네트워크 연결을 확인해주세요.");
        } else {
            // 요청 설정 중 오류가 발생한 경우
            console.log('Error message:', error.message);
            alert("요청 중 오류가 발생했습니다. 나중에 다시 시도해주세요.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={() => navigate('/tip/waste')} />
                <h2>폐기물 Tip 작성</h2>
            </div>

            <div className={styles.formContainer}>
                <div className={styles.formGroup}>
                    <label htmlFor="tipTitle">제목</label>
                    <input
                        type="text"
                        id="tipTitle"
                        name="tipTitle"
                        value={tip.tipTitle}
                        onChange={handleChange}
                        placeholder="제목을 입력하세요"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="tipContent">내용</label>
                    <textarea
                        id="tipContent"
                        name="tipContent"
                        value={tip.tipContent}
                        onChange={handleChange}
                        placeholder="내용을 입력하세요"
                    />
                </div>
                <div className={styles.submitButton}>
                    <button onClick={submitForm}>등록</button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default WasteTipWrite;
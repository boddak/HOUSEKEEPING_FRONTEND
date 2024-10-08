import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/myPage/myPage.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import axiosInstance from '../../config/axiosInstance.js';
import { useAuth } from '../../contexts/AuthContext';

const MyPage = () => {
    const navigate = useNavigate();
    const { user, logout, fetchUserInfo } = useAuth();
    const [attendanceChecked, setAttendanceChecked] = useState(false);

    useEffect(() => {
        checkAttendanceStatus();
    }, []);

    const checkAttendanceStatus = async () => {
        try {
            const response = await axiosInstance.get(`/api/user/attendance/status?userId=${user.userId}`);
            setAttendanceChecked(response.data.checked);
        } catch (error) {
            console.error('Failed to check attendance status', error);
        }
    };

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/api/auth/logout');
            logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
            logout();
        }
    };

    const handleAttendanceCheck = async () => {
        if (attendanceChecked) return;

        try {
            await axiosInstance.post(`/api/user/attendance?userId=${user.userId}`);
            setAttendanceChecked(true);
            fetchUserInfo(user.userId);
        } catch (error) {
            console.error('Attendance check failed', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="뒤로가기" onClick={() => navigate('/main')} />
                <h2>마이페이지</h2>
            </div>
            <div className={styles.profile}>
                <div className={styles.profileInfo}>
                    <p className={styles.profileNickname}>
                        {user?.profileImageUrl ? (
                            <img
                                src={user.profileImageUrl}
                                alt="프로필 이미지"
                                className={styles.profileImage}
                            />
                        ) : (
                            <img
                                src="/lib/마이페이지아이콘.svg"
                                alt="프로필 아이콘"
                                className={styles.defaultProfileIcon}
                            />
                        )}
                        {user?.nickname}님, 청소하세요.
                    </p>
                    <p className={styles.profileLevel}>
                        <img src="/lib/루미.png" alt="아바타"/>
                        Lv.{user?.level} {user?.levelName}
                    </p>
                    <div className={styles.xpContainer}>
                        <progress className={styles.xpBar} value={user?.exp} max={user?.nextLevelExp}></progress>
                        <span className={styles.xpText}>{user?.exp}/{user?.nextLevelExp}</span>
                    </div>
                    <button
                        onClick={handleAttendanceCheck}
                        className={`${styles.attendanceButton} ${attendanceChecked ? styles.attendanceChecked : ''}`}
                        disabled={attendanceChecked}
                    >
                        {attendanceChecked ? '출석체크 완료' : '출석체크'}
                    </button>
                </div>
            </div>
            <div className={styles.menu}>
                <div className={styles.menuItem} onClick={() => navigate('/mypage/info')}>
                    <p>내 정보</p>
                    <img src="/lib/front.svg" alt="화살표"/>
                </div>
                <div className={styles.menuItem} onClick={() => navigate('/friend')}>
                    <p>친구 관리</p>
                    <img src="/lib/front.svg" alt="화살표"/>
                </div>
                <div className={styles.menuItem} onClick={() => navigate('/friend/request')}>
                    <p>친구 요청</p>
                    <img src="/lib/front.svg" alt="화살표"/>
                </div>
                <div className={styles.menuItem} onClick={() => navigate('/mypage/guestBook/storage')}>
                    <p>방명록 보관함</p>
                    <img src="/lib/front.svg" alt="화살표"/>
                </div>
                <div className={styles.menuItem} onClick={() => navigate(`/mypage/myroom/edit/${false}`)}>
                    <p>내 방 수정</p>
                    <img src="/lib/front.svg" alt="화살표"/>
                </div>
                <div className={styles.menuItem} onClick={() => navigate('/mypage/setting')}>
                    <p>설정</p>
                    <img src="/lib/front.svg" alt="화살표"/>
                </div>
            </div>
            <div className={styles.footerMenu}>
                <p onClick={handleLogout}>로그아웃</p>
                <p onClick={() => navigate('/mypage/delete')}>회원탈퇴</p>
            </div>
            <Footer />
        </div>
    );
};

export default MyPage;
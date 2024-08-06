import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/tip/roomeTipDetail.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const RoomeTipDetail = () => {
    const navigate = useNavigate();

    const editPost = () => {
        // Implement the edit post functionality
    };

    const deletePost = () => {
        // Implement the delete post functionality
    };

    const goToList = () => {
        navigate('/tip/roome');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={() => navigate('/tip/roome')} />
                <h2>루미`s Tip</h2>
            </div>

            <div className={styles.postContainer}>
                <div className={styles.postInfoTitle}>
                    <p>제목</p>
                    <p>바나나껍질은 어디 버리게요~ ~??</p>
                </div>
                <div className={styles.postInfoDate}>
                    <p>24.07.18</p>
                    <p>루미</p>
                </div>
                <div className={styles.postContent}>
                    <p>응 음식물이야</p>
                </div>
                <div className={styles.buttonContainer}>
                    <button onClick={editPost}>수정</button>
                    <button onClick={deletePost}>삭제</button>
                    <button onClick={goToList}>목록</button>
                </div>
            </div>

            <div className={styles.commentsSection}>
                <div className={styles.commentInput}>
                    <input type="text" placeholder="댓글을 입력하세요" />
                    <button>
                        <img src="/lib/채팅보내기.svg" alt="send" />
                    </button>
                </div>
                {[...Array(5)].map((_, index) => (
                    <div className={styles.comment} key={index}>
                        <div className={styles.commentUser}>
                            <img src="/lib/마이페이지아이콘.svg" alt="user icon" />
                            <p>Lv.3 ddak</p>
                            <div className={styles.commentActions}>
                                <span>수정</span>
                                <span>삭제</span>
                            </div>
                        </div>
                        <div className={styles.commentText}>
                            <p>네 맞습니다.</p>
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
};

export default RoomeTipDetail;
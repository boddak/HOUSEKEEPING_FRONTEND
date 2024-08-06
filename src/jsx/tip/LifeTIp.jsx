import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/tip/lifeTip.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const LifeTip = () => {
    const navigate = useNavigate();
    const [searchVisible, setSearchVisible] = useState(false);

    const toggleSearchBar = () => {
        setSearchVisible(!searchVisible);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={() => navigate('/tip')} />
                <h2>생활 Tip</h2>
                <img className={styles.searchIcon} src="/lib/검색.svg" alt="search" id="search-icon" onClick={toggleSearchBar} />
            </div>
            <div className={`${styles.searchBar} ${searchVisible ? styles.visible : ''}`} id="search-bar">
                <input type="text" placeholder="검색어를 입력하세요" id="search-input" />
                <img src="/lib/검색.svg" alt="search" />
            </div>

            <div className={styles.postContainer}>
                <div className={styles.sortOptions}>
                    <select>
                        <option value="latest">최신순</option>
                        <option value="popular">인기순</option>
                    </select>
                </div>

                <div className={styles.postList}>
                    <div className={styles.postItem} onClick={() => navigate('/tip/listfacks/detail')}>
                        <div className={styles.postContent}>바나나껍질은 어디 버리게요~ ~??</div>
                        <div className={styles.postInfo}>
                            <span>24.07.18</span>
                            <span>루미</span>
                        </div>
                    </div>
                    <div className={styles.postItem}>
                        <div className={styles.postContent}>바나나껍질은 어디 버리게요~ ~??</div>
                        <div className={styles.postInfo}>
                            <span>24.07.18</span>
                            <span>루미</span>
                        </div>
                    </div>
                    <div className={styles.postItem}>
                        <div className={styles.postContent}>바나나껍질은 어디 버리게요~ ~??</div>
                        <div className={styles.postInfo}>
                            <span>24.07.18</span>
                            <span>루미</span>
                        </div>
                    </div>
                    {/* Additional post items */}
                </div>

                <div className={styles.createButton} onClick={() => navigate('/tip/listfacks/post')}>
                    <img src="/lib/연필.svg" alt="write" />
                    <span>작성</span>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LifeTip;
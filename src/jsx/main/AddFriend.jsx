import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../fix/Footer.jsx';
import styles from '../../css/main/addFriend.module.css';
import { BACK_URL } from "../../Constraints.js";

const AddFriend = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const navigate = useNavigate();
    const loginUserId = 1; // 실제 userId를 적절히 설정해야 합니다.

    useEffect(() => {
        // 검색어가 변경될 때마다 검색 함수 호출
        const fetchData = async () => {
            if (searchQuery.trim() !== '') {
                try {
                    // 사용자 검색
                    const response = await axios.get(`${BACK_URL}/friend/search`, {
                        params: { nickname: searchQuery }
                    });

                    // 검색 결과에서 자기 자신을 제외
                    const filteredResults = response.data.filter(user => user.userId !== loginUserId);

                    // 사용자 ID 목록을 쉼표로 구분된 문자열로 변환
                    const userIds = filteredResults.map(user => user.userId).join(',');

                    console.log(loginUserId);
                    console.log(userIds);

                    const requestStatusResponse = await axios.get(`${BACK_URL}/friendRequest/status`, {
                        params: {
                            senderId: loginUserId,
                            receiverIds: userIds
                        }
                    });



                    const requestStatusMap = requestStatusResponse.data;
                    const updatedResults = filteredResults.map(user => ({
                        ...user,
                        requestStatus: requestStatusMap[user.userId] || null
                    }));

                    setSearchResults(updatedResults);
                } catch (error) {
                    console.error("친구 검색 중 오류가 발생했습니다:", error);
                }
            } else {
                setSearchResults([]);
            }
        };

        fetchData();
    }, [searchQuery, loginUserId]);

    // 친구 요청 보내기
    const sendFriendRequest = async (receiverId) => {
        try {
            const requestDTO = {
                requestSenderId: loginUserId,
                requestReceiverId: receiverId,
                requestStatus: "PENDING",
                requestDate: new Date().toISOString()
            };

            await axios.post(`${BACK_URL}/friendRequest/send`, requestDTO, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('팔로우 요청을 보냈습니다.');
            fetchSearchResults(); // 상태 갱신을 위해 검색 결과를 새로 가져옵니다.
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    // 팔로우 취소
    const cancelFriendRequest = async (receiverId) => {
        try {
            await axios.post(`${BACK_URL}/friendRequest/cancel`, null, {
                params: {
                    senderId: loginUserId,
                    receiverId: receiverId
                }
            });
            console.log('팔로우를 취소했습니다.');
            fetchSearchResults(); // 상태 갱신을 위해 검색 결과를 새로 가져옵니다.
        } catch (error) {
            console.error('Error cancelling friend request:', error);
        }
    };

    // 검색 결과 새로 가져오기
    const fetchSearchResults = async () => {
        if (searchQuery.trim() !== '') {
            try {
                // 사용자 검색
                const response = await axios.get(`${BACK_URL}/friend/search`, {
                    params: { nickname: searchQuery }
                });

                // 검색 결과에서 자기 자신을 제외
                const filteredResults = response.data.filter(user => user.userId !== loginUserId);

                // 사용자 ID 목록을 쉼표로 구분된 문자열로 변환
                const userIds = filteredResults.map(user => user.userId).join(',');
                const requestStatusResponse = await axios.get(`${BACK_URL}/friendRequest/status`, {
                    params: {
                        senderId: loginUserId,
                        receiverIds: userIds
                    }
                });

                const requestStatusMap = requestStatusResponse.data;
                const updatedResults = filteredResults.map(user => ({
                    ...user,
                    requestStatus: requestStatusMap[user.userId] || null
                }));

                setSearchResults(updatedResults);
            } catch (error) {
                console.error("친구 검색 중 오류가 발생했습니다:", error);
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back}
                     src="/lib/back.svg"
                     alt="back"
                     onClick={() => navigate('/main')}
                />
                <h2>친구 추가</h2>
                <img
                    src="/lib/검색.svg"
                    alt="search"
                    className={styles.searchIcon}
                    onClick={() => setIsSearchVisible(!isSearchVisible)}
                />
            </div>

            <div className={`${styles.searchBar} ${isSearchVisible ? styles.visible : ''}`} id="search-bar">
                <input
                    type="text"
                    placeholder="닉네임 검색"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <img src="/lib/검색.svg" alt="search" />
            </div>

            <div className={styles.searchResults}>
                {searchResults.length > 0 ? (
                    searchResults.map((friend, index) => (
                        <div key={index} className={styles.searchResultItem}>
                            <img src={friend.img || '/lib/마이페이지아이콘.svg'} alt={friend.nickname}/>
                            <span>{friend.nickname}</span>
                            {friend.requestStatus === "PENDING" ? (
                                <button>승인 대기중</button>
                            ) : friend.requestStatus === "ACCEPTED" ? (
                                <button onClick={() => cancelFriendRequest(friend.userId)}>팔로우 취소</button>
                            ) : (
                                <button onClick={() => sendFriendRequest(friend.userId)}>팔로우</button>
                            )}
                        </div>
                    ))
                ) : searchQuery.trim() !== '' ? (
                    <p className={styles.noResults}>검색 결과가 없습니다.</p>
                ) : null}
            </div>

            <Footer />
        </div>
    );
};

export default AddFriend;
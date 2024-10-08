import React, { useState, useEffect } from 'react';
import styles from '../../css/routine/dailyRoutineInfo.module.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Footer from '../../jsx/fix/Footer.jsx';
import {useLogin} from "../../contexts/AuthContext.jsx";
import axiosInstance from "../../config/axiosInstance.js";

const DailyRoutineInfo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { groupName } = useParams();
    const [rooms, setRooms] = useState([]);
    const [routineItems, setRoutineItems] = useState({});
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [newRoutineText, setNewRoutineText] = useState('');
    const [editRoutineId, setEditRoutineId] = useState(null);
    const [editRoutineText, setEditRoutineText] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [routineToEdit, setRoutineToEdit] = useState(null); // Routine to edit
    const [isGroupActive, setIsGroupActive] = useState(false);
    const [alarmStatus, setAlarmStatus] = useState({});

    const { user } = useLogin();

    // 그룹 이름으로 루틴 정보 가져오기
    const fetchDailyRoutines = async () => {
        try {
            const response = await axiosInstance.get(`/routine/group/${groupName}`);
            const dailyRoutines = response.data.filter(routine => routine.routineFrequency === 'DAILY')
                .reduce((acc, routine) => {
                    if (!acc[routine.roomId]) {
                        acc[routine.roomId] = [];
                    }
                    acc[routine.roomId].push({
                        id: routine.routineId,
                        text: routine.routineName,
                        notification: routine.routineIsAlarm ? 'on' : 'off'
                    });
                    return acc;
                }, {});
            setRoutineItems(dailyRoutines);

            const activeRoutineResponse = await axiosInstance.get('/routine/checked-group-names', {
                params: { userId: user.userId }
            });
            console.log(groupName);
            console.log(activeRoutineResponse.data);
            if(groupName === activeRoutineResponse.data){
                setIsGroupActive(true);
            }
        } catch (error) {
            console.error('Error fetching daily routines:', error);
        }
    };

    useEffect(() => {
        // 모든 방 정보 가져오기
        const fetchRooms = async () => {
            try {
                const response = await axiosInstance.get(`/room/list`, {
                    params: { userId: user.userId }
                });
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();
        fetchDailyRoutines();
    }, [groupName]);



    const addRoutineItem = async () => {
        if (selectedRoomId === null || newRoutineText.trim() === '') {
            alert('방 ID가 없거나 새로운 루틴 이름이 비어 있습니다.');
            return;
        }

        const newRoutine = {
            routineName: newRoutineText,
            routineGroupName: groupName,
            roomId: selectedRoomId,
            routineInterval: "",
            routineFrequency: 'DAILY',
            routineIsAlarm: false,
            routineIsChecked: false
        };

        try {
            const response = await axiosInstance.post(`/routine/add`, newRoutine);
            if (response.status === 200) {
                const addedRoutine = response.data;
                setRoutineItems(prevItems => ({
                    ...prevItems,
                    [selectedRoomId]: [
                        ...(prevItems[selectedRoomId] || []),
                        {
                            id: addedRoutine.routineId,
                            text: addedRoutine.routineName,
                            notification: addedRoutine.routineIsAlarm ? 'on' : 'off'
                        }
                    ]
                }));
                // isGroupActive가 true이면 루틴 그룹 업데이트 요청
                if (isGroupActive) {
                    await applyRoutineGroupUpdate(groupName, groupName);
                }

                closeAddModal();
                fetchDailyRoutines();
            } else {
                throw new Error('Failed to add routine item');
            }
        } catch (error) {
            console.error('Error adding routine item:', error);
            alert('일정 추가 중 오류가 발생했습니다.');
        }
    };

    const deleteRoutineGroup = async () => {
        if (!window.confirm('이 루틴 그룹을 정말로 삭제하시겠습니까?')) {
            return;
        }

        try {
            const response = await axiosInstance.delete(`/routine/deleteGroup/${groupName}`);
            if (response.status === 200) {
                alert('루틴 그룹이 성공적으로 삭제되었습니다.');
                navigate('/routine'); // 루틴 페이지로 이동하거나 다른 적절한 페이지로 이동
            } else {
                throw new Error('Failed to delete routine group');
            }
        } catch (error) {
            console.error('Error deleting routine group:', error);
            alert('루틴 그룹 삭제 중 오류가 발생했습니다.');
        }
    };

    const updateRoutineItem = async () => {
        if (editRoutineText.trim() === '') {
            alert('루틴 이름이 비어 있습니다.');
            return;
        }

        const updatedRoutine = {
            routineId: routineToEdit.id,
            routineName: editRoutineText,
            routineGroupName: groupName,
            roomId: routineToEdit.roomId,
            routineInterval: "",
            routineFrequency: 'DAILY',
            routineIsAlarm: routineToEdit.notification === 'on',
            routineIsChecked: routineToEdit.routineIsChecked
        };

        try {
            const response = await axiosInstance.put(`/routine/update`, updatedRoutine);

            if (response.status === 200) {
                const updatedItem = response.data;
                setRoutineItems(prevItems => {
                    const newItems = { ...prevItems };
                    for (let key in newItems) {
                        newItems[key] = newItems[key].map(item =>
                            item.id === updatedItem.id ? {
                                ...item,
                                text: updatedItem.text
                            } : item
                        );
                    }
                    return newItems;
                });
                // isGroupActive가 true이면 루틴 그룹 업데이트 요청
                if (isGroupActive) {
                    await applyRoutineGroupUpdate(groupName, groupName);
                }

                closeEditModal();
                fetchDailyRoutines();
            } else {
                throw new Error('Failed to update routine item');
            }
        } catch (error) {
            console.error('Error updating routine item:', error);
            alert('루틴 수정 중 오류가 발생했습니다.');
        }
    };

    const deleteRoutineItem = async () => {
        if (!routineToEdit) {
            alert('삭제할 루틴을 선택해주세요.');
            return;
        }

        try {
            const response = await axiosInstance.delete(`/routine/delete/${routineToEdit.id}`);

            if (response.status === 200) {
                setRoutineItems(prevItems => ({
                    ...prevItems,
                    [routineToEdit.roomId]: (prevItems[routineToEdit.roomId] || []).filter(item => item.id !== routineToEdit.id)
                }));

                closeEditModal();
                fetchDailyRoutines();
            } else {
                throw new Error('Failed to delete routine item');
            }
        } catch (error) {
            console.error('Error deleting routine item:', error);
            alert('일정 삭제 중 오류가 발생했습니다.');
        }
    };

    const applyRoutineGroupUpdate = async (oldRoutineGroupName, newRoutineGroupName) => {
        try {
            const response = await axiosInstance.post('/routine/apply', null, {
                params: {
                    oldRoutineGroupName: oldRoutineGroupName,
                    newRoutineGroupName: newRoutineGroupName
                }
            });

            if (response.status === 200) {
                console.log('Routine group successfully updated.');
            } else {
                throw new Error('Failed to apply routine group update');
            }
        } catch (error) {
            console.error('Error applying routine group update:', error);
            alert('루틴 그룹 업데이트 중 오류가 발생했습니다.');
        }
    };


    const handleTabClick = (frequency) => {
        navigate(`/routine/${frequency}/${groupName}`);
    };

    const openAddModal = (roomId) => {
        setSelectedRoomId(roomId);
        setAddModalOpen(true);
    };

    const closeAddModal = () => {
        setAddModalOpen(false);
        setNewRoutineText('');
        setSelectedRoomId(null);
    };

    const openEditModal = (routine) => {
        setRoutineToEdit(routine);
        setEditRoutineText(routine.text);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setEditRoutineId(null);
        setEditRoutineText('');
    };

    const getAddButtonBackgroundColor = (index) => {
        const colors = ['#ffc5f2', '#ffebc5', '#c5f1ff'];
        return colors[index % colors.length] || '#ffffff';
    };

    // 알림 켜기 요청을 보내는 함수
    const toggleRoomAlarms = async (roomId, routineGroupName) => {
        try {
            const response = await axiosInstance.post(`/routine/toggle-alarms`, {
                roomId,
                routineGroupName
            });

            if (response.status === 200) {
                const updatedRoutines = response.data;
                setRoutineItems(prevItems => {
                    const newItems = { ...prevItems };
                    newItems[roomId] = newItems[roomId].map(item => {
                        return {
                            ...item,
                            notification: 'on'
                        };
                    });
                    return newItems;
                });
                fetchDailyRoutines(); // 업데이트된 루틴들을 다시 가져옴
            } else {
                throw new Error('Failed to toggle alarms for room and group');
            }
        } catch (error) {
            console.error('Error toggling alarms for room and group:', error);
            alert('알림 설정 중 오류가 발생했습니다.');
        }
    };

    const handleToggleAlarmsClick = (roomId) => {
        if (!window.confirm('이 방의 모든 알림을 켜시겠습니까?')) {
            return;
        }

        toggleRoomAlarms(roomId, groupName);
    };

    const handleNotificationClick = async (roomId, routine) => {
        try {
            const newNotificationStatus = routine.notification === 'on' ? 'off' : 'on';

            // 서버에 알림 상태 변경 요청
            await axiosInstance.put(`/routine/toggle-notification`, null, {
                params: {
                    routineId: routine.id,
                    routineIsAlarm: newNotificationStatus
                }
            });

            // 상태 업데이트
            setRoutineItems(prevItems => ({
                ...prevItems,
                [roomId]: prevItems[roomId].map(item =>
                    item.id === routine.id ? { ...item, notification: newNotificationStatus } : item
                )
            }));
        } catch (error) {
            console.error('Error toggling notification status:', error);
            alert('알림 상태 변경 중 오류가 발생했습니다.');
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={() => navigate('/routine')} />
                <h2>{groupName}</h2>
                <h3 onClick={deleteRoutineGroup}>루틴 삭제</h3>
            </div>
            <div className={styles.tabs}>
                <div
                    className={`${styles.tab} ${location.pathname.includes('/routine/daily') ? styles.active : ''}`}
                    onClick={() => handleTabClick('daily')}
                >
                    일간
                </div>
                <div
                    className={`${styles.tab} ${location.pathname.includes('/routine/weekly') ? styles.active : ''}`}
                    onClick={() => handleTabClick('weekly')}
                >
                    주간
                </div>
                <div
                    className={`${styles.tab} ${location.pathname.includes('/routine/monthly') ? styles.active : ''}`}
                    onClick={() => handleTabClick('monthly')}
                >
                    월간
                </div>
            </div>
            <div className={styles.routineContainer}>
                {rooms.map((room, index) => (
                    <div key={room.roomId} className={styles.roomRoutine}>
                        <div className={styles.roomRoutineHeader}>
                            <div className={styles.roomRoutineTitle}
                                 style={{
                                backgroundColor: getAddButtonBackgroundColor(index),
                                color: '#000'
                            }}>
                                <p>{room.roomName}</p>
                                <img src="/lib/연필.svg" alt="edit"/>
                            </div>
                            <div className={styles.alramOnOff}>
                                <p onClick={() => handleToggleAlarmsClick(room.roomId)}>모든 알람 켜기</p>
                                <img src="/lib/plus.svg" alt="plus" className={styles.plusIcon}
                                     onClick={() => openAddModal(room.roomId)}/>
                            </div>
                        </div>
                        <div className={styles.roomRoutineInfo}>
                            <ul>
                                {(routineItems[room.roomId] || []).map(item => (
                                    <li key={item.id}>
                                        <label htmlFor={`routine-${item.id}`} onClick={() => openEditModal(item)}>
                                            {item.text}
                                        </label>
                                        <img
                                            src={`/lib/알림${item.notification}.svg`}
                                            alt={`notification ${item.notification}`}
                                            onClick={() => handleNotificationClick(room.roomId, item)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
            {addModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>루틴 추가</h2>
                        <input
                            type="text"
                            value={newRoutineText}
                            onChange={(e) => setNewRoutineText(e.target.value)}
                        />
                        <div className={styles.buttonGroup}>
                            <button onClick={addRoutineItem}>추가</button>
                            <button onClick={closeAddModal}>취소</button>
                        </div>
                    </div>
                </div>
            )}
            {editModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>루틴 수정</h2>
                        <input
                            type="text"
                            value={editRoutineText}
                            onChange={(e) => setEditRoutineText(e.target.value)}
                        />
                        <div className={styles.buttonGroup}>
                            <button onClick={updateRoutineItem}>수정</button>
                            <button onClick={deleteRoutineItem} className={styles.deleteButton}>삭제</button>
                            <button onClick={closeEditModal}>취소</button>
                        </div>
                    </div>
                </div>
            )}
            <Footer/>
        </div>
    );
};

export default DailyRoutineInfo;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/clothes/topList.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import apiClient from '../../api/axiosConfig';

const TopList = () => {
    const navigate = useNavigate();
    const [clothes, setClothes] = useState([]);
    const [modalData, setModalData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [currentEdit, setCurrentEdit] = useState(null);

    useEffect(() => {
        const fetchClothes = async () => {
            try {
                const response = await apiClient.get('/ware/items');
                const topClothes = response.data.filter(item =>
                    item.clothType === '반팔' || item.clothType === '긴팔' || item.clothType === '셔츠' ||
                    item.clothType === '니트' || item.clothType === '민소매' || item.clothType === '카라티'
                );
                setClothes(topClothes);
            } catch (error) {
                console.error('옷 데이터를 불러오는 중 오류 발생:', error);
            }
        };

        fetchClothes();
    }, []);

    useEffect(() => {
        if (modalData) {
            const modalElement = document.getElementById("myModal");
            if (modalElement) {
                modalElement.style.display = "block";
            }
        }
    }, [modalData]);

    const openModal = (cloth) => {
        setModalData(cloth);
        setEditMode(false);
        setCurrentEdit({ ...cloth }); // 편집 중인 옷 데이터 복사
    };

    const closeModal = () => {
        document.getElementById("myModal").style.display = "none";
        setModalData(null);
        setCurrentEdit(null);
    };

    const handleClickOutside = (event) => {
        if (event.target.id === "myModal") {
            closeModal();
        }
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = async () => {
        try {
            await apiClient.put(`/ware/items/${currentEdit.clothId}`, currentEdit); // 수정된 부분: currentEdit.clothId 사용
            setClothes(clothes.map(cloth => cloth.clothId === currentEdit.clothId ? currentEdit : cloth)); // 수정된 부분: clothId 사용
            closeModal();
        } catch (error) {
            console.error('수정 중 오류 발생:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await apiClient.delete(`/ware/items/${currentEdit.clothId}`);
            const fileName = currentEdit.imageUrl.split('/').pop();
            await apiClient.delete(`/files/delete?fileName=${encodeURIComponent(fileName)}`);
            setClothes(clothes.filter(cloth => cloth.clothId !== currentEdit.clothId));
            closeModal();
        } catch (error) {
            console.error('삭제 중 오류 발생:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCurrentEdit({ ...currentEdit, [name]: value });
    };

    const getOptions = () => {
        return ['반팔', '긴팔', '셔츠', '민소매', '카라티', '니트'];
    };

    const getColorOptions = () => {
        return ['초록', '검정', '회색', '흰색'];
    };

    const getMaterialOptions = () => {
        return ['면', '폴리에스터', '나일론'];
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={() => navigate('/closet')} />
                <h2>Top</h2>
            </div>
            <div className={styles.itemList}>
                {clothes.map((cloth, index) => (
                    <img
                        key={index}
                        src={cloth.imageUrl || '/lib/상의1.svg'}
                        alt={cloth.clothName || `상의 ${index + 1}`}
                        onClick={() => openModal(cloth)}
                    />
                ))}
            </div>

            {modalData && (
                <div id="myModal" className={styles.modal} onClick={handleClickOutside}>
                    <div className={styles.modalContent}>
                        <span className={styles.close} onClick={closeModal}>&times;</span>
                        {!editMode ? (
                            <>
                                <h2>{modalData.clothName}</h2>
                                <p>종류: {modalData.clothType}</p>
                                <p>색상: {modalData.clothColor}</p>
                                <p>소재: {modalData.clothMaterial}</p>
                                <p>계절: {modalData.clothSeason}</p>
                                <p>세탁 방법: {modalData.howWash}</p>
                                <p>커스텀 태그: {modalData.clothCustomTag}</p>
                                <button onClick={handleEdit}>수정</button>
                                <button onClick={handleDelete} className={styles.deleteButton}>삭제</button>

                            </>
                        ) : (
                            <>
                                <h2>수정 모드</h2>
                                <div className={styles.tag}>
                                    <label htmlFor="clothName">옷 이름</label>
                                    <input
                                        type="text"
                                        id="clothName"
                                        name="clothName"
                                        value={currentEdit.clothName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.tag}>
                                    <label htmlFor="clothType">종류</label>
                                    <select
                                        id="clothType"
                                        name="clothType"
                                        value={currentEdit.clothType}
                                        onChange={handleChange}
                                    >
                                        {getOptions().map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.tag}>
                                    <label htmlFor="clothColor">색상</label>
                                    <select
                                        id="clothColor"
                                        name="clothColor"
                                        value={currentEdit.clothColor}
                                        onChange={handleChange}
                                    >
                                        {getColorOptions().map(color => (
                                            <option key={color} value={color}>{color}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.tag}>
                                    <label htmlFor="clothMaterial">소재</label>
                                    <select
                                        id="clothMaterial"
                                        name="clothMaterial"
                                        value={currentEdit.clothMaterial}
                                        onChange={handleChange}
                                    >
                                        {getMaterialOptions().map(material => (
                                            <option key={material} value={material}>{material}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.tag}>
                                    <label htmlFor="clothSeason">계절</label>
                                    <select
                                        id="clothSeason"
                                        name="clothSeason"
                                        value={currentEdit.clothSeason}
                                        onChange={handleChange}
                                    >
                                        <option value="SUMMER">여름</option>
                                        <option value="SPRING_FALL">봄/가을</option>
                                        <option value="WINTER">겨울</option>
                                    </select>
                                    <div className={styles.tag}>
                                        <label htmlFor="clothCustomTag">커스텀 태그</label>
                                        <input
                                            type="text"
                                            id="clothCustomTag"
                                            name="clothCustomTag"
                                            value={currentEdit.clothCustomTag}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <button onClick={handleSave}>저장</button>
                                <button onClick={closeModal}>취소</button>
                            </>
                        )}
                    </div>
                </div>
            )}
            <Footer/>
        </div>
    );
};

export default TopList;
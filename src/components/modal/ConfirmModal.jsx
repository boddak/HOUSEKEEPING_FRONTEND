import '../../css/modal/InformModal.css';
import PropTypes from "prop-types";

// 값을 입력받는 모달
const inputModal = ({modalState, modalTitle, modalBody, modalCallback, hideModal}) => {

    const handleConfirm = () => {

        modalCallback();
        hideModal();
    }

    return (
        <div className={`modal ${modalState}`}>
            <div className="modal-content">
                <span className="modal-title">{modalTitle}</span>
                <div className="modal-body">
                    {modalBody}
                </div>
                <button className="close-button" onClick={handleConfirm}>예</button>
                <button className="close-button" onClick={hideModal}>아니오</button>
            </div>
        </div>
    );
};

// 받은 props의 타입 확인. 매치되지 않으면 오류 발생
inputModal.propTypes = {
    modalState: PropTypes.string,
    modalTitle: PropTypes.string,
    modalBody: PropTypes.string,
    modalCallback: PropTypes.func,
    hideModal: PropTypes.func,
}

export default inputModal;
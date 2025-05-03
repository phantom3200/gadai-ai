import { FC, useState } from 'react';
import { ModalProps } from '../app.types';
import CrossIcon from '../icons/CrossIcon';

const Modal: FC<ModalProps> = ({ children, onClose, isCloseIconDisabled }) => {
    const [modalClassName, setModalClassName] = useState('modal');

    const handleClose = () => {
        setModalClassName('modal fade-out');
        setTimeout(() => {
            onClose();
        }, 200);
    };

    return (
        <div className={modalClassName}>
            {!isCloseIconDisabled && (
                <div className={'modal-close-icon'} onClick={handleClose}>
                    <CrossIcon />
                </div>
            )}
            <div className={'modal-content-wrapper'}>{children}</div>
        </div>
    );
};

export default Modal;

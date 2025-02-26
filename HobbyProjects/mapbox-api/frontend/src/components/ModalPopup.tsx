import React, { FC } from 'react';
import { messages } from '../types/messages';
import styles from '../styles/components.module.scss';

type ModalPopupProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: messages | null;
    children: React.ReactNode;
};

const ModalPopup: FC<ModalPopupProps> = ({
    isOpen,
    onClose,
    title,
    message,
    children,
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div
                className={styles.modalContainer}
                onClick={(e) => e.stopPropagation()}
            >
                <button className={styles.modalClose} onClick={onClose}>
                    &times;
                </button>
                {title && <h2 className={styles.modalTitle}>{title}</h2>}
                {message && (
                    <div
                        className={
                            message.type === 'ERROR'
                                ? styles.error
                                : styles.success
                        }
                    >
                        {message.text}
                    </div>
                )}
                <div className={styles.modalContent}>{children}</div>
            </div>
        </div>
    );
};

export default ModalPopup;

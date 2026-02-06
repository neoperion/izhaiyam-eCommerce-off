import React, { createContext, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const toast = useRef(null);

    const showToast = (severity, summary, detail, life = 4000) => {
        if (toast.current) {
            toast.current.show({
                severity,
                summary,
                detail,
                life
            });
        }
    };

    // Helper functions to match common usages or simplify calls
    const toastSuccess = (detail, summary = 'Success') => showToast('success', summary, detail);
    const toastError = (detail, summary = 'Error') => showToast('error', summary, detail);
    const toastInfo = (detail, summary = 'Info') => showToast('info', summary, detail);
    const toastWarn = (detail, summary = 'Warning') => showToast('warn', summary, detail);

    return (
        <ToastContext.Provider value={{ showToast, toastSuccess, toastError, toastInfo, toastWarn }}>
            <Toast ref={toast} position="top-right" />
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

import React, { useEffect } from 'react';

const AlertDialog = ({ isOpen, message, onConfirm, onCancel }) => {
    useEffect(() => {
        if (isOpen) {
            // Store current scroll position
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        } else {
            // Restore scroll position
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }

        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
        };
    }, [isOpen]);
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-xl border border-gray-200 max-w-md w-11/12 transform transition-all">
                <p className="text-lg mb-6 text-gray-800 font-medium">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2.5 bg-[#B4975A] text-white rounded-lg hover:bg-[#8B7355] transition-colors duration-200 shadow-sm"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertDialog;

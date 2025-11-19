// components/Modal.tsx

import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    // 선택적으로 모달의 최대 너비 등을 props로 받을 수도 있습니다.
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    if (!isOpen) return null;

    // 중앙 배치 스타일을 사용합니다.
    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900/50 backdrop-blur-md transition-opacity duration-300">
            {/* ESC 키로 모달 닫기 기능 추가 (선택 사항) */}
            <div 
                className="bg-gray-800 text-gray-100 rounded-lg shadow-2xl w-full max-w-sm 
                           transform transition-all duration-300 scale-100 border border-gray-700 hover:shadow-indigo-500/50"
            >
                
                <div className="flex justify-end p-2">
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-100 transition p-1 rounded-full hover:bg-gray-700"
                        aria-label="모달 닫기"
                    >
                        <X className="w-5 h-5"/>
                    </button>
                </div>
                
                {/* 모달 본문 (children 렌더링) */}
                <div className="p-4 pt-0">
                    {children} 
                </div>

            </div>
        </div>
    );
};

export default Modal;
import React from 'react';
import { cn } from '@/utils/cn';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "destructive",
  loading = false,
  className 
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleModalClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onConfirm();
  };

  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className={cn(
          "bg-white rounded-xl shadow-elevated max-w-md w-full p-6",
          "transform transition-all duration-200",
          className
        )}
        onClick={handleModalClick}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <ApperIcon name="AlertTriangle" size={20} className="text-red-600" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-primary mb-2">
              {title}
            </h3>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2"
              >
                {cancelText}
              </Button>
              <Button
                variant={confirmVariant}
                onClick={handleConfirm}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  confirmText
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
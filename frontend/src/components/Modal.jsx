const Modal = ({ isOpen, onClose, children }) => {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            
            <div className="absolute top-[40%] right-[50%] bg-white p-4 rounded-lg z-10 text-right">
              <div className="flex flex-column">
                <h4 className="pl-[1rem]">Edit or delete category</h4>
                <button
                  className="pl-[5rem] text-black font-semibold hover:text-gray-700 focus:outline-none mr-2"
                  onClick={onClose}
                >
                  X
                </button>
              </div>
              
              {children}
            </div>
          </div>
        )}
      </>
    );
  };
  
  export default Modal;
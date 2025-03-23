const CollapsibleChart = ({ title, children, isOpen, onClick }) => {
  return (
    <div 
      className="bg-white dark:bg-secondary-dark-bg rounded-3xl p-4 m-2 cursor-pointer transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-lg">{title}</h4>
        <span className="text-gray-600">
          {isOpen ? '▼' : '▶'}
        </span>
      </div>
      
      {isOpen && (
        <div className="mt-4 transition-all duration-300">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleChart;
import React from 'react';

const Loader = ({ fullScreen = false }) => {
    const loaderContent = (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium animate-pulse">Loading Hospital System...</p>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm">
                {loaderContent}
            </div>
        );
    }

    return <div className="p-12 flex justify-center">{loaderContent}</div>;
};

// Simple CSS for the loader (usually you'd use Tailwind, but I'll add inline style for the animation)
const style = document.createElement('style');
style.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  .flex { display: flex; }
  .flex-col { flex-direction: column; }
  .items-center { align-items: center; }
  .justify-center { justify-content: center; }
  .space-y-4 > * + * { margin-top: 1rem; }
  .w-12 { width: 3rem; }
  .h-12 { height: 3rem; }
  .border-4 { border-width: 4px; }
  .border-blue-200 { border-color: #bfdbfe; }
  .border-t-blue-600 { border-top-color: #2563eb; }
  .rounded-full { border-radius: 9999px; }
`;
document.head.appendChild(style);

export default Loader;

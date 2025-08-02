import React from "react";

const Loader = () => {
  return (
    <div className="w-full min-h-screen bg-black/80">
      <div className="w-full flex items-center justify-center z-50 py-20">
        <div className="relative w-24 h-24">
          <svg
            className="animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4.75V6.25"
              stroke="darkOrange"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.1266 6.87347L16.0659 7.93413"
              stroke="darkOrange"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.25 12L17.75 12"
              stroke="darkOrange"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.1266 17.1265L16.0659 16.0659"
              stroke="darkOrange"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 17.75V19.25"
              stroke="darkOrange"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.9342 16.0659L6.87354 17.1265"
              stroke="darkOrange"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.25 12L4.75 12"
              stroke="darkOrange"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.9342 7.93413L6.87354 6.87347"
              stroke="darkOrange"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Loader;

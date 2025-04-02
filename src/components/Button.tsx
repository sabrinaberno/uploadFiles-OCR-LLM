// components/Button.tsx

import React from 'react';
 import {twMerge} from 'tailwind-merge';

interface ButtonProps {
  onClick?: () => void;
  type: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, type, disabled, children, className }) => {
  const baseStyle = "inline-flex items-center justify-center px-6 py-3 text-base font-medium text-center rounded-lg focus:ring-4 focus:ring-purple-200";
  const enabledStyle = "text-white bg-purple-700 hover:bg-purple-800";
  const disabledStyle = "text-gray-400 bg-gray-300 cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={twMerge(`${baseStyle}, ${disabled ? disabledStyle : enabledStyle}, ${className}`)}
    >
      {children}
    </button>
  );
};

export default Button;

// components/Button.tsx

import React from 'react';
 import {twMerge} from 'tailwind-merge';

interface ButtonProps {
  onClick?: () => void;
  type: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  unstyled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, type, disabled, children, className, unstyled }) => {
  const baseStyle = unstyled ? "" : "inline-flex items-center justify-center px-6 py-3 text-base font-medium text-center rounded-lg focus:ring-4 focus:ring-purple-200";
  const enabledStyle = unstyled ? "" : "text-white bg-purple-700 hover:bg-purple-800";
  const disabledStyle = unstyled ? "" : "text-gray-400 bg-gray-300 cursor-not-allowed";

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

import type { ReactElement } from "react";

interface ButtonProps {
    variant: "primary" | "secondary";
    size: "sm" | "md" | "lg";
    text: string;
    startIcon?: ReactElement; // ? makes this field optional
    // endIcon?: ReactElement; // ? makes this field optional
    onClick?: ()=> void;
}

const variantStyles = {
    "primary": "bg-primary-800 text-white font-semibold hover:bg-primary-900 shadow-lg hover:scale-105 transition-all duration-300 ease-out will-change-transform px-4 py-2 rounded-xl",
    "secondary": "bg-white text-primary-800 font-semibold hover:bg-primary-50 shadow-lg hover:scale-105 transition-all duration-300 ease-out will-change-transform px-4 py-2 rounded-xl"
}
const defaultStyles = "rounded-md flex item-center"
const sizeStyles = {
    "sm": "py-1 px-2",
    "md": "py-2 px-4",
    "lg": "py-4 px-6"
}

export const Button = ({variant, size, text, startIcon, onClick}: ButtonProps) => { // ButtonProps is the structure of Button(type of props)
    return <button onClick={onClick} className={`${variantStyles[variant]} ${defaultStyles} ${sizeStyles[size]}`}> 
        {startIcon? <div className="flex item-center justify-center p-2">{startIcon}</div> : null} {<div className="flex item-center justify-center p-1 mr-1">{text}</div>}
    </button>
}

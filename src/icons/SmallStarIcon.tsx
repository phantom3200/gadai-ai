import { FC } from 'react';
import { IconsProps } from '../app.types';

const SmallStarIcon: FC<IconsProps> = ({ className }) => (
    <svg
        width="47"
        height="47"
        viewBox="0 0 47 47"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M5 23.5C16.1 24.7333 22.2667 30.9 23.5 42C24.7333 30.9 30.9 24.7333 42 23.5C30.9 22.2667 24.7333 16.1 23.5 5C22.2667 16.1 16.1 22.2667 5 23.5Z"
            fill="white"
            stroke="white"
            strokeWidth="9.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default SmallStarIcon;

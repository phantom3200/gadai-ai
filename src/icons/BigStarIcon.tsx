import { FC } from 'react';
import { IconsProps } from '../app.types';

const BigStarIcon: FC<IconsProps> = ({ className }) => (
    <svg
        width="112"
        height="112"
        viewBox="0 0 112 112"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M9.3335 55.9999C37.3335 59.111 52.8891 74.6666 56.0002 102.667C59.1113 74.6666 74.6668 59.111 102.667 55.9999C74.6668 52.8888 59.1113 37.3333 56.0002 9.33325C52.8891 37.3333 37.3335 52.8888 9.3335 55.9999Z"
            fill="white"
            stroke="white"
            strokeWidth="9.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default BigStarIcon;

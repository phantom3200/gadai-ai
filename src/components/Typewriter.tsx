import { FC, Fragment, useEffect, useState } from 'react';
import { TypewriterProps } from '../app.types';
import { Cursor } from '../icons';
import {useRecoilState} from "recoil";
import {isTypewriterCompleted} from "../app.atoms";

const Typewriter: FC<TypewriterProps> = ({ text, delay }) => {
    const [isTypingCompleted, setIsTypingCompleted] = useRecoilState(isTypewriterCompleted);
    const [displayResponse, setDisplayResponse] = useState('');

    useEffect(() => {
        setIsTypingCompleted(false);

        let i = 0;

        const intervalId = setInterval(() => {
            setDisplayResponse(text.slice(0, i));

            i++;

            if (i > text.length) {
                clearInterval(intervalId);
                setIsTypingCompleted(true);
            }
        }, delay);

        return () => clearInterval(intervalId);
    }, [text]);

    return (
        <Fragment>
            {displayResponse}
            {!isTypingCompleted && <Cursor />}
        </Fragment>
    );
};

export default Typewriter;

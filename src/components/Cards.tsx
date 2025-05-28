import { createRef, CSSProperties, FC, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import card from '../images/card.png';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
    currentMode,
    currentUser,
    image,
    isPredictionAlertOpened,
    isPredictionDataLoading,
    isTypewriterCompleted,
    isUserDataLoading,
    prediction,
} from '../app.atoms';
import { cards, Modes } from '../app.const';
// @ts-ignore
import styles from '../App.scss';
import Typewriter from './Typewriter';
import { getUserData } from '../app.services';

const Cards: FC = () => {
    const [isLoading, setIsLoading] = useRecoilState(isPredictionDataLoading);
    const [mode, setMode] = useRecoilState(currentMode);
    const [file, setFile] = useRecoilState(image);
    const [predictionAlertOpened, setPredictionAlertOpened] =
        useRecoilState(isPredictionAlertOpened);
    const [user, setUser] = useRecoilState(currentUser);
    const [isUserLoading, setIsUserLoading] = useRecoilState(isUserDataLoading);
    const [currentPrediction, setCurrentPrediction] = useRecoilState(prediction);
    const [isTypingCompleted, setIsTypingCompleted] = useRecoilState(isTypewriterCompleted);
    const [activeCardId, setActiveCardId] = useState<number | null>(null);
    const [isCardReadyToFlip, setIsCardReadyToFlip] = useState(false);
    const [isCardsAnimationFinished, setIsCardsAnimationFinished] = useState(false);
    const [cardBackStyles, setCardBackStyles] = useState<CSSProperties>();
    const [isCardBackReadyToFlip, setIsCardBackReadyToFlip] = useState(false);
    const [isCardBackVisible, setIsCardBackVisible] = useState(false);

    const cardsReadyTimeout = Number(styles.cardsReadyDelay) + Number(styles.cardsReadyDuration);
    const cardFlippedTimeout = Number(styles.activeCardDuration);
    const cardFlippedDelay = Number(styles.flipCardDelay);
    const cardFlippedDuration = Number(styles.flipCardDuration);
    const cardFlippingAnimation = cardFlippedDelay + cardFlippedDuration;

    const cardsRefs = useMemo(() => cards.map(() => createRef<HTMLDivElement>()), []);
    const footerButtonClassName = isTypingCompleted
        ? 'cards-footer-button visible'
        : 'cards-footer-button';

    useEffect(() => {
        if (!isLoading) {
            setTimeout(() => {
                setIsCardsAnimationFinished(true);
            }, cardsReadyTimeout);
        }
    }, [isLoading]);

    useEffect(() => {
        if (isCardReadyToFlip && activeCardId) {
            const activeCardIndex = activeCardId - 1;
            const activeCardRef = cardsRefs[activeCardIndex];
            if (activeCardRef.current) {
                const { offsetWidth, offsetHeight, offsetTop, offsetLeft } = activeCardRef.current;
                const footerButtonOffset = 30;

                setCardBackStyles({
                    width: offsetWidth,
                    height: offsetHeight,
                    top: offsetTop - footerButtonOffset,
                    left: offsetLeft,
                });
                setIsCardBackReadyToFlip(true);
            }
            const timer = setTimeout(() => {
                setIsCardBackVisible(true);
            }, cardFlippingAnimation);

            return () => clearTimeout(timer);
        }
    }, [isCardReadyToFlip]);

    const cardsClassName = isLoading ? 'cards' : 'cards cards-ready';
    const loaderWrapperClassName = isLoading ? 'loader-wrapper' : 'loader-wrapper invisible';
    const headerTextClassName = isLoading ? 'tarot-header-text' : 'tarot-header-text ready';
    const cardBackClassName = isCardBackReadyToFlip ? 'card-back flipped' : 'card-back';

    const headerText = isLoading
        ? 'Анализируем Ваше фото'
        : 'Персональное предсказание для Вас готово! Выберете карту';

    const handleCardClick = (cardNumber: number) => () => {
        if (isCardsAnimationFinished) {
            setActiveCardId(cardNumber);
            setTimeout(() => {
                setIsCardReadyToFlip(true);
            }, cardFlippedTimeout);
        }
    };

    const clearStateAfterPrediction = () => {
        setFile(null);
        setCurrentPrediction('');
        setIsTypingCompleted(false);
        setIsLoading(true);
    };

    const handleContinue = async () => {
        await getUserData({ setUser, setIsLoading: setIsUserLoading });
        setMode(Modes.MainScreen);
        clearStateAfterPrediction();
        // TODO: перенести в главный экран, чтобы открывалось с анимацией
        setPredictionAlertOpened(true);
    };

    // TODO: переименовать переменные с анимацией более понятно, например isCardAnimationEnded
    // TODO: можно переделать с абсолютного позиционирования на флекс. подробнее - в файле

    return (
        <div className={'cards-container'}>
            <div className={headerTextClassName}>{headerText}</div>
            <div className={loaderWrapperClassName}>
                <div className={'tarot-loader'} />
            </div>
            <div className={cardsClassName}>
                {cards.map((cardNumber, index) => {
                    const cardClassName = clsx(
                        `card-item card-${cardNumber}`,
                        activeCardId === cardNumber && 'is-active',
                        isCardReadyToFlip && 'ready-to-flip',
                    );
                    return (
                        <div
                            ref={cardsRefs[index]}
                            className={cardClassName}
                            key={cardNumber}
                            onClick={handleCardClick(cardNumber)}
                        >
                            <img src={card} alt="" />
                        </div>
                    );
                })}
                {isCardReadyToFlip && (
                    <div className={cardBackClassName} style={cardBackStyles}>
                        {isCardBackVisible && <Typewriter text={currentPrediction} delay={30} />}
                    </div>
                )}
            </div>
            <div className={footerButtonClassName}>
                <button className={'base-button'} onClick={handleContinue} disabled={isUserLoading}>
                    Продолжить
                </button>
            </div>
        </div>
    );
};

export default Cards;

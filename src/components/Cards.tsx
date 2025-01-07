import {
    createRef,
    CSSProperties,
    FC,
    useEffect,
    useMemo,
    useState,
} from 'react';
import clsx from 'clsx';
import card from '../images/card.png';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isDataLoading, prediction } from '../app.atoms';
import { cards } from '../app.const';
// @ts-ignore
import styles from '../App.scss';
import Typewriter from './Typewriter';

const Cards: FC = () => {
    const [isLoading, setIsLoading] = useRecoilState(isDataLoading);
    const currentPrediction = useRecoilValue(prediction);
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

    const cardsRefs = useMemo(() => cards.map((card) => createRef<HTMLDivElement>()), []);

   /* useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []); */

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
                setCardBackStyles({
                    width: offsetWidth,
                    height: offsetHeight,
                    top: offsetTop,
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
        </div>
    );
};

export default Cards;

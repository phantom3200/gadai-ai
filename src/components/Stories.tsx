import { FC, Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { StoriesProps } from '../app.types';
import { getStoryWidth } from '../app.utils';

const Stories: FC<StoriesProps> = ({
    stories,
    defaultStoryDuration,
    millisecondsToPauseStory,
    onStart,
    isLoading,
}) => {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [isSameStoryPlaying, setIsSameStoryPlaying] = useState(true); // для повторного воспроизведения той же сторис
    const [progress, setProgress] = useState(0);
    const [touchStartTime, setTouchStartTime] = useState<number | null>(null);
    const [touchTimeoutId, setTouchTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const [isProgressBarInvisible, setIsProgressBarInvisible] = useState(false);
    const animationFrameId = useRef<any>(); // для хранения ID анимации

    const currentStory = stories[currentStoryIndex];
    const currentStoryDuration = currentStory.duration || defaultStoryDuration;
    const isOnboardingCompleted = currentStoryIndex === stories.length - 1 && progress === 100;
    const progressBarClassName = isProgressBarInvisible
        ? 'progress-bar-wrapper invisible'
        : 'progress-bar-wrapper';
    const startButtonClassName = isOnboardingCompleted ? 'base-button visible' : 'base-button';

    const animateCallback = useCallback(
        (currentTime: number, newCurrentStartTime: number, storyDuration: number) => {
            const elapsedTime = currentTime - newCurrentStartTime;
            const newProgress = Math.min((elapsedTime / storyDuration) * 100, 100);
            setProgress(newProgress);

            if (newProgress < 100) {
                animationFrameId.current = requestAnimationFrame((time) =>
                    animateCallback(time, newCurrentStartTime, storyDuration),
                );
            } else {
                const isLastStory = currentStoryIndex === stories.length - 1;
                if (isLastStory) return;

                setCurrentStoryIndex((prevIndex) => prevIndex + 1);
            }
        },
        [currentStoryIndex],
    );

    useEffect(() => {
        if (!isSameStoryPlaying) return;

        const newCurrentStartTime = performance.now();
        animationFrameId.current = requestAnimationFrame((time) =>
            animateCallback(time, newCurrentStartTime, currentStoryDuration),
        );

        return () => {
            cancelAnimationFrame(animationFrameId.current); // отменяем анимацию при размонтировании
            setProgress(0); // Сброс прогресса при размонтировании
        };
    }, [currentStoryIndex, isSameStoryPlaying, stories, animateCallback]);

    useEffect(() => {
        if (isSameStoryPlaying) return; // Если анимация уже идет, ничего не делаем
        setIsSameStoryPlaying(true); // Запускаем анимацию
    }, [currentStoryIndex]);

    const handleNext = () => {
        const isLastStory = currentStoryIndex === stories.length - 1;
        if (isLastStory) {
            cancelAnimationFrame(animationFrameId.current);
            setProgress(100);
            return;
        }

        setIsSameStoryPlaying(false); // останавливаем анимацию
        setCurrentStoryIndex((prevIndex) => Math.min(prevIndex + 1, stories.length - 1)); // переходим к следующей истории
        setProgress(0);
    };

    const handlePrev = () => {
        const prevValue = currentStoryIndex - 1;
        const valueToSet = prevValue >= 0 ? prevValue : 0;
        const isSameStory = currentStoryIndex === 0 && valueToSet === 0;

        setIsSameStoryPlaying(false);
        setCurrentStoryIndex(valueToSet);

        if (isSameStory) {
            cancelAnimationFrame(animationFrameId.current);
            const newCurrentStartTime = performance.now();

            animationFrameId.current = requestAnimationFrame((time) =>
                animateCallback(time, newCurrentStartTime, currentStoryDuration),
            );
            setIsSameStoryPlaying(true);
        }
    };

    const handlePause = () => {
        cancelAnimationFrame(animationFrameId.current);
        setIsSameStoryPlaying(true);
    };

    const handleContinue = () => {
        const newCurrentTime = performance.now() - (currentStoryDuration / 100) * progress;
        animationFrameId.current = requestAnimationFrame((time) =>
            animateCallback(time, newCurrentTime, currentStoryDuration),
        );
    };

    const handleTouchStart = () => {
        if (touchTimeoutId) {
            clearTimeout(touchTimeoutId);
        }
        setTouchStartTime(Date.now());

        const newTimer = setTimeout(() => {
            handlePause();
            setIsProgressBarInvisible(true);
        }, millisecondsToPauseStory);

        setTouchTimeoutId(newTimer);
    };

    const handleNextTouchEnd = () => {
        setIsProgressBarInvisible(false);
        if (touchTimeoutId) {
            clearTimeout(touchTimeoutId);
        }
        if (touchStartTime) {
            const timeLeft = Date.now() - touchStartTime;
            if (timeLeft < millisecondsToPauseStory) {
                handleNext();
                return;
            }
            handleContinue();
        }
    };

    const handlePrevTouchEnd = () => {
        setIsProgressBarInvisible(false);
        if (touchTimeoutId) {
            clearTimeout(touchTimeoutId);
        }
        if (touchStartTime) {
            const timeLeft = Date.now() - touchStartTime;
            if (timeLeft < millisecondsToPauseStory) {
                handlePrev();
                return;
            }
            handleContinue();
        }
    };

    return (
        <div className={'stories'}>
            <div className={progressBarClassName}>
                {stories.map(({ id }, index) => {
                    const isCurrentStory = currentStoryIndex === index;
                    const isViewedStory = currentStoryIndex > index;
                    const isNextStory = currentStoryIndex < index;
                    const percentWidth = getStoryWidth(
                        isCurrentStory,
                        isViewedStory,
                        isNextStory,
                        progress,
                    );
                    return (
                        <div className="progress-container" key={String(id)}>
                            <div
                                className="progress-bar"
                                style={{
                                    transform: `scaleX(${percentWidth / 100})`,
                                }}
                            />
                        </div>
                    );
                })}
            </div>
            <div
                className={'prev'}
                onTouchStart={handleTouchStart}
                onTouchEnd={handlePrevTouchEnd}
            />
            <div
                className={'next'}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleNextTouchEnd}
            />
            {stories.map((story, index) => {
                const imgClassName = currentStoryIndex === index ? 'image active' : 'image';
                const backgroundImgClassName =
                    currentStoryIndex === index ? 'background-image active' : 'background-image';
                return (
                    <Fragment key={story.id}>
                        <img src={story.link} alt="" className={backgroundImgClassName} />
                        <img src={story.link} alt="" className={imgClassName} />
                    </Fragment>
                );
            })}
            <button className={startButtonClassName} onClick={onStart} disabled={isLoading}>
                Начать
            </button>
        </div>
    );
};

export default Stories;

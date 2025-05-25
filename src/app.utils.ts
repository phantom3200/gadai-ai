import { AnimateProps, GetRemainingTimeData } from './app.types';
import { tg } from './telegramData';
import { groupsPredictionDictionary } from './app.const';
import { addDays, differenceInSeconds, fromUnixTime } from 'date-fns';

export const blobToDataUrl = (blob: Blob): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });

export const blobToBase64 = (blob: Blob) =>
    blobToDataUrl(blob).then((text) => {
        if (typeof text === 'string') {
            const typeSeparator = text.indexOf(',') + 1;
            return text.slice(typeSeparator);
        }
        return null;
    });

export const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
    new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Failed to convert canvas to blob'));
                }
            },
            'image/jpeg',
            1.0,
        );
    });

export const getCropImgMaxHeight = (element: HTMLDivElement) => {
    const cropWrapperStyles = window.getComputedStyle(element);
    const cropWrapperPaddingTop = parseInt(cropWrapperStyles.paddingTop, 10);
    const imgMaxHeight = Number(element.clientHeight) - cropWrapperPaddingTop;
    return imgMaxHeight;
};

export const getStoryWidth = (
    isCurrentStory: boolean,
    isViewedStory: boolean,
    isNextStory: boolean,
    percentWidth: number,
) => {
    if (isCurrentStory) return percentWidth;
    if (isViewedStory) return 100;
    if (isNextStory) return 0;
    return 0;
};

export const hapticHeartbreakFeedback = () => {
    const haptic = tg.HapticFeedback;
    haptic.impactOccurred('medium');
    // Второй удар (слабее) через 200 мс
    setTimeout(() => {
        haptic.impactOccurred('light');
    }, 200);
};

export const getPredictionText = (value: number) => {
    const lastDigit = String(value).at(-1);
    const numericLastDigit = Number(lastDigit);

    if (value >= 5 && value <= 20) return groupsPredictionDictionary[2];

    if (numericLastDigit === 1) return groupsPredictionDictionary[0];

    if (numericLastDigit >= 2 && numericLastDigit <= 4) return groupsPredictionDictionary[1];

    return groupsPredictionDictionary[2];
};

export const getRemainingTime = (timestamp: number): GetRemainingTimeData => {
    const lastClickDate = fromUnixTime(timestamp / 1000); // Преобразуем timestamp в Date
    const oneDayLater = addDays(lastClickDate, 1); // Время, когда пройдет 24 часа
    const currentTime = new Date(); // Текущее время

    // Вычисляем разницу в секундах до истечения 24 часов
    const secondsLeft = differenceInSeconds(oneDayLater, currentTime);
    const hours = Math.floor(secondsLeft / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;

    return { hours, minutes, seconds };
};

export const checkIsNextPredictionAvailable = (remainingTime: GetRemainingTimeData) => {
    const isNextPredictionAvailable =
        remainingTime?.hours <= 0 && remainingTime?.minutes <= 0 && remainingTime?.seconds <= 0;
    return isNextPredictionAvailable;
};

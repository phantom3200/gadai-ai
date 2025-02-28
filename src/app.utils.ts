import { AnimateProps } from './app.types';

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

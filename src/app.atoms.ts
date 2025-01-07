import { atom, selector } from 'recoil';
import { Modes } from './app.const';

export const currentMode = atom<Modes>({
    key: 'currentMode',
    default: Modes.Stories,
});
export const image = atom<File | null>({
    key: 'image',
    default: null,
});

export const imageUrl = selector<string>({
    key: 'imageUrl',
    get: ({ get }) => {
        const img = get(image);
        return img ? URL.createObjectURL(img) : '';
    },
});

export const croppedImage = atom<Blob | null>({
    key: 'croppedImage',
    default: null,
});

export const croppedImageUrl = atom<string>({
    key: 'croppedImageUrl',
    default: '',
});

export const prediction = atom<string>({
    key: 'prediction',
    default: '',
});

export const isDataLoading = atom<boolean>({
    key: 'isDataLoading',
    default: true,
});

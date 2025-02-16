import { atom, selector } from 'recoil';
import {Modes, paywallItems} from './app.const';
import {PaywallItem, User} from './app.types';

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

export const isPredictionLoading = atom<boolean>({
    key: 'isPredictionLoading',
    default: true,
});

export const isStartButtonLoading = atom<boolean>({
    key: 'isStartButtonLoading',
    default: false,
});

export const currentUser = atom<User | null>({
    key: 'currentUser',
    default: null,
});

export const paywallRadioState = atom<PaywallItem>({
    key: 'paywallRadioState',
    default: paywallItems[1],
});

export const isPaywallOpened = atom<boolean>({
    key: 'isPaywallOpened',
    default: true
})

import type { Crop } from 'react-image-crop';
import { PaywallItem, StoryItem, User } from './app.types';
import screen1 from './images/demo_screen_1.jpg';
import screen2 from './images/demo_screen_2.jpg';
import screen3 from './images/demo_screen_3.jpg';
import { tgUserId, tgUserName, tgUserNickname, tgUserSurname } from './telegramData';

export enum Modes {
    MainScreen = 'MainScreen',
    CropScreen = 'CropScreen',
    Stories = 'Stories',
    Cards = 'Cards',
}
export const initialCrop: Crop = {
    unit: '%',
    x: 0,
    y: 0,
    width: 100,
    height: 50,
};

export const millisecondsToPauseStory = 500;

export const defaultStoryDuration = 5000;

export const stories: StoryItem[] = [
    {
        id: 1,
        link: screen1,
    },
    {
        id: 2,
        link: screen2,
    },
    {
        id: 3,
        link: screen3,
    },
];

export const cards = [1, 2, 3, 4, 5];

export const movingToCenterDuration = 2;

export const defaultUser: User = {
    id: tgUserId,
    name: tgUserName,
    surname: tgUserSurname,
    username: tgUserNickname,
    balance: 2,
    lastPredictionTimestamp: null
};

export const paywallItems: PaywallItem[] = [
    {
        id: 1,
        title: '1 Предсказание',
        price: 100,
        value: 1,
    },
    {
        id: 2,
        title: '10 Предсказаний',
        price: 500,
        benefit: 25,
        value: 10,
    },
    {
        id: 3,
        title: '30 Предсказаний',
        price: 1000,
        benefit: 67,
        value: 30
    },
];

export const urls: Record<string, string> = {
    auth: 'auth',
    getPrediction: 'getPrediction',
    createUser: 'createUser',
    getUserData: 'getUserData',
    updateUser: 'updateUser',
    getInvoiceLink: 'getInvoiceLink',
}

export const groupsPredictionDictionary = ['предсказание', 'предсказания', 'предсказаний'];

import type { Crop } from 'react-image-crop';
import {StoryItem} from "./app.types";
import screen1 from './images/demo_screen_1.jpg'
import screen2 from './images/demo_screen_2.jpg'
import screen3 from './images/demo_screen_3.jpg'

export enum Modes {
    MainScreen = 'MainScreen',
    CropScreen = 'CropScreen',
    Stories = 'Stories',
    Cards = 'Cards'
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

export const cards = [1, 2, 3, 4, 5]

export const movingToCenterDuration = 2

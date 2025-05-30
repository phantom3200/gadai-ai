import { FC } from 'react';
import {
    defaultStoryDuration,
    millisecondsToPauseStory,
    Modes,
    stories,
} from '../app.const';
import Stories from './Stories';
import { useRecoilState } from 'recoil';
import { currentMode, currentUser, isUserDataLoading } from '../app.atoms';

const StoriesScreen: FC = () => {
    const [mode, setMode] = useRecoilState(currentMode);
    const [user, setUser] = useRecoilState(currentUser);
    const [isLoading, setIsLoading] = useRecoilState(isUserDataLoading);


    const handleStart = async () => {
        setMode(Modes.MainScreen);
    };

    return (
        <Stories
            stories={stories}
            defaultStoryDuration={defaultStoryDuration}
            millisecondsToPauseStory={millisecondsToPauseStory}
            onStart={handleStart}
            isLoading={isLoading}
        />
    );
};

export default StoriesScreen;

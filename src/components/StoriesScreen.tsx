import { FC } from 'react';
import { defaultStoryDuration, millisecondsToPauseStory, Modes, stories } from '../app.const';
import Stories from './Stories';
import { useRecoilState } from 'recoil';
import { currentMode } from '../app.atoms';

const StoriesScreen: FC = () => {
    const [mode, setMode] = useRecoilState(currentMode);
    const handleStart = () => {
        setMode(Modes.MainScreen);
    };

    return (
        <Stories
            stories={stories}
            defaultStoryDuration={defaultStoryDuration}
            millisecondsToPauseStory={millisecondsToPauseStory}
            onStart={handleStart}
        />
    );
};

export default StoriesScreen;

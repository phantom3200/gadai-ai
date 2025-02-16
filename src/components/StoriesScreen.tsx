import { FC, useEffect } from 'react';
import { updateDoc } from 'firebase/firestore';
import {
    defaultStoryDuration,
    millisecondsToPauseStory,
    Modes,
    stories,
    userRef,
} from '../app.const';
import Stories from './Stories';
import { useRecoilState } from 'recoil';
import { currentMode, currentUser, isStartButtonLoading } from '../app.atoms';
import { tgUserId } from '../telegramData';
import { createUser, getUserData } from '../app.services';

const StoriesScreen: FC = () => {
    const [mode, setMode] = useRecoilState(currentMode);
    const [user, setUser] = useRecoilState(currentUser);
    const [isLoading, setIsLoading] = useRecoilState(isStartButtonLoading);

    useEffect(() => {
        void getUserData({ setUser });
    }, []);

    const handleStart = async () => {
        if (!user && tgUserId) {
            await createUser({ id: tgUserId, setIsLoading });
            setMode(Modes.MainScreen);
            return;
        }

        if (userRef) {
            // TODO: можно убрать, isOnboardingCompleted в любом случае будет true
            await updateDoc(userRef, { isOnboardingCompleted: true });
            setMode(Modes.MainScreen);
        }
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

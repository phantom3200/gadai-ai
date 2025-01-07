export type IconsProps = {
    className?: string;
};

export type FormattedImg = {
    image: Blob;
    link: string;
};

export type RequestDataByImageProps = {
    file: Blob;
    setIsLoading: (value: boolean) => void;
    setCurrentPrediction: (prediction: string) => void;
};

export type StoryItem = {
    id: number;
    link: string;
    duration?: number;
};

export type StoriesProps = {
    stories: StoryItem[];
    defaultStoryDuration: number;
    millisecondsToPauseStory: number;
    onStart: () => void;
};

export type AnimateProps = {
    currentTime: number;
    currentStartTime: number;
    storyDuration: number;
    setProgress: (value: number) => void;
    setCurrentStoryIndex: (value: number) => void;
    currentStoryIndex: number;
};

export type TypewriterProps = {
    text: string;
    delay: number;
};

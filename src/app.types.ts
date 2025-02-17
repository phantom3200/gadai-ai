import {ReactNode} from "react";

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
    isLoading: boolean;
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

export type User = {
    isAdmin?: boolean;
    isOnboardingCompleted?: boolean;
    id?: string | null;
    name?: string | null;
    surname?: string | null;
    username?: string | null;
    balance: number;
};

export type GetUserDataProps = {
    setUser: (user: User | null) => void;
};

export type CreateUserProps = {
    id: string;
    setIsLoading: (value: boolean) => void;
};

export type PaywallItem = {
    id: number;
    title: string;
    price: number;
    benefit?: number;
}

export type ModalProps = {
    children: ReactNode;
    onClose: () => void;
}

export type EventData = { url: string; status: "paid" | "cancelled" | "failed" | "pending" }

export type InvoiceClosedCallback = (eventData: EventData) => void;

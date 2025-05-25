import { ReactNode } from 'react';

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
    id?: string | null;
    name?: string | null;
    surname?: string | null;
    username?: string | null;
    balance: number;
    lastPredictionTimestamp?: number | null;
};

export type GetUserDataProps = {
    setUser: (user: User | null) => void;
    setIsLoading: (value: boolean) => void;
};

export type CreateUserProps = {
    setIsLoading: (value: boolean) => void;
    setUser: (user: User | null) => void;
};

export type UpdateUserProps = {
    setIsLoading: (value: boolean) => void;
    setUser: (user: User | null) => void;
    updatedUser: User;
};

export type GetInvoiceLinkProps = {
    title: string;
    price: number;
    count: number;
};

export type PaywallItem = {
    id: number;
    title: string;
    price: number;
    value: number;
    benefit?: number;
};

export type ModalProps = {
    children: ReactNode;
    onClose: () => void;
    isCloseIconDisabled?: boolean;
};

export type EventData = { url: string; status: 'paid' | 'cancelled' | 'failed' | 'pending' };

export type InvoiceClosedCallback = (eventData: EventData) => void;

export type AuthDataProps = {
    tgId: string | null;
    initData: unknown;
};

export type InitUserProps = GetUserDataProps & {
    setPredictionAlertOpened: (value: boolean) => void;
    setIsInitQueryLoading: (value: boolean) => void;
};

export type AuthResponse = {
    success: boolean;
    data: string | null;
};

export type GetPredictionBodyProps = {
    base64Image: string | null;
};

export type GetRemainingTimeData = {
    hours: number;
    minutes: number;
    seconds: number;
};

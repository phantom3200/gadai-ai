import { FC } from 'react';
import Avatar from './Avatar';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
    prediction,
    croppedImage,
    currentMode,
    isDataLoading,
} from '../app.atoms';
import { Modes } from '../app.const';
import LogoIcon from '../icons/LogoIcon';
import { requestDataByImage } from '../app.services';

const MainScreen: FC = () => {
    const [isLoading, setIsLoading] = useRecoilState(isDataLoading);
    const [currentPrediction, setCurrentPrediction] = useRecoilState(prediction);
    const [mode, setMode] = useRecoilState(currentMode);
    const croppedImg = useRecoilValue(croppedImage);

    const handleGetPrediction = () => {
        if (croppedImg) {
            void requestDataByImage({
                setIsLoading,
                file: croppedImg,
                setCurrentPrediction,
            });
            setMode(Modes.Cards);
        }
    };

    const headerText = croppedImg
        ? 'Для получения ежедневного Предсказания всё готово!'
        : 'Загрузите селфи и получите персональное Предсказание на день от Искусственного Интеллекта';

    return (
        <div className={'main-screen-container'}>
            <div className={'main-screen-header'}>
                <LogoIcon />
                <div className={'header-text'}>{headerText}</div>
            </div>
            <div className={'main-screen-body'}>
                <Avatar />
            </div>
            <div className={'main-screen-footer'}>
                <button
                    className={'base-button'}
                    disabled={!croppedImg}
                    onClick={handleGetPrediction}
                >
                    Получить предсказание
                </button>
            </div>
        </div>
    );
};

export default MainScreen;

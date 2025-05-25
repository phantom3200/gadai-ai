import { ChangeEvent, FC, Fragment, useEffect, useState } from 'react';
import Avatar from './Avatar';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
    prediction,
    croppedImage,
    currentMode,
    isPredictionDataLoading,
    isUserDataLoading,
    image,
    isPaywallOpened,
    currentUser,
    isPredictionAlertOpened,
    isInitUserLoading,
} from '../app.atoms';
import { Modes } from '../app.const';
import LogoIcon from '../icons/LogoIcon';
import { auth, getUserData, getPrediction, initUser } from '../app.services';
import Paywall from './Paywall';
import Modal from './Modal';
import { tg } from '../telegramData';
import { getPredictionText } from '../app.utils';
import PredictionAlertModal from './PredictionAlertModal';
import { GetRemainingTimeData } from '../app.types';

const MainScreen: FC = () => {
    const [isPredictionLoading, setIsPredictionDataLoading] =
        useRecoilState(isPredictionDataLoading);
    const [isUserLoading, setIsUserLoading] = useRecoilState(isUserDataLoading);
    const [isInitQueryLoading, setIsInitQueryLoading] = useRecoilState(isInitUserLoading);
    const [currentPrediction, setCurrentPrediction] = useRecoilState(prediction);
    const [mode, setMode] = useRecoilState(currentMode);
    const [file, setFile] = useRecoilState(image);
    const [user, setUser] = useRecoilState(currentUser);
    const [isPaywallModalOpened, setIsPaywallModalOpened] = useRecoilState(isPaywallOpened);
    const [predictionAlertOpened, setPredictionAlertOpened] =
        useRecoilState(isPredictionAlertOpened);
    const croppedImg = useRecoilValue(croppedImage);

    const userBalance = user?.balance ?? 0;
    const isZeroBalance = userBalance < 1;
    const predictionText = getPredictionText(userBalance);
    const isTestMode = process.env.REACT_APP_IS_TEST_MODE
        ? JSON.parse(process.env.REACT_APP_IS_TEST_MODE)
        : true;

    useEffect(() => {
        if (!user) {
            void initUser({
                setUser,
                setPredictionAlertOpened,
                setIsInitQueryLoading,
                setIsLoading: setIsUserLoading,
            });
        }
    }, []);

    useEffect(() => {
        const isOpenPaywall =
            user && isZeroBalance && !predictionAlertOpened && !isInitQueryLoading;
        if (isOpenPaywall) {
            setIsPaywallModalOpened(true);
        }
    }, [user, predictionAlertOpened]);

    const handleGetPrediction = () => {
        if (croppedImg && !isZeroBalance) {
            void getPrediction({
                setIsLoading: setIsPredictionDataLoading,
                file: croppedImg,
                setCurrentPrediction,
            });
            setMode(Modes.Cards);
        }
    };

    const handleSetFile = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            setMode(Modes.CropScreen);
        }
    };

    const handleClosePaywall = () => {
        setIsPaywallModalOpened(false);
    };

    const handleClosePredictionAlert = () => {
        setPredictionAlertOpened(false);
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
            <div className={'main-screen-body-wrapper'}>
                <div className={'main-screen-body'}>
                    <Avatar />
                </div>
                <div className={'balance'}>
                    Вам доступно: <span>{userBalance}</span> {predictionText}
                </div>
            </div>
            <div className={'main-screen-footer'}>
                {croppedImg ? (
                    <button className={'base-button'} onClick={handleGetPrediction}>
                        Получить предсказание
                    </button>
                ) : (
                    <Fragment>
                        <input
                            type="file"
                            accept="image/*"
                            id={'image-input'}
                            onChange={handleSetFile}
                            hidden
                        />
                        <label htmlFor="image-input">
                            <div className={'base-button'}>Загрузить фото</div>
                        </label>
                    </Fragment>
                )}
            </div>
            {isPaywallModalOpened && (
                <Modal onClose={handleClosePaywall} isCloseIconDisabled={!isTestMode}>
                    <Paywall />
                </Modal>
            )}
            {predictionAlertOpened && (
                <Modal onClose={handleClosePredictionAlert} isCloseIconDisabled={!isTestMode}>
                    <PredictionAlertModal />
                </Modal>
            )}
        </div>
    );
};

export default MainScreen;

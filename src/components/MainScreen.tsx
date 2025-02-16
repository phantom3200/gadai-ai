import { ChangeEvent, FC, Fragment } from 'react';
import Avatar from './Avatar';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
    prediction,
    croppedImage,
    currentMode,
    isPredictionLoading,
    image,
    isPaywallOpened,
} from '../app.atoms';
import { Modes } from '../app.const';
import LogoIcon from '../icons/LogoIcon';
import { requestDataByImage } from '../app.services';
import Paywall from './Paywall';
import Modal from './Modal';

const MainScreen: FC = () => {
    const [isLoading, setIsLoading] = useRecoilState(isPredictionLoading);
    const [currentPrediction, setCurrentPrediction] = useRecoilState(prediction);
    const [mode, setMode] = useRecoilState(currentMode);
    const [file, setFile] = useRecoilState(image);
    const [isPaywallModalOpened, setIsPaywallModalOpened] = useRecoilState(isPaywallOpened);
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
                            <div className={'base-button'}>Загрузить селфи</div>
                        </label>
                    </Fragment>
                )}
            </div>
            {isPaywallModalOpened && (
                <Modal onClose={handleClosePaywall}>
                    <Paywall />
                </Modal>
            )}
        </div>
    );
};

export default MainScreen;

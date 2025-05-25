import { FC, useEffect, useState } from 'react';
import { GetRemainingTimeData } from '../app.types';
import { checkIsNextPredictionAvailable, getRemainingTime } from '../app.utils';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentUser, isPredictionAlertOpened } from '../app.atoms';

const PredictionAlertModal: FC = () => {
    const [remainingTime, setRemainingTime] = useState<GetRemainingTimeData | null>(null);
    const user = useRecoilValue(currentUser);
    const [predictionAlertOpened, setPredictionAlertOpened] =
        useRecoilState(isPredictionAlertOpened);

    useEffect(() => {
        const predictionTimestamp = user?.lastPredictionTimestamp;
        if (predictionTimestamp) {
            const interval = setInterval(() => {
                const timeLeft = getRemainingTime(predictionTimestamp);
                setRemainingTime(timeLeft);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [user]);

    useEffect(() => {
        if (!remainingTime) {
            return;
        }
        const isNextPredictionAvailable = checkIsNextPredictionAvailable(remainingTime);
        if (isNextPredictionAvailable) {
            setPredictionAlertOpened(false);
        }
    }, [remainingTime]);

    return (
        <div className={'prediction-alert-wrapper'}>
            <div className={'prediction-alert'}>
                <div className={'prediction-alert-header'}>
                    Предсказание на сегодня уже получено
                </div>
                <div className={'prediction-alert-body'}>
                    Следующее предсказание будет доступно через{' '}
                    {remainingTime?.hours.toString().padStart(2, '0')}:
                    {remainingTime?.minutes.toString().padStart(2, '0')}:
                    {remainingTime?.seconds.toString().padStart(2, '0')}
                </div>
            </div>
        </div>
    );
};

export default PredictionAlertModal;

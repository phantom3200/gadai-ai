import {FC, useEffect} from 'react';
import {useRecoilState, useRecoilValue} from 'recoil';
import {currentUser, isPaywallOpened, paywallRadioState} from '../app.atoms';
import tgStarIcon from '../images/tg-star-icon.png';
import {paywallItems, userRef} from '../app.const';
import { PaywallItem } from '../app.types';
import { openInvoiceLink } from '../app.services';
import {updateDoc} from "firebase/firestore";

const Paywall: FC = () => {
    const [paywallState, setPaywallState] = useRecoilState(paywallRadioState);
    const [isPaywallModalOpened, setIsPaywallModalOpened] = useRecoilState(isPaywallOpened);
    const user = useRecoilValue(currentUser)
    // TODO: сделать анимацию для чекбокса и кастомную иконку внутри

    const handleRadioChange = (newValue: PaywallItem) => () => {
        setPaywallState(newValue);
    };

    const handlePay = async () => {
        void openInvoiceLink({ setIsPaywallModalOpened });
    };

    return (
        <div className={'paywall-wrapper'}>
            <div className={'paywall'}>
                <div className={'paywall-header'}>
                    <div>Мы используем внутреннюю валюту Telegram - Stars.</div>
                    <div>
                        Приобрести Stars можно через официального бота{' '}
                        <a href={'https://t.me/PremiumBot'}>Premium Bot</a>.
                    </div>
                    <div>В боте доступна оплата российскими картами.</div>
                </div>
                <div className={'paywall-body'}>
                    <ul>
                        {paywallItems.map((item) => {
                            const isLastItem = item.id === paywallItems.length;
                            return (
                                <li className={'paywall-body-list-item'} key={item.id}>
                                    <label htmlFor={String(item.id)}>
                                        <input
                                            id={String(item.id)}
                                            type={'radio'}
                                            value={item.id}
                                            checked={paywallState === item}
                                            onChange={handleRadioChange(item)}
                                        />
                                        <div className={'paywall-body-list-item-content'}>
                                            <div className={'left-content'}>
                                                <div className={'left-content-title'}>
                                                    {item.title}
                                                </div>
                                                {item.benefit && (
                                                    <div className={'left-content-benefit'}>
                                                        Выгода {item.benefit}%
                                                    </div>
                                                )}
                                            </div>
                                            <div className={'right-content'}>
                                                <div>{item.price}</div>
                                                <img src={tgStarIcon} alt="" />
                                            </div>
                                            {!isLastItem && <div className={'separator'} />}
                                        </div>
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className={'paywall-footer'}>
                    <button onClick={handlePay}>Заплатить {paywallState.price} Stars</button>
                </div>
            </div>
        </div>
    );
};

export default Paywall;

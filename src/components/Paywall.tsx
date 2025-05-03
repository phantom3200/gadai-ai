import { FC, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentUser, isPaywallOpened, isUserDataLoading, paywallRadioState } from '../app.atoms';
import tgStarIcon from '../images/tg-star-icon.png';
import { paywallItems } from '../app.const';
import { EventData, PaywallItem } from '../app.types';
import { getInvoiceLink, updateUser } from '../app.services';
import { tg } from '../telegramData';

const Paywall: FC = () => {
    const [paywallState, setPaywallState] = useRecoilState(paywallRadioState);
    const [isPaywallModalOpened, setIsPaywallModalOpened] = useRecoilState(isPaywallOpened);
    const [isUserLoading, setIsUserLoading] = useRecoilState(isUserDataLoading);
    const [user, setUser] = useRecoilState(currentUser);
    // TODO: сделать анимацию для чекбокса и кастомную иконку внутри

    const handleInvoiceClosed = async (e: EventData) => {
        const { status } = e;
        if (status === 'paid' && user) {
            const newBalance = user.balance + paywallState.value;
            const updatedUser = { ...user, balance: newBalance };
            await updateUser({ setUser, updatedUser, setIsLoading: setIsUserLoading }).then(() => {
                setIsPaywallModalOpened(false);
            });
        }
    };

    useEffect(() => {
        tg.onEvent('invoiceClosed', handleInvoiceClosed);
        return () => {
            tg.offEvent('invoiceClosed', handleInvoiceClosed);
        };
    }, []);

    const handleRadioChange = (newValue: PaywallItem) => () => {
        setPaywallState(newValue);
    };

    const openInvoiceLink = async () => {
        const invoiceLinkResult = await getInvoiceLink();
        if (invoiceLinkResult.success) {
            const invoiceLink = invoiceLinkResult.data;
            tg.openInvoice(invoiceLink, () => null);
        }
    };

    const handlePay = () => {
        void openInvoiceLink();
    };

    return (
        <div className={'paywall-wrapper'}>
            <div className={'paywall'}>
                <div className={'paywall-header'}>
                    <div>Мы используем внутреннюю валюту Telegram - Stars.</div>
                    <div>
                        Приобрести Stars можно также через официального бота{' '}
                        <a href={'https://t.me/PremiumBot'}>Premium Bot</a>.
                    </div>
                    <div>Доступна оплата российскими картами.</div>
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

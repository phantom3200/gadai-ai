export const tg = window.Telegram.WebApp;
export const tgUserId = tg?.initDataUnsafe?.user?.id ? String(tg.initDataUnsafe.user.id) : null;
export const tgUserName = tg?.initDataUnsafe?.user?.first_name ?? null;
export const tgUserSurname = tg?.initDataUnsafe?.user?.last_name ?? null;
export const tgUserNickname = tg?.initDataUnsafe?.user?.username ?? null;
export const setTgLoadingReady = () => tg?.ready();
export const openTelegramLink = (value: string) => tg?.openTelegramLink(value);
export const openInvoice = (
    url: string,
    cb: (status: 'paid' | 'cancelled' | 'failed' | 'pending') => void,
) => tg?.openInvoice(url, cb);

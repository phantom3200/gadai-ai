import {InvoiceClosedCallback} from "./app.types";

export const tg = window.Telegram.WebApp;
export const tgUserId = tg?.initDataUnsafe?.user?.id ? String(tg.initDataUnsafe.user.id) : null;
export const tgUserName = tg?.initDataUnsafe?.user?.first_name ?? null;
export const tgUserSurname = tg?.initDataUnsafe?.user?.last_name ?? null;
export const tgUserNickname = tg?.initDataUnsafe?.user?.username ?? null;
export const setTgLoadingReady = () => tg?.ready();

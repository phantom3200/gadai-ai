import { blobToBase64 } from './app.utils';
import {
    CreateUserProps,
    GetUserDataProps,
    OpenInvoiceLinkProps,
    RequestDataByImageProps,
} from './app.types';
import { openInvoice, setTgLoadingReady } from './telegramData';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import { defaultUser, userRef } from './app.const';
import axios from 'axios';

export const requestDataByImage = async ({
    file,
    setCurrentPrediction,
    setIsLoading,
}: RequestDataByImageProps) => {
    const base64 = await blobToBase64(file);

    setIsLoading(true);
    await fetch('https://astroface-koowrwpr4a-uc.a.run.app', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            authentication: {
                checksum: 'b6c9367b2ae5f0642b9404d1caad399bee8f6ec3',
            },
            payload: {
                language: 'ru',
                image: {
                    mimeType: 'image/jpeg',
                    base64,
                },
            },
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            setCurrentPrediction(data.data.text);
        })
        .catch((e) => console.log(e))
        .finally(() => setIsLoading(false));
};

export const getUserData = async ({ setUser }: GetUserDataProps) => {
    if (userRef) {
        await getDoc(userRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setUser(userData);
                    setTgLoadingReady();
                }
            })
            .catch((error) => {
                console.error('Ошибка получения пользователя:', error);
            });
    }
};

export const createUser = async ({ id, setIsLoading }: CreateUserProps) => {
    setIsLoading(true);
    await setDoc(doc(firestore, 'users', id), defaultUser)
        .catch((e) => {
            console.error('Ошибка создания пользователя:', e);
        })
        .finally(() => {
            setIsLoading(false);
        });
};

export const getInvoiceLink = async () => {
    const response = await axios.post(
        'https://gadai-ai-server-slavaluhanin.amvera.io/tg/getInvoiceLink',
        {},
        {
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json; charset=utf-8',
            },
        },
    );
    const invoiceLink = response.data;
    return invoiceLink;
};

export const openInvoiceLink = async ({ setIsPaywallModalOpened }: OpenInvoiceLinkProps) => {
    const invoiceLinkResult = await getInvoiceLink();
    if (invoiceLinkResult.success) {
        const invoiceLink = invoiceLinkResult.data;
        // @ts-ignore
        openInvoice(invoiceLink, async (url, status) => {
            console.log(url);
            console.log(status);
            if (status === 'paid') {
                console.log('paid')
                if (userRef) {
                    await updateDoc(userRef, {balance: 1}).then(() => {
                        console.log('balance updated')
                        setIsPaywallModalOpened(false);
                    });
                }
            }
        });
    }
};

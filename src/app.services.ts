import { blobToBase64, hapticHeartbreakFeedback } from './app.utils';
import imageCompression from 'browser-image-compression';
import {
    AuthDataProps,
    AuthResponse,
    CreateUserProps, GetInvoiceLinkProps,
    GetPredictionBodyProps,
    GetUserDataProps,
    RequestDataByImageProps,
    UpdateUserProps,
    User,
} from './app.types';
import { setTgLoadingReady, tg, tgUserId } from './telegramData';
import { defaultUser, urls } from './app.const';
import axios, { AxiosResponse } from 'axios';
import { $api, saveToken } from './axiosConfig';

export const getPrediction = async ({
    file,
    setCurrentPrediction,
    setIsLoading,
}: RequestDataByImageProps) => {
    // @ts-ignore
    const compressedFile = await imageCompression(file, { maxSizeMB: 0.3 });
    const base64 = await blobToBase64(compressedFile);

    setIsLoading(true);

    const body: GetPredictionBodyProps = {
        base64Image: `data:image/jpeg;base64,${base64}`,
    };

    const interval = setInterval(() => hapticHeartbreakFeedback(), 1000);

     await $api
        .post(urls.getPrediction, body)
        .then((response) => {
            const { success, data } = response.data;
            if (success) {
                setCurrentPrediction(data);
            }
        })
        .catch((e) => console.log(e))
        .finally(() => {
            clearInterval(interval)
            setIsLoading(false)
        });
};

export const auth = async () => {

     const data: AuthDataProps = {
        tgId: tgUserId,
        initData: tg.initData,
    };
    await $api
        .post(urls.auth, data)
        .then((response: AxiosResponse<AuthResponse>) => {
            const token = response.data.data;
            saveToken(token);
        })
        .catch((e) => console.log(e));
};

export const createUser = async ({ setIsLoading, setUser }: CreateUserProps) => {
    setIsLoading(true);
    await $api
        .post(urls.createUser, defaultUser)
        .then((response) => {
            const isSuccess = response.data.success;
            if (isSuccess) {
                setUser({ ...defaultUser });
            }
        })
        .catch((e) => {
            console.error('Ошибка создания пользователя:', e);
        })
        .finally(() => {
            setIsLoading(false);
        });
};

export const getUserData = async ({ setUser, setIsLoading }: GetUserDataProps) => {
    setIsLoading(true);
    await $api
        .get(urls.getUserData)
        .then(async (response) => {
            const isSuccess = response.data.success;
            if (isSuccess) {
                const user = response.data.data;
                setUser(user);
                return;
            }
            await createUser({ setIsLoading, setUser });
        })
        .catch((e) => console.log(e))
        .finally(() => {
            setIsLoading(false);
        });
};

export const updateUser = async ({ setIsLoading, updatedUser, setUser }: UpdateUserProps) => {
    setIsLoading(true);
    await $api
        .post(urls.updateUser, updatedUser)
        .then((response) => {
            const isSuccess = response.data.success;
            if (isSuccess) {
                setUser(updatedUser);
            }
        })
        .catch((e) => {
            console.error('Ошибка обновления пользователя:', e);
        })
        .finally(() => {
            setIsLoading(false);
        });
};

export const getInvoiceLink = async (paymentInfo: GetInvoiceLinkProps) => {
    const response = await axios.post(urls.getInvoiceLink, paymentInfo);
    const invoiceLink = response.data;
    return invoiceLink;
};

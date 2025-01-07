import { blobToBase64 } from './app.utils';
import { RequestDataByImageProps } from './app.types';

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

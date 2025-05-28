import { ChangeEvent, CSSProperties, FC, Fragment, useEffect, useRef, useState } from 'react';
import { BigStarIcon, BorderIcon, ProfileIcon } from '../icons';
import { useRecoilState, useRecoilValue } from 'recoil';
import { croppedImage, croppedImageUrl, currentMode, image, imageUrl } from '../app.atoms';
import { Modes } from '../app.const';

const Avatar: FC = () => {
    const [file, setFile] = useRecoilState(image);
    const [mode, setMode] = useRecoilState(currentMode);
    const croppedImgUrl = useRecoilValue(croppedImageUrl);
    const [innerStyles, setInnerStyles] = useState<CSSProperties>();
    const innerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // TODO: пересчитывать при изменении размера экрана
        const innerBlockWidth = innerRef.current?.offsetWidth;
        setInnerStyles({ height: innerBlockWidth });
    }, []);

    const handleSetFile = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            setMode(Modes.CropScreen);
        }
    };

    return (
        <Fragment>
            <input
                type="file"
                accept="image/*"
                id={'image-input'}
                onChange={handleSetFile}
                hidden
            />
            <label htmlFor="image-input" className={'avatar'}>
                <div className={'avatar-inner'} ref={innerRef} style={innerStyles}>
                    {file ? (
                        <Fragment>
                            <img src={croppedImgUrl} alt="" className={'avatar-image'} />
                            <img
                                src={croppedImgUrl}
                                alt=""
                                className={'avatar-image background-avatar-image'}
                                style={innerStyles}
                            />
                        </Fragment>
                    ) : (
                        <ProfileIcon className={'profile-icon'} />
                    )}
                    <BorderIcon className={'border-icon'} />
                </div>
            </label>
            {!file && (
                <Fragment>
                    <BigStarIcon className={'star-icon top-outside-icon'} />
                    <BigStarIcon className={'star-icon left-inside-icon'} />
                    <BigStarIcon className={'star-icon right-inside-icon'} />
                    <BigStarIcon className={'star-icon right-outside-icon'} />
                </Fragment>
            )}
        </Fragment>
    );
};

export default Avatar;

import './App.scss';
import { CropScreen, MainScreen, StoriesScreen, Cards } from './components';
import { useRecoilValue } from 'recoil';
import { currentMode } from './app.atoms';
import { Modes } from './app.const';

function App() {
    const mode = useRecoilValue(currentMode);
    const isStartScreen = mode === Modes.MainScreen;
    const isCropScreen = mode === Modes.CropScreen;
    const isStoriesScreen = mode === Modes.Stories;
    const isCardsScreen = mode === Modes.Cards;

    return (
        <div className={'content-wrapper'}>
            <div className={'container'}>
                {isStartScreen && <MainScreen />}
                {isCropScreen && <CropScreen />}
                {isStoriesScreen && <StoriesScreen />}
                {isCardsScreen && <Cards />}
            </div>
        </div>
    );
}

export default App;

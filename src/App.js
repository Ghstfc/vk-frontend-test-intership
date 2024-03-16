import * as React from 'react';
import {
    AppRoot, CellButton, Group,
    Panel,
    PanelHeader, View,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import {useState} from "react";
import Fact from "./components/Fact/Fact";
import Age from "./components/Age/Age";

const App = () => {

    const [panel, setPanel] = useState('fact')

    return (
        <AppRoot>
            <Panel id="main">
                <PanelHeader>VK INTERSHIP TEST</PanelHeader>
                <Group>
                    <CellButton onClick={() => setPanel('fact')} style={{width: '100%'}}>
                        Задание с фактами
                    </CellButton>
                    <CellButton onClick={() => setPanel('age')} style={{width: '100%'}}>
                        Задание с возрастом
                    </CellButton>
                </Group>
                <View activePanel={panel}>
                    <Panel id={'fact'}>
                        <Fact />
                    </Panel>
                    <Panel id={'age'}>
                        <Age/>
                    </Panel>
                </View>
            </Panel>
        </AppRoot>
    );
};


export default App;

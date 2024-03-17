import * as React from 'react';
import {
    AdaptivityProvider,
    AppRoot, CellButton, ConfigProvider, Group,
    Panel, SplitCol, SplitLayout, View,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import {useState} from "react";
import Fact from "./components/Fact/Fact";
import Age from "./components/Age/Age";
import './styles/App.css'

const App = () => {

    const [panel, setPanel] = useState('fact')

    return (
        <ConfigProvider appearance={"light"}>
            <AdaptivityProvider>
                <AppRoot>
                    <SplitLayout style={{display: "flex", flexDirection: 'column', justifyContent: 'center'}}>
                        <SplitCol className={'u vas kostil'}>
                            <Group>
                                <CellButton onClick={() => setPanel('fact')} style={{width: '100%'}}>
                                    Задание с фактами
                                </CellButton>
                                <CellButton onClick={() => setPanel('age')} style={{width: '100%'}}>
                                    Задание с возрастом
                                </CellButton>
                            </Group>
                        </SplitCol>
                        <SplitCol className={'u vas kostil'}>
                            <View activePanel={panel}>
                                <Panel id={'fact'}>
                                    <Fact/>
                                </Panel>
                                <Panel id={'age'}>
                                    <Age/>
                                </Panel>
                            </View>
                        </SplitCol>
                    </SplitLayout>
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    );
};


export default App;

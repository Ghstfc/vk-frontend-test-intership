import * as React from 'react';
import {
    AppRoot,
    Panel,
    PanelHeader,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import {useEffect, useRef, useState} from "react";
import axios, {CanceledError} from "axios";
import Task from "./components/Task";

const App = () => {

    // refs to inputs
    const factsInputRef = useRef()
    const ageInputRef = useRef()

    // data in inputs
    const [fact, setFact] = useState('')
    const [age, setAge] = useState('')

    // data to show
    const [name, setName] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false);

    // validation on name
    const [validAge, setValidAge] = useState(true)
    const [error, setError] = useState('')

    // axios controller
    const [controller, setController] = useState(new AbortController())


    // change cursor position
    useEffect(() => {
        const pos = fact.search(/[^A-Za-z]/)
        factsInputRef.current.setSelectionRange(pos, pos)
        factsInputRef.current.focus()
    }, [fact]);


    useEffect(() => {
        if (name === '')
            return
        let ID
        if (!isSubmitting)
            ID = setTimeout(() => getAge(), 3000)
        return () => clearTimeout(ID)
    }, [name, isSubmitting, getAge]);


    function onChangeHandler() {
        if (!validAge)
            setValidAge(true)
        if (error)
            setError('')
        setName(ageInputRef.current.value)
        setIsSubmitting(false)
    }

    // get fact from server
    async function getFact() {

        // validate data
        const response = await axios('https://catfact.ninja/fact')
        let data = response.data.fact;
        setFact(data)
    }


    function checkCached(name) {
        let data = localStorage.getItem(name)
        if (data) {
            // fill fields
            setAge(data)
            setValidAge(true)

            // to default values of controllers
            ageInputRef.current.value = ''
            setIsSubmitting(false)
            setName('')
            return true
        }
        return false
    }

    function validate(name) {

        const regex = new RegExp(/^[a-zA-Z]+$/);
        if (!regex.test(name) || name.length > 15) {
            setValidAge(false)
            setIsSubmitting(false)
            return false
        }
        return true
    }


    function getAgeFromNameAndCache(name, controller) {
        const signal = controller.signal


        axios.get(`https://api.agify.io/?name=${name}`, {signal}).then((response) => {
            if (response.status !== 200 || !response.data || !response.data.age)
                throw new Error("Server get bad response")
            const age = response.data.age;
            setAge(age)
            setValidAge(true)
            ageInputRef.current.value = ''
            localStorage.setItem(name, age)
            setIsSubmitting(false)
        }).catch((e) => {
            if (!(e instanceof CanceledError)) {
                setError(e.message)
                setValidAge(false)
                setIsSubmitting(false)
            }
        }).finally(() => {
            ageInputRef.current.value = ''
            setName('')
        })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function getAge() {
        controller.abort()
        const abortController = new AbortController()
        setController(abortController)
        const name = ageInputRef.current.value
        ageInputRef.current.value = ''
        setIsSubmitting(true)
        if (checkCached(name))
            return
        setAge('')
        if (!validate(name))
            return
        getAgeFromNameAndCache(name, abortController)
    }


    function returnAge(age) {
        // spdfkpsk
        if (error)
            return `Error: ${error}`
        if (age)
            return `AGE : ${age}`
        else if (validAge)
            return ''
        return 'Имя может содержать только буквы'
    }

    function returnNamePlaceholder() {
        if (isSubmitting)
            return 'Загружаем ваш возраст...'
        return 'Введите имя';
    }

    return (
        <AppRoot>
            <Panel id="main">
                <PanelHeader>VK INTERSHIP TEST</PanelHeader>

                <Task
                    title={'FIRST TASK'}
                    onSubmit={getFact}
                    ref={factsInputRef}
                    defaultVal={fact}
                    placeholder={'Не вводите ничего, просто нажмите на кнопку'}
                />
                <Task
                    title={'SECOND TASK'}
                    onSubmit={getAge}
                    ref={ageInputRef}
                    defaultVal={''}
                    placeholder={returnNamePlaceholder()}
                    onChange={onChangeHandler}
                    status={validAge ? 'valid' : 'error'}
                    bottom={returnAge(age)}
                />
                {/*<Group>*/}
                {/*    <Header>FIRST TASK</Header>*/}
                {/*    <form onSubmit={(event) => {*/}
                {/*        event.preventDefault()*/}
                {/*        getFact()*/}
                {/*    }}>*/}
                {/*        <FormItem>*/}
                {/*            <Input*/}
                {/*                type={"text"}*/}
                {/*                getRef={factsInputRef}*/}
                {/*                defaultValue={fact}*/}
                {/*                placeholder={'Не вводите ничего, просто нажмите на кнопку'}*/}
                {/*            />*/}
                {/*        </FormItem>*/}
                {/*        <FormItem>*/}
                {/*            <Button type='submit' size='l' stretched>*/}
                {/*                SUBMIT*/}
                {/*            </Button>*/}
                {/*        </FormItem>*/}
                {/*    </form>*/}
                {/*</Group>*/}

                {/*<Group>*/}
                {/*    <Header>SECOND TASK</Header>*/}
                {/*    <form onSubmit={(event) => {*/}
                {/*        event.preventDefault()*/}
                {/*        getAge()*/}
                {/*    }}>*/}
                {/*        <FormItem*/}
                {/*            // поменять код*/}
                {/*            bottom={returnAge(age)}*/}
                {/*            status={validAge ? 'valid' : 'error'}*/}
                {/*        >*/}
                {/*            <Input*/}
                {/*                type={"text"}*/}
                {/*                getRef={ageInputRef}*/}
                {/*                defaultValue={''}*/}
                {/*                placeholder={returnNamePlaceholder()}*/}
                {/*                onChange={onChangeHandler}*/}
                {/*            />*/}
                {/*        </FormItem>*/}
                {/*        <FormItem>*/}
                {/*            <Button type='submit' size='l' stretched>*/}
                {/*                SUBMIT*/}
                {/*            </Button>*/}
                {/*        </FormItem>*/}
                {/*    </form>*/}
                {/*</Group>*/}
            </Panel>
        </AppRoot>
    );
};


export default App;

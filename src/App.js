import * as React from 'react';
import {
    AppRoot,
    Panel,
    PanelHeader,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import {useEffect, useRef, useState} from "react";
import Task from "./components/Task";
import {useAxios} from "./hooks/useAxios";
import {checkCached, validate} from "./utils/Validation";

const App = () => {


    const axiosFacts = useAxios('https://catfact.ninja/fact')
    const axiosAge = useAxios('https://api.agify.io/')


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
    const [errorName, setErrorName] = useState('')

    // axios controller
    const [controller, setController] = useState(new AbortController())


    // change cursor position
    useEffect(() => {
        factsInputRef.current.value = fact
        const pos = fact.search(/[^A-Za-z]/)
        factsInputRef.current.setSelectionRange(pos, pos)
        factsInputRef.current.focus()
    }, [fact]);


    // control input and auto submit after 3 seconds
    useEffect(() => {
        if (name === '')
            return
        let ID
        if (!isSubmitting)
            ID = setTimeout(() => getAge(), 3000)
        return () => clearTimeout(ID)
    }, [name, isSubmitting, getAge]);


    // change name field
    function onChangeHandler() {
        if (!validAge)
            setValidAge(true)
        if (errorName)
            setErrorName('')
        setName(ageInputRef.current.value)
        setIsSubmitting(false)
    }

    function getFact() {
        axiosFacts({}).then((data) => {
            console.log(data)
            const fact = data.fact;
            if (!fact)
                throw new Error('No such fact')
            setFact(fact)
        }).catch((e) => {
            setErrorName(e)
        })
    }

    function getAgeFromNameAndCache(name, controller) {
        const signal = controller.signal
        const request = {
            params: {name: name},
            signal: signal
        }
        axiosAge(request).then((data) => {
            if (data === '') // CancelError ignoring
                return
            const age = data.age;
            console.log(age)
            if (!age)
                throw new Error('No age')
            setAge(age)
            setName('')
            localStorage.setItem(name, age)
            setValidAge(true)
        }).catch((e) => {
            setErrorName(e.message)
            setValidAge(false)
        }).finally(() => {
            setIsSubmitting(false)
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

        if (checkCached(name)) {
            setAge(localStorage.getItem(name))
            toDefault()
            return
        }
        setAge('')
        if (!validate(name)) {
            setValidAge(false)
            setIsSubmitting(false)
            return
        }
        getAgeFromNameAndCache(name, abortController)
    }

    function toDefault() {
        setValidAge(true)
        ageInputRef.current.value = ''
        setIsSubmitting(false)
        setName('')
    }

    function returnAge(age) {
        if (errorName)
            return `Error: ${errorName}`
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
            </Panel>
        </AppRoot>
    );
};


export default App;

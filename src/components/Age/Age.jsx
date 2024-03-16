import React, {useEffect, useRef, useState} from 'react';
import {useAxios} from "../../hooks/useAxios";
import {Button, FormItem, Group, Header, Input} from "@vkontakte/vkui";
import {checkCached, validate} from "../../utils/Validation";

const Age = () => {

    const axiosAge = useAxios('https://api.agify.io/')

    const ref = useRef()

    const [name, setName] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [age, setAge] = useState('')

    // validation on name
    const [validAge, setValidAge] = useState(true)
    const [error, setError] = useState('')

    // axios controller
    const [controller, setController] = useState(new AbortController())

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
        setName(ref.current.value)
        setIsSubmitting(false)
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
            setError(e.message)
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
        const name = ref.current.value
        ref.current.value = ''
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
        ref.current.value = ''
        setIsSubmitting(false)
        setName('')
    }

    function returnAge(age) {
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
        <Group>
            <Header>{'SECOND TASK'}</Header>
            <form onSubmit={(event) => {
                event.preventDefault()
                getAge()
            }}>
                <FormItem
                    status={validAge ? 'valid' : 'error'}
                    bottom={returnAge(age)}
                >
                    <Input
                        type={"text"}
                        getRef={ref}
                        defaultValue={''}
                        placeholder={returnNamePlaceholder()}
                        onChange={onChangeHandler}
                    />
                </FormItem>
                <FormItem>
                    <Button type='submit' size='l' stretched>
                        SUBMIT
                    </Button>
                </FormItem>
            </form>
        </Group>
    );
};

export default Age;
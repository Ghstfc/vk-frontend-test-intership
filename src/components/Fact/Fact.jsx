import React, {useEffect, useRef, useState} from 'react';
import {useAxios} from "../../utils/useAxios";
import {Button, FormItem, Group, Header, Input} from "@vkontakte/vkui";

const Fact = () => {

    const axiosFacts = useAxios('https://catfact.ninja/fact')

    const ref = useRef()

    const [fact, setFact] = useState('')

    const [error, setError] = useState('')

    useEffect(() => {
        ref.current.value = fact
        const pos = fact.search(/[^A-Za-z]/)
        ref.current.setSelectionRange(pos, pos)
        ref.current.focus()
    }, [fact]);

    function getFact() {
        setError('')
        axiosFacts({}).then((data) => {
            const fact = data.fact;
            if (!fact)
                throw new Error('No such fact')
            setFact(fact)
        }).catch((e) => {
            setError(e.message)
        })
    }

    function getError() {
        if (error)
            return 'error'
        return 'valid'
    }

    return (
        <Group>
            <Header>{'FIRST TASK'}</Header>
            <form onSubmit={(event) => {
                event.preventDefault()
                getFact()
            }}>
                <FormItem
                    status={getError()}
                    bottom={error}
                >
                    <Input
                        type={"text"}
                        getRef={ref}
                        defaultValue={''}
                        placeholder={'Здесь будет факт про котиков'}
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

export default Fact;
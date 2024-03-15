import React from 'react';
import {Button, FormItem, Group, Header, Input} from "@vkontakte/vkui";

const Task = React.forwardRef(({
                                   title,
                                   onSubmit,
                                   defaultVal,
                                   placeholder,
                                   onChange,
                                   bottom,
                                   status
                               }, ref) => {
    return (
        <Group>
            <Header>{title}</Header>
            <form onSubmit={(event) => {
                event.preventDefault()
                onSubmit()
            }}>
                <FormItem
                    status={status}
                    bottom={bottom}
                >
                    <Input
                        type={"text"}
                        getRef={ref}
                        defaultValue={defaultVal}
                        placeholder={placeholder}
                        onChange={onChange}
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
})

export default Task;
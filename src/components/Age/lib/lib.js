function returnAge(age, error, validAge) {
    if (error)
        return `Error: ${error}`
    if (age)
        return `AGE : ${age}`
    else if (validAge)
        return ''
    return 'Имя может содержать только латинские буквы'
}

function validate(name) {
    const regex = new RegExp(/^[a-zA-Z]+$/);
    return regex.test(name);
}

function checkCached(name) {
    let data = localStorage.getItem(name)
    return !!data;
}

export {returnAge, validate, checkCached}
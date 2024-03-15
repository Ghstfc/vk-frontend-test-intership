
function validate(name) {
    const regex = new RegExp(/^[a-zA-Z]+$/);
    return regex.test(name);
}

function checkCached(name) {
    let data = localStorage.getItem(name)
    return !!data;
}

export {validate, checkCached}
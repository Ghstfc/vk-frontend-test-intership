
import axios, {CanceledError} from "axios";

export const useAxios = (link) => {

    function get(params) {
        return new Promise((resolve, reject) => {
            axios.get(link, params).then(response => {
                if (response.status !== 200)
                    throw new Error('Bad response from server')
                if (!response.data)
                    throw new Error('No data in response')
                resolve(response.data)
            }).catch((e) => {
                if (!(e instanceof CanceledError)) {
                    reject(e)
                }
                resolve('')
            })
        })
    }

    return get

}
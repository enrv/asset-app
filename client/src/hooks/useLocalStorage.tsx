import { useState } from 'react'

const useLocalStorage = (key: string, initial) => {
    const get = () => {
        const storage = localStorage.getItem(key)
        if (storage) {
            return JSON.parse(storage)
        } else {
            return initial
        }
    }

    const [value, setValue] = useState(get());

    const set = (newValue) => {
        localStorage.setItem(key, JSON.stringify(newValue))
        setValue(newValue)
    }

    return [value, set]
}

export { useLocalStorage }
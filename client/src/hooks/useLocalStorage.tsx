import { useState } from 'react'
import { UserInfo } from './useAuth'

const useLocalStorage = (key: string, initial: UserInfo) => {
    const get = () => {
        const storage = localStorage.getItem(key)
        if (storage) {
            return JSON.parse(storage)
        } else {
            return initial
        }
    }

    const [value, setValue] = useState(get());

    const set = (newValue: UserInfo) => {
        localStorage.setItem(key, JSON.stringify(newValue))
        setValue(newValue)
    }

    return [value, set]
}

export { useLocalStorage }
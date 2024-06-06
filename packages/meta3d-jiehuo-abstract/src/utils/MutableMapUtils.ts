import { isNullable } from "./NullableUtils"

export let create = () => {
    return {}
}

export let has = (map, key) => {
    return !isNullable(get(map, key))
}

export let get = (map, key) => {
    return map[key]
}

export let set = (map, key, value) => {
    map[key] = value

    return map
}
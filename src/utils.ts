export function winPath(path: string) {
    const isExtendedLengthPath = /^\\\\\?\\/.test(path);
    if (isExtendedLengthPath) {
        return path;
    }

    return path.replace(/\\/g, "/");
}

interface SelectPropertyObj {
    [key: string]: any;
}
export function selectProperty(object: SelectPropertyObj, filterKey: (key: string) => boolean): SelectPropertyObj {
    return Object.keys(object)
        .filter(filterKey)
        .reduce((pre, next) => {
            pre[next] = object[next];
            return pre;
        }, {} as SelectPropertyObj);
}

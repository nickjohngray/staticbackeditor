export const fieldsOk = (...fields: string[]): boolean => {
    const ok = fields.every((field) => field !== '')
    console.log('ok=' + ok)
    return ok
}

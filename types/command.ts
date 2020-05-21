export type commandInfo = {
    name: string,
    desc: string
}

export type commandBase = {
    info: commandInfo,
    help: () => void,
    run: (args: any, force?: boolean, perms?: any) => void
}

export type dispatcherArgs = {
    cmd: string,
    help: boolean,
    force: boolean,
    args: any,
    perms?: any
}
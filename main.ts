import { parse } from "https://deno.land/std/flags/mod.ts";
import { dispatcher, helper } from "./dispatcher.ts";

const { args } = Deno;

const checkVersion = async () => {
    await dispatcher({
        cmd: 'upgrade',
        help: false,
        force: false,
        args: {silence: true}
    });
}

(async ({
    _,
    version, v,
    help, h,
    force, f,
    ...perms
}) => {

    if ((help || h) && _.length == 0)
        return helper();

    if (version || v)
        return dispatcher({
            cmd: 'version',
            help: false,
            force: false,
            args: {raw: version || v}
        });
        
    if(_[0] != "upgrade")
        await checkVersion();

    if(_.length === 0)
        return helper();
    
    return dispatcher({
        cmd: _[0],
        help: help || h,
        force: force || f,
        args: _,
        perms: perms
    });

})(parse(args) as any)
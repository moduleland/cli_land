import { green, yellow, red } from "https://deno.land/std/fmt/colors.ts";
import { commandBase } from "./../types/command.ts";
import { moduleRegex } from "./../RegexUtils.ts";
import API from "./../API.ts";
import { updateModule, getModules, saveFile } from "./../ModuleUtils.ts";


const _getParams = (args: string): {  user: string, module: string } => {
    const paramsArgs: any = moduleRegex.exec(args);
    const [full, u, m, v, _u, _m] = paramsArgs;
    const user = u || _u;
    const module = m || _m;
    // const version = v || "";

    return { user, module };
}

const _update = async (modules: any, oldAlias: string, apiData: any) => {
    const res = await updateModule(oldAlias, apiData.alias);
    if(!res) return false;

    delete modules.imports[oldAlias];
    modules.imports[apiData.alias] = apiData.url;

    return modules;
}

const _save = async (modules: any, msg: string) => {
    try {
        await saveFile(JSON.stringify(modules, null, 4));
        console.log(green(msg));
    } catch (e) {
        console.error('Something went extremely wrong...')
    }
}

const error = () => console.error(red("Something went wrong..."));

const update: commandBase = {
    info: {
        name: "update",
        desc: "Update modules from project."
    },

    help: () => {
        console.log(yellow(`update help`))
    },

    run: async (args: any) => {

        let modules = await getModules();

        if(!args[1]) {
            const _modules = modules.imports;
                        
            for(const modAlias in _modules) {

                if(!moduleRegex.test(modAlias)) 
                    return error();
                
                const { user, module } = _getParams(modAlias);

                const apiData = await API({user, module, version: ""});
                if(!apiData) return error();

                if(!apiData.error && apiData.alias != modAlias) {
                    modules = await _update(modules, modAlias, apiData);
                    if(modules) console.log(green(`Module ${modAlias} updated to ${apiData.alias}.`));
                    else error();
                }                
            }

            return _save(modules, `All modules updated.`);
        }

        if(!moduleRegex.test(args[1])) 
            return error();
                
        const { user, module } = _getParams(args[1]);

        const oldAlias = Object.keys(modules.imports).find(m => m.split("@")[0] == `${user}/${module}`);
        if(!oldAlias)
            return console.log(yellow(`Module ${user}/${module} not found on project.`));

        const apiData = await API({user, module, version: ""});
        if(!apiData) return error();
        if(apiData.error) return console.log(red(apiData.error_message));

        if(apiData.alias === oldAlias)
            return console.log(green(`Module ${oldAlias} is up to date.`));

        modules = await _update(modules, oldAlias, apiData);
        if(!modules) error();

        _save(modules, `Module ${oldAlias} updated to ${apiData.alias}.`);
    }
}


export default update;
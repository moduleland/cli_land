import { green, red, yellow } from "https://deno.land/std/fmt/colors.ts";
import { commandBase } from "./../types/command.ts";
import API from "./../API.ts";
import { getModules, saveFile } from "./../ModuleUtils.ts";
import { moduleRegex } from "./../RegexUtils.ts";


const add: commandBase = {
    
    info: {
        name: "add",
        desc: "Add module to project"
    },

    help: () => {
        return console.log(yellow('TODO: help add with all cases'));
    },

    run: async (args: any) => {
        
        const error = () => console.error(red("Something went wrong..."));

        if(!moduleRegex.test(args[1])) 
            return error();

        const paramsArgs: any = moduleRegex.exec(args[1]);
        const [full, u, m, v, _u, _m] = paramsArgs;

        const user = u || _u;
        const module = m || _m;
        const version = v || "";

        const modules = await getModules();
        if(!modules) return error();

        const res = await API({user, module, version, extra: args[2]});
        if(!res) return error();
        if(res.error) return console.log(red(res.error_message))
        
        if(modules.imports[res.alias])
            return console.log(yellow(`Module ${full} already added to project.`));

        modules.imports[res.alias] = res.url;

        try {
            await saveFile(JSON.stringify(modules, null, 4));

            console.log(green(`Module ${res.alias} added to project successfully.`))
        } catch (e) {
            console.error('Something went extremely wrong...')
        }
    }
}

export default add;
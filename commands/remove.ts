import { green, red, yellow } from "https://deno.land/std/fmt/colors.ts";
import { commandBase } from "./../types/command.ts";
import { getModules, saveFile } from "./../ModuleUtils.ts";
import { moduleRegex } from "./../RegexUtils.ts";


const remove: commandBase = {
    
    info: {
        name: "remove",
        desc: "Remove module from project"
    },

    help: () => {
        return console.log(yellow('TODO: help remove with all cases'));
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

        const alias = Object.keys(modules.imports).find(name => name.indexOf(`${user}/${module}`) === 0);

        if(!alias)
            return console.log(yellow(`Module ${full} not found on project.`));

        delete modules.imports[alias];

        try {
            await saveFile(JSON.stringify(modules, null, 4));
            console.log(green(`Module ${alias} removed from project successfully.`))
        } catch (e) {
            console.error('Something went extremely wrong...')
        }
    }
}

export default remove;
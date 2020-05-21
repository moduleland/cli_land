import { commandBase } from "./../types/command.ts";
import { green, yellow} from "https://deno.land/std/fmt/colors.ts";
import { config } from "./../config.ts";

const version: commandBase = {
    
    info: {
        name: "version",
        desc: "Returns land version"
    },

    help: () => {
        return console.log(yellow(`version help`))
    },

    run: (args: any) => {
        const version = config.version;
        const raw = args.raw;
        
        if(raw === 'raw') return console.log(version);
        console.log(green(`version ${version}`))
    }
}

export default version;
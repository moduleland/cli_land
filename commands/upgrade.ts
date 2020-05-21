import { commandBase } from "./../types/command.ts";
import { green, yellow } from "https://deno.land/std/fmt/colors.ts";
import { config } from "./../config.ts";

const cliUrl = "https://module.land/cli/land.js";

const denoRun = async (...args: string[]) => 
    Deno.run({
        cmd: args,
        stdout: 'piped',
        stderr: 'piped'
    });
    
const getText = (int8Array: Uint8Array) => new TextDecoder().decode(int8Array);

const upgrade: commandBase = {
    
    info: {
        name: "upgrade",
        desc: "Upgrade land cli"
    },

    help: () => {
        return console.log(yellow(`upgrade help`))
    },

    run: async (args: any, force?: boolean) => {
        const error = () => console.error("Something went wrong...");

        try {
            const newVersionProcess = await denoRun('deno', 'run', '-A', '--reload', cliUrl, '-v', 'raw')
            const newVersion = getText(await newVersionProcess.output()).replace(/(\r\n|\n|\r)/gm, '');
            
            if(newVersion.length === 0) return error();

            const oVArr = config.version.split('.').map((e: string) => parseInt(e));
            const nVArr = newVersion.split('.').map((e: string) => parseInt(e));

            if(!force && oVArr[0] >= nVArr[0] && oVArr[1] >= nVArr[1] && oVArr[2] >= nVArr[2])
                return args.silence || console.log(green('Your land is up to date!'));
            
            const upgradeProcess = await denoRun('deno', 'install', '-A', '-f', cliUrl);
            if(getText(await upgradeProcess.output()).length === 0) return error();
        
            console.log(green(`Your land is now updated to version ${newVersion}!`));
            console.log(green(`Now you see more...`));
            return;

        } catch(e) {}

        return error();
    }
}

export default upgrade;
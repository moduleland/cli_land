import { yellow, red } from "https://deno.land/std/fmt/colors.ts";
import { commandBase } from "./../types/command.ts";
import { config } from "./../config.ts";
import { mayusRegex } from "./../RegexUtils.ts";

const existsFile = (filename: string) => {
    try {
        const file = Deno.statSync(filename);
        return file.isFile;
    } catch(e) {
        return false;
    }
}

const run: commandBase = {
    info: {
        name: "run",
        desc: "Run project with land."
    },

    help: () => {
        console.log(yellow(`run help`))
    },

    run: async (args: any, force:any, perms: any) => {

        if(perms.importmap)
            return console.log(red(`Cannot add importmap file.`));

        let runner = Object.values(perms)[Object.values(perms).length - 1] || args[1];
        
        if(!runner) {
            const mainRunners = ["main.ts", "index.ts", "main.js", "index.js"].filter((f) => existsFile(f));
            
            if(mainRunners.length === 0)
                return console.log(red(`Cannot find runner file.`));

            runner = mainRunners[0];
        }

        if(args.length > 2)
            args.splice(0, 2);

        try {
            const process = Deno.run({
                cmd: [
                    'deno',
                    'run',
                    '--unstable',
                    '--importmap',
                    config.moduleFile,
                    ...Object.keys(perms).map(p => mayusRegex.test(p) ? `-${p}` : `--${p}`),
                    runner,
                    ...args
                ]
            });

            const { code } = await process.status();
            Deno.exit(code);

        } catch (e) {
            if (e instanceof Deno.errors.NotFound) {
                return console.log(red(`Couldn't find file in "${Deno.cwd()}"`));
            } else if (e instanceof Deno.errors.PermissionDenied) {
                return console.log(red(`
                  Please reinstall land with the correct pemissions
                  deno install -A -f https://module.land/cli/land.js
                `));
            }

            return console.log(red(e.message));
        }
    }
}


export default run;
import { dispatcherArgs } from './types/command.ts';
// import exampleCmd from './commands/example.ts';
import upgradeCmd from './commands/upgrade.ts';
import versionCmd from './commands/version.ts';
import addCmd from './commands/add.ts';
import removeCmd from './commands/remove.ts';
import updateCmd from './commands/update.ts';
import runCmd from './commands/run.ts';

const commands = [
    addCmd,
    updateCmd,
    removeCmd,
    runCmd,
    upgradeCmd,
    versionCmd
    // exampleCmd,
];

export const dispatcher = (args: dispatcherArgs) => {
    
    const cmd = commands.find(cmd => cmd.info.name == args.cmd);
    if(args.help)
        return cmd?.help();
        
    return cmd?.run(args.args, args.force, args.perms);
}


export const helper = () => console.table(commands.map(cmd => cmd.info));
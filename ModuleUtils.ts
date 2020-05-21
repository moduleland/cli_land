import { config } from "./config.ts";
import { filesRegex } from "./RegexUtils.ts";

const decoder = new TextDecoder("utf-8");
const encoder = new TextEncoder();

export const getModules = async () => {
    try {
        const file = await Deno.readFile(config.moduleFile);
        return JSON.parse(decoder.decode(file));
    } catch (e) {
        return { imports: {} };
    }
}

export const saveFile = async (modules: string) => {
    try {
        const data = encoder.encode(modules);
        await Deno.writeFile(config.moduleFile, data);
    } catch (e) {
    }    
}

export const updateModule = async (oldAlias: string, newAlias: string) => {
    console.log(`Updating module ${oldAlias} to ${newAlias}`);
    return await processFiles(Deno.cwd(), oldAlias, newAlias); 
}

const processFiles = async (path: string, oldAlias: string, newAlias: string) => {
    const files = Deno.readDirSync(path);

    for(const file of files) {
        if(file.isDirectory)
            processFiles(`${path}/${file.name}`, oldAlias, newAlias);

        if(filesRegex.test(file.name)){
            const res = await updateFile(`${path}/${file.name}`, oldAlias, newAlias);
            if(!res) return false;
        }
    }

    return true;
}

const getRegex = (alias: string): RegExp => {
    // const patt1 = `import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:"(`;
    // const patt2 = `).*?")|(?:'(`;
    // const patt3 = ").*?')|(?:`(";
    // const patt4 = ").*?`))[\s]*?(?:;|$|)";

    // const regex =  `${patt1}${alias}${patt2}${alias}${patt3}${alias}${patt4}`;
    
    return new RegExp(alias, 'g');
}

const updateFile = async(path: string, oldAlias: string, newAlias: string) => {

    try {
        const file = await Deno.readFile(path);
        const dataFile = decoder.decode(file);

        const newDataFile = dataFile.replace(getRegex(oldAlias), newAlias);
        const data = encoder.encode(newDataFile);
        await Deno.writeFile(path, data);
        
        return true;

    } catch (e) {
        // console.log(e);
    }

    return false;
}
import { green, yellow } from "https://deno.land/std/fmt/colors.ts";
import { commandBase } from "./../types/command.ts";

const example: commandBase = {
    info: {
        name: "example",
        desc: "example description"
    },

    help: () => {
        console.log(yellow(`example help`))
    },

    run: (args: any) => {
        console.log(green(`example args: ${args[1]} ${args[2]}`))
    }
}


export default example;
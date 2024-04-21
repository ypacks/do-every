import { world } from "@minecraft/server"
import { doevery, stopevery, listevery } from "./funcs"

world.afterEvents.chatSend.subscribe((arg) => {
    // !doevery name time
    // !de name time
    const p = arg.sender;
    if (!p.isOp) return;

    const message = arg.message
    if (!/^\W/.test(message)) return; // This allows use for any prefix to be used. Any character that isnt 0-9 a-z A-Z works.

    switch (message.substring(1).split(" ")[0].toLowerCase()) { // check first param
        case "de":
        case "doevery":
        case "startevery":
        case "sev":
            doevery(p, message.substring(1));
            break;
        case "stopevery":
        case "se":
        case "endevery":
        case "ee":
            stopevery(p, message.substring(1))
            break;
        case "listevery":
        case "le":
        case "list":
        case "listtasks":
        case "l":
        case "lt":
            listevery(p)
            break;
    }
})
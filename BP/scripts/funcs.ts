import { Player, system, world, ChatSendBeforeEvent } from "@minecraft/server"

let ints: {
    [key: string]: {
        num: number,
        exec: string
    }
} = {}
let timeout = 20
let run: number;
let event: (arg: ChatSendBeforeEvent) => void;

function error(p: Player, msg: string) {
    p.sendMessage("§3" + msg);
}

function secondsToTicks(num: number): number {
    return num * 20
}

let re;
const r = {
    s: (func: () => void) => {
        re = system.runInterval(func, secondsToTicks(4));
    },
    c: () => {
        re = system.clearRun(re);
    }
}

function doevery(p: Player, msg: string) {
    const [, name, t] = msg.split(" ");
    console.warn(t)
    console.warn(msg)
    const time = parseInt(t);

    if (isNaN(time)) {
        error(p, "The time must be a valid number! (In seconds)")
        return;
    }
    let executable: string;
    let cont = false

    p.sendMessage(`Send the chat command you want to execute every ${t} seconds. (Without the slash (/) )`)

    event = world.afterEvents.chatSend.subscribe((a) => {
        if (a.sender != p) return;
        if (/^\W/.test(a.message)) {
            error(p, `Command contained (${a.message[0]}) at the start, so it was ignored. Try again big dawg.`)
        }

        executable = a.message
        system.clearRun(run)
        cont = true
        world.afterEvents.chatSend.unsubscribe(event);
    })

    let shouldStop = false;

    // user took too long to respond, so remove event, maybe use [current < current + (timeout * 1000)] for calc
    r.s(() => {
        if (cont == false) {
            if (run == undefined) {
                run = system.runTimeout(() => {
                    error(p, "You took too long to respond. The command subscription has been canceled.");
                    world.afterEvents.chatSend.unsubscribe(event);
                    shouldStop = true; // Set the flag variable to indicate that the function should stop.
                    cont = true;
                    return;
                }, secondsToTicks(timeout));
            }
        } else {

            world.afterEvents.chatSend.unsubscribe(event);


            if (shouldStop) return;

            // Rest of doevery code, finally.

            ints[name] = {
                num: system.runInterval(() => {
                    let count: number = 0;
                    try {
                        p.runCommand(executable)
                    } catch (err) {
                        count++
                        if (count > 5) {
                            delete ints[name]
                            error(p, `Task with the name (${name}) has failed more than 5 times. Execution has automatically been stopped and task has been cleared.`)
                        }
                    }
                }, secondsToTicks(time)),
                exec: executable
            }

            r.c();

            p.sendMessage(`Task with the name (${name}) has been added!`)
        }
    })
}

function stopevery(p: Player, msg: string) {
    const [, name] = msg.split(" ");
    if (!(name in ints)) {
        error(p, `Task with the name (${name}) does not exist.`);
        return;
    }

    delete ints[name];
    p.sendMessage("Task has successfully been cleared!")
}

function listevery(p: Player) {
    const intervalList = Object.keys(ints).map(name => `§lTask Name: §r§o${name} | §lExecutable: §r§o${ints[name].exec}`);

    if (intervalList.length == 0) {
        p.sendMessage("No intervals have been set. yet.")
    } else {
        for (const i of intervalList) {
            p.sendMessage(i)
        }
    }

}

export { doevery, stopevery, listevery }
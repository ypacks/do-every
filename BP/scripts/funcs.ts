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


export const help = {
    func: (p: Player) => {
        const msg = [doevery, stopevery, listevery].map(func => {
            return func(true)
        })
        p.sendMessage(msg.join("\n"))
    }
}

export function doevery(help: boolean, p?: Player, msg?: string) {
    // !doevery (Task name) (Amount of time in seconds)
    const helpString = "§o§2!doevery [Task Name] [Amount in seconds]"
    if (help) {
        return helpString + " | Create a new task with the given name and runs every [Amount in seconds]"
    }
    const [, name, t] = msg.split(" ");
    if (!name) {
        error(p, "Enter the task name. \n" + helpString)
        return
    }
    if (Object.keys(ints).filter(n => n == name).length !== 0) {
        error(p, `A task with the name §o${name}§r already exists!`)
        return
    }
    console.error(name)
    console.error(t)
    const time = parseInt(t);

    if (isNaN(time)) {
        error(p, "The time must be a valid number! (In seconds)" + "\n" + helpString)
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

            p.sendMessage(`Task with the name (${name}) has been added! (Tasks reset when the world is left)`)
        }
    })
}

export function stopevery(help: boolean, p?: Player, msg?: string) {
    // !stopevery (Task name)
    const helpString = "§o§2!stopevery [Task Name]"
    if (help) {
        return helpString + " | Stops the given task."
    }
    const [, name] = msg.split(" ");
    if (!(name in ints)) {
        error(p, `Task with the name (${name}) does not exist.` + "\n" + helpString);
        return;
    }

    system.clearRun(ints[name].num)
    delete ints[name];
    p.sendMessage("Task has successfully been cleared!")
}

export function listevery(help: boolean, p?: Player) {
    // !listevery
    const helpString = "§o§2!listevery"
    if (help) {
        return helpString + " | Lists every task that's active."
    }
    const intervalList = Object.keys(ints).map(
        name => `§lTask Name: §r§o${name}§r | §lExecutable: §r§o/${ints[name].exec}`
    );

    if (intervalList.length == 0) {
        p.sendMessage("No tasks have been set. yet.")
    } else {
        for (const i of intervalList) {
            p.sendMessage(i)
        }
    }

}

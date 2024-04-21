# doevery!

### A Minecraft Bedrock Edition Script Addon which allows execution of commands every (x) amount of seconds!

> [!IMPORTANT] > **In order for the mod to addon to work, you need to Enable _Beta APIs_ in Experimental Gameplay.**

> [!NOTE] > **There is no specific command prefix, anything that isnt a letter or number (or /), can be a prefix to use. (It has to be an alhpanumeric character)**

## Commands

-   **[doevery](#doevery-1)**
-   **[stopevery](#stopevery)**
-   **[listevery](#listevery)**

### `doevery`

Execute a task (command) every `x` amount of seconds

_Aliases: `de`, `startevery`, `sev`_

Usage:

```bf
!doevery (Task name) (Amount of time in seconds)
```

After using, you will asked to send the command to be executed, make sure the command does NOT have a / or else, the script will ignore it.

Example:

```bf
!doevery lightning 20
```

```bmx
Send the chat command you want to execute every 20 seconds. (Without the slash (/) )
```

```bf
execute at @s run summon lightning_bolt ~ ~ ~
```

```bmx
Task with the name (lightning) has been added!
```

#### Possible Errors

When waiting for a command to execute, if you do not say anything in 20 seconds, it will stop execution.

Of course type it out correctly.

### `stopevery`

Stop task execution.

_Aliases: `se`, `endevery`, `ee`_

Usage:

```bf
!stopevery (Task name)
```

Example:

```bf
!stopevery lightning
```

```bmx
Task has successfully been cleared!
```

### `listevery`

List all the Tasks

_Aliases: `le`, `list`, `l`, `listtasks`, `lt`_

Usage:

```bf
!listevery
```

```bmx
(Tasks)
```

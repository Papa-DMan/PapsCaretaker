# PapsCaretaker
My Personal Discord Bot

discord.js documentation: https://discord.js.org/

files in the command folder should have the following modules:
```
.name : string
.description : string (MAX 100 char)
.usage : string
.execute() : function, parameters currently sent are (message: Message, args : string[])
.interact() : function, parameters currently sent are (interaction: ChatInputCommandInteraction<CacheType>)
?.__internal_is_music
?.__internal_requires_directory : bool
?.__internal_setdir() : function -> should update a global string varaible that holds the directory path. Default is "."
```

files in the registers folder should have the following modules:
```
.name : string
.description : string
.execute : function
```
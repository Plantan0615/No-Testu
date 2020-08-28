const Discord = require("discord.js")
var TreeModel = require('tree-model');

module.exports.help = {
  name: "rpg",
  category: "rpg",
  usage: "",
  description: "Type this to play the story as a variety of chracters."
}

module.exports.run = async(client, message, args) => {
  const categoryPrepare = client.sql.prepare("SELECT DISTINCT category FROM rpg")
  const categories = categoryPrepare.all()

  const catMap = categories.map(v => v.category)
  if (!catMap.includes(args.join(" "))) {
    let msg = await message.channel.send(`Missing Category\n: ${categories.map(v => `-> ${v.category}`).join("\n")}`)
    await message.delete({timeout: 3000})
    return
  }
  const choice = args.join(" ").trim()

  const categoryLst = categories.map(v => v.category.toLowerCase())

  if (categoryLst.includes(choice)) {
    // valid choice
    const generateEmbed = (title, desc, color, fields = [], oldEmbed = null) => {
      const embed = oldEmbed != null ? new Discord.MessageEmbed(oldEmbed) : new Discord.MessageEmbed()
      embed.setTitle(title)
      embed.setDescription(desc)
      embed.setColor(color)
      if (embed.fields.length >= 1) {
        embed.fields = []
      }
      if (fields.length != 0) {
        embed.addFields(fields)
      }
      return embed
    }

    async function GameHandler(reactions, game, mess, userId) {
      let options = reactions

      function getKeyByValue(input, value) {
        return Object.keys(input).find(key => input[key] === value)
      }

      function filterReact(reaction, user) { 
        if (user.bot) return; 
        return ["🅰️", '🅱️'].includes(reaction.emoji.name) && user.id === userId;
      }

      async function createReaction(reactLst, msg) {
        let emojiLst = Object.keys(reactLst)
        for (let i = 0; i < emojiLst.length; i++) {
          await msg.react(reactLst[emojiLst[i]])
        }
      }

      if (!game.isFinal()) {
        await createReaction(options, mess)
      }

      let skip = false

      if (game.isFinal()) {
        skip = true
      }

      let hasError = false

      let reactCollector = null
      if (!skip) {
        reactCollector = await mess.awaitReactions(filterReact, {max: 1, timeout: 10000}).catch(e => {
          hasError = true
        })
      }

      let choices = {}

      async function optA() {
        await game.getChoiceA()
        return game.getCurrentNode()
      }
      async function optB() {
        await game.getChoiceB()
        return game.getCurrentNode()
      }

      choices.a = optA
      choices.b = optB

      let emojiReact = null
      if (!skip) {
        emojiReact = reactCollector.first()
        if (emojiReact == undefined) {
          await mess.reactions.removeAll()
          return null
        }
      }

      let reactResponse = null
      if (!skip) {
        reactResponse = {
          data: emojiReact,
          emoji: emojiReact.emoji,
          emojiConvert: getKeyByValue(options, emojiReact.emoji.name)
        }
      }

      let result = null
      if (!skip) {
        result = await choices[reactResponse.emojiConvert]()
      }

      if (skip) {
        result = []
      }

      if (result == null) {
        await mess.reactions.removeAll()
        return result
      }

      let oldEmbed = mess.embeds[0]

      const newEmbed = generateEmbed(Game.getTitle(), Game.getDescription(), "#e0115b", Game.getFields(), oldEmbed)

      await mess.edit({embed: newEmbed})

      if (skip) {
        await mess.reactions.removeAll()
        return result
      }
      const userReactions = mess.reactions.cache.filter(react => {
        return react.users.cache.has(userId)
      })

      const userReact = userReactions.first()
      if (userReact != undefined) {
        await userReact.users.remove(userId)
      } else {
        await mess.reactions.removeAll()
      }

      return await GameHandler(options, game, mess, userId)
    }

    const TreeData = client.rpg[choice]

    const Tree = new TreeModel()
    
    const root = Tree.parse(TreeData)
    
    const Game = new TreeNavigation(root)

    const getCurrent = await Game.getCurrentNode()

    let msg = await message.channel.send(generateEmbed(Game.getTitle(), Game.getDescription(), "#e0115b", Game.getFields()))
    
    let reacts = {
      a: "🅰️",
      b: "🅱️"
    }
    await GameHandler(reacts, Game, msg, message.author.id)
  } else {
    let msg = await message.channel.send(`Missing Category\n: ${categories.map(v => `-> ${v.category}`).join("\n")}\nYou chose: **${choice}**`)
    await message.delete({timeout: 3000})
    return
  }
}

class TreeNavigation {
  constructor(tree) {
    this.current = 1
    this.content = null
    this.index = 0
    this.choice = -1
    this.selected = null
    this.tree = tree
    this.previous = -1
  }

  isFinal = () => {
    return this.getModel().data.final
  }

  getCount() {
    return this.current
  }

  getTitle() {
    return (this.isFinal() ? `Final Outcome` : `Decision ${this.getCount()}`)
  }

  getDescription() {
    return this.getData().scenario
  }

  getData() {
    return this.getModel().data
  }

  getChoiceA() {
    if (!this.isFinal()) {
      this.choice = 0
      this.current++
      if (this.getModel().children.length == 2) {
        this.selected = this.getModel().children[0]
        this.previous = this.index
        this.index = this.selected.id
        return this.getModel().children[0]
      }
    }
    return null
  }
  getChoiceB() {
    if(!this.isFinal()) {
      this.choice = 1
      this.current++
      if (this.getModel().children.length == 2) {
        this.selected = this.getModel().children[1]
        this.previous = this.index
        this.index = this.selected.id
        return this.getModel().children[1]
      }
    }
  }

  getModel() {
    return this.content.model
  }

  capitalize(input) {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }

  getFields() {
    if (this.content == null) {
      return []
    } else {
      let result = []

      let keys = Object.keys(this.getModel().data)
      let fields = ["question", "left", "right"]
      for( let i = 0; i < keys.length; i++) {
        let key = keys[i]
        const oKey = key
        if (fields.includes(key.toLowerCase())) {
          if (key == "left") {
            key = "Option A"
          }
          if (key == "right") {
            key = "Option B"
          }
          const value = this.getModel().data[oKey]
          if (value.trim().length != 0) {
            result.push({name: this.capitalize(key), value: this.getModel().data[oKey]})
          }
        }
      }

      return result;
    }
  }

  getFirstNode() {
    return new Promise((resolve) => {
      let result = this.tree.first({strategy: "breadth"}, (node) => {
        return node.isRoot()
      })
      resolve(result)
    })
  }

  getIndex() {
    return this.index
  }

  getNode() {
    return new Promise((resolve, reject) => {
      let result = this.tree.first({strategy: "breadth"}, (node) => {
        return node.model.id == this.getIndex()
      })
      resolve(result)
    })
  }

  async getCurrentNode() {
    if (this.content == null) {
      this.content = await this.getFirstNode()
      return this.content
    } else {
      if (this.selected == this.previous) {
        return await this.getNode()
      } else {
        return await this.next()
      }
    }
  }

  isNodeFinal(input) {
    return input.model.data.final
  }

  async next() {
    let node = await this.getNode()
    if (!this.isNodeFinal(node)) {
      this.content = node
    } else {
      this.content = node
    }
    this.selected = null
    return this.content
  }
}

module.exports.help = {
  name: "rpg",
  category: "fun",
  usage: "Template: PREFIXrpg character\nExamples: PREFIXrpg teenager\nPREFIXrpg hunter\nPREFIXrpg business man\nPREFIXrpg detective",
  short: `Type 'PREFIXhelp rpg' for more info`,
  description: [
    {name: "~rpg teenager", value: "Type this command to play the story as a female teenager."},
    {name: "~rpg hunter", value: "Type this command to play the story as a male (adult) hunter."},
    {name: "~rpg business man", value: "Type this command to play the story as a male (adult) business man."},
    {name: "~rpg detective", value: "Type this command to play the story as a female (adult) detective."}
  ]
}
module.exports.h2p = {
  instructions: "Simply type one of the above commands, and I will send a message. Wait for me to react to the message with A and B, then make your decision (by selecting either A or B), at which point I will edit the message. After 4 decisions you will know the outcome of the story."
}

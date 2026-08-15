// Minecraft Bedrock WebSocket OS Bridge
// Connects Minecraft in-game events directly to Windows OS native actions (Launching Roblox, Time Sync, HUD)
const { WebSocketServer } = require('ws');
const { exec } = require('child_process');
const crypto = require('crypto');

class MinecraftBedrockBridge {
  constructor(port = 19134) {
    this.port = port;
    this.wss = null;
    this.activeClient = null;
  }

  start() {
    try {
      this.wss = new WebSocketServer({ port: this.port });
      console.log(`[Minecraft OS Bridge] Listening for Minecraft Bedrock connections on ws://localhost:${this.port}`);

      this.wss.on('connection', (ws) => {
        console.log('[Minecraft OS Bridge] 🎮 Minecraft Bedrock Client Connected!');
        this.activeClient = ws;

        // Subscribe to Player Messages and Chat Events
        this._subscribeEvent(ws, 'PlayerMessage');

        // Welcome player in-game
        this.sendCommand(ws, 'title @a subtitle §fConnected to Computer Shop OS Hub');
        this.sendCommand(ws, 'title @a title §e§l⚡ SHOP OS ACTIVE ⚡');
        this.sendCommand(ws, 'playsound random.levelup @a');

        ws.on('message', (data) => {
          this._handleMessage(ws, data);
        });

        ws.on('close', () => {
          console.log('[Minecraft OS Bridge] Minecraft Client Disconnected.');
          if (this.activeClient === ws) this.activeClient = null;
        });

        ws.on('error', (err) => {
          console.error('[Minecraft OS Bridge] WebSocket Error:', err.message);
        });
      });
    } catch (e) {
      console.error('[Minecraft OS Bridge] Failed to start WebSocket server:', e.message);
    }
  }

  _subscribeEvent(ws, eventName) {
    const packet = {
      header: {
        version: 1,
        requestId: crypto.randomUUID(),
        messageType: 'commandRequest',
        messagePurpose: 'subscribe'
      },
      body: {
        eventName: eventName
      }
    };
    if (ws.readyState === 1) {
      ws.send(JSON.stringify(packet));
    }
  }

  sendCommand(ws, commandLine) {
    const client = ws || this.activeClient;
    if (!client || client.readyState !== 1) return;

    const packet = {
      header: {
        version: 1,
        requestId: crypto.randomUUID(),
        messageType: 'commandRequest',
        messagePurpose: 'commandRequest'
      },
      body: {
        version: 1,
        commandLine: commandLine,
        origin: {
          type: 'player'
        }
      }
    };
    client.send(JSON.stringify(packet));
  }

  _handleMessage(ws, rawData) {
    try {
      const msg = JSON.parse(rawData.toString());

      // Check for PlayerMessage Event (Chat trigger or Command block output)
      if (msg.header && msg.header.eventName === 'PlayerMessage') {
        const text = (msg.body && msg.body.message) ? msg.body.message.trim().toLowerCase() : '';
        const sender = msg.body ? msg.body.sender : 'Player';

        console.log(`[Minecraft OS Bridge] In-game message from ${sender}: "${text}"`);

        if (text.includes('roblox') || text.includes('[action_roblox]') || text === '!roblox') {
          this._triggerRobloxLaunch(ws, sender);
        } else if (text.includes('youtube') || text.includes('[action_youtube]') || text === '!youtube') {
          this._triggerYouTube(ws, sender);
        } else if (text === '!help' || text === '!menu') {
          this.sendCommand(ws, 'tellraw @a {"rawtext":[{"text":"§e--- Computer Shop OS Hub Commands ---\\n§b!roblox §7- Launch Roblox\\n§c!youtube §7- Open YouTube\\n§a!time §7- Check remaining playtime"}]}');
        }
      }
    } catch (e) {
      // Ignored malformed packets
    }
  }

  _triggerRobloxLaunch(ws, sender) {
    console.log(`[Minecraft OS Bridge] 🚀 Launching Roblox triggered by ${sender} in Minecraft!`);

    // In-game HUD Feedback
    this.sendCommand(ws, 'title @a subtitle §bLaunching official Roblox client on your PC...');
    this.sendCommand(ws, 'title @a title §a§l🚀 LAUNCHING ROBLOX 🚀');
    this.sendCommand(ws, 'playsound random.explode @a ~ ~ ~ 0.5 1.5');

    // Windows Native Launch
    exec('cmd.exe /c start "" "roblox://"', (err) => {
      if (err) {
        exec('powershell -Command "Start-Process \'roblox://\'"');
      }
    });
  }

  _triggerYouTube(ws, sender) {
    console.log(`[Minecraft OS Bridge] ▶️ Opening YouTube triggered by ${sender} in Minecraft!`);
    this.sendCommand(ws, 'title @a title §c§l▶ OPENING YOUTUBE ▶');
    exec('cmd.exe /c start "" "https://youtube.com"');
  }
}

module.exports = { MinecraftBedrockBridge };

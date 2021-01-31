![alt text](images/logo.jpg?raw=true)

It become quite common to show the audience comments during a live stream. However, there were not so many good ways to do that. At least, until the Audience Display.

It works in two parts: a server app and an extension for chrome.

## Server App

It will run a command line that will open a port on the computer. In case you want to do some changes, you can verify the config file:

```json
{
  "Urls": "http://localhost:40000",
  "ColorConfiguration": {
    "Author": {
      "Background": "#000144",
      "Border": "#000144",
      "Text": "#fff"
    },
    "Picture": {
      "Border": "#fff"
    },
    "Comment": {
      "Background": "#000084",
      "Text": "#fff"
    }
  }
}
```
You can change both the port and the colors using this file and just run the server again.

## Chrome Extension

After install it, open the live chat on a pop up, copy the address and then open the link on a normal chrome tab. Click on the extension button on the chrome bar and select an comment to send, clicking with the right button on it and selecting the "Send to Audience Display".

In case you changed the address/port for the Server App, please, go to options and configure the correct address.

## Running on Docker

You can run the Audience Display in docker. However, per default, you will have problems if you try to run it outside localhost without HTTPS valid certificate. To run it, you can use direct from the hub.docker.com, where we already made the image available. Use the command bellow as example to run it:

`docker run -p 40000:40000 -e ASPNETCORE_URLS=http://+:40000 -e Urls=http://+:40000 -d hodstudio/audience-display`

In case you want to run in different port, change it as necessary.

In case you want to specify the colors, just use the environment variables to do it. Follow the example:

`docker run -p 40000:40000 -e ASPNETCORE_URLS=http://+:40000 -e Urls=http://+:40000 -e ColorConfiguration:Author:Background=#0F0 hodstudio/audience-display`

## 🤝 Contributing

Contributions, issues and feature requests are welcome.<br />
Feel free to check [issues page](https://github.com/hodstudio/audience-display/issues) if you want to contribute.<br />
[Check the contributing guide](./CONTRIBUTING.md).<br />

## Author

👤 **Cussa (Mitre) de Souza**

- Twitter: [@cussamitre](https://twitter.com/cussamitre)
- Github: [@cussa](https://github.com/cussa)
- Telegram: [@cussamitre](https://t.me/cussamitre)

## Show your support

Please ⭐️ this repository if this project helped you!

<a href="https://www.buymeacoffee.com/cussa" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;"></a>
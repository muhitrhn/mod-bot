# Create discord bot account

1. Visit https://discord.com/developers/applications and click on `New Application`.
![24A0D0E5-EB5C-4362-9DAF-DBF1FCC4ADB0](https://user-images.githubusercontent.com/36473811/172999271-2ae52b53-6895-405f-9479-8678b69909e5.jpeg)

2. Give your application a name and click on `Create`.
![A53DD499-AF3A-4921-8D7E-3322E504DB43](https://user-images.githubusercontent.com/36473811/172999476-8a668127-fdd2-431d-934b-a82f9219d0aa.jpeg)

3. Now you're application is created, click on `Bot` from the sidebar. That's where the main part is.
![AA367128-B2B9-45D3-B9BC-2EAB5416E09A](https://user-images.githubusercontent.com/36473811/172999681-26fc4b2d-7319-4b38-960b-215c22acaf55.jpeg)

4. Click on `Add bot` and confirm. Then click on `Reset Token` and copy the token, save it to somewhere. This will be needed to activate the bot.
![F03A32B2-E2A6-403E-87D6-E7F0FB31C7A8](https://user-images.githubusercontent.com/36473811/172999937-63bba736-aee0-40a1-af9b-c66108c0fced.jpeg)
![012204D0-6CD2-4DEA-AA9D-5E35B6165373](https://user-images.githubusercontent.com/36473811/172999968-86c203f4-d689-463e-9bac-3f53a1803667.jpeg)
![DDCC1C39-23AB-49FE-8C0F-2783769BDBF4](https://user-images.githubusercontent.com/36473811/172999978-14059f35-601f-411f-bf21-0a45bd6f2238.jpeg)

5. Make sure to enable all intents in that page and save changes.
![1B3C78D6-F8D1-4802-9A87-4E113DB667F6](https://user-images.githubusercontent.com/36473811/173000129-1badcd21-4a9e-4ce2-be8e-fc281382a9a5.jpeg)

6. Go to `OAuth2 > URL Generator` from the sidebar and choose all the selected options from below screenshots.
![A9ACA759-74D5-4E99-BFD5-FC9259F2B9FD](https://user-images.githubusercontent.com/36473811/173000269-0b7d11fa-a5b0-442f-ac7e-88179b78576a.jpeg)
![02F59BF7-4C9D-4F9D-815A-E395B024AC9E](https://user-images.githubusercontent.com/36473811/173000291-72febc8f-33ec-4c70-baf7-4bb492403bb5.jpeg)

7. Finally click the `Copy` button at the end and visit the link to invite the bot to your server.
![7806F54B-8BC1-48FE-836A-7E5B4B03C657](https://user-images.githubusercontent.com/36473811/173000470-389400fd-cdba-482e-b39f-7338cfaf5aab.jpeg)

# Initialize the bot

Make sure you have Node version `16.6x` installed. if not please search google `Install Node 16.6x` and follow a tutorial.

1. Open the command line (on the directory where bot files are) and run `npm i`. This will install all the required dependencies.

2. Run `sudo npm i pm2 -g`. This will install the process manager which will keep the bot running 24/7.

3. Rename the `.env.example` to `.env` and paste the copied bot token there and save the file.

4. Open `config.js` file and add your server id on which you added the bot and save it.

5. Finally run `npm run pm2` and you'll see your bot up and running.

# Finally

You'll need to add ban names and ban log channel for the bot to start work. Use `+help` to see available commands and their usage. Default prefix is `+`.

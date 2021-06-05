# CHAT-BACKEND

describe project here




### Run chat in cluster mode using all available cpu

---------------------------
*first install pm2 globally*

`npm install -g pm2`

*compile the application*

`npm run build`

*run in pm2 from project directory*

`pm2 start --name chat -i max ./build/index.js`

*check the logs*

`pm2 logs chat`

*stop everything after you are done*

`pm2 stop all`

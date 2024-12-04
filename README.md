# Puppeteer

## Project
I use this project to automate some tasks that I do every day.
Puppeteer is the perfect tool for this automation. These "actions" bring me possible advantages.

## Install
```
# installs nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
# download and install Node.js (you may need to restart the terminal)
nvm install 22.9.0
# verifies the right Node.js version is in the environment
node -v # should print `v22.9.0`
# verifies the right npm version is in the environment
npm -v # should print `10.9.0`nvm use v22.9.0
# install the npm dependencies
npm install
```
Open the `.env` file and change the current configuration:
```
website="www.mysite.com"
username="my-username"
password="my-password"
team_name="my-team-name"
```

## Usage
```
# Use the 22.9 version of Node.js
nvm use v22.9.0
# Start the programm
node main
```

Enjoy!
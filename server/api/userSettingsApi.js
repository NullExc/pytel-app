const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../UserSettings.json');

console.log("filePath", filePath);

module.exports = {

    getUserSettings() {

        var file = fs.readFileSync(filePath, 'utf8');

        var UserSettings = JSON.parse(file);

        return UserSettings;
        //res.status(200).send(UserSettings);
    },

    saveUserSettings(req, res, next) {

        var UserSettings = req.body;

        fs.writeFileSync(filePath, JSON.stringify(UserSettings), 'utf8');

        res.status(200).send(UserSettings);
    }

}
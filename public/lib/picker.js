import googleAuth from './google-auth.js';

var GoogleApi;
var TOKEN;
var photoUrl;
var pickerApiLoaded = false;

var photoUrls = [];

var clientCallback;


function setGoogleApi(api, token) {
    GoogleApi = api;
    TOKEN = token;
}

function loadPicker(callback) {
    console.log('waiting for callback');
    clientCallback = callback;
    gapi.load('picker', { 'callback': onPickerApiLoad });
}

function onPickerApiLoad() {
    pickerApiLoaded = true;
    console.log('callback was called');
    createPicker();
}

function createPicker() {
    if (pickerApiLoaded && TOKEN) {
        console.log('picker is createing', TOKEN, googleAuth.PROJECT_ID, googleAuth.API_KEY);
        var view = new google.picker.View(google.picker.ViewId.DOCS);
        view.setMimeTypes("image/png,image/jpeg,image/jpg");
        var picker = new google.picker.PickerBuilder()
            .enableFeature(google.picker.Feature.NAV_HIDDEN)
            .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
            .setAppId(googleAuth.PROJECT_ID)
            .setOAuthToken(TOKEN)
            .addView(view)
            .addView(new google.picker.DocsUploadView())
            .setDeveloperKey(googleAuth.API_KEY)
            .setCallback(pickerCallback)
            .build();
        picker.setVisible(true);
    }
}

function pickerCallback(data) {
    if (data.action == google.picker.Action.PICKED) {
        var fileId = data.docs[0].id;

        console.log("urls", data.docs);

        photoUrl = 'https://docs.google.com/uc?id=' + fileId;

        data.docs.forEach(function (doc) {
            var id = doc.id;

            photoUrls.push({
                name: doc.name,
                url: 'https://docs.google.com/uc?id=' + id
            });
        })

        clientCallback(photoUrls);

    }
}

function getPhotoUrls() {
    return photoUrls;
}

export default { setGoogleApi, loadPicker, createPicker, getPhotoUrls }
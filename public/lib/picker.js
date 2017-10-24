import googleAuth from './google-auth.js';

var GoogleApi;
var TOKEN;
var photoUrl;
var pickerApiLoaded = false;


function setGoogleApi(api, token) {
    GoogleApi = api;
    TOKEN = token;
}

function loadPicker() {
    console.log('waiting for callback');
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
        photoUrl = 'https://docs.google.com/uc?id=' + fileId;
    }
}

function getPhotoUrl() {
    return photoUrl;
}

export default { setGoogleApi, loadPicker, createPicker, getPhotoUrl }
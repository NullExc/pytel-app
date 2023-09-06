
var CLIENT_ID = '594621902662-b4e9v1girln9pv681qq6ropifl3isv8i.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCATpJdLXMjzH-IcDzAeCgxAk-ZC-agdhg';

var DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
];

var SCOPES = "https://www.googleapis.com/auth/admin.directory.device.mobile https://www.googleapis.com/auth/photos https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/plus.login";

var PROJECT_ID = "594621902662";


var TOKEN = null;
var GoogleApi;
var isClientSigned = false;

var clientCallback;

function handleClientLoad(updateSigninStatus, callback) {

    if (GoogleApi && TOKEN) {
        callback(GoogleApi, TOKEN);
    } else {
        gapi.load('client', initClient);
    }

    function initClient() {

        GoogleApi = gapi;

        if (gapi.client.init) {

            gapi.client.init({
                discoveryDocs: DISCOVERY_DOCS,
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                scope: SCOPES,
                prompt: 'select_account',
                authuser: -1
            }).then(function () {

                gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

                updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

                TOKEN = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

                if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
                    callback(null);
                } else {
                    callback(GoogleApi, TOKEN);
                }

                //console.log('token loaded from external file!', GoogleAuth.currentUser.get().getAuthResponse());
            });
            
        } else {

            gapi.load('auth', { 'callback': mobileApiLoad });

            function mobileApiLoad() {

                gapi.auth.authorize(
                    {
                        'client_id': CLIENT_ID,
                        'scope': SCOPES,
                        'immediate': false
                    },
                    function (authResult) {

                    });

            }
        }
    }
}

function login() { }

function handleAuthClick(updateSigninStatus) {
    gapi.auth2.getAuthInstance().signIn().then(function () {
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();

    GoogleApi = null;
}

function isClientLogged() {
    gapi.auth2.getAuthInstance().isSignedIn.get();
}



export default { TOKEN, handleClientLoad, GoogleApi, isClientSigned, PROJECT_ID, API_KEY, CLIENT_ID, handleSignoutClick, handleAuthClick, clientCallback }

var CLIENT_ID = '594621902662-b4e9v1girln9pv681qq6ropifl3isv8i.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCATpJdLXMjzH-IcDzAeCgxAk-ZC-agdhg';

var DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
];

var SCOPES = "https://www.googleapis.com/auth/photos https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/plus.login";

var PROJECT_ID = "594621902662";


var TOKEN = null;
var GoogleAuth;
var GoogleApi;
var isClientSigned = false;

function handleClientLoad(callback) {
    if (GoogleApi) {
        console.log('client was loaded before');
        callback(GoogleApi, TOKEN);
    } else {
        console.log('client is loading ...');
        gapi.load('client:auth2', initClient);
    }

    function initClient() {
        
            GoogleApi = gapi;
        
            gapi.client.init({
                discoveryDocs: DISCOVERY_DOCS,
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                scope: SCOPES
            }).then(function () {
        
                GoogleAuth = gapi.auth2.getAuthInstance();
        
                GoogleAuth.isSignedIn.listen(updateSigninStatus);
        
                updateSigninStatus(GoogleAuth.isSignedIn.get());
        
                TOKEN = GoogleAuth.currentUser.get().getAuthResponse().access_token;

                if (!GoogleAuth.isSignedIn.get()) {
                    callback(null);
                } else {
                    callback(GoogleApi, TOKEN);
                }
        
                //console.log('token loaded from external file!', GoogleAuth.currentUser.get().getAuthResponse());
            });
        }
}

function updateSigninStatus(isSignedIn) {
    if (!isSignedIn) {
        isClientSigned = false;
        GoogleAuth.signIn();
    } else {
        isSignedIn = true;
    }
    console.log('status change', isSignedIn);
}

function handleAuthClick(event) {
    GoogleAuth.signIn();
}

function handleSignoutClick(event) {
    GoogleAuth.signOut();
}

export default { TOKEN, handleClientLoad, GoogleApi, isClientSigned, PROJECT_ID, API_KEY, CLIENT_ID }
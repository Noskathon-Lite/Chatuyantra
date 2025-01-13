#include <FirebaseESP32.h>
#include <Firebase.h>
#include <FirebaseFS.h>
#include <TinyGPS++.h>
// Provide the token generation process info.
#include <addons/TokenHelper.h>
// Provide thde RTDB payload printing info and other helper functions.
#include <addons/RTDBHelper.h>

TinyGPSPlus gps;

#define WIFI_SSID "realmeManish"
#define WIFI_PASSWORD "w2d9z225"
// For the following credentials, see examples/Authentications/SignInAsUser/EmailPassword/EmailPassword.ino

/* Define the API Key */
#define API_KEY "AIzaSyBGpQq_H3rzwo7xM4WZhHi2lyblQbITJ_o"

/*Define the RTDB URL */
//#define DATABASE_URL "https://esp8266-data-transfer-default-rtdb.firebaseio.com/"
#define DATABASE_URL "https://ncithack-default-rtdb.asia-southeast1.firebasedatabase.app/"
//<databaseName>.firebaseio.com or <databaseName>.<region>.firebasedatabase.app

/*Define the user Email and password that alreadey registerd or added in your project */
#define USER_EMAIL "poudelmanish321@gmail.com"
#define USER_PASSWORD "123456"

// Define Firebase Data objecut
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;

void setup() {
  Serial.begin(9600);
  Serial.begin(9600);  // Initialize default TX/RX for GPS communication
  Serial.println("GPS Module Test - Using Default TX/RX Pins");

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  unsigned long ms = millis();
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
    yield();
  }

  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);

  /* Assign the api key (required) */
  config.api_key = API_KEY;

  /* Assign the user sign in credentials */
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  /* Assign the RTDB URL (required) */
  config.database_url = DATABASE_URL;
  /* Assign the callback function for the loncg running token 
  generation task */

  config.token_status_callback = tokenStatusCallback;


  // see addons/TokenHelper.h

  // Comment or pass false value when WiFi reconnection will
  // control by your code or third party library e.g. WiFiManager
  Firebase.reconnectNetwork(true);

  // Since v4.4.x, BearSSL engine was used, the SSL buffer
  //need to be set.
  // Large data transmission may require larger RX buffer,
  //otherwise connection issue or data read time out can
  //be occurred.
  fbdo.setBSSLBufferSize(4096 /* Rx buffer size in bytes 
  from 512 - 16384 */
                         ,
                         1024 /* Tx buffer size in bytes 
  from 512 - 16384 */
  );

  // for debugging.

  Firebase.begin(&config, &auth);
  Firebase.setDoubleDigits(4);
  if (Firebase.ready() > 0) {
    Serial.println("hello");
  }
  Serial.println("hello from end of the setup");
}

void loop() {
  while (Serial.available() > 0) {
    char c = Serial.read();  // Read a character from GPS
    if (gps.encode(c)) {     // Parse the data
      //displayGPSInfo();
      Serial.println("GPS started");

      if (gps.location.isValid()) {

        float longitude = gps.location.lng();
        float latitude = gps.location.lat();
        Serial.println(latitude);

        if (Firebase.ready()  //&& (millis() - sendDataPrevMillis > 15000
            /*|| sendDataPrevMillis == 0)*/) {
          //sendDataPrevMillis = millis();
          Serial.println("firebase Ready");
          Serial.printf("Set float... %s\n", Firebase.setFloat(fbdo, F("/test/longitude"), longitude) ? "ok" : fbdo.errorReason().c_str());
          Serial.printf("Set float... %s\n", Firebase.setFloat(fbdo, F("/test/latitude"), latitude) ? "ok" : fbdo.errorReason().c_str());

          // for soil-temperature and moisture
          //    Serial.printf("Set Float... %s\n", Firebase.setFloat(fbdo, F("/test/soilMoisture"), soilMoisture) ? "ok" : fbdo.errorReason().c_str());

          // for warning system.
          //    Serial.printf("Set int... %s\n", Firebase.setInt(fbdo, F("/test/warning"), warning) ? "ok" : fbdo.errorReason().c_str());
          //    delay(1000);
        }
      }
    }
  }
  delay(1000);
  // yeild is used to pass control to other task if
  // loop is too long
  yield();
}

#include <FirebaseESP32.h>
#include <Firebase.h>
#include <FirebaseFS.h>
#include <NewPing.h> // Ultrasonic sensor library
// Provide the token generation process info.
#include <addons/TokenHelper.h>
// Provide the RTDB payload printing info and other helper functions.
#include <addons/RTDBHelper.h>

#define WIFI_SSID "realmeManish"
#define WIFI_PASSWORD "98436490"

/* Define the API Key */
#define API_KEY "AIzaSyBGpQq_H3rzwo7xM4WZhHi2lyblQbITJ_o"

/* Define the RTDB URL */
#define DATABASE_URL "https://ncithack-default-rtdb.asia-southeast1.firebasedatabase.app/"

/* Define the user Email and password */
#define USER_EMAIL "poudelmanish321@gmail.com"
#define USER_PASSWORD "123456"

// Define Firebase Data object
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Ultrasonic sensor pins and maximum distance
#define TRIG_PIN1 4
#define ECHO_PIN1 5
#define TRIG_PIN2 18
#define ECHO_PIN2 19
#define MAX_DISTANCE 400 // Maximum distance for ultrasonic sensor in cm

NewPing sonar1(TRIG_PIN1, ECHO_PIN1, MAX_DISTANCE);
NewPing sonar2(TRIG_PIN2, ECHO_PIN2, MAX_DISTANCE);

// LED pins
#define LED_PIN_GE 12
#define LED_PIN_RN 13
#define LED_PIN_RE 14
#define LED_PIN_GN 15

unsigned long sendDataPrevMillis = 0;

void setup() {
  Serial.begin(9600);

  pinMode(LED_PIN_GE, OUTPUT);
  pinMode(LED_PIN_RN, OUTPUT);
  pinMode(LED_PIN_RE, OUTPUT);
  pinMode(LED_PIN_GN, OUTPUT);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
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

  // Configure Firebase
  config.api_key = API_KEY;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  config.database_url = DATABASE_URL;
  config.token_status_callback = tokenStatusCallback;

  Firebase.reconnectNetwork(true);
  fbdo.setBSSLBufferSize(4096, 1024);
  Firebase.begin(&config, &auth);
  Firebase.setDoubleDigits(4);

  if (Firebase.ready()) {
    Serial.println("Firebase is ready.");
  }
}

void loop() {
  // Measure distances from ultrasonic sensors
  float distance1 = sonar1.ping_cm();
  float distance2 = sonar2.ping_cm();

  Serial.print("Distance 1: ");
  Serial.println(distance1);
  Serial.print("Distance 2: ");
  Serial.println(distance2);

  // Send data to Firebase
  if (Firebase.ready()) {
    Serial.println("Sending data to Firebase...");
    Firebase.setFloat(fbdo, F("/test2/use"), distance1);
    Firebase.setFloat(fbdo, F("/test2/usn"), distance2);
  }

  // Read data from Firebase to control LEDs
  if (Firebase.ready()) {
    if (Firebase.getInt(fbdo, F("/test3/ge"))) {
      int geStatus = fbdo.intData();
      digitalWrite(LED_PIN_GE, geStatus == 1 ? HIGH : LOW);
      Serial.print("LED GE: ");
      Serial.println(geStatus == 1 ? "ON" : "OFF");
    } else {
      Serial.println(fbdo.errorReason());
    }

    if (Firebase.getInt(fbdo, F("/test3/rn"))) {
      int rnStatus = fbdo.intData();
      digitalWrite(LED_PIN_RN, rnStatus == 1 ? HIGH : LOW);
      Serial.print("LED RN: ");
      Serial.println(rnStatus == 1 ? "ON" : "OFF");
    } else {
      Serial.println(fbdo.errorReason());
    }

    if (Firebase.getInt(fbdo, F("/test3/re"))) {
      int reStatus = fbdo.intData();
      digitalWrite(LED_PIN_RE, reStatus == 1 ? HIGH : LOW);
      Serial.print("LED RE: ");
      Serial.println(reStatus == 1 ? "ON" : "OFF");
    } else {
      Serial.println(fbdo.errorReason());
    }

    if (Firebase.getInt(fbdo, F("/test3/gn"))) {
      int gnStatus = fbdo.intData();
      digitalWrite(LED_PIN_GN, gnStatus == 1 ? HIGH : LOW);
      Serial.print("LED GN: ");
      Serial.println(gnStatus == 1 ? "ON" : "OFF");
    } else {
      Serial.println(fbdo.errorReason());
    }
  }

  delay(1000);
}

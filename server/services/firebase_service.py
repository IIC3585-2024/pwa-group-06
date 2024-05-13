from firebase_admin import credentials, messaging
import firebase_admin

firebase_cred = credentials.Certificate('firebase_key.json')
firebase_app = firebase_admin.initialize_app(firebase_cred)

def send_token_push(title, body, tokens):
    message = messaging.MulticastMessage(
        notification=messaging.Notification(
        title=title,
        body=body
    ), tokens=tokens)

    messaging.send_multicast(message)

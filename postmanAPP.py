from mailjet_rest import Client
import os

api_key = os.getenv('API_KEY')
api_secret = os.getenv('API_SECRET')
mailjet = Client(auth=(api_key, api_secret), version='v3.1')
def sendMesage(Subject, text='', additional=''):
	message = {
	'Messages': [
					{
						"From": {
								"Email": "arturroman4uk@gmail.com",
								"Name": "Me"
						},
						"To": [
								{
								"Email": "arturroman4uk@gmail.com",
								"Name": "You"
								}
						],
						"Subject": Subject,
						"TextPart": text,
						"HTMLPart": additional
					}
			]
	}
	return message

# message = sendMesage('Тест повідомлення', 'Перевірка успішна✅')

# result = mailjet.send.create(data=message)
# print (result.json())
from flask import *
from dotenv import load_dotenv
import os
from postmanAPP import *

load_dotenv()

API_KEY = os.getenv("API_KEY")
API_SECRET = os.getenv("API_SECRET")

app = Flask(__name__, static_folder="static")



@app.route('/')
def index():
    return render_template('index.html')


@app.route('/cart')
def cart():
    return render_template('cart.html')
@app.route('/check', methods=['GET', 'POST'])
def check():
    if request.method == 'POST':
        cart = request.json.get('cart', [])  # Отримання товарів з запиту

        # Вивід замовлення у термінал
        print("Received cart items:")
        for item in cart:
            print(f"{item['name']} - {item['price']} грн")

        # Підготовка листа
        items_text = '\n'.join([f"{item['name']} - {item['price']} грн" for item in cart])
        total_price = sum(item['price'] for item in cart)

        subject = 'Нове замовлення'
        text = f"Ви отримали нове замовлення:\n{items_text}\nЗагальна сума: {total_price} грн"
        additional_html = f"<p>Замовлення:</p><ul>" + ''.join(
            [f"<li>{item['name']} - {item['price']} грн</li>" for item in cart]) + f"</ul><p>Загальна сума: {total_price} грн</p>"

        message = sendMesage(subject, text, additional_html)  # Надсилання листа через MailJet
        result = mailjet.send.create(data=message)
        print (result.json())
        return jsonify({'success': True, 'message': 'Замовлення оформлене'}), 200
    
    return render_template('index.html')



if __name__ == '__main__':
    app.run(debug=True)

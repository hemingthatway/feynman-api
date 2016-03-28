from flask import Flask, session, redirect
from flask import url_for, escape, request, render_template
from flask import Markup, flash, session

from werkzeug.security import generate_password_hash, check_password_hash

import redis

app = Flask(__name__)

db = redis.StrictRedis(host='localhost', port=6379, db=0)

@app.route('/')
@app.route('/index.html')
def index():
    return render_template('index.html')

@app.route('/logowanie.html', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('logowanie.html')

    else:
        password = request.form['password']
        email = request.form['email']
        pass_hash = db.hget('user:' + email, 'password')
        if pass_hash is None or (not check_password_hash(pass_hash, password)):
            flash('Użytkownik nie istnieje, bądź błędne hasło')
            return redirect(url_for('login'))

        session['username'] = email
        flash('Zalogowano')
        return redirect(url_for('index'))


@app.route('/rejestracja.html', methods=['GET', 'POST'])
def register():
    error = None
    if request.method == 'GET':
        return render_template('rejestracja.html')
    else:
        app.logger.debug("hihi" + str(dict(request.form)))
        password = request.form['password']
        email = request.form['email']
        username = request.form['name']
        app.logger.debug("hihi" + request.form)

        if db.exists('user:'+email):
            error = 'Użytkownik opodanym adresie istnieje'
            return redirect(url_for('register'))

        pass_hash = generate_password_hash(password)
        db.hmset('user:' + email, {'username': username, 'password': pass_hash})

        return redirect(url_for('index'))

if __name__ == '__main__':
    app.secret_key = '44444444omomof&^&TB'
    app.debug = True
    app.run()

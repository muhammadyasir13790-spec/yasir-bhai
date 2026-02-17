from flask import Flask, render_template, request, jsonify
from textblob import TextBlob
import re

app = Flask(__name__)

def clean_text(text):
    """Remove extra spaces and clean text"""
    return ' '.join(text.strip().split())

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        text = clean_text(data.get('text', ''))
        
        if not text:
            return jsonify({
                'error': 'Kuch likho to sahi! 😅'
            }), 400
        
        # TextBlob sentiment analysis
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity
        subjectivity = blob.sentiment.subjectivity
        
        # Detailed sentiment analysis
        if polarity > 0.3:
            sentiment = '😊 Positive'
            emoji = '😊'
            reply = 'Waah! Bahut achha lag raha hai sunke!'
            color = '#28a745'
        elif polarity > 0:
            sentiment = '🙂 Mildly Positive'
            emoji = '🙂'
            reply = 'Achha lag raha hai!'
            color = '#5cb85c'
        elif polarity < -0.3:
            sentiment = '😔 Negative'
            emoji = '😔'
            reply = 'Kya hua? Dil chota mat karo, main hoon na!'
            color = '#dc3545'
        elif polarity < 0:
            sentiment = '😕 Mildly Negative'
            emoji = '😕'
            reply = 'Thoda upset ho? Sab theek ho jayega!'
            color = '#ffc107'
        else:
            sentiment = '😐 Neutral'
            emoji = '😐'
            reply = 'Hanji, batao aur kya chal raha hai?'
            color = '#6c757d'
        
        # Word count and analysis
        words = len(text.split())
        
        return jsonify({
            'sentiment': sentiment,
            'emoji': emoji,
            'reply': reply,
            'polarity': round(polarity, 2),
            'subjectivity': round(subjectivity, 2),
            'words': words,
            'color': color,
            'message': text
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Kuch gadbad ho gayi! Dobara try karo.'
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
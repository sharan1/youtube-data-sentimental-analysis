from flask import Flask, render_template,Response,request,stream_with_context
import redis
import logging

app = Flask(__name__)

r = redis.StrictRedis(host='127.0.0.1',port=6379,db=0)


def event_stream():
    pubsub = r.pubsub()
    pubsub.subscribe('YouTube')
    for message in pubsub.listen():
        yield 'data: %s\n\n' % message['data']

@app.route('/')
def render_homepage():
    app.logger.info("Home Page")
    return render_template('index.html')


@app.route('/stream')
def stream():
    if request.headers.get('accept') == 'text/event-stream':
        app.logger.info("Stream")
        return Response(event_stream(),mimetype="text/event-stream")

if __name__== '__main__':
    app.logger.info("web app started")
    app.debug = True
    app.run(host='0.0.0.0',port=5005, threaded=True)




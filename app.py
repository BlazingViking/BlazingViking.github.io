from flask import Flask, request, jsonify
import whisper
import os
import moviepy.editor as mp

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = "uploads"

# Load Whisper AI model
model = whisper.load_model("base")

# Ensure uploads folder exists
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

@app.route("/upload", methods=["POST"])
def upload_file():
    if "video" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["video"]
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(filepath)

    # Convert video to audio
    audio_path = filepath.replace(".mp4", ".mp3")
    video = mp.VideoFileClip(filepath)
    video.audio.write_audiofile(audio_path)

    # Generate subtitles
    result = model.transcribe(audio_path)
    subtitles = result["text"]

    return jsonify({"subtitles": subtitles})

if __name__ == "__main__":
    app.run(debug=True)


#!/bin/bash

# Activate backend dir
cd "$(dirname "$0")"

# Start the Flask server
python transcribe_server.py
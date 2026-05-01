import os
import sys

# Standard Industry Practice: Ensure the current directory is in the path
# This solves the 'ModuleNotFoundError' once and for all.
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

os.environ["TESTING"] = "true"
os.environ["GEMINI_API_KEY"] = "mock_key"
os.environ["GOOGLE_CLOUD_PROJECT"] = "mock_project"

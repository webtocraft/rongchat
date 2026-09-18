import re
import os

with open('Index.html', 'r', encoding='utf-8') as f:
    code = f.read()

# Let's inspect where modal-story-viewer is located
print("Has modal-story-viewer:", "modal-story-viewer" in code)
print("Has tab-feed:", "tab-feed" in code)
print("Has tab-profile:", "tab-profile" in code)

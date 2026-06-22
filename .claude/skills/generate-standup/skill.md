---
name: generate-standup
description: Generates a professional standup from today's CodeAIPulse tasks. Use before your daily standup meeting.
trigger: /generate-standup
effort: low
---

# Generate Standup Skill

Creates a formatted, professional standup update from your completed tasks.

**Requires:** Backend running on http://localhost:8000

## Execution

```python
import urllib.request
import json
import sys
import io
from platform import system

# Set stdout encoding to UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

API = 'http://localhost:8000'

def get_json(endpoint: str) -> dict | list:
    """Fetch JSON from the API."""
    with urllib.request.urlopen(f'{API}{endpoint}') as resp:
        return json.loads(resp.read().decode())

try:
    # Get standup and tasks from backend
    standup_data = get_json('/standup')
    standup_text = standup_data.get('standup', '')
    
    tasks = get_json('/tasks')
    pending = [t for t in tasks if not t.get('completed')]

    # Display standup
    print()
    print('═' * 60)
    print('📋 Your Standup:')
    print('═' * 60)
    print()
    print('✅ COMPLETED')
    print(standup_text)
    print()
    print('🔨 NEXT')
    if pending:
        for task in pending[:3]:
            print(f'• {task["title"]}')
    else:
        print('• No pending tasks — all caught up!')
    print()
    print('🚧 BLOCKERS')
    print('None')
    print()
    print('═' * 60)
    print()
    print('Ready for your standup! Copy the text above to share with your team.')
    print()

except Exception as e:
    print(f'❌ Error: {e}')
    print('   Make sure the backend is running: python -m uvicorn main:app --reload')
    sys.exit(1)
```

## Usage

Run before your standup meeting:
```
/generate-standup
```

The skill will:
1. Fetch today's standup summary from the backend (Gemini-generated from completed tasks)
2. Fetch pending tasks for your next section
3. Display a formatted standup with three sections:
   - ✅ What you completed (from Gemini-generated summary including subtask details)
   - 🔨 Your next priorities (up to 3 pending tasks)
   - 🚧 Any blockers (you can add these manually)

Perfect for pasting directly into Slack, Teams, or your sync document.
